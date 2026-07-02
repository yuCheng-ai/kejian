import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Monitor,
  Pause,
  Play,
  Presentation,
  Printer,
  QrCode,
  RotateCcw,
  Wifi,
  WifiOff,
} from "lucide-react";
import type { PrintKind, SyncStatus, ViewMode } from "../types";
import { formatTime } from "../lib/time";

interface CountdownControls {
  remainingSeconds: number;
  isRunning: boolean;
}

interface DeckControlsProps {
  countdown: CountdownControls;
  currentSlide: number;
  isFullscreen: boolean;
  mode: ViewMode;
  modeLabel: string;
  onModeChange: (mode: ViewMode) => void;
  onNext: () => void;
  onPrevious: () => void;
  onPrint: (kind: PrintKind) => void;
  onQrPage: () => void;
  onResetTimer: () => void;
  onToggleFullscreen: () => void;
  onToggleTimer: () => void;
  syncStatus: SyncStatus;
  totalSlides: number;
}

export function DeckControls({
  countdown,
  currentSlide,
  isFullscreen,
  mode,
  modeLabel,
  onModeChange,
  onNext,
  onPrevious,
  onPrint,
  onQrPage,
  onResetTimer,
  onToggleFullscreen,
  onToggleTimer,
  syncStatus,
  totalSlides,
}: DeckControlsProps) {
  const syncStatusCopy = {
    connected: {
      className: "border-green-200 bg-green-50 text-green-800",
      label: "同步已连接",
    },
    connecting: {
      className: "border-amber-200 bg-amber-50 text-amber-800",
      label: "同步连接中",
    },
    disconnected: {
      className: "border-red-200 bg-red-50 text-red-800",
      label: "同步未连接",
    },
  }[syncStatus];

  return (
    <header className="screen-only fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/92 px-3 py-2 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            aria-label="上一页"
            className="icon-button"
            onClick={onPrevious}
            title="上一页"
            type="button"
          >
            <ChevronLeft aria-hidden="true" size={22} />
          </button>
          <div className="min-w-24 text-center">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {modeLabel}
            </div>
            <div className="text-base font-black text-ink">
              {currentSlide} / {totalSlides}
            </div>
          </div>
          <button
            aria-label="下一页"
            className="icon-button"
            onClick={onNext}
            title="下一页"
            type="button"
          >
            <ChevronRight aria-hidden="true" size={22} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`hidden min-h-11 items-center gap-2 rounded-md border px-3 text-sm font-black shadow-sm sm:inline-flex ${syncStatusCopy.className}`}
            role="status"
            title={syncStatusCopy.label}
          >
            {syncStatus === "connected" ? (
              <Wifi aria-hidden="true" size={17} />
            ) : (
              <WifiOff aria-hidden="true" size={17} />
            )}
            {syncStatusCopy.label}
          </div>

          <div className="segmented-control" role="group">
            <button
              className={mode === "student" ? "is-active" : ""}
              onClick={() => onModeChange("student")}
              type="button"
            >
              <Presentation aria-hidden="true" size={18} />
              学生
            </button>
            <button
              className={mode === "teacher" ? "is-active" : ""}
              onClick={() => onModeChange("teacher")}
              type="button"
            >
              <Monitor aria-hidden="true" size={18} />
              老师
            </button>
          </div>

          <div className="timer-control" role="timer">
            <button
              aria-label={countdown.isRunning ? "暂停倒计时" : "开始倒计时"}
              className="icon-button !h-9 !w-9"
              onClick={onToggleTimer}
              title={countdown.isRunning ? "暂停倒计时" : "开始倒计时"}
              type="button"
            >
              {countdown.isRunning ? (
                <Pause aria-hidden="true" size={18} />
              ) : (
                <Play aria-hidden="true" size={18} />
              )}
            </button>
            <span className="tabular-nums">{formatTime(countdown.remainingSeconds)}</span>
            <button
              aria-label="重置倒计时"
              className="icon-button !h-9 !w-9"
              onClick={onResetTimer}
              title="重置倒计时"
              type="button"
            >
              <RotateCcw aria-hidden="true" size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="command-button" onClick={onQrPage} type="button">
            <QrCode aria-hidden="true" size={18} />
            二维码
          </button>
          <select
            aria-label="选择打印资料"
            className="print-select"
            defaultValue=""
            onChange={(event) => {
              const value = event.target.value as PrintKind | "";
              if (value) {
                onPrint(value);
                event.target.value = "";
              }
            }}
          >
            <option value="" disabled>
              打印资料
            </option>
            <option value="tasks">学生任务卡</option>
            <option value="parents">家长说明页</option>
            <option value="purchase">购买页</option>
            <option value="certificate">证书</option>
          </select>
          <button
            aria-label={isFullscreen ? "退出全屏" : "全屏展示"}
            className="command-button"
            onClick={onToggleFullscreen}
            type="button"
          >
            {isFullscreen ? (
              <Minimize2 aria-hidden="true" size={18} />
            ) : (
              <Maximize2 aria-hidden="true" size={18} />
            )}
            全屏
          </button>
          <button className="command-button" onClick={() => onPrint("tasks")} type="button">
            <Printer aria-hidden="true" size={18} />
            打印
          </button>
        </div>
      </div>
    </header>
  );
}
