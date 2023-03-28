import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  IconButton,
  Container,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";

interface Props {
  openConfirmSongModal: boolean;
  setOpenConfirmSongModal: React.Dispatch<React.SetStateAction<boolean>>;
  setUserValidatedLink: React.Dispatch<React.SetStateAction<boolean>>;
  setLinkTested: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ConfirmSongModal: React.FC<Props> = ({
  openConfirmSongModal,
  setOpenConfirmSongModal,
  setUserValidatedLink,
  setLinkTested,
}) => {
  const handleOpen = (e: Event) => {
    setOpenConfirmSongModal(true);
  };

  const handleClose = (e: Event) => {
    setOpenConfirmSongModal(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonName = event.currentTarget.name;
    if (buttonName === "yes") {
      setUserValidatedLink(true);
      setLinkTested(true);
    } else if (buttonName === "no") setUserValidatedLink(false);
    setOpenConfirmSongModal(false);
  };

  return (
    <Dialog open={openConfirmSongModal} onClose={handleClose}>
      <DialogTitle>Do you hear the song playing?</DialogTitle>
      <DialogActions>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box>
            <IconButton onClick={handleClick} name="yes">
              <CheckCircleOutlineIcon fontSize="large" color="success" />
            </IconButton>
          </Box>
          <Box>
            <IconButton onClick={handleClick} name="no">
              <CancelIcon fontSize="large" color="error" />
            </IconButton>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
