export type ViewMode = "student" | "teacher";

export type PrintKind = "tasks" | "parents" | "certificate";

export type SyncStatus = "connecting" | "connected" | "disconnected";

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
    host: string;
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

export interface PrintablesData {
  taskCards: TaskCard[];
  parentGuide: {
    title: string;
    intro: string;
    sections: ParentGuideSection[];
  };
  certificate: {
    title: string;
    subtitle: string;
    achievements: string[];
    footer: string;
  };
}
