import { ReactNode } from "react";

export default function SongCard({
  demo,
  large,
}: {
  demo: ReactNode;
  large?: boolean;
}) {
  return (
    <div
      className={`relative col-span-1 h-96 rounded-xl border border-gray-200 bg-white 
      shadow-md ${large ? "md:col-span-2 md:h-60" : ""}`}
    >
      <div className="flex items-center justify-center">{demo}</div>
    </div>
  );
}
