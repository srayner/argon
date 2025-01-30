"use client";

import React, { useRef, useState } from "react";
import Header from "../../../ui/header/header";
import Button from "@/app/ui/button/button";

const ImagesPage = () => {
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
      <Header>
        <div>Images</div>
      </Header>
      <form onSubmit={onsubmit} className="w-[500px]">
        <label htmlFor="file-input">Upload file:</label>
        <input
          ref={fileInputRef}
          id="file-input"
          type="file"
          name="file"
          onChange={(e) => setFile(e.target.files?.[0])}
        />
        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="Selected preview"
            className="mt-2 max-w-full h-auto"
          />
        )}

        <Button type="submit">{loading ? "Uploading..." : "Upload"}</Button>
      </form>
    </>
  );
};

export default ImagesPage;
