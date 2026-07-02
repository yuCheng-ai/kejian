import { ArrowLeft, Printer } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import type { CourseData, PrintablesData, PrintKind } from "../types";

interface PrintViewProps {
  course: CourseData;
  data: PrintablesData;
  kind: PrintKind;
  onChangeKind: (kind: PrintKind) => void;
  onClose: () => void;
}

const printLabels: Record<PrintKind, string> = {
  tasks: "学生任务卡",
  parents: "家长说明页",
  purchase: "购买页",
  certificate: "证书",
};

const printOptions: PrintKind[] = ["tasks", "parents", "purchase", "certificate"];

function PrintToolbar({ kind, onChangeKind, onClose }: PrintViewProps) {
  return (
    <header className="screen-only sticky top-0 z-50 border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3">
        <button className="command-button" onClick={onClose} type="button">
          <ArrowLeft aria-hidden="true" size={18} />
          返回课件
        </button>
        <div className="segmented-control" role="group">
          {printOptions.map((option) => (
            <button
              className={kind === option ? "is-active" : ""}
              key={option}
              onClick={() => onChangeKind(option)}
              type="button"
            >
              {printLabels[option]}
            </button>
          ))}
        </div>
        <button className="command-button" onClick={() => window.print()} type="button">
          <Printer aria-hidden="true" size={18} />
          打印当前页
        </button>
      </div>
    </header>
  );
}

function TaskCards({ course, data }: { course: CourseData; data: PrintablesData }) {
  return (
    <div className="print-page">
      <header className="print-header">
        <p>{course.meta.host}</p>
        <h1>学生任务卡</h1>
        <span>{course.meta.title}</span>
      </header>

      <div className="student-info-row">
        <span>姓名：</span>
        <span>组号：</span>
        <span>机器人名字：</span>
      </div>

      <div className="task-card-grid">
        {data.taskCards.map((card) => (
          <article className="print-task-card" key={card.title}>
            <h2>{card.title}</h2>
            <p className="goal">{card.goal}</p>
            <ol>
              {card.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <div className="check-line">过关确认：{card.check}</div>
          </article>
        ))}
      </div>
    </div>
  );
}

function ParentGuide({ course, data }: { course: CourseData; data: PrintablesData }) {
  return (
    <div className="print-page">
      <header className="print-header">
        <p>{course.meta.host}</p>
        <h1>{data.parentGuide.title}</h1>
        <span>{course.meta.subtitle}</span>
      </header>
      <p className="print-intro">{data.parentGuide.intro}</p>
      <div className="print-section-grid">
        {data.parentGuide.sections.map((section) => (
          <section className="print-section" key={section.title}>
            <h2>{section.title}</h2>
            <ul>
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <footer className="print-footer">请和孩子一起保留任务卡，作为后续课程的作品记录。</footer>
    </div>
  );
}

function PurchasePage({ course, data }: { course: CourseData; data: PrintablesData }) {
  const kitLink = course.meta.qrLinks[0];

  return (
    <div className="print-page">
      <header className="print-header">
        <p>{course.meta.host}</p>
        <h1>{data.purchasePage.title}</h1>
        <span>{course.meta.subtitle}</span>
      </header>

      <div className="purchase-layout">
        <div>
          <p className="print-intro">{data.purchasePage.intro}</p>
          <div className="purchase-items">
            {data.purchasePage.items.map((item) => (
              <article className="purchase-item" key={item.name}>
                <h2>{item.name}</h2>
                <p>{item.fit}</p>
                <ul>
                  {item.includes.map((included) => (
                    <li key={included}>{included}</li>
                  ))}
                </ul>
                <strong>{item.nextStep}</strong>
              </article>
            ))}
          </div>
        </div>
        <aside className="purchase-qr">
          <QRCodeSVG value={kitLink.url} size={190} />
          <h2>{kitLink.label}</h2>
          <p>{kitLink.description}</p>
          <span>{kitLink.url}</span>
        </aside>
      </div>

      <div className="promise-row">
        {data.purchasePage.promise.map((promise) => (
          <span key={promise}>{promise}</span>
        ))}
      </div>
    </div>
  );
}

function Certificate({ course, data }: { course: CourseData; data: PrintablesData }) {
  return (
    <div className="print-page certificate-sheet">
      <div className="certificate-box">
        <p className="certificate-host">{course.meta.host}</p>
        <h1>{data.certificate.title}</h1>
        <p className="certificate-subtitle">{data.certificate.subtitle}</p>
        <div className="certificate-name">姓名：</div>
        <div className="achievement-row">
          {data.certificate.achievements.map((achievement) => (
            <span key={achievement}>{achievement}</span>
          ))}
        </div>
        <div className="certificate-footer">
          <span>{data.certificate.footer}</span>
          <span>日期：______ 年 ____ 月 ____ 日</span>
        </div>
      </div>
    </div>
  );
}

function PrintableContent({
  course,
  data,
  kind,
}: {
  course: CourseData;
  data: PrintablesData;
  kind: PrintKind;
}) {
  if (kind === "tasks") {
    return <TaskCards course={course} data={data} />;
  }

  if (kind === "parents") {
    return <ParentGuide course={course} data={data} />;
  }

  if (kind === "purchase") {
    return <PurchasePage course={course} data={data} />;
  }

  return <Certificate course={course} data={data} />;
}

export function PrintView(props: PrintViewProps) {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <PrintToolbar {...props} />
      <div className="mx-auto max-w-[1200px] py-6">
        <PrintableContent course={props.course} data={props.data} kind={props.kind} />
      </div>
    </main>
  );
}
