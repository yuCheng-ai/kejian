import { ArrowLeft, Printer, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import type { CourseData } from "../types";

interface QrPageProps {
  course: CourseData;
  onBack: () => void;
}

export function QrPage({ course, onBack }: QrPageProps) {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="screen-only mx-auto flex max-w-[1320px] items-center justify-between gap-3 px-5 py-5">
        <button className="command-button bg-white text-slate-950" onClick={onBack} type="button">
          <ArrowLeft aria-hidden="true" size={18} />
          返回课件
        </button>
        <button
          className="command-button bg-white text-slate-950"
          onClick={() => window.print()}
          type="button"
        >
          <Printer aria-hidden="true" size={18} />
          打印
        </button>
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-92px)] max-w-[1320px] flex-col justify-center px-5 pb-10">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-cyan-400 text-slate-950">
            <QrCode aria-hidden="true" size={38} />
          </div>
          <div>
            <p className="text-xl font-black text-cyan-200">{course.meta.host}</p>
            <h1 className="text-5xl font-black leading-tight">{course.meta.title}</h1>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {course.meta.qrLinks.map((link) => (
            <article className="rounded-lg bg-white p-8 text-slate-950 shadow-stage" key={link.id}>
              <div className="flex flex-col items-center text-center">
                <QRCodeSVG value={link.url} size={280} />
                <h2 className="mt-6 text-4xl font-black">{link.label}</h2>
                <p className="mt-3 max-w-lg text-xl font-bold leading-relaxed text-slate-700">
                  {link.description}
                </p>
                <p className="mt-4 break-all rounded-md bg-slate-100 px-4 py-3 text-base font-bold text-slate-600">
                  {link.url}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
