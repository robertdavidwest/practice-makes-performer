import { styled } from "@mui/material/styles";

export const Widget = styled("div")(({ theme }) => ({
  height: 350,
  padding: 16,
  borderRadius: 16,
  backgroundColor:
    theme.palette.mode === "dark" ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.4)",
  backdropFilter: "blur(40px)",
}));

export const HeaderWidget = styled("div")(({ theme }) => ({
  padding: 16,
  borderRadius: 16,
  backgroundColor:
    theme.palette.mode === "dark" ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.4)",
  backdropFilter: "blur(40px)",
}));
