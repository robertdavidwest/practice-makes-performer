import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import LoopIcon from "@mui/icons-material/Loop";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SlowMotionVideoIcon from "@mui/icons-material/SlowMotionVideo";
import { TextField } from "@mui/material";
import Grid from "@mui/material/Grid";

import { Widget } from "./widget";
import Timer from "./timer";

import { PlayerType } from "./types";

const TinyText = styled(Typography)({
  fontSize: "0.75rem",
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
});

export default function Player({
  sectionId,
  label,
  start,
  setStart,
  end,
  setEnd,
  duration,
  currentTime,
  restart,
  loadPlayPause,
  isPlaying,
  loop,
  toggleLoop,
  setPlayback,
  speed,
  setAudioPlaybackRate,
  savePlayer,
  deletePlayer,
}: PlayerType) {
  const setPlaybackManually = (value: number) => {
    setPlayback(value);
    setPosition(value);
  };

  React.useEffect(() => {
    setPosition(currentTime);
  }, [currentTime]);

  const theme = useTheme();
  const [position, setPosition] = React.useState(0);

  function formatDuration(value: number) {
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
  }
  const mainIconColor = theme.palette.mode === "dark" ? "#fff" : "#000";
  const lightIconColor =
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";

  const maxMins = Math.floor(duration / 60);
  const remainingSeconds = duration - maxMins * 60;

  const [startMinutes, setStartMinutes] = React.useState(0);
  const [startSeconds, setStartSeconds] = React.useState(0);
  const [endMinutes, setEndMinutes] = React.useState(maxMins);
  const [endSeconds, setEndSeconds] = React.useState(remainingSeconds);

  const [sectionLabel, setSectionLabel] = React.useState(label);

  const changeMinutes = (value: number, startOrEnd: "start" | "end") => {
    value = Number(value);
    value = Math.min(maxMins, value);

    if (startOrEnd === "start") setStartMinutes(value);
    else if (startOrEnd === "end") setEndMinutes(value);
  };

  const changeSeconds = (value: number, startOrEnd: string) => {
    value = Number(value);
    let minutes;
    if (startOrEnd === "start") minutes = startMinutes;
    else minutes = endMinutes;

    let priorSeconds;
    if (startOrEnd === "start") priorSeconds = startSeconds;
    else if (startOrEnd === "end") priorSeconds = endSeconds;

    let valueMinutes;
    if (value === 60 && priorSeconds === 59 && minutes < maxMins) {
      value = 0;
      valueMinutes = minutes + 1;
    } else if (value === -1 && priorSeconds === 0 && minutes > 0) {
      value = 59;
      valueMinutes = minutes - 1;
    } else {
      const maxSeconds = minutes === maxMins ? remainingSeconds : 59;
      value = Math.min(maxSeconds, value);
    }

    if (startOrEnd === "start") setStartSeconds(value);
    else if (startOrEnd === "end") setEndSeconds(value);
    if (!(typeof valueMinutes === "undefined")) {
      if (startOrEnd === "start") setStartMinutes(valueMinutes);
      else if (startOrEnd === "end") setEndMinutes(valueMinutes);
    }
  };

  const changeStartMinutes = (value: string) => {
    let numValue = Number(value);
    // ensure start time never after end time
    numValue = Math.min(numValue, endMinutes);
    changeMinutes(numValue, "start");
  };

  const changeStartSeconds = (value: string) => {
    let numValue = Number(value);
    // ensure start time never after end time
    const maxValue = end - startMinutes * 60;
    numValue = Math.min(numValue, maxValue);
    changeSeconds(numValue, "start");
  };

  const changeEndMinutes = (value: string) => {
    let numValue = Number(value);
    // ensure start time never after end time
    numValue = Math.max(numValue, startMinutes);
    changeMinutes(numValue, "end");
  };

  const changeEndSeconds = (value: string) => {
    let numValue = Number(value);
    // ensure start time never after end time
    const minValue = start - endMinutes * 60;
    numValue = Math.max(numValue, minValue);
    changeSeconds(numValue, "end");
  };

  React.useEffect(() => {
    const currentStartSeconds = startSeconds + startMinutes * 60;
    setStart(currentStartSeconds);

    const currentEndSeconds = endSeconds + endMinutes * 60;
    setEnd(currentEndSeconds);
  }, [startSeconds, startMinutes, endSeconds, endMinutes, setStart, setEnd]);

  React.useEffect(() => {
    const mins = Math.floor(start / 60);
    const secs = Math.round(start - mins * 60);
    setStartMinutes(mins);
    setStartSeconds(secs);
  }, [start]);

  React.useEffect(() => {
    const mins = Math.floor(end / 60);
    const secs = Math.round(end - mins * 60);
    setEndMinutes(mins);
    setEndSeconds(secs);
  }, [end]);

  return (
    <Widget>
      <IconButton
        aria-label="delete"
        size="large"
        onClick={() => deletePlayer(sectionId)}
      >
        <DeleteIcon fontSize="inherit" />
      </IconButton>
      <IconButton
        aria-label="save"
        size="large"
        onClick={() =>
          savePlayer({
            label: sectionLabel,
            start,
            end,
            speed,
            loop,
            id: sectionId,
          })
        }
      >
        <SaveIcon fontSize="inherit" />
      </IconButton>

      <TextField
        size="small"
        label="Section"
        variant="standard"
        value={sectionLabel}
        onChange={(e) => setSectionLabel(e.target.value)}
      />
      <Grid
        container
        spacing={2}
        columns={15}
        sx={{
          marginTop: "10px",
          marginBottom: "10px",
        }}
      >
        <Grid item xs={7}>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            {"Start"}
          </Typography>
          <Grid container spacing={2} columns={2}>
            <Grid item xs={1}>
              <TextField
                size="small"
                helperText="minutes"
                placeholder={"MM"}
                value={startMinutes}
                type="number"
                onChange={(e) => changeStartMinutes(e.target.value)}
                InputProps={{
                  inputProps: { min: 0 },
                }}
              />
            </Grid>
            <Grid item xs={1}>
              <TextField
                size="small"
                helperText="seconds"
                placeholder={"SS"}
                value={startSeconds}
                type="number"
                onChange={(e) => changeStartSeconds(e.target.value)}
                InputProps={{
                  inputProps: { min: -1 },
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={7}>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            {"End"}
          </Typography>
          <Grid container spacing={2} columns={2}>
            <Grid item xs={1}>
              <TextField
                size="small"
                helperText="minutes"
                placeholder={"MM"}
                value={endMinutes}
                type="number"
                onChange={(e) => changeEndMinutes(e.target.value)}
                InputProps={{
                  inputProps: { min: 0 },
                }}
              />
            </Grid>
            <Grid item xs={1}>
              <TextField
                size="small"
                helperText="seconds"
                placeholder={"SS"}
                value={endSeconds}
                type="number"
                onChange={(e) => changeEndSeconds(e.target.value)}
                InputProps={{
                  inputProps: { min: -1 },
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Timer time={currentTime} />
      <Slider
        aria-label="time-indicator"
        size="small"
        value={position}
        min={Number(start)}
        step={0.1}
        max={Number(end)}
        onChange={(_, value) => setPlaybackManually(value as number)}
        sx={{
          color: theme.palette.mode === "dark" ? "#fff" : "rgba(0,0,0,0.87)",
          height: 4,
          "& .MuiSlider-thumb": {
            width: 8,
            height: 8,
            transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
            "&:before": {
              boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
            },
            "&:hover, &.Mui-focusVisible": {
              boxShadow: `0px 0px 0px 8px ${
                theme.palette.mode === "dark"
                  ? "rgb(255 255 255 / 16%)"
                  : "rgb(0 0 0 / 16%)"
              }`,
            },
            "&.Mui-active": {
              width: 20,
              height: 20,
            },
          },
          "& .MuiSlider-rail": {
            opacity: 0.28,
          },
        }}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mt: -2,
        }}
      >
        <TinyText>{formatDuration(Math.round(start))}</TinyText>
        <TinyText>-{formatDuration(Math.round(end))}</TinyText>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: -1,
        }}
      >
        <IconButton aria-label="restart" onClick={restart}>
          <RestartAltIcon />
        </IconButton>
        <IconButton aria-label="play/pause" onClick={loadPlayPause}>
          {isPlaying ? (
            <PauseIcon sx={{ height: 38, width: 38 }} />
          ) : (
            <PlayArrowIcon sx={{ height: 38, width: 38 }} />
          )}
        </IconButton>
        <IconButton aria-label="loop" onClick={toggleLoop}>
          {loop ? <LoopIcon sx={{ color: "lightgreen" }} /> : <LoopIcon />}
        </IconButton>
      </Box>
      <Stack
        spacing={2}
        direction="row"
        sx={{ mb: 1, px: 1 }}
        alignItems="center"
      >
        <SlowMotionVideoIcon htmlColor={lightIconColor} />
        <TinyText>{speed}</TinyText>
        <Slider
          aria-label="Speed"
          value={speed}
          min={0}
          step={0.1}
          max={2}
          onChange={(_, value) => setAudioPlaybackRate(value as number)}
          sx={{
            color: theme.palette.mode === "dark" ? "#fff" : "rgba(0,0,0,0.87)",
            "& .MuiSlider-track": {
              border: "none",
            },
            "& .MuiSlider-thumb": {
              width: 24,
              height: 24,
              backgroundColor: "#fff",
              "&:before": {
                boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
              },
              "&:hover, &.Mui-focusVisible, &.Mui-active": {
                boxShadow: "none",
              },
            },
          }}
        />
      </Stack>
    </Widget>
  );
}
