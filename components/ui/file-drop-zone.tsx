"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Upload,
  X,
  FileBox,
  Image as ImageIcon,
  File,
  Cuboid,
} from "lucide-react";

// File type definitions
const IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".svg",
  ".bmp",
];
const MODEL_3D_EXTENSIONS = [
  ".stl",
  ".obj",
  ".3mf",
  ".step",
  ".stp",
  ".iges",
  ".igs",
  ".fbx",
  ".gltf",
  ".glb",
];

type UploadedFile = {
  id: string;
  file: File;
  type: "image" | "model" | "other";
  previewUrl?: string;
};

type FileData = {
  id: string;
  name: string;
  size: number;
  type: "image" | "model" | "other";
  previewUrl?: string;
};

type FileDropZoneProps = {
  className?: string;
  value?: FileData[];
  onChange?: (files: FileData[], rawFiles: Map<string, File>) => void;
  maxFiles?: number;
  disabled?: boolean;
};

// Store file objects outside of React state to persist across renders
const fileStore = new Map<string, File>();

function getFileType(filename: string): "image" | "model" | "other" {
  const ext = filename.toLowerCase().slice(filename.lastIndexOf("."));
  if (IMAGE_EXTENSIONS.includes(ext)) return "image";
  if (MODEL_3D_EXTENSIONS.includes(ext)) return "model";
  return "other";
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function FileDropZone({
  className,
  value = [],
  onChange,
  maxFiles = 20,
  disabled = false,
}: FileDropZoneProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragCounter, setDragCounter] = React.useState(0);
  const [internalFiles, setInternalFiles] = React.useState<UploadedFile[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const initializedRef = React.useRef(false);

  // Sync internal state with external value on mount
  React.useEffect(() => {
    if (!initializedRef.current && value.length > 0) {
      const reconstructedFiles: UploadedFile[] = value.map((f) => ({
        id: f.id,
        file: fileStore.get(f.id) || new globalThis.File([""], f.name),
        type: f.type,
        previewUrl: f.previewUrl,
      }));
      setInternalFiles(reconstructedFiles);
      initializedRef.current = true;
    }
  }, [value]);

  const handleDragEnter = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      setDragCounter((prev) => prev + 1);
      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        setIsDragging(true);
      }
    },
    [disabled],
  );

  const handleDragLeave = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      setDragCounter((prev) => {
        const newCount = prev - 1;
        if (newCount === 0) {
          setIsDragging(false);
        }
        return newCount;
      });
    },
    [disabled],
  );

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const processFiles = React.useCallback(
    (fileList: FileList | File[]) => {
      const newUploadedFiles: UploadedFile[] = [];
      const filesToProcess = Array.from(fileList);
      const remainingSlots = maxFiles - internalFiles.length;

      filesToProcess.slice(0, remainingSlots).forEach((file) => {
        const type = getFileType(file.name);
        const id = generateId();
        const previewUrl =
          type === "image" ? URL.createObjectURL(file) : undefined;

        // Store file in the file store
        fileStore.set(id, file);

        const uploadedFile: UploadedFile = {
          id,
          file,
          type,
          previewUrl,
        };
        newUploadedFiles.push(uploadedFile);
      });

      if (newUploadedFiles.length > 0) {
        const updatedFiles = [...internalFiles, ...newUploadedFiles];
        setInternalFiles(updatedFiles);

        // Notify parent with serializable data
        if (onChange) {
          const fileData: FileData[] = updatedFiles.map((f) => ({
            id: f.id,
            name: f.file.name,
            size: f.file.size,
            type: f.type,
            previewUrl: f.previewUrl,
          }));
          onChange(fileData, fileStore);
        }
      }
    },
    [internalFiles, maxFiles, onChange],
  );

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      setDragCounter(0);

      if (disabled) return;

      const { files: droppedFiles } = e.dataTransfer;
      if (droppedFiles && droppedFiles.length > 0) {
        processFiles(droppedFiles);
      }
    },
    [disabled, processFiles],
  );

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { files: selectedFiles } = e.target;
      if (selectedFiles && selectedFiles.length > 0) {
        processFiles(selectedFiles);
      }
      // Reset input value to allow selecting the same file again
      e.target.value = "";
    },
    [processFiles],
  );

  const handleRemoveFile = React.useCallback(
    (id: string) => {
      const fileToRemove = internalFiles.find((f) => f.id === id);
      if (fileToRemove?.previewUrl) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }

      // Remove from file store
      fileStore.delete(id);

      const updatedFiles = internalFiles.filter((f) => f.id !== id);
      setInternalFiles(updatedFiles);

      // Notify parent
      if (onChange) {
        const fileData: FileData[] = updatedFiles.map((f) => ({
          id: f.id,
          name: f.file.name,
          size: f.file.size,
          type: f.type,
          previewUrl: f.previewUrl,
        }));
        onChange(fileData, fileStore);
      }
    },
    [internalFiles, onChange],
  );

  const handleBrowseClick = React.useCallback(() => {
    inputRef.current?.click();
  }, []);

  // Cleanup preview URLs on unmount
  React.useEffect(() => {
    return () => {
      internalFiles.forEach((f) => {
        if (f.previewUrl) {
          URL.revokeObjectURL(f.previewUrl);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const imageFiles = internalFiles.filter((f) => f.type === "image");
  const modelFiles = internalFiles.filter((f) => f.type === "model");
  const otherFiles = internalFiles.filter((f) => f.type === "other");

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
        className={cn(
          "relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all duration-200",
          isDragging
            ? "border-accent bg-accent/10 scale-[1.02]"
            : "border-muted-foreground/25 hover:border-accent/50 hover:bg-muted/50",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={handleInputChange}
          className="hidden"
          accept={[...IMAGE_EXTENSIONS, ...MODEL_3D_EXTENSIONS].join(",")}
          disabled={disabled}
        />

        <div
          className={cn(
            "flex flex-col items-center gap-4 text-center transition-transform duration-200",
            isDragging && "scale-110",
          )}
        >
          <div
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-full transition-colors duration-200",
              isDragging ? "bg-accent text-accent-foreground" : "bg-muted",
            )}
          >
            <Upload className={cn("h-8 w-8", isDragging && "animate-bounce")} />
          </div>

          <div className="space-y-2">
            <p className="text-lg font-medium">
              {isDragging ? (
                <span className="text-accent">Drop your files here!</span>
              ) : (
                "Drag & drop your files here"
              )}
            </p>
            <p className="text-muted-foreground text-sm">
              or{" "}
              <span className="text-accent font-medium underline underline-offset-2">
                browse from your computer
              </span>
            </p>
          </div>

          <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <Cuboid className="h-4 w-4" />
              <span>3D Models (STL, OBJ, GLTF, etc.)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ImageIcon className="h-4 w-4" />
              <span>Images (JPG, PNG, WebP, etc.)</span>
            </div>
          </div>
        </div>

        {/* Animated border effect when dragging */}
        {isDragging && (
          <div className="border-accent pointer-events-none absolute inset-0 rounded-xl border-2 opacity-50" />
        )}
      </div>

      {/* 3D Models Section */}
      {modelFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileBox className="text-accent h-5 w-5" />
            <h3 className="font-medium">
              3D Models{" "}
              <span className="text-muted-foreground text-sm font-normal">
                ({modelFiles.length})
              </span>
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {modelFiles.map((file) => (
              <ModelFileCard
                key={file.id}
                file={file}
                onRemove={() => handleRemoveFile(file.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Images Section */}
      {imageFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ImageIcon className="text-accent h-5 w-5" />
            <h3 className="font-medium">
              Reference Images{" "}
              <span className="text-muted-foreground text-sm font-normal">
                ({imageFiles.length})
              </span>
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {imageFiles.map((file) => (
              <ImageFileCard
                key={file.id}
                file={file}
                onRemove={() => handleRemoveFile(file.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Other Files Section */}
      {otherFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <File className="text-muted-foreground h-5 w-5" />
            <h3 className="font-medium">
              Other Files{" "}
              <span className="text-muted-foreground text-sm font-normal">
                ({otherFiles.length})
              </span>
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {otherFiles.map((file) => (
              <OtherFileCard
                key={file.id}
                file={file}
                onRemove={() => handleRemoveFile(file.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type FileCardProps = {
  file: UploadedFile;
  onRemove: () => void;
};

function ModelFileCard({ file, onRemove }: FileCardProps) {
  const extension = file.file.name
    .slice(file.file.name.lastIndexOf(".") + 1)
    .toUpperCase();

  return (
    <div className="group bg-muted/50 hover:border-accent/50 relative flex flex-col overflow-hidden rounded-lg border transition-all">
      <div className="from-accent/20 to-accent/5 flex aspect-square items-center justify-center bg-gradient-to-br p-4">
        <div className="relative">
          <Cuboid className="text-accent h-12 w-12" />
          <span className="bg-accent text-accent-foreground absolute -right-2 -bottom-1 rounded px-1.5 py-0.5 text-[10px] font-bold">
            {extension}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between p-2">
        <p className="truncate text-xs font-medium" title={file.file.name}>
          {file.file.name}
        </p>
        <p className="text-muted-foreground text-[10px]">
          {formatFileSize(file.file.size)}
        </p>
      </div>
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="absolute top-1 right-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}

function ImageFileCard({ file, onRemove }: FileCardProps) {
  return (
    <div className="group hover:border-accent/50 relative aspect-square overflow-hidden rounded-lg border transition-all">
      {file.previewUrl ? (
        <img
          src={file.previewUrl}
          alt={file.file.name}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
      ) : (
        <div className="bg-muted flex h-full w-full items-center justify-center">
          <ImageIcon className="text-muted-foreground h-8 w-8" />
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 pt-8">
        <p
          className="truncate text-xs font-medium text-white"
          title={file.file.name}
        >
          {file.file.name}
        </p>
        <p className="text-[10px] text-white/70">
          {formatFileSize(file.file.size)}
        </p>
      </div>
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="absolute top-1 right-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}

function OtherFileCard({ file, onRemove }: FileCardProps) {
  const extension = file.file.name
    .slice(file.file.name.lastIndexOf(".") + 1)
    .toUpperCase();

  return (
    <div className="group bg-muted/50 hover:border-accent/50 relative flex flex-col overflow-hidden rounded-lg border transition-all">
      <div className="flex aspect-square items-center justify-center p-4">
        <div className="relative">
          <File className="text-muted-foreground h-12 w-12" />
          <span className="bg-muted-foreground text-muted absolute -right-2 -bottom-1 rounded px-1.5 py-0.5 text-[10px] font-bold">
            {extension}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between p-2">
        <p className="truncate text-xs font-medium" title={file.file.name}>
          {file.file.name}
        </p>
        <p className="text-muted-foreground text-[10px]">
          {formatFileSize(file.file.size)}
        </p>
      </div>
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="absolute top-1 right-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}

export { FileDropZone };
export type { FileData, UploadedFile };
