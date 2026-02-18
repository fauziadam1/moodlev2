"use client";

import z from "zod";
import { api } from "@/lib/axios";
import { CourseForm } from "./course-form";
import { useEffect, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type Course = {
  id: string;
  title: string;
  description: string;
  is_published: boolean;
};

export function CourseView() {
  const [isLoading, SetLoading] = useState(false);
  const [courses, setCourse] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourse = async () => {
      SetLoading(true);
      try {
        const res = await api.get("/api/courses-admin");
        SetLoading(false);
        setCourse(res.data.data);
      } catch {}
    };
    fetchCourse();
  }, []);

  return (
    <div className="container px-10 mx-auto">
      <div className="space-y-5">
        <CourseForm />
        <div className="grid grid-cols-4 gap-4">
          {isLoading ? (
            <div className="col-span-4 flex items-center justify-center h-64">
              <Spinner className="size-8" />
            </div>
          ) : (
            courses.map((course) => (
              <Link key={course.id} href={`/dashboard/${course.id}`}>
                <Card className="relative w-full h-80 max-w-sm pt-0 overflow-auto">
                  <div className="w-full h-30 bg-gray-200" />
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                    <CardDescription className="text-justify line-clamp-3">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex gap-2 mt-auto">
                    <Button className="flex-1 rounded-xl">Published</Button>
                    <Button className="flex-1 rounded-xl" variant="outline">View</Button>
                  </CardFooter>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
