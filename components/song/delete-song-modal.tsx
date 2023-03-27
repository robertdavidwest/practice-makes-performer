import Modal from "@/components/shared/modal";
import {
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
} from "react";
import Image from "next/image";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Song } from "@prisma/client";

const DeleteSongModal = ({
  showDeleteSongModal,
  setShowDeleteSongModal,
  song,
  deleteSong,
}: {
  showDeleteSongModal: boolean;
  setShowDeleteSongModal: Dispatch<SetStateAction<boolean>>;
  song: Song;
  deleteSong: (id: number) => void;
}) => {
  return (
    <Modal
      showModal={showDeleteSongModal}
      setShowModal={setShowDeleteSongModal}
    >
      <div className="w-full overflow-hidden md:max-w-md md:rounded-2xl md:border md:border-gray-100 md:shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 bg-white px-4 py-6 pt-8 text-center md:px-16">
          <h3 className="font-display text-2xl font-bold">{song.name}</h3>
          <h3 className="font-display font-bold">{song.artist}</h3>
          <p className="text-sm text-gray-500">
            Are you sure you want to delete this song?
          </p>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                deleteSong(song.id);
                setShowDeleteSongModal(false);
              }}
            >
              Delete
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setShowDeleteSongModal(false)}
            >
              Take Me Back
            </Button>
          </Stack>
        </div>
      </div>
    </Modal>
  );
};

export function useDeleteSongModal(
  song: Song,
  deleteSong: (id: number) => void,
) {
  const [showDeleteSongModal, setShowDeleteSongModal] = useState(false);

  const DemoModalCallback = useCallback(() => {
    return (
      <DeleteSongModal
        showDeleteSongModal={showDeleteSongModal}
        setShowDeleteSongModal={setShowDeleteSongModal}
        song={song}
        deleteSong={deleteSong}
      />
    );
  }, [showDeleteSongModal, setShowDeleteSongModal, song, deleteSong]);

  return useMemo(
    () => ({ setShowDeleteSongModal, DeleteSongModal: DemoModalCallback }),
    [setShowDeleteSongModal, DemoModalCallback],
  );
}
