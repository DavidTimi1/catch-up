"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, Loader2, X } from "lucide-react";
import { useModal } from "@/components/providers/modal-provider";

interface ExtendLessonModalProps {
  lessonId: string;
  onSuccess: () => void;
}

export function ExtendLessonModal({ lessonId, onSuccess }: ExtendLessonModalProps) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { hideModal } = useModal();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeImage = (idxToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const handleExtend = async () => {
    if (images.length === 0) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/lessons/${lessonId}/extend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images }),
      });
      const data = await res.json();

      if (data.success) {
        onSuccess();
        hideModal();
      } else {
        alert("Failed to extend lesson: " + (data.error || "Unknown error"));
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while extending the lesson.");
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-stone-900 rounded-xl shadow-xl max-w-lg w-full mx-auto relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-4 right-4 text-stone-500" 
        onClick={hideModal}
      >
        <X size={20} />
      </Button>

      <h2 className="text-2xl font-heading font-bold text-stone-800 dark:text-stone-100 mb-2">Extend Lesson</h2>
      <p className="text-stone-500 dark:text-stone-400 mb-6 text-sm">Upload more notes. AI will pick up where it left off.</p>

      <div className="border-2 border-dashed border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-950/50 rounded-xl p-8 text-center hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer relative overflow-hidden group">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        />
        <div className="relative z-10 pointer-events-none">
          <UploadCloud className="mx-auto text-stone-400 mb-3 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors" size={32} />
          <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
            Click or drag pictures here
          </p>
        </div>
      </div>

      {images.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3 max-h-[200px] overflow-y-auto p-2 border border-stone-200 dark:border-stone-800 rounded-lg">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative h-20 w-20 rounded-lg border border-stone-200 dark:border-stone-700 shadow-sm group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="preview" className="h-full w-full object-cover rounded-lg" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(idx);
                }}
                className="absolute -top-2 -right-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-600 text-stone-500 dark:text-stone-300 rounded-full p-1 shadow-sm hover:bg-red-50 hover:text-red-600 transition-colors z-30"
                title="Remove image"
              >
                <X size={14} strokeWidth={3} />
              </button>
            </div>
          ))}
        </div>
      )}

      <Button
        className="w-full bg-stone-800 hover:bg-stone-900 dark:bg-stone-200 dark:hover:bg-stone-300 dark:text-stone-900 text-white h-12 text-lg font-bold rounded-xl shadow-md mt-6 transition-all"
        onClick={handleExtend}
        disabled={loading || images.length === 0}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Analyzing Notes...
          </>
        ) : (
          "Add to Lesson"
        )}
      </Button>
    </div>
  );
}
