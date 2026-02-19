"use client";

import { api } from "@/lib/axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SetAdd } from "@/components/set-add";
import { LessonAdd } from "@/components/lesson-add";

type Set = {
  id: string;
  title: string;
  course_id: string;
  sort_order?: number;
};

type Lesson = {
  id: string;
  title: string;
  description: string;
  content: string;
  sort_order?: number;
};

type Course = {
  id: string;
  title: string;
  description: string;
  is_published: boolean;
};

export default function CourseDetailPage() {
  const params = useParams<{ id: string }>();
  const CourseId = params.id;

  const [isLoading, SetLoading] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [sets, setSets] = useState<Set[]>([]);
  const [activeSet, setActiveSet] = useState<Set | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    const fetchCourse = async () => {
      SetLoading(true);
      try {
        const res = await api.get(`/api/courses/${CourseId}`);
        setCourse(res.data.data);
      } catch (e) {
        console.error(e);
      } finally {
        SetLoading(false);
      }
    };

    if (CourseId) fetchCourse();
  }, [CourseId]);

  const fetchSets = async () => {
    SetLoading(true);
    try {
      const res = await api.get(`/api/courses/${CourseId}/sets`);
      const data = res.data.data;

      setSets(data);

      if (data.length > 0) {
        setActiveSet(data[0]);
      } else {
        setActiveSet(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      SetLoading(false);
    }
  };

  useEffect(() => {
    if (CourseId) fetchSets();
  }, [CourseId]);

  const fetchLessons = async (setId: string) => {
    SetLoading(true);
    try {
      const res = await api.get(`/api/sets/${setId}/lessons`);
      setLessons(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      SetLoading(false);
    }
  };

  useEffect(() => {
    if (activeSet) fetchLessons(activeSet.id);
  }, [activeSet]);

  return (
    <div className="container px-10 mx-auto mt-10">
      <div className="w-full flex gap-10">
        <div className="w-full space-y-5">

          {course && (
            <div className="space-y-2">
              <h1 className="font-bold text-2xl">{course.title}</h1>
              <p className="max-w-3xl">{course.description}</p>
            </div>
          )}

          <div className="border rounded-xl p-6 min-h-75 bg-white">

            {activeSet ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">
                    {activeSet.title}
                  </h2>

                  <LessonAdd
                    setId={activeSet.id}
                    onSuccess={() => fetchLessons(activeSet.id)}
                  />
                </div>
                {lessons.length > 0 ? (
                  <div className="space-y-3">
                    {lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="border rounded-lg p-4"
                      >
                        <h3 className="font-semibold">
                          {lesson.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {lesson.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">
                    Belum ada content di set ini.
                  </p>
                )}
              </>
            ) : (
              <p className="text-gray-400">
                Belum ada set. Tambahkan set terlebih dahulu.
              </p>
            )}
          </div>
        </div>
        <div className="w-87.5 border rounded-xl p-4 space-y-5 bg-gray-50">

          <div className="flex justify-end">
            <SetAdd courseId={CourseId} onSuccess={fetchSets} />
          </div>

          <div className="space-y-3">
            {sets.map((set) => (
              <div
                key={set.id}
                onClick={() => setActiveSet(set)}
                className={`border rounded-lg p-4 cursor-pointer transition
                  ${
                    activeSet?.id === set.id
                      ? "bg-blue-50 border-blue-500"
                      : "bg-white hover:bg-gray-100"
                  }`}
              >
                <h1 className="font-semibold text-sm line-clamp-1">
                  {set.title}
                </h1>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}