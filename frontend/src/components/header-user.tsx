"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { api } from "@/lib/axios";
import { Spinner } from "./ui/spinner";
import { BookMarked, Home, LogOutIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function HeaderUser({
  user,
}: {
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}) {
  const [isLoading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await api.get("/sanctum/csrf-cookie");
      await new Promise((resolve) => setTimeout(resolve, 100));
      await api.post("/api/logout");

      toast.success("Logout success");
      setLoading(false);
      window.location.href = "/";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const message = err?.response?.message ?? err.message ?? "Logout failed";
      toast.error(message);
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="flex items-center gap-5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="w-10 h-10 border cursor-pointer">
              <AvatarFallback className="font-semibold">
                {user.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="translate-x-11">
            <DropdownMenuGroup>
              {user.role == "admin" && (
                <DropdownMenuItem asChild>
                  <Link href={"/dashboard"}>
                    <Home />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href={"/course"}>
                  <BookMarked />
                  My Course
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
              className="cursor-pointer"
              variant="destructive"
            >
              {isLoading ? (
                <Spinner />
              ) : (
                <LogOutIcon className="text-destructive" />
              )}
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
