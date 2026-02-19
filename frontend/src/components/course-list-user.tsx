"use client";

import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
type Course = {
  id: number;
  title: string;
  description: string;
  is_published: boolean;
  created_at: string;
};

export function CourseListUser() {
  const [isLoading, SetLoading] = useState(false);
  const [isPubLoading, setPubLoading] = useState<number | null>(null);
  const [courses, setCourse] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourse = async () => {
      SetLoading(true);
      try {
        const res = await api.get("/api/courses-user");
        SetLoading(false);
        setCourse(res.data.data);
      } catch {}
    };
    fetchCourse();
  }, []);

  return (
    <div className="container px-10 py-10 mx-auto">
      <div className="space-y-5">
        <div className="">
          {isLoading ? (
            <div className="col-span-4 flex items-center justify-center h-64">
              <Spinner className="size-8" />
            </div>
          ) : (
            courses.map((course) => (
              <Card
                key={course.id}
                className="relative max-w-2xl"
              >
                <CardHeader>
                  <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                  <CardDescription className="text-justify line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
