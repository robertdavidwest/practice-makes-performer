import * as React from "react";
import Typography from "@mui/material/Typography";
import { Container, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import { useDeleteSongModal } from "./delete-song-modal";
import { Song } from "@prisma/client";

export default function SongHeader({
  song,
  deleteSong,
  saveSong,
}: {
  song: Song;
  deleteSong: (id: number) => void;
  saveSong: (id: number, name: string, artist: string) => void;
}) {
  const { DeleteSongModal, setShowDeleteSongModal } = useDeleteSongModal(
    song,
    deleteSong,
  );
  const [songName, setSongName] = React.useState("");
  const [artist, setArtist] = React.useState("");

  React.useEffect(() => {
    if (song.name) setSongName(song.name);
    if (song.artist) setArtist(song.artist);
  }, [song]);

  const [disableSave, setDisableSave] = React.useState(true);
  return (
    <Container sx={{ marginTop: "1rem" }}>
      <DeleteSongModal />
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5" color="text.secondary" fontWeight={500}>
          {"Song Settings"}
        </Typography>
        <div>
          <Tooltip title="Save song Settings">
            <span>
              <IconButton
                disabled={disableSave}
                aria-label="save"
                size="large"
                onClick={() => {
                  setDisableSave(true);
                  saveSong(song.id, songName, artist);
                }}
              >
                {disableSave ? (
                  <SaveIcon color="disabled" fontSize="inherit" />
                ) : (
                  <SaveIcon color="primary" fontSize="inherit" />
                )}
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Delete Song">
            <span>
              <IconButton
                aria-label="delete"
                size="large"
                onClick={() => setShowDeleteSongModal(true)}
              >
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </span>
          </Tooltip>
        </div>
      </Box>

      <Container sx={{ margin: "2rem" }}>
        <TextField
          size="small"
          label="Song Name"
          variant="outlined"
          value={songName}
          onChange={(e) => {
            setSongName(e.target.value);
            setDisableSave(false);
          }}
        />
        <TextField
          size="small"
          label="Artist"
          variant="outlined"
          value={artist}
          onChange={(e) => {
            setArtist(e.target.value);
            setDisableSave(false);
          }}
        />
      </Container>
    </Container>
  );
}
