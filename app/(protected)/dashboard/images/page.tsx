"use client";

import React, { use, useState } from "react";
import Header from "../../../ui/header/header";

const ImagesPage = () => {
  const [file, setFile] = useState<File>();

  const onsubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    try {
      const data = new FormData();
      data.set("file", file);

      const res = await fetch("/api/images", {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error(await res.text());
    } catch (e: any) {
      console.error(e);
    }
  };

  return (
    <>
      <Header>
        <div>Images</div>
      </Header>
      <form onSubmit={onsubmit}>
        <input
          type="file"
          name="file"
          onChange={(e) => setFile(e.target.files?.[0])}
        />
        <input
          type="submit"
          value="Upload"
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        />
      </form>
    </>
  );
};

export default ImagesPage;
