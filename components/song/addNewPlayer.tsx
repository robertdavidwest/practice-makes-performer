import * as React from "react";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea, Container } from "@mui/material";
import { Box } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import PlayerLoading from "./playerLoading";

export default function AddNewPlayer({
  addNewPlayer,
  loadingNewPlayer,
}: {
  addNewPlayer: () => void;
  loadingNewPlayer: boolean;
}) {
  if (loadingNewPlayer) return <PlayerLoading />;
  return (
    <Container>
      <CardActionArea onClick={addNewPlayer}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Add New Player
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="center">
            <AddRoundedIcon
              sx={{
                fontSize: "150px",
                marginTop: "50px",
                marginBottom: "70px",
              }}
            />
          </Box>
        </CardContent>
      </CardActionArea>
    </Container>
  );
}
