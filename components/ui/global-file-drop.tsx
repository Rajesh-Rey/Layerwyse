"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type GlobalFileDropContextType = {
  registerFileHandler: (handler: (files: FileList) => void) => () => void;
};

const GlobalFileDropContext = React.createContext<GlobalFileDropContextType | null>(null);

export function GlobalFileDropProvider({ children }: { children: React.ReactNode }) {
  const fileHandlersRef = React.useRef<Set<(files: FileList) => void>>(new Set());
  const [isDragging, setIsDragging] = React.useState(false);
  const dragCounterRef = React.useRef(0);

  const registerFileHandler = React.useCallback(
    (handler: (files: FileList) => void) => {
      fileHandlersRef.current.add(handler);
      return () => {
        fileHandlersRef.current.delete(handler);
      };
    },
    [],
  );

  React.useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounterRef.current += 1;
      if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
        const hasFiles = Array.from(e.dataTransfer.items).some(
          (item) => item.kind === "file",
        );
        if (hasFiles) {
          setIsDragging(true);
        }
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounterRef.current -= 1;
      if (dragCounterRef.current === 0) {
        setIsDragging(false);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounterRef.current = 0;

      if (!e.dataTransfer) return;
      
      const files = e.dataTransfer.files;
      if (files && files.length > 0 && fileHandlersRef.current.size > 0) {
        const handler = Array.from(fileHandlersRef.current)[0];
        handler(files);
      }
    };

    document.addEventListener("dragenter", handleDragEnter);
    document.addEventListener("dragleave", handleDragLeave);
    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("drop", handleDrop);

    return () => {
      document.removeEventListener("dragenter", handleDragEnter);
      document.removeEventListener("dragleave", handleDragLeave);
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("drop", handleDrop);
    };
  }, []);

  return (
    <GlobalFileDropContext.Provider value={{ registerFileHandler }}>
      {children}
      {isDragging && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-accent bg-accent/10 p-12">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <svg
                className="h-10 w-10 animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <p className="text-xl font-semibold text-accent">Drop files anywhere to upload</p>
            <p className="text-muted-foreground text-sm">Release to add files to your project</p>
          </div>
        </div>
      )}
    </GlobalFileDropContext.Provider>
  );
}

export function useGlobalFileDrop() {
  const context = React.useContext(GlobalFileDropContext);
  if (!context) {
    throw new Error("useGlobalFileDrop must be used within GlobalFileDropProvider");
  }
  return context;
}

export function useGlobalFileDropOptional() {
  return React.useContext(GlobalFileDropContext);
}


