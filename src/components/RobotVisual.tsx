import {
  Bot,
  Brain,
  Cable,
  CheckCircle2,
  Cloud,
  Cpu,
  Ear,
  GraduationCap,
  Home,
  Images,
  Lightbulb,
  Map,
  MessageCircle,
  Mic,
  Monitor,
  Power,
  Puzzle,
  RotateCcw,
  Search,
  ShieldCheck,
  Smile,
  Sparkles,
  Tag,
  Trophy,
  Users,
  Volume2,
  Wifi,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CourseSlide } from "../types";

interface RobotVisualProps {
  accent: CourseSlide["accent"];
  audience?: "student" | "teacher";
  compact?: boolean;
  image?: string;
  imageAlt?: string;
  imageFit?: CourseSlide["imageFit"];
  imageSource?: string;
  supportImages?: CourseSlide["supportImages"];
  visual: string;
}

interface VisualConfig {
  icon: LucideIcon;
  label: string;
  status: string;
  chips: string[];
}

interface VisualStep {
  icon: LucideIcon;
  label: string;
  detail: string;
}

const accentTokens: Record<CourseSlide["accent"], string> = {
  cyan: "border-cyan-300 bg-cyan-50 text-cyan-800",
  green: "border-green-300 bg-green-50 text-green-800",
  orange: "border-orange-300 bg-orange-50 text-orange-800",
  yellow: "border-yellow-300 bg-yellow-50 text-yellow-900",
  red: "border-red-300 bg-red-50 text-red-800",
};

const accentBg: Record<CourseSlide["accent"], string> = {
  cyan: "bg-cyan-500",
  green: "bg-green-500",
  orange: "bg-orange-500",
  yellow: "bg-yellow-400",
  red: "bg-red-500",
};

const visualMap: Record<string, VisualConfig> = {
  title: {
    icon: Bot,
    label: "AI 桌宠",
    status: "待唤醒",
    chips: ["听", "说", "表情"],
  },
  demo: {
    icon: Sparkles,
    label: "出场演示",
    status: "正在互动",
    chips: ["唤醒词", "问答", "表情"],
  },
  mission: {
    icon: Map,
    label: "闯关路线",
    status: "8 个任务",
    chips: ["检查", "开机", "展示"],
  },
  systems: {
    icon: Brain,
    label: "AI 线索",
    status: "正在判断",
    chips: ["声音", "画面", "文字", "任务"],
  },
  chip: {
    icon: Cpu,
    label: "控制中心",
    status: "控制中心",
    chips: ["Wi-Fi", "音频", "屏幕"],
  },
  listen: {
    icon: Ear,
    label: "听懂人话",
    status: "声音输入",
    chips: ["麦克风", "识别", "意图"],
  },
  speak: {
    icon: Volume2,
    label: "说出回答",
    status: "声音输出",
    chips: ["文字", "合成", "喇叭"],
  },
  face: {
    icon: Smile,
    label: "表情状态",
    status: "交流中",
    chips: ["开心", "思考", "疑问"],
  },
  parts: {
    icon: Puzzle,
    label: "零件点名",
    status: "检查材料",
    chips: ["线材", "板子", "外壳"],
  },
  power: {
    icon: Power,
    label: "第一次开机",
    status: "通电启动",
    chips: ["插线", "亮灯", "等待"],
  },
  cloud: {
    icon: Cloud,
    label: "AI 大脑",
    status: "连接网络",
    chips: ["Wi-Fi", "问候", "回答"],
  },
  name: {
    icon: Tag,
    label: "命名仪式",
    status: "拥有身份",
    chips: ["名字", "贴纸", "故事"],
  },
  personality: {
    icon: Users,
    label: "性格卡",
    status: "设定风格",
    chips: ["探险家", "小老师", "守护者"],
  },
  challenge: {
    icon: Trophy,
    label: "挑战任务",
    status: "三次调试",
    chips: ["观察", "改进", "展示"],
  },
  showcase: {
    icon: Images,
    label: "作品展示",
    status: "60 秒上台",
    chips: ["名字", "性格", "挑战"],
  },
  home: {
    icon: Home,
    label: "继续升级",
    status: "带回家",
    chips: ["证书", "任务卡", "升级"],
  },
};

const fallbackVisual: VisualConfig = {
  icon: Lightbulb,
  label: "任务",
  status: "进行中",
  chips: ["观察", "动手", "表达"],
};

const stepMap: Record<string, VisualStep[]> = {
  title: [
    { icon: Bot, label: "看见它", detail: "桌宠出场" },
    { icon: Power, label: "唤醒它", detail: "开机亮屏" },
    { icon: MessageCircle, label: "认识它", detail: "名字性格" },
  ],
  demo: [
    { icon: Mic, label: "听见", detail: "唤醒词" },
    { icon: Brain, label: "思考", detail: "理解问题" },
    { icon: Volume2, label: "回应", detail: "声音表情" },
  ],
  mission: [
    { icon: Puzzle, label: "认识零件", detail: "先检查" },
    { icon: Power, label: "开机", detail: "看状态" },
    { icon: Wifi, label: "连接 AI", detail: "说问候" },
    { icon: Tag, label: "起名字", detail: "贴上身份" },
    { icon: Users, label: "选性格", detail: "设定风格" },
    { icon: Trophy, label: "挑战展示", detail: "讲过程" },
  ],
  systems: [
    { icon: Mic, label: "声音", detail: "听你说话" },
    { icon: Monitor, label: "画面", detail: "看见东西" },
    { icon: MessageCircle, label: "文字", detail: "读到内容" },
    { icon: Brain, label: "任务", detail: "知道目标" },
  ],
  chip: [
    { icon: Mic, label: "输入", detail: "声音进来" },
    { icon: Cpu, label: "控制", detail: "程序调度" },
    { icon: Monitor, label: "表现", detail: "屏幕表情" },
    { icon: Volume2, label: "输出", detail: "喇叭说话" },
  ],
  listen: [
    { icon: Mic, label: "声音", detail: "麦克风接收" },
    { icon: Ear, label: "文字", detail: "语音识别" },
    { icon: Brain, label: "意图", detail: "AI 理解" },
    { icon: Bot, label: "动作", detail: "机器人反应" },
  ],
  speak: [
    { icon: Brain, label: "回答", detail: "AI 生成文字" },
    { icon: MessageCircle, label: "语气", detail: "变成说法" },
    { icon: Volume2, label: "声音", detail: "喇叭播放" },
    { icon: Smile, label: "表情", detail: "同步状态" },
  ],
  face: [
    { icon: Smile, label: "开心", detail: "回答成功" },
    { icon: Search, label: "专注", detail: "正在听你" },
    { icon: RotateCcw, label: "等待", detail: "正在思考" },
    { icon: Lightbulb, label: "疑问", detail: "没听清楚" },
  ],
  parts: [
    { icon: Cpu, label: "开发板", detail: "控制中心" },
    { icon: Cable, label: "USB 线", detail: "供电通信" },
    { icon: Mic, label: "麦克风", detail: "接收声音" },
    { icon: Volume2, label: "喇叭", detail: "播放回答" },
    { icon: Monitor, label: "屏幕", detail: "显示表情" },
    { icon: Puzzle, label: "外壳", detail: "变成桌宠" },
  ],
  power: [
    { icon: Cable, label: "插线", detail: "对准接口" },
    { icon: Power, label: "通电", detail: "看指示灯" },
    { icon: Monitor, label: "亮屏", detail: "等启动" },
    { icon: CheckCircle2, label: "记录", detail: "写下变化" },
  ],
  cloud: [
    { icon: Cpu, label: "控制中心", detail: "收集问题" },
    { icon: Wifi, label: "网络桥", detail: "发送请求" },
    { icon: Cloud, label: "AI 大脑", detail: "生成回答" },
    { icon: MessageCircle, label: "带回结果", detail: "机器人说出" },
  ],
  name: [
    { icon: Tag, label: "候选名", detail: "写 3 个" },
    { icon: Users, label: "投票", detail: "家庭决定" },
    { icon: MessageCircle, label: "呼叫", detail: "说给它听" },
    { icon: Smile, label: "贴纸", detail: "身份完成" },
  ],
  personality: [
    { icon: Search, label: "探险家", detail: "爱发现" },
    { icon: GraduationCap, label: "小老师", detail: "会解释" },
    { icon: ShieldCheck, label: "守护者", detail: "会提醒" },
  ],
  challenge: [
    { icon: Search, label: "第一次", detail: "看结果" },
    { icon: Wrench, label: "第二次", detail: "说清楚" },
    { icon: Sparkles, label: "第三次", detail: "加性格" },
    { icon: Trophy, label: "展示", detail: "选最好" },
  ],
  showcase: [
    { icon: Tag, label: "名字", detail: "介绍身份" },
    { icon: Users, label: "性格", detail: "说明选择" },
    { icon: Bot, label: "互动", detail: "演示一句" },
    { icon: Lightbulb, label: "改进", detail: "讲调试" },
  ],
  home: [
    { icon: Home, label: "家庭任务", detail: "每天一问" },
    { icon: Puzzle, label: "继续扩展", detail: "传感器/表情" },
    { icon: Trophy, label: "作品成长", detail: "下次展示" },
  ],
};

function VisualHeader({
  accent,
  compact,
  config,
}: {
  accent: CourseSlide["accent"];
  compact?: boolean;
  config: VisualConfig;
}) {
  const Icon = config.icon;

  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-black uppercase tracking-wide opacity-80">{config.label}</p>
        <p className={compact ? "text-2xl font-black" : "text-3xl font-black"}>
          {config.status}
        </p>
      </div>
      <div
        className={`flex items-center justify-center rounded-lg ${accentBg[accent]} ${
          compact ? "h-11 w-11" : "h-14 w-14"
        } text-white shadow-sm`}
      >
        <Icon aria-hidden="true" size={compact ? 26 : 34} />
      </div>
    </div>
  );
}

function FlowCards({
  accent,
  compact,
  steps,
}: {
  accent: CourseSlide["accent"];
  compact?: boolean;
  steps: VisualStep[];
}) {
  return (
    <div className={`grid gap-2 ${steps.length > 4 ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-2"}`}>
      {steps.map(({ detail, icon: Icon, label }) => (
        <div
          className="flex min-h-20 items-center gap-3 rounded-md border border-white/80 bg-white p-3 text-slate-900 shadow-sm"
          key={`${label}-${detail}`}
        >
          <div
            className={`flex shrink-0 items-center justify-center rounded-md ${accentBg[accent]} ${
              compact ? "h-9 w-9" : "h-11 w-11"
            } text-white`}
          >
            <Icon aria-hidden="true" size={compact ? 19 : 23} />
          </div>
          <div className="min-w-0">
            <p className={`font-black leading-tight ${compact ? "text-sm" : "text-base"}`}>
              {label}
            </p>
            <p className={`mt-1 font-bold leading-tight text-slate-500 ${compact ? "text-xs" : "text-sm"}`}>
              {detail}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function RobotStage({
  accent,
  compact,
  config,
}: {
  accent: CourseSlide["accent"];
  compact?: boolean;
  config: VisualConfig;
}) {
  const Icon = config.icon;

  return (
    <div className={`robot-device ${compact ? "mt-3" : "mt-5"}`}>
      <div className="robot-head">
        <span />
        <span />
      </div>
      <div className="robot-screen">
        <Icon aria-hidden="true" size={compact ? 64 : 92} />
      </div>
      <div className="robot-controls">
        <span />
        <span />
        <span />
      </div>
      <div className="mt-4 grid w-full grid-cols-3 gap-2">
        {config.chips.map((chip) => (
          <span
            className={`rounded bg-white px-2 py-2 text-center text-xs font-black ${
              accent === "yellow" ? "text-yellow-900" : "text-slate-900"
            }`}
            key={chip}
          >
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}

function ImageStory({
  accent,
  audience,
  compact,
  config,
  image,
  imageAlt,
  imageFit = "cover",
  imageSource,
  supportImages = [],
  steps,
}: {
  accent: CourseSlide["accent"];
  audience?: "student" | "teacher";
  compact?: boolean;
  config: VisualConfig;
  image: string;
  imageAlt?: string;
  imageFit?: CourseSlide["imageFit"];
  imageSource?: string;
  supportImages?: CourseSlide["supportImages"];
  steps: VisualStep[];
}) {
  return (
    <div className="space-y-3">
      <div
        className={`relative overflow-hidden rounded-lg border border-white/80 bg-white shadow-sm ${
          compact ? "h-[220px]" : "h-[330px]"
        }`}
      >
        <img
          alt={imageAlt ?? config.label}
          className={`h-full w-full ${imageFit === "contain" ? "object-contain p-3" : "object-cover"}`}
          src={image}
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-4 text-white">
          <p className="text-sm font-black opacity-90">{config.label}</p>
          <p className={compact ? "text-2xl font-black" : "text-3xl font-black"}>
            {config.status}
          </p>
          {audience === "teacher" && imageSource ? (
            <p className="mt-1 text-xs font-bold text-white/80">{imageSource}</p>
          ) : null}
        </div>
      </div>
      {supportImages.length > 0 ? (
        <div className={`grid gap-2 ${supportImages.length > 2 ? "grid-cols-3" : "grid-cols-2"}`}>
          {supportImages.map((item) => (
            <figure
              className="overflow-hidden rounded-md border border-white/80 bg-white shadow-sm"
              key={`${item.label}-${item.src}`}
            >
              <img
                alt={item.label}
                className={`w-full bg-slate-50 object-contain p-1 ${compact ? "h-20" : "h-28"}`}
                src={item.src}
              />
              <figcaption className="px-2 py-2">
                <p className="text-xs font-black leading-tight text-slate-900">{item.label}</p>
                {audience === "teacher" && item.source ? (
                  <p className="mt-1 text-[11px] font-bold leading-tight text-slate-500">
                    {item.source}
                  </p>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </div>
      ) : null}
      <FlowCards accent={accent} compact={compact} steps={steps} />
    </div>
  );
}

export function RobotVisual({
  accent,
  audience = "student",
  compact = false,
  image,
  imageAlt,
  imageFit,
  imageSource,
  supportImages = [],
  visual,
}: RobotVisualProps) {
  const config = visualMap[visual] ?? fallbackVisual;
  const steps = stepMap[visual] ?? stepMap.title;

  return (
    <div
      className={`rounded-lg border-2 ${accentTokens[accent]} p-4 shadow-stage ${
        compact ? "min-h-[360px]" : "min-h-[500px]"
      }`}
    >
      {image ? (
        <ImageStory
          accent={accent}
          audience={audience}
          compact={compact}
          config={config}
          image={image}
          imageAlt={imageAlt}
          imageFit={imageFit}
          imageSource={imageSource}
          supportImages={supportImages}
          steps={steps}
        />
      ) : (
        <div className="space-y-4">
          <VisualHeader accent={accent} compact={compact} config={config} />
          <RobotStage accent={accent} compact={compact} config={config} />
          <FlowCards accent={accent} compact={compact} steps={steps} />
        </div>
      )}
    </div>
  );
}
