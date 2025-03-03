import { useState, useEffect } from "react";

export function useCourseCalculator(groupName: string) {
  const [course, setCourse] = useState<number | null>(null);

  useEffect(() => {
    if (!groupName) {
      setCourse(null);
      return;
    }

    const match = groupName.match(/(\d{2})$/);
    if (match) {
      const groupYear = parseInt("20" + match[1], 10);

      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      const academicYear = currentMonth >= 9 ? currentYear : currentYear - 1;

      const calculatedCourse = academicYear - groupYear + 1;

      if (calculatedCourse >= 1 && calculatedCourse <= 5) {
        setCourse(calculatedCourse);
      } else {
        setCourse(null);
      }
    } else {
      setCourse(null);
    }
  }, [groupName]);

  return course;
}
