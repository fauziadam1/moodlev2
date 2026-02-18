import { Metadata } from "next";
import { CourseView } from "@/components/course-view";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default function RegisterPage() {
  return (
    <div className="w-full h-screen flex items-start justify-center mt-10">
      <CourseView />
    </div>
  );
}
