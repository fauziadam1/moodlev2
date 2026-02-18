import { Metadata } from "next";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Login Page",
};

export default function RegisterPage() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <LoginForm />
    </div>
  );
}
