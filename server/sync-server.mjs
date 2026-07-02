import http from "node:http";
import { WebSocket, WebSocketServer } from "ws";

const host = process.env.SYNC_HOST ?? "0.0.0.0";
const port = Number(process.env.SYNC_PORT ?? 5174);
const initialSlideId = Number(process.env.INITIAL_SLIDE_ID ?? 1);

let deckState = {
  slideId: Number.isInteger(initialSlideId) && initialSlideId > 0 ? initialSlideId : 1,
  updatedAt: Date.now(),
  senderId: "server",
};

const server = http.createServer((request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Content-Type", "application/json; charset=utf-8");

  if (request.url === "/health") {
    response.end(JSON.stringify({ ok: true, clients: wss.clients.size }));
    return;
  }

  if (request.url === "/state") {
    response.end(JSON.stringify({ type: "state", state: deckState }));
    return;
  }

  response.statusCode = 404;
  response.end(JSON.stringify({ error: "not_found" }));
});

const wss = new WebSocketServer({ server });

function send(socket, payload) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(payload));
  }
}

function broadcast(payload) {
  for (const client of wss.clients) {
    send(client, payload);
  }
}

function parseMessage(raw) {
  try {
    const message = JSON.parse(raw.toString());
    if (message?.type !== "setSlide") {
      return null;
    }

    const slideId = Number(message.slideId);
    if (!Number.isInteger(slideId) || slideId < 1 || slideId > 64) {
      return null;
    }

    return {
      senderId: String(message.senderId ?? "unknown"),
      slideId,
    };
  } catch {
    return null;
  }
}

wss.on("connection", (socket) => {
  send(socket, { type: "state", state: deckState });

  socket.on("message", (raw) => {
    const message = parseMessage(raw);
    if (!message) {
      send(socket, { type: "error", error: "invalid_message" });
      return;
    }

    if (deckState.slideId === message.slideId) {
      send(socket, { type: "state", state: deckState });
      return;
    }

    deckState = {
      slideId: message.slideId,
      updatedAt: Date.now(),
      senderId: message.senderId,
    };

    broadcast({ type: "state", state: deckState });
  });
});

server.listen(port, host, () => {
  console.log(`Courseware sync WebSocket listening on ws://${host}:${port}`);
});

function shutdown() {
  wss.close(() => {
    server.close(() => process.exit(0));
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
