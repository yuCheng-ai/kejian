import { CheckCircle2, Flag, ListChecks, Sparkles } from "lucide-react";
import { RobotVisual } from "./RobotVisual";
import type { CourseSlide } from "../types";

interface SlideCanvasProps {
  allSlides?: CourseSlide[];
  audience?: "student" | "teacher";
  compact?: boolean;
  slide: CourseSlide;
  totalSlides: number;
}

const accentBars: Record<CourseSlide["accent"], string> = {
  cyan: "bg-cyan-500",
  green: "bg-green-500",
  orange: "bg-orange-500",
  yellow: "bg-yellow-400",
  red: "bg-red-500",
};

const accentText: Record<CourseSlide["accent"], string> = {
  cyan: "text-cyan-700",
  green: "text-green-700",
  orange: "text-orange-700",
  yellow: "text-yellow-700",
  red: "text-red-700",
};

function getStageTitle(title: string) {
  return title.replace(/^第\s*\d+\s*关[:：]\s*/, "");
}

function StudentCommandDeck({
  allSlides,
  slide,
  totalSlides,
}: {
  allSlides: CourseSlide[];
  slide: CourseSlide;
  totalSlides: number;
}) {
  const projectionSteps = slide.student.activitySteps.slice(0, 4);
  const stages = allSlides.length > 0 ? allSlides : [slide];

  return (
    <section className="student-command-deck">
      <aside className="student-command-rail">
        <div className="student-command-brand">
          <span>AI 桌宠</span>
          <strong>任务控制台</strong>
        </div>
        <ol className="student-command-stages">
          {stages.map((item) => (
            <li className={item.id === slide.id ? "is-active" : ""} key={item.id}>
              <span>{String(item.id).padStart(2, "0")}</span>
              <strong>{getStageTitle(item.title)}</strong>
            </li>
          ))}
        </ol>
      </aside>

      <main className="student-command-main">
        <header className="student-command-topbar">
          <div>
            <span>当前关卡</span>
            <strong>
              第 {slide.id} 关 / 共 {totalSlides} 关
            </strong>
          </div>
          <div>
            <span>现场任务</span>
            <strong>{slide.student.activityTitle}</strong>
          </div>
        </header>

        <div className="student-command-grid">
          <section className="student-command-content">
            <div className="student-command-title">
              <span>{slide.subtitle}</span>
              <h1>{slide.title}</h1>
              <p>{slide.student.headline}</p>
            </div>

            <div className="student-command-summary">{slide.student.summary}</div>

            <ol className="student-command-steps">
              {projectionSteps.map((step, index) => (
                <li key={step}>
                  <span>{index + 1}</span>
                  <strong>{step}</strong>
                </li>
              ))}
            </ol>
          </section>

          <aside className="student-command-visual">
            {slide.image ? (
              <img
                alt={slide.imageAlt ?? slide.title}
                className={slide.imageFit === "contain" ? "is-contain" : ""}
                src={slide.image}
              />
            ) : (
              <RobotVisual
                accent={slide.accent}
                audience="student"
                visual={slide.visual}
              />
            )}
            <div className="student-command-features">
              {slide.student.bullets.slice(0, 4).map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </aside>
        </div>

        <footer className="student-command-pass">
          <div>
            <Flag aria-hidden="true" size={28} />
            <span>通关条件</span>
          </div>
          <strong>{slide.student.checkpoint}</strong>
        </footer>
      </main>
    </section>
  );
}

export function SlideCanvas({
  allSlides = [],
  audience = "student",
  compact = false,
  slide,
  totalSlides,
}: SlideCanvasProps) {
  const isStudentProjection = audience === "student" && !compact;

  if (isStudentProjection) {
    return (
      <StudentCommandDeck
        allSlides={allSlides}
        slide={slide}
        totalSlides={totalSlides}
      />
    );
  }

  return (
    <section
      className={`mx-auto w-full max-w-[1500px] px-4 ${
        compact ? "py-4" : "min-h-screen py-8"
      }`}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`h-10 w-2 rounded-full ${accentBars[slide.accent]}`} />
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-slate-500">
              第 {slide.id} 页 / {totalSlides}
            </p>
            <h1
              className={`font-black leading-tight text-ink ${
                compact ? "text-3xl" : "text-5xl lg:text-6xl"
              }`}
            >
              {slide.title}
            </h1>
          </div>
        </div>
      </div>

      <p
        className={`max-w-5xl font-bold leading-relaxed text-slate-700 ${
          compact ? "mb-4 text-xl" : "mb-8 text-3xl"
        }`}
      >
        {slide.subtitle}
      </p>

      <div className={`grid gap-5 ${compact ? "lg:grid-cols-[1fr_360px]" : "lg:grid-cols-[1.05fr_0.95fr]"}`}>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-stage">
          <h2 className={`font-black leading-tight ${compact ? "text-3xl" : "text-5xl"}`}>
            {slide.student.headline}
          </h2>
          <p
            className={`mt-4 leading-relaxed text-slate-700 ${
              compact ? "text-lg" : "text-2xl"
            }`}
          >
            {slide.student.summary}
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {slide.student.bullets.map((item) => (
              <div className="flex min-h-16 items-start gap-3 rounded-md bg-slate-50 p-4" key={item}>
                <CheckCircle2
                  aria-hidden="true"
                  className={`mt-1 shrink-0 ${accentText[slide.accent]}`}
                  size={compact ? 20 : 26}
                />
                <span className={`font-bold text-slate-900 ${compact ? "text-base" : "text-xl"}`}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        <RobotVisual
          accent={slide.accent}
          audience={audience}
          compact={compact}
          image={slide.image}
          imageAlt={slide.imageAlt}
          imageFit={slide.imageFit}
          imageSource={slide.imageSource}
          supportImages={slide.supportImages}
          visual={slide.visual}
        />
      </div>

      <div className={`mt-5 grid gap-5 ${compact ? "lg:grid-cols-[1.2fr_0.8fr]" : "lg:grid-cols-[1.4fr_0.6fr]"}`}>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-stage">
          <div className="mb-4 flex items-center gap-3">
            <ListChecks aria-hidden="true" className={accentText[slide.accent]} size={28} />
            <h3 className={`font-black ${compact ? "text-2xl" : "text-4xl"}`}>
              {slide.student.activityTitle}
            </h3>
          </div>
          <ol className="grid gap-3 md:grid-cols-2">
            {slide.student.activitySteps.map((step, index) => (
              <li
                className="flex min-h-16 items-center gap-3 rounded-md bg-slate-50 p-4"
                key={step}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base font-black text-white ${accentBars[slide.accent]}`}
                >
                  {index + 1}
                </span>
                <span className={`font-bold text-slate-900 ${compact ? "text-base" : "text-xl"}`}>
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-stage">
          <div className="mb-4 flex items-center gap-3">
            <Sparkles aria-hidden="true" className={accentText[slide.accent]} size={28} />
            <h3 className={`font-black ${compact ? "text-2xl" : "text-4xl"}`}>过关确认</h3>
          </div>
          <p className={`font-bold leading-relaxed text-slate-800 ${compact ? "text-lg" : "text-2xl"}`}>
            {slide.student.checkpoint}
          </p>
        </div>
      </div>
    </section>
  );
}
