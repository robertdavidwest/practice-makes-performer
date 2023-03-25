import { ReactNode } from "react";

export default function SongCard({ demo }: { demo: ReactNode }) {
  return (
    <div
      className={`relative col-span-1 h-96 rounded-xl border border-gray-200 bg-white 
      shadow-md`}
    >
      <div className="flex items-center justify-center">{demo}</div>
    </div>
  );
}
