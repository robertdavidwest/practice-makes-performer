import { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import Balancer from "react-wrap-balancer";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { IconButton } from "@mui/material";
import { Tooltip } from "@mui/material";
import { useUploadSongModal } from "./upload-song-modal";
import { Button } from "@mui/material";
import { handleAuthClick, handleSignoutClick } from "@/lib/googleDrive";

export default function PortalCard({
  title,
  description,
  demo,
  large,
}: {
  title: string;
  description: string;
  demo: ReactNode;
  large?: boolean;
}) {
  return (
    <div
      className={`relative col-span-1 h-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md ${
        large ? "md:col-span-2" : ""
      }`}
    >
      <div className="mx-auto max-w-md text-center">
        <br />
        <Tooltip title="Upload an mp3 file">
          <IconButton aria-label="upload-file" size="large" onClick={() => {}}>
            <CloudUploadIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>

        <h2 className="bg-gradient-to-br from-black to-stone-500 bg-clip-text font-display text-xl font-bold text-transparent md:text-3xl md:font-normal">
          <Balancer>{title}</Balancer>
        </h2>
        <div className="prose-sm -mt-2 leading-normal text-gray-500 md:prose">
          <Balancer>
            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                    className="font-medium text-gray-800 underline transition-colors"
                  />
                ),
                code: ({ node, ...props }) => (
                  <code
                    {...props}
                    // @ts-ignore (to fix "Received `true` for a non-boolean attribute `inline`." warning)
                    inline="true"
                    className="rounded-sm bg-gray-100 px-1 py-0.5 font-mono font-medium text-gray-800"
                  />
                ),
              }}
            >
              {description}
            </ReactMarkdown>
          </Balancer>
        </div>
      </div>
      <div>{demo}</div>
    </div>
  );
}
