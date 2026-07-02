import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import courseJson from "./data/course.json";
import printablesJson from "./data/printables.json";
import { DeckControls } from "./components/DeckControls";
import { PrintView } from "./components/PrintView";
import { QrPage } from "./components/QrPage";
import { StudentView } from "./components/StudentView";
import { TeacherView } from "./components/TeacherView";
import type { CourseData, PrintablesData, PrintKind, SyncStatus, ViewMode } from "./types";

const course = courseJson as CourseData;
const printables = printablesJson as PrintablesData;

interface SyncedDeckState {
  senderId: string;
  slideId: number;
  updatedAt: number;
}

interface SyncServerStateMessage {
  state: SyncedDeckState;
  type: "state";
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getInitialSlideIndex() {
  return 0;
}

function getInitialMode(): ViewMode {
  return new URLSearchParams(window.location.search).get("mode") === "teacher"
    ? "teacher"
    : "student";
}

function getInitialPrintKind(): PrintKind | null {
  const value = new URLSearchParams(window.location.search).get("print");
  return value === "tasks" ||
    value === "parents" ||
    value === "purchase" ||
    value === "certificate"
    ? value
    : null;
}

function getSyncUrl() {
  const configuredUrl = import.meta.env.VITE_SYNC_WS_URL?.trim();
  if (configuredUrl) {
    return configuredUrl;
  }

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.hostname}:5174`;
}

function parseSyncMessage(raw: string): SyncServerStateMessage | null {
  try {
    const message = JSON.parse(raw) as SyncServerStateMessage;
    if (message?.type !== "state") {
      return null;
    }

    const slideId = Number(message.state?.slideId);
    if (!Number.isInteger(slideId)) {
      return null;
    }

    return {
      type: "state",
      state: {
        senderId: String(message.state.senderId ?? "server"),
        slideId,
        updatedAt: Number(message.state.updatedAt ?? Date.now()),
      },
    };
  } catch {
    return null;
  }
}

function useCountdown(initialSeconds: number) {
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setRemainingSeconds(initialSeconds);
    setIsRunning(false);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning || remainingSeconds <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setRemainingSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning, remainingSeconds]);

  useEffect(() => {
    if (remainingSeconds === 0) {
      setIsRunning(false);
    }
  }, [remainingSeconds]);

  return {
    remainingSeconds,
    isRunning,
    start: () => setIsRunning(true),
    pause: () => setIsRunning(false),
    reset: () => {
      setRemainingSeconds(initialSeconds);
      setIsRunning(false);
    },
  };
}

export default function App() {
  const tabId = useRef(
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`,
  );
  const websocket = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<number | null>(null);
  const queuedTeacherSlideId = useRef<number | null>(null);
  const modeRef = useRef<ViewMode>(getInitialMode());
  const [slideIndex, setSlideIndex] = useState(getInitialSlideIndex);
  const [mode, setMode] = useState<ViewMode>(getInitialMode);
  const [printKind, setPrintKind] = useState<PrintKind | null>(getInitialPrintKind);
  const [showQrPage, setShowQrPage] = useState(
    new URLSearchParams(window.location.search).get("view") === "qr",
  );
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("connecting");

  const totalSlides = course.slides.length;
  const activeSlide = course.slides[slideIndex];
  const countdown = useCountdown(activeSlide.timerSeconds);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  const applySlideId = useCallback((slideId: number) => {
    const foundIndex = course.slides.findIndex((slide) => slide.id === slideId);
    if (foundIndex >= 0) {
      setSlideIndex(foundIndex);
    }
  }, []);

  const publishSlideId = useCallback((slideId: number) => {
    const payload = JSON.stringify({
      senderId: tabId.current,
      slideId,
      type: "setSlide",
    });

    if (websocket.current?.readyState === WebSocket.OPEN) {
      websocket.current.send(payload);
      return;
    }

    queuedTeacherSlideId.current = slideId;
  }, []);

  const goToSlide = useCallback(
    (nextIndex: number) => {
      const nextSlideIndex = clamp(nextIndex, 0, totalSlides - 1);
      const nextSlide = course.slides[nextSlideIndex];

      setSlideIndex(nextSlideIndex);

      if (mode === "teacher" && !printKind && !showQrPage) {
        publishSlideId(nextSlide.id);
      }
    },
    [mode, printKind, publishSlideId, showQrPage, totalSlides],
  );

  const goPrevious = useCallback(() => goToSlide(slideIndex - 1), [goToSlide, slideIndex]);
  const goNext = useCallback(() => goToSlide(slideIndex + 1), [goToSlide, slideIndex]);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      return;
    }

    await document.exitFullscreen();
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    if (printKind || showQrPage) {
      return;
    }

    const url = new URL(window.location.href);
    url.searchParams.set("mode", mode);
    url.searchParams.delete("print");
    url.searchParams.delete("slide");
    url.searchParams.delete("view");
    url.hash = "";
    window.history.replaceState(null, "", `${url.pathname}${url.search}`);
  }, [mode, printKind, showQrPage]);

  useEffect(() => {
    if (printKind || showQrPage) {
      setSyncStatus("disconnected");
      return undefined;
    }

    let disposed = false;

    const closeSocket = () => {
      if (websocket.current) {
        websocket.current.close();
        websocket.current = null;
      }

      if (reconnectTimer.current) {
        window.clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }
    };

    const connect = () => {
      if (disposed) {
        return;
      }

      setSyncStatus("connecting");
      const socket = new WebSocket(getSyncUrl());
      websocket.current = socket;

      socket.addEventListener("open", () => {
        setSyncStatus("connected");

        if (modeRef.current === "teacher" && queuedTeacherSlideId.current !== null) {
          publishSlideId(queuedTeacherSlideId.current);
          queuedTeacherSlideId.current = null;
        }
      });

      socket.addEventListener("message", (event) => {
        const message = parseSyncMessage(String(event.data));
        if (message) {
          applySlideId(message.state.slideId);
        }
      });

      socket.addEventListener("close", () => {
        if (websocket.current === socket) {
          websocket.current = null;
        }

        if (disposed) {
          return;
        }

        setSyncStatus("disconnected");
        reconnectTimer.current = window.setTimeout(connect, 1200);
      });

      socket.addEventListener("error", () => {
        setSyncStatus("disconnected");
        socket.close();
      });
    };

    connect();

    return () => {
      disposed = true;
      closeSocket();
    };
  }, [applySlideId, printKind, publishSlideId, showQrPage]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName;

      if (tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT") {
        return;
      }

      if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault();
        if (mode === "teacher") {
          goNext();
        }
      }

      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        if (mode === "teacher") {
          goPrevious();
        }
      }

      if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        void toggleFullscreen();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrevious, mode, toggleFullscreen]);

  const modeLabel = useMemo(() => (mode === "teacher" ? "老师视图" : "学生视图"), [mode]);

  if (printKind) {
    return (
      <PrintView
        course={course}
        data={printables}
        kind={printKind}
        onChangeKind={setPrintKind}
        onClose={() => setPrintKind(null)}
      />
    );
  }

  if (showQrPage) {
    return <QrPage course={course} onBack={() => setShowQrPage(false)} />;
  }

  return (
    <main className="min-h-screen bg-paper text-ink">
      {mode === "teacher" ? (
        <DeckControls
          countdown={countdown}
          currentSlide={activeSlide.id}
          isFullscreen={isFullscreen}
          mode={mode}
          modeLabel={modeLabel}
          onModeChange={setMode}
          onNext={goNext}
          onPrevious={goPrevious}
          onPrint={setPrintKind}
          onQrPage={() => setShowQrPage(true)}
          onResetTimer={countdown.reset}
          onToggleFullscreen={toggleFullscreen}
          onToggleTimer={() => {
            if (countdown.isRunning) {
              countdown.pause();
              return;
            }

            countdown.start();
          }}
          syncStatus={syncStatus}
          totalSlides={totalSlides}
        />
      ) : null}

      {mode === "teacher" ? (
        <TeacherView
          course={course}
          countdown={countdown}
          slide={activeSlide}
          totalSlides={totalSlides}
        />
      ) : (
        <StudentView course={course} slide={activeSlide} totalSlides={totalSlides} />
      )}
    </main>
  );
}
