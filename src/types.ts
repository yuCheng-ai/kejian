export type ViewMode = "student" | "teacher";

export type PrintKind = "tasks" | "parents" | "purchase" | "certificate";

export type SyncStatus = "connecting" | "connected" | "disconnected";

export interface QrLink {
  id: string;
  label: string;
  url: string;
  description: string;
}

export interface SlideStudentContent {
  headline: string;
  summary: string;
  bullets: string[];
  activityTitle: string;
  activitySteps: string[];
  checkpoint: string;
  callout: string;
}

export interface SlideTeacherContent {
  estimatedMinutes: number;
  script: string[];
  actions: string[];
  notes: string[];
  emergency: string[];
}

export interface CourseSlide {
  id: number;
  title: string;
  subtitle: string;
  visual: string;
  image?: string;
  imageAlt?: string;
  imageSource?: string;
  imageFit?: "cover" | "contain";
  supportImages?: Array<{
    src: string;
    label: string;
    source?: string;
  }>;
  accent: "cyan" | "green" | "orange" | "yellow" | "red";
  timerSeconds: number;
  student: SlideStudentContent;
  teacher: SlideTeacherContent;
}

export interface CourseData {
  meta: {
    title: string;
    subtitle: string;
    audience: string;
    durationMinutes: number;
    hardware: string;
    host: string;
    qrLinks: QrLink[];
  };
  slides: CourseSlide[];
}

export interface TaskCard {
  title: string;
  goal: string;
  steps: string[];
  check: string;
}

export interface ParentGuideSection {
  title: string;
  items: string[];
}

export interface PurchaseItem {
  name: string;
  fit: string;
  includes: string[];
  nextStep: string;
}

export interface PrintablesData {
  taskCards: TaskCard[];
  parentGuide: {
    title: string;
    intro: string;
    sections: ParentGuideSection[];
  };
  purchasePage: {
    title: string;
    intro: string;
    items: PurchaseItem[];
    promise: string[];
  };
  certificate: {
    title: string;
    subtitle: string;
    achievements: string[];
    footer: string;
  };
}
