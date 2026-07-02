import { SlideCanvas } from "./SlideCanvas";
import type { CourseData, CourseSlide } from "../types";

interface StudentViewProps {
  course: CourseData;
  slide: CourseSlide;
  totalSlides: number;
}

export function StudentView({ course, slide, totalSlides }: StudentViewProps) {
  return (
    <div className="screen-only">
      <SlideCanvas audience="student" course={course} slide={slide} totalSlides={totalSlides} />
    </div>
  );
}
