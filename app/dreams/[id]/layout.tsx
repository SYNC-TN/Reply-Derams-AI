// app/dreams/layout.tsx

import Link from "next/link";
import Logo from "../Logo";

export default function DreamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0f1c] overflow-hidden">
      <nav className="bg-[#111827] border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8">
                <img
                  src="/logo.png"
                  alt="Replay Dreams Logo"
                  className="w-full h-full  rounded-full scale-150 mt-1"
                />
              </div>
              <Logo test="true" />
            </Link>

            <div className="flex items-center space-x-4">
              <Link
                href="/dreams/gallery"
                className="text-gray-300 hover:text-white transition"
              >
                Gallery
              </Link>
              <Link
                href="/dreams"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition"
              >
                Create Dream
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {children}
    </div>
  );
}
