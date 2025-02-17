"use client";

import { NextPage } from "next";
import React, { useRef, useState } from "react";
import Header from "@/components/ui/header/Header";
import { Button } from "@/components/ui/button";

const ImagesPage: NextPage = () => {
  const [file, setFile] = useState<File>();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onsubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);

    try {
      const data = new FormData();
      data.set("file", file);

      const res = await fetch("/api/images", {
        method: "POST",
        body: data,
      });

      setFile(undefined);
      if (fileInputRef.current) fileInputRef.current.value = "";

      if (!res.ok) throw new Error(await res.text());
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header caption="Image Upload" />
      <form onSubmit={onsubmit} className="w-[500px]">
        <div className="mt-4 flex flex-col gap-4 items-center">
          <label
            htmlFor="file-input"
            className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition"
          >
            Choose a file
          </label>
          <input
            ref={fileInputRef}
            id="file-input"
            type="file"
            name="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0])}
          />
          <div
            className={`w-full h-64 border-2 border-dashed ${
              file ? "border-blue-500" : "border-gray-300"
            } rounded-lg flex items-center justify-center`}
          >
            {file ? (
              <img
                src={URL.createObjectURL(file)}
                alt="Selected preview"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <span className="text-gray-500 text-sm">No image selected</span>
            )}
          </div>

          <Button type="submit" disabled={!file || loading}>
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default ImagesPage;
