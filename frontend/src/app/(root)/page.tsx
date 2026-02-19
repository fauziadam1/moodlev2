"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthUser } from "@/lib/auth";
import { CourseListUser } from "@/components/course-list-user";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const { user } = useAuthUser();

  return (
    <div>
      <div className="border-b bg-gray-50">
        <div className="container px-10 py-15 mx-auto space-y-5">
          <div className="space-y-2">
            <h1 className="font-semibold text-3xl">
              Selamat datang {user?.username}
            </h1>
            <p className="text-gray-600 text-sm">
              Belajar gratis di moodle kawe super.
            </p>
          </div>
          {!user && (
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>Aku lihat kamu belum login nih...</CardTitle>
                <CardDescription>
                  Login untuk mengakses course kami dan daftar course kami untuk
                  meningkatkan soft skill mu.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="secondary">
                  <Link href={"/login"}>Login</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <CourseListUser />
    </div>
  );
}
