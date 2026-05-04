"use client";

import React from "react";
import { FiCamera, FiImage, FiUpload, FiX } from "react-icons/fi";
import { apiUpload } from "@/lib/api";
import type { WardrobeItem } from "@/lib/wardrobe";

export function UploadModal({
  open,
  onClose,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: (item?: WardrobeItem) => Promise<void> | void;
}) {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<string>("auto");
  const fileRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!open) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setProcessing(false);
      setError(null);
      setSelectedCategory("auto");
    }
  }, [open]);

  if (!open) return null;

  async function handlePreview(event?: React.MouseEvent<HTMLButtonElement>) {
    event?.preventDefault();
    event?.stopPropagation();

    if (!selectedFile || !previewUrl) return;

    setProcessing(true);
    setError(null);

    try {
      const uploadResult = await apiUpload(selectedFile, selectedFile.name, selectedCategory);
      await onSaved(uploadResult.item as WardrobeItem);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setProcessing(false);
    }



  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm md:items-center">
      <div className="w-full max-w-lg rounded-t-[2rem] bg-white p-6 shadow-2xl md:rounded-[2rem]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
              Add to closet
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-foreground">Upload an item</h2>
          </div>
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onClose();
            }}
            className="rounded-full border border-border p-2 text-[color:var(--muted)] transition hover:text-foreground"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            event.preventDefault();
            event.stopPropagation();
            const file = event.target.files?.[0] || null;
            setSelectedFile(file);
            setPreviewUrl(file ? URL.createObjectURL(file) : null);
            setError(null);
          }}
        />

        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!previewUrl ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                fileRef.current?.click();
              }}
              className="flex w-full items-center gap-3 rounded-3xl border border-dashed border-border bg-[color:var(--background)] px-5 py-5 text-left transition hover:border-primary/40"
            >
              <FiImage className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Choose from gallery</span>
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                fileRef.current?.click();
              }}
              className="flex w-full items-center gap-3 rounded-3xl border border-dashed border-border bg-[color:var(--background)] px-5 py-5 text-left transition hover:border-primary/40"
            >
              <FiCamera className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Take a photo</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-[2rem] bg-[color:var(--background)]">
              <img
                src={previewUrl}
                alt="Preview"
                className="mx-auto max-h-[22rem] w-full object-contain"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="category" className="text-sm font-medium text-foreground">
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-2xl border border-border bg-[color:var(--background)] px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="auto">✨ Auto-detect</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="shoes">Shoes</option>
                <option value="outer">Outerwear</option>
                <option value="dress">Dress</option>
                <option value="accessory">Accessory</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                disabled={processing}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-white px-5 py-3 text-sm font-medium text-foreground transition hover:bg-gray-50 disabled:opacity-50"
              >
                Reupload
              </button>
              <button
                type="button"
                onClick={(event) => void handlePreview(event)}
                disabled={processing}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-[color:var(--primary-hover)] px-5 py-3 text-sm font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {processing ? <FiUpload className="h-4 w-4 animate-bounce" /> : <FiUpload className="h-4 w-4" />}
                {processing ? "Processing..." : "Proceed"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
