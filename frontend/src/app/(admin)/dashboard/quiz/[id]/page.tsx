"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, PlusCircle, CheckCircle2, Circle } from "lucide-react";

type Option = {
  id: string;
  option: string;
  is_correct: boolean;
};

type Question = {
  id: string;
  question: string;
  sort_order: number;
  options: Option[];
};

type Quiz = {
  id: string;
  title: string;
  description?: string;
  passing_score: number;
  questions: Question[];
};

export default function AdminQuizPage() {
  const params = useParams<{ id: string }>();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [isAddingQuestion, setAddingQuestion] = useState(false);
  const [newOption, setNewOption] = useState<Record<string, string>>({});
  const [isCorrect, setIsCorrect] = useState<Record<string, boolean>>({});
  const [isAddingOption, setAddingOption] = useState<Record<string, boolean>>(
    {},
  );

  const fetchQuiz = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/quiz/${params.id}`);
      setQuiz(res.data.data);
    } catch {
      toast.error("Gagal memuat quiz");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) fetchQuiz();
  }, [params.id]);

  const handleAddQuestion = async () => {
    if (!newQuestion.trim()) return;

    setAddingQuestion(true);
    try {
      await api.post("/api/question", {
        quiz_id: params.id,
        question: newQuestion,
      });
      setNewQuestion("");
      toast.success("Soal ditambahkan");
      fetchQuiz();
    } catch {
      toast.error("Gagal menambahkan soal");
    } finally {
      setAddingQuestion(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      await api.delete(`/api/question/${questionId}`);
      toast.success("Soal dihapus");
      fetchQuiz();
    } catch {
      toast.error("Gagal menghapus soal");
    }
  };

  const handleAddOption = async (questionId: string) => {
    const text = newOption[questionId];
    if (!text?.trim()) return;

    setAddingOption((prev) => ({ ...prev, [questionId]: true }));
    try {
      await api.post("/api/option", {
        question_id: questionId,
        option: text,
        is_correct: isCorrect[questionId] ?? false,
      });
      setNewOption((prev) => ({ ...prev, [questionId]: "" }));
      setIsCorrect((prev) => ({ ...prev, [questionId]: false }));
      toast.success("Pilihan ditambahkan");
      fetchQuiz();
    } catch {
      toast.error("Gagal menambahkan pilihan");
    } finally {
      setAddingOption((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  const handleDeleteOption = async (optionId: string) => {
    try {
      await api.delete(`/api/option/${optionId}`);
      toast.success("Pilihan dihapus");
      fetchQuiz();
    } catch {
      toast.error("Gagal menghapus pilihan");
    }
  };

  if (isLoading && !quiz) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!quiz) return null;

  return (
    <div className="container max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{quiz.title}</h1>
        {quiz.description && (
          <p className="text-gray-500 mt-1">{quiz.description}</p>
        )}
        <span className="text-sm text-gray-400">
          Nilai lulus: {quiz.passing_score}%
        </span>
      </div>
      <div className="space-y-6">
        {quiz.questions.map((q, idx) => (
          <div key={q.id} className="border rounded-xl p-5 bg-white space-y-4">
            <div className="flex justify-between items-start gap-3">
              <p className="font-semibold">
                {idx + 1}. {q.question}
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="shrink-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Soal?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Semua pilihan jawaban pada soal ini akan ikut terhapus.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteQuestion(q.id)}
                    >
                      Hapus
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div className="space-y-2 pl-2">
              {q.options.length === 0 && (
                <p className="text-sm text-gray-400">
                  Belum ada pilihan jawaban.
                </p>
              )}
              {q.options.map((opt) => (
                <div
                  key={opt.id}
                  className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-sm ${
                    opt.is_correct
                      ? "bg-green-50 border-green-400"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {opt.is_correct ? (
                      <CheckCircle2 className="size-4 text-green-500 shrink-0" />
                    ) : (
                      <Circle className="size-4 text-gray-300 shrink-0" />
                    )}
                    <span>{opt.option}</span>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-7 text-destructive hover:text-destructive"
                    onClick={() => handleDeleteOption(opt.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="pl-2 space-y-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Tambah Pilihan
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="Teks pilihan jawaban..."
                  value={newOption[q.id] ?? ""}
                  onChange={(e) =>
                    setNewOption((prev) => ({
                      ...prev,
                      [q.id]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleAddOption(q.id)}
                />
                <Button
                  variant="outline"
                  onClick={() =>
                    setIsCorrect((prev) => ({
                      ...prev,
                      [q.id]: !prev[q.id],
                    }))
                  }
                  className={`shrink-0 gap-1.5 ${
                    isCorrect[q.id]
                      ? "border-green-500 text-green-600 bg-green-50"
                      : ""
                  }`}
                >
                  {isCorrect[q.id] ? (
                    <CheckCircle2 className="size-4" />
                  ) : (
                    <Circle className="size-4" />
                  )}
                  Benar
                </Button>
                <Button
                  onClick={() => handleAddOption(q.id)}
                  disabled={isAddingOption[q.id]}
                >
                  {isAddingOption[q.id] ? <Spinner /> : "Tambah"}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 border rounded-xl p-5 bg-gray-50">
        <p className="font-semibold mb-3 flex items-center gap-2">
          <PlusCircle className="size-5" />
          Tambah Soal Baru
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="Tulis pertanyaan..."
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddQuestion()}
          />
          <Button onClick={handleAddQuestion} disabled={isAddingQuestion}>
            {isAddingQuestion ? <Spinner /> : "Tambah Soal"}
          </Button>
        </div>
      </div>
    </div>
  );
}
