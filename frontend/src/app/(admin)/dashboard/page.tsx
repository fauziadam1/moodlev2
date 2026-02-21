import { Metadata } from "next";
import { CourseListAdmin } from "@/components/course-list-admin";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default function RegisterPage() {
  return (
    <div className="w-full h-screen flex items-start justify-center mt-10">
      <CourseListAdmin />
    </div>
  );
}
