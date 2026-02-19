"use client";

import Link from "next/link";
import { useAuthUser } from "@/lib/auth";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Button } from "./ui/button";
import { HeaderUser } from "./header-user";

export function Header() {
  const { user } = useAuthUser();

  return (
    <div className="border-b py-5">
      <div className="container px-10 mx-auto flex justify-between">
        <Link href={"/"}>
          <h1 className="font-bold text-2xl">Moodle</h1>
        </Link>
        <NavigationMenu className="list-none font-semibold space-x-5">
          <NavigationMenuItem>
            <NavigationMenuLink href="/">
              Home
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink>
              Course
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenu>
        {user ? (
          <HeaderUser user={user} />
        ) : (
          <div className="flex items-center gap-5">
            <Button className="rounded-xl">
              <Link href={"/login"}>Login</Link>
            </Button>
            <Button variant="outline" className="rounded-xl">
              <Link href={"/register"}>Register</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
