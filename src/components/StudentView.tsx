import { SlideCanvas } from "./SlideCanvas";
import type { CourseSlide } from "../types";

interface StudentViewProps {
  allSlides: CourseSlide[];
  slide: CourseSlide;
  totalSlides: number;
}

export function StudentView({ allSlides, slide, totalSlides }: StudentViewProps) {
  return (
    <div className="screen-only">
      <SlideCanvas
        allSlides={allSlides}
        audience="student"
        slide={slide}
        totalSlides={totalSlides}
      />
    </div>
  );
}
