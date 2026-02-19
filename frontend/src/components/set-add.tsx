"use client";

import z from "zod";
import { useState } from "react";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "./ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Spinner } from "./ui/spinner";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";

export function SetAdd({
  courseId,
  onSuccess,
}: {
  courseId: string;
  onSuccess?: () => void;
}) {
  const [isLoading, SetLoading] = useState(false);

  const formSet = z.object({
    title: z.string().trim().min(1, "The title field is required"),
  });

  type FormSet = z.infer<typeof formSet>;

  const form = useForm<FormSet>({
    resolver: zodResolver(formSet),
    defaultValues: {
      title: "",
    },
  });

  const addSet = async (data: FormSet) => {
    SetLoading(true);
    try {
      await api.post("/api/set", {
        ...data,
        course_id: courseId,
      });

      toast.success("Set created");
      onSuccess?.();
      form.reset();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const message =
        err?.response?.data?.message ?? err.message ?? "Add set failed";
      toast.error(message);
    } finally {
      SetLoading(false);
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="rounded-xl">
            <PlusIcon />
            New Set
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new Set/Bab</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(addSet)}>
                <div className="space-y-5">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">
                    {isLoading ? <Spinner /> : ""}Add
                  </Button>
                </div>
              </form>
            </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
