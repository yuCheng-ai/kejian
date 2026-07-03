import {
  AlertTriangle,
  CheckSquare,
  Clock3,
  Megaphone,
  Monitor,
  NotebookText,
  ShieldCheck,
} from "lucide-react";
import { formatTime } from "../lib/time";
import type { CourseSlide } from "../types";

interface TeacherViewProps {
  countdown: {
    remainingSeconds: number;
    isRunning: boolean;
  };
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
    <section className={`teacher-runbook-block ${tone === "warning" ? "is-warning" : ""}`}>
      <div className="teacher-runbook-heading">
        <Icon aria-hidden="true" size={21} />
        <h3>{title}</h3>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export function TeacherView({ countdown, slide, totalSlides }: TeacherViewProps) {
  return (
    <div className="teacher-console screen-only">
      <section className="teacher-console-preview">
        <header className="teacher-console-header">
          <div>
            <span>学生屏当前关卡</span>
            <h1>{slide.title}</h1>
          </div>
          <div className="teacher-console-counter">
            {slide.id} / {totalSlides}
          </div>
        </header>

        <div className="teacher-student-card">
          <div className="teacher-student-copy">
            <span>{slide.subtitle}</span>
            <h2>{slide.student.headline}</h2>
            <p>{slide.student.summary}</p>
          </div>
          {slide.image ? (
            <img alt={slide.imageAlt ?? slide.title} src={slide.image} />
          ) : (
            <div className="teacher-student-placeholder">
              <Monitor aria-hidden="true" size={54} />
              <span>无图片素材</span>
            </div>
          )}
        </div>

        <div className="teacher-step-grid">
          {slide.student.activitySteps.slice(0, 4).map((step, index) => (
            <div className="teacher-step-item" key={step}>
              <span>{index + 1}</span>
              <strong>{step}</strong>
            </div>
          ))}
        </div>

        <div className="teacher-pass-line">
          <ShieldCheck aria-hidden="true" size={24} />
          <span>{slide.student.checkpoint}</span>
        </div>
      </section>

      <aside className="teacher-console-runbook">
        <section className="teacher-timing-card">
          <div>
            <span>预计用时</span>
            <strong>{slide.teacher.estimatedMinutes} 分钟</strong>
          </div>
          <div>
            <span>倒计时</span>
            <strong className="tabular-nums">{formatTime(countdown.remainingSeconds)}</strong>
          </div>
          <div className={countdown.isRunning ? "is-running" : ""}>
            <span>状态</span>
            <strong>{countdown.isRunning ? "计时中" : "已暂停"}</strong>
          </div>
        </section>

        <div className="teacher-runbook-grid">
          <TeacherBlock icon={NotebookText} items={slide.teacher.script} title="照读口令" />
          <TeacherBlock icon={Megaphone} items={slide.teacher.actions} title="现场动作" />
          <TeacherBlock icon={CheckSquare} items={slide.teacher.notes} title="控场边界" />
          <TeacherBlock
            icon={AlertTriangle}
            items={slide.teacher.emergency}
            title="失败处理"
            tone="warning"
          />
        </div>

        <section className="teacher-focus-card">
          <div>
            <Clock3 aria-hidden="true" size={20} />
            <strong>讲师提醒</strong>
          </div>
          <p>
            学生屏只负责带节奏。技术解释、家长沟通、失败兜底都在老师侧处理。
          </p>
        </section>
      </aside>
    </div>
  );
}
