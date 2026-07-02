import { AlertTriangle, CheckSquare, Clock3, Megaphone, NotebookText } from "lucide-react";
import { SlideCanvas } from "./SlideCanvas";
import { formatTime } from "../lib/time";
import type { CourseData, CourseSlide } from "../types";

interface TeacherViewProps {
  countdown: {
    remainingSeconds: number;
    isRunning: boolean;
  };
  course: CourseData;
  slide: CourseSlide;
  totalSlides: number;
}

interface TeacherBlockProps {
  icon: typeof NotebookText;
  items: string[];
  title: string;
  tone?: "normal" | "warning";
}

function TeacherBlock({ icon: Icon, items, title, tone = "normal" }: TeacherBlockProps) {
  return (
    <section
      className={`rounded-lg border p-4 shadow-sm ${
        tone === "warning" ? "border-red-200 bg-red-50" : "border-slate-200 bg-white"
      }`}
    >
      <div className="mb-3 flex items-center gap-2">
        <Icon
          aria-hidden="true"
          className={tone === "warning" ? "text-red-600" : "text-slate-700"}
          size={22}
        />
        <h3 className="text-xl font-black text-slate-950">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li className="leading-relaxed text-slate-800" key={item}>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function TeacherView({ countdown, course, slide, totalSlides }: TeacherViewProps) {
  return (
    <div className="screen-only grid min-h-screen gap-4 bg-slate-100 px-4 pt-[76px] lg:grid-cols-[minmax(0,1.15fr)_minmax(420px,0.85fr)]">
      <div className="rounded-lg border border-slate-200 bg-white">
        <SlideCanvas
          audience="teacher"
          compact
          course={course}
          slide={slide}
          totalSlides={totalSlides}
        />
      </div>

      <aside className="pb-6">
        <div className="sticky top-[84px] space-y-4">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-slate-500">
                  第 {slide.id} 页
                </p>
                <h2 className="text-3xl font-black text-slate-950">{slide.title}</h2>
              </div>
              <div className="rounded-md bg-slate-950 px-4 py-3 text-right text-white">
                <p className="text-xs font-black uppercase tracking-wide text-slate-300">倒计时</p>
                <p className="text-3xl font-black tabular-nums">
                  {formatTime(countdown.remainingSeconds)}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-md bg-cyan-50 p-3 text-cyan-900">
                <Clock3 aria-hidden="true" size={22} />
                <span className="font-black">预计 {slide.teacher.estimatedMinutes} 分钟</span>
              </div>
              <div className="flex items-center gap-3 rounded-md bg-green-50 p-3 text-green-900">
                <CheckSquare aria-hidden="true" size={22} />
                <span className="font-black">
                  {countdown.isRunning ? "计时进行中" : "计时已暂停"}
                </span>
              </div>
            </div>
          </section>

          <TeacherBlock icon={NotebookText} items={slide.teacher.script} title="讲稿" />
          <TeacherBlock icon={Megaphone} items={slide.teacher.actions} title="现场动作" />
          <TeacherBlock icon={CheckSquare} items={slide.teacher.notes} title="注意事项" />
          <TeacherBlock
            icon={AlertTriangle}
            items={slide.teacher.emergency}
            title="故障应急"
            tone="warning"
          />
        </div>
      </aside>
    </div>
  );
}
