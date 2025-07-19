import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { IconButton } from "@mui/material";
import { Container, Tooltip } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { CreateSong } from "../song/types";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { ConfirmSongModal } from "./confirmSongUrl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

async function createSong(payload: CreateSong) {
  const response = await fetch("/api/songs", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  const { status } = response;
  return { data, status };
}

interface FormState {
  songName: string;
  artist: string;
  audioUrl: string;
  duration: number;
}

interface UploadSongForModalInputs {
  appendToSongs: (song: CreateSong) => Promise<void>;
  userId: number;
}

const initialFormState: FormState = {
  songName: "",
  artist: "",
  audioUrl: "",
  duration: 0,
};

const GOOGLE_DRIVE_PREFIX = "https://drive.google.com/file/d/";

function convertGoogleDriveUrlToAudioUrl(url: string) {
  const id = url.split(GOOGLE_DRIVE_PREFIX)[1].split("/")[0];
  const audioUrl_f = (id: string) =>
    `https://drive.google.com/file/d/${id}/preview`;

  return audioUrl_f(id);
}

function validateAudioUrl(url: string, directMp3Link: boolean) {
  if (directMp3Link) return validateDirectMp3Url(url);
  else return validateGoogleDriveUrl(url);
}

function validateDirectMp3Url(url: string) {
  const condition1 = url.slice(url.length - 4, url.length) === ".mp3";
  const condition2 = url.slice(0, 8) === "https://";
  return condition1 && condition2;
}

function validateGoogleDriveUrl(url: string) {
  const condition1 = url.slice(0, 32) === GOOGLE_DRIVE_PREFIX;
  if (!condition1) return false;
  const condition2 = url.split(GOOGLE_DRIVE_PREFIX).length === 2;
  if (!condition2) return false;
  const condition3 = url.split(GOOGLE_DRIVE_PREFIX)[1].split("/").length === 2;
  if (!condition3) return false;
  const id = url.split(GOOGLE_DRIVE_PREFIX)[1].split("/")[0];
  const regex = new RegExp("[a-zA-Z0-9_-]");
  const condition4 = regex.test(id);
  if (!condition4) return false;
  return true;
}

export default function UploadSongFormModal({
  appendToSongs,
  userId,
}: UploadSongForModalInputs) {
  const audio = React.useRef(createAudioElement());
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const [formState, setFormState] = React.useState<FormState>(initialFormState);
  const [disabled, setDisabled] = React.useState(true);
  const [validLink, setValidLink] = React.useState(true);
  const [userValidatedLink, setUserValidatedLink] = React.useState(true);
  const [linktested, setLinkTested] = React.useState(false);
  const [directMp3Link, setDirectMp3Link] = React.useState(false);
  const [helperText, setHelperText] = React.useState("");

  const [open, setOpen] = React.useState(false);
  const [openConfirmSongModal, setOpenConfirmSongModal] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseSnackBar = (
    event: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackBar(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  };

  function createAudioElement() {
    const audio = document.createElement("audio");
    return audio;
  }

  const testAudioUrl = async () => {
    setOpenConfirmSongModal(true);
    try {
      const audioUrl = directMp3Link
        ? formState.audioUrl
        : convertGoogleDriveUrlToAudioUrl(formState.audioUrl);
      audio.current.src = audioUrl;
      audio.current.load();
      audio.current.onloadedmetadata = function () {
        const duration = Math.round(audio.current.duration);
        const name = "duration";
        setFormState({ ...formState, [name]: duration });
      };
      await audio.current.play();
    } catch (error) {
      let message: string;
      if (error instanceof Error) {
        message = error.message;
        console.log(message);
      }
    }
  };

  if (!openConfirmSongModal) {
    if (!audio.current.paused) {
      audio.current.pause();
    }
  }

  const handleSubmit = async () => {
    const audioUrl = directMp3Link
      ? formState.audioUrl
      : convertGoogleDriveUrlToAudioUrl(formState.audioUrl);

    const payload = {
      name: formState.songName,
      artist: formState.artist,
      duration: formState.duration,
      audioUrl: audioUrl,
      userId: userId,
    };
    const { data, status } = await createSong(payload);
    if (status === 201) {
      setSuccess(true);
      appendToSongs(data);
    } else {
      setSuccess(false);
    }
    setFormState(initialFormState);
    handleClose();
    setOpenSnackBar(true);
  };

  React.useEffect(() => {
    if (formState.audioUrl === "") {
      setValidLink(true);
    } else if (validateAudioUrl(formState.audioUrl, directMp3Link)) {
      setValidLink(true);
    } else {
      setValidLink(false);
    }
  }, [directMp3Link, formState, setValidLink]);

  React.useEffect(() => {
    if (
      formState.songName === "" ||
      formState.artist === "" ||
      formState.audioUrl === "" ||
      validateAudioUrl(formState.audioUrl, directMp3Link) === false ||
      linktested === false ||
      formState.duration === 0
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [directMp3Link, formState, linktested, setDisabled]);

  React.useEffect(() => {
    if (!userValidatedLink) {
      setHelperText("Try another link!");
      setUserValidatedLink(true);
    }
  }, [userValidatedLink]);

  React.useEffect(() => {
    if (validLink) setHelperText("");
    else {
      if (directMp3Link) {
        setHelperText("Link must be of the format: https://path/to/file.mp3");
      } else {
        setHelperText(
          "Link must be of the format: https://drive.google.com/file/d/FILE_ID/view?usp=share_link",
        );
      }
    }
  }, [validLink, directMp3Link]);

  return (
    <div>
      <ConfirmSongModal
        openConfirmSongModal={openConfirmSongModal}
        setOpenConfirmSongModal={setOpenConfirmSongModal}
        setUserValidatedLink={setUserValidatedLink}
        setLinkTested={setLinkTested}
      />
      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
      >
        {success ? (
          <Alert
            onClose={handleCloseSnackBar}
            severity="success"
            sx={{ width: "100%" }}
          >
            Song uploaded successfully!
          </Alert>
        ) : (
          <Alert severity="error">
            oh uh. Something went wrong. Try uploading again.
          </Alert>
        )}
      </Snackbar>
      <Tooltip title="Upload an mp3 file">
        <IconButton
          aria-label="upload-file"
          size="large"
          onClick={handleClickOpen}
        >
          <CloudUploadIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Upload Song</DialogTitle>
        <Container>
          <p>
            <strong>Practice Makes Performer</strong> will never store your
            audio files, you are in control of your own data.
          </p>
        </Container>
        <DialogContent>
          <DialogContentText>
            Follow these steps to upload your mp3 file to google drive and link
            it to your account:
          </DialogContentText>
          <List>
            <ListItem>
              <ListItemAvatar>{"1."}</ListItemAvatar>
              <ListItemText
                primary="Upload your mp3 file to Google Drive"
                secondary="(any location is fine, but I would recommend creating a folder for all your songs)"
              />
            </ListItem>
            <ListItem>
              <ListItemAvatar>{"2."}</ListItemAvatar>
              <ListItemText
                primary={"Right click on the file and hit 'Get Link'"}
                secondary=""
              />
            </ListItem>
            <ListItem>
              <ListItemAvatar>{"3."}</ListItemAvatar>
              <ListItemText
                primary="Select 'Anyone with the link: Viewer'"
                secondary="(your link will be kept secure. No one else will have access to it but you)"
              />
            </ListItem>
            <ListItem>
              <ListItemAvatar>{"4."}</ListItemAvatar>
              <ListItemText
                primary="Enter the details below:"
                secondary="then hit 'TEST LINK' to make sure the link works"
              />
            </ListItem>
          </List>

          <TextField
            InputLabelProps={{ shrink: true }}
            required
            autoFocus
            value={formState.songName}
            onChange={handleChange}
            id="name"
            name="songName"
            label="Song Name"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            InputLabelProps={{ shrink: true }}
            required
            autoFocus
            value={formState.artist}
            onChange={handleChange}
            margin="dense"
            id="arist"
            name="artist"
            label="Artist Name"
            type="text"
            fullWidth
            variant="standard"
          />

          <TextField
            InputLabelProps={{ shrink: true }}
            required
            autoFocus
            value={formState.audioUrl}
            onChange={handleChange}
            margin="dense"
            id="link"
            name="audioUrl"
            label={directMp3Link ? "Link to mp3 file" : "Google Drive link"}
            type="text"
            fullWidth
            variant="standard"
            error={!validLink}
            helperText={helperText}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              onClick={() => testAudioUrl()}
              color={"primary"}
              variant={"outlined"}
              disabled={!validateAudioUrl(formState.audioUrl, directMp3Link)}
            >
              Test Link
            </Button>
            <FormControlLabel
              control={
                <Checkbox onChange={() => setDirectMp3Link(!directMp3Link)} />
              }
              label="Use a different source *"
            />
          </Box>
          <List>
            <ListItem>
              <ListItemAvatar>{"5."}</ListItemAvatar>
              <ListItemText
                primary="If the link works hit 'SUBMIT' to link your song"
                secondary="If it doesn't, try again."
              />
            </ListItem>
          </List>
          <p>
            <em>* You may also use a direct mp3 link from any platform</em>
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => handleSubmit()} disabled={disabled}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
