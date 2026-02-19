import { PropsWithChildren } from "react";
import { Header } from "@/components/header";

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
