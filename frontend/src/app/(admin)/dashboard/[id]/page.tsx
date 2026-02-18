"use client";

import Link from "next/link";
import { api } from "@/lib/axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Course = {
  id: string;
  title: string;
  description: string;
  is_published: boolean;
};

export function CourseView() {
  const params = useParams<{ id: string }>();
  const [isLoading, SetLoading] = useState(false);
  const [courses, setCourse] = useState<Course[]>([]);

  const CourseId = params.id;

  useEffect(() => {
    const fetchCourse = async () => {
      SetLoading(true);
      try {
        const res = await api.get(`/api/courses/${CourseId}`);
        SetLoading(false);
        setCourse(res.data.data);
      } catch {}
    };
    fetchCourse();
  }, []);

  return <div className="container px-10 mx-auto"></div>;
}
