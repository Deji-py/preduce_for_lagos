"use client";

import type React from "react";

import { useState, useCallback } from "react";
import { IconUpload, IconCheck, IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CloudDownload, FileIcon } from "lucide-react";
import CategoryIcon from "./category-icon";
import { formTypes } from "@/type";
import { useUser } from "@/context/UserContext";
import Link from "next/link";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: "uploading" | "completed" | "error";
}

interface SectionCardsProps {
  onFileUpload?: (files: File[]) => void;
  type: formTypes;
}

// Map form types to human-readable titles and Unsplash image URLs
const formConfig: Record<
  SectionCardsProps["type"],
  { title: string; imageUrl: string }
> = {
  farmer: {
    title: "Farmers",
    imageUrl:
      "https://images.unsplash.com/photo-1661328993179-777ad80cd245?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  government_agencies: {
    title: "Government Agencies",
    imageUrl:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  aggregator: {
    title: "Aggregators",
    imageUrl:
      "https://images.unsplash.com/photo-1651400846434-ccd0e95b56b9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  input_supplier: {
    title: "Input Suppliers",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  investors: {
    title: "Investors",
    imageUrl:
      "https://images.unsplash.com/photo-1554224155-8d04cb21a1c7?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  retailers: {
    title: "Retailers",
    imageUrl:
      "https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  ngo_and_development_partners: {
    title: "NGOs & Development Partners",
    imageUrl:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  transport_company: {
    title: "Transport Companies",
    imageUrl:
      "https://images.unsplash.com/photo-1517502166878-35c3664f9b13?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  bulk_trader: {
    title: "Bulk Traders",
    imageUrl:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3a8dd22?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
};

export default function ActionCards({ onFileUpload, type }: SectionCardsProps) {
  const { profile } = useUser();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      handleFiles(files);
    },
    []
  );

  const handleFiles = (files: File[]) => {
    if (onFileUpload) {
      onFileUpload(files);
    }

    const newFiles: UploadedFile[] = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      status: "uploading",
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload completion
    newFiles.forEach((file) => {
      setTimeout(() => {
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? { ...f, status: Math.random() > 0.1 ? "completed" : "error" }
              : f
          )
        );
      }, 1000 + Math.random() * 2000);
    });
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const { title } = formConfig[type];

  return (
    <div className="grid grid-cols-1 w-full max-w-7xl gap-6 lg:grid-cols-12">
      <Card className="bg-[hsl(86,53%,80%)] pt-0 relative col-span-4 text-primary border-0 shadow-lg rounded-xl overflow-hidden">
        <CardContent className="p-6 pt-0 relative z-10 pb-0">
          <div className="flex items-center mt-3 justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-primary mb-1">
                {title}
              </h2>
              <p className="text-primary text-sm">
                Please Complete form details
              </p>
            </div>
            <div className=" h-20 w-20 scale-70 flex flex-col justify-center items-center rounded-lg bg-white/10  text-white">
              <CategoryIcon type={type as any} />
            </div>
          </div>

          <div className="mt-8">
            <Link href={"/dashboard/my-form"}>
              <Button
                disabled={profile?.form_submitted}
                className="w-full bg-white text-primary hover:bg-green-50 font-medium py-2.5 rounded-lg shadow-sm"
              >
                {profile?.form_submitted
                  ? "Form Already Sumitted"
                  : "Complete Form Online"}
                <FileIcon />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card  col-span-3 !py-0 text-white border-0 shadow-lg rounded-xl overflow-hidden">
        <CardContent className="p-6 pb-0">
          <div className="flex flex-wrap items-start gap-5 justify-between">
            <div>
              <h2 className="text-lg font-semibold text-black mb-1">
                Fill Form Offline?
              </h2>
              <p className="text-gray-500 text-xs md:text-xs lg:text-sm mt-2">
                download the form below, fill it and upload it scanned
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button disabled={profile?.form_submitted} className="w-full">
            Download Form <CloudDownload />
          </Button>
        </CardFooter>
      </Card>

      <div
        className={cn(
          "relative border-2 col-span-5 h-full flex justify-center items-center border-dashed rounded-lg p-8 text-center transition-colors",
          isDragOver
            ? "border-green-400 bg-green-50"
            : "border-gray-300 hover:border-gray-400",
          profile?.form_submitted && "opacity-40"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 ? (
          <div className=" flex flex-wrap gap-5 items-center">
            <div>
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-card rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        file.status === "completed" && "bg-green-100",
                        file.status === "uploading" && "bg-blue-100",
                        file.status === "error" && "bg-red-100"
                      )}
                    >
                      {file.status === "completed" && (
                        <IconCheck className="w-4 h-4 text-green-600" />
                      )}
                      {file.status === "uploading" && (
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      )}
                      {file.status === "error" && (
                        <IconX className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 truncate max-w-48">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)} • {file.status}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    className="text-gray-400 hover:!bg-transparent hover:text-red-500"
                  >
                    <IconX className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button className=" bg-[#8ec645a1] hover:text-white text-primary">
              Submit Form
            </Button>
          </div>
        ) : (
          <>
            <input
              disabled={profile?.form_submitted}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <IconUpload className="w-6 h-6 text-gray-400" />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  {profile?.form_submitted
                    ? "Form Already Sumitted Online"
                    : "Upload the Scanned Form here"}
                </p>
                {!profile?.form_submitted && (
                  <p className="text-xs text-gray-500">
                    Supports: PDF, JPG, PNG, DOC, DOCX (Max 10MB each)
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
