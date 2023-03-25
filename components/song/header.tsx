import * as React from "react";
import Typography from "@mui/material/Typography";
import { Container, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";

import { HeaderWidget } from "./widget";
import { Song } from "@prisma/client";
import Link from "next/link";
export default function SongHeader({ song }: { song: Song }) {
  const [songName, setSongName] = React.useState("");
  const [artist, setArtist] = React.useState("");

  React.useEffect(() => {
    if (song.name) setSongName(song.name);
    if (song.artist) setArtist(song.artist);
  }, [song]);

  const [disableSave, setDisableSave] = React.useState(true);
  const saveSong = () => {};
  const deleteSong = () => {};
  return (
    <Container sx={{ marginTop: "1rem" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5" color="text.secondary" fontWeight={500}>
          {"Song Settings"}
        </Typography>
        <div>
          <Tooltip title="Save your Settings">
            <IconButton
              disabled={disableSave}
              aria-label="save"
              size="large"
              onClick={() => {
                setDisableSave(true);
                saveSong();
              }}
            >
              {disableSave ? (
                <SaveIcon color="disabled" fontSize="inherit" />
              ) : (
                <SaveIcon color="primary" fontSize="inherit" />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Song">
            <IconButton
              aria-label="delete"
              size="large"
              onClick={() => deleteSong()}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
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
        <br />
        <br />
        <p>
          URL: <a href={song.audioUrl}>{song.audioUrl}</a>
        </p>
      </Container>
    </Container>
  );
}
