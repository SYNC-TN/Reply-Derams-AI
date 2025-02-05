// /app/dreams/gallery/ClientGallery.tsx
"use client";

import dynamic from "next/dynamic";

const BookShelfContainer = dynamic(() => import("./BookShelfContainer"), {
  ssr: false,
});

export default function ClientGallery() {
  return <BookShelfContainer />;
}
