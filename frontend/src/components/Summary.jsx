import React from "react";

import { Button, CircularProgress } from "@mui/material";
import { Stack } from "@mui/system";
import Typography from "@mui/material/Typography";

import SummaryReportIcon from "@mui/icons-material/Description";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";

export default function Summary() {
  const transcription = useSelector((state) => state.transcription);
  const language = useSelector((state) => state.language);
  const navigate = useNavigate();
  const [summary, setSummary] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleClick = () => {
    setLoading(true);
    fetch("http://localhost:5000/summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: transcription,
        language: language,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.answer);
        setSummary(data.answer);
        setLoading(false);
      });
  };

  const viewReport = () => {
    localStorage.setItem("transcriptionData", JSON.stringify(summary));
    window.open("/viewPDF", "_blank");
  };

  return (
    <div>
      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          startIcon={loading ? <CircularProgress size={20} /> : <SummaryReportIcon />}
          style={{ marginLeft: "20rem" }}
          onClick={handleClick}
          disabled={transcription.length === 0}
        >
          Generate
        </Button>
        <Button
          id="viewReport"
          variant="outlined"
          size="large"
          sx={{ marginTop: "20px" }}
          startIcon={<VisibilityIcon />}
          disabled={summary.length === 0}
          onClick={viewReport}
        >
          View Report
        </Button>
      </Stack>
    </div>
  );
}
