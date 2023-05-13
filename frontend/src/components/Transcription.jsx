import React, { useState, useEffect, useRef } from "react";
import { ReactMic } from "react-mic";
import axios from "axios";
import { ScaleLoader } from "react-spinners";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Select, MenuItem } from "@mui/material";

import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

import TranscribeOutput from "../services/TranscribeOutput";

import { useDispatch } from 'react-redux';
import { saveTranscriptionAction, saveInformationAction, savePatientInformationAction, savePatientTranscriptionAction, saveLanguageAction } from '../redux/actions';



const root = {
  display: "flex",
  flex: "1",
  margin: "",
  alignItems: "center",
  textAlign: "center",
  flexDirection: "column",
};

const title = {
  marginBottom: "10px",
};

const settingsSection = {
  marginBottom: "20px",
  display: "flex",
  width: "100%",
};

const buttonsSection = {
  marginBottom: "40px",
};

const recordIllustration = {
  width: "100px",
};

export default function Transcription() {

    const dispatch = useDispatch();
  const [transcribedData, setTranscribedData] = useState([]);
  const [interimTranscribedData] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [selectedModel, setSelectedModel] = useState(1);
  const [transcribeTimeout, setTranscribeTimout] = useState(5);
  const [stopTranscriptionSession, setStopTranscriptionSession] =
    useState(false);
    const selectedLangRef = useRef(selectedLanguage);

  const intervalRef = useRef(null);

  const stopTranscriptionSessionRef = useRef(stopTranscriptionSession);
  stopTranscriptionSessionRef.current = stopTranscriptionSession;

//   const selectedLangRef = useRef(selectedLanguage);
  selectedLangRef.current = selectedLanguage;

  const selectedModelRef = useRef(selectedModel);
  selectedModelRef.current = selectedModel;

  const modelOptions = ["tiny", "base", "small", "medium", "large"];

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  function handleTranscribeTimeoutChange(newTimeout) {
    setTranscribeTimout(newTimeout);
  }

  function startRecording() {
    setStopTranscriptionSession(false);
    setIsRecording(true);
    intervalRef.current = setInterval(
      transcribeInterim,
      transcribeTimeout * 1000
    );
  }

  function stopRecording() {
    clearInterval(intervalRef.current);
    setStopTranscriptionSession(true);
    setIsRecording(false);
    setIsTranscribing(false);
  }

  function onStop(recordedBlob) {
    transcribeRecording(recordedBlob);
    setIsTranscribing(true);
  }

  function transcribeInterim() {
    clearInterval(intervalRef.current);
    setIsRecording(false);
  }

  function onData(recordedBlob) {
    // console.log('chunk of real-time data is: ', recordedBlob);
  }

  function transcribeRecording(recordedBlob) {
    const headers = {
      "content-type": "multipart/form-data",
    };
    const formData = new FormData();
    dispatch(saveLanguageAction(selectedLangRef.current));
    formData.append("language", selectedLangRef.current);
    formData.append("model_size", modelOptions[selectedModelRef.current]);
    formData.append("audio_data", recordedBlob.blob, "temp_recording");
    // Get user media device

    axios
      .post("http://68.178.200.63:5000/transcribe", formData, { headers })
      .then((res) => {
        setTranscribedData((oldData) => {
            const newData = [...oldData, res.data["transcription"]];
            console.log("Previous data: ", oldData);
            console.log("New data: ", newData);
            dispatch(saveTranscriptionAction(newData));
            dispatch(savePatientTranscriptionAction(newData));
            dispatch(saveInformationAction(res.data["report"]));
            dispatch(savePatientInformationAction(res.data["report"]));
            return newData;
          });
        console.log("Report: ", res.data["report"]);
        
        setIsTranscribing(false);
        intervalRef.current = setInterval(
          transcribeInterim,
          transcribeTimeout * 2000
        );
      });

    if (!stopTranscriptionSessionRef.current) {
      setIsRecording(true);
    }
  }

  return (
    <div style={root}>
      <div style={title}>
        <Typography variant="h6">Select Language</Typography>
      </div>

      <Select value={selectedLanguage} onChange={(e) => { selectedLangRef.current = e.target.value; setSelectedLanguage(e.target.value); }}
      style={{
        marginBottom: "50px",
      }}
      >
        <MenuItem value="english">English</MenuItem>
        <MenuItem value="urdu">Urdu</MenuItem>
        <MenuItem value="romanurdu">Roman Urdu</MenuItem>
      </Select>
      
      <div style={buttonsSection}>
        {!isRecording && !isTranscribing && (
          <Button
            onClick={startRecording}
            variant="outlined"
            startIcon={<MicIcon />}
            size="large"
          >
            Start
          </Button>
        )}
        {(isRecording || isTranscribing) && (
          <Button
            onClick={stopRecording}
            variant="outlined"
            color="error"
            disabled={stopTranscriptionSessionRef.current}
            endIcon={<MicOffIcon />}
          >
            Stop
          </Button>
        )}
      </div>

      <div className="recordIllustration">
        <ReactMic
          record={isRecording}
          className="sound-wave"
          onStop={onStop}
          onData={onData}
          strokeColor="#3b9698"
          backgroundColor="#fafbfc"
        />
      </div>

      <div>
        <TranscribeOutput
          transcribedText={transcribedData}
          interimTranscribedText={interimTranscribedData}
        />
        <ScaleLoader
          sizeUnit={"px"}
          width={5}
          color="#1f2937"
          loading={isTranscribing}
        />
      </div>
    </div>
  );
}
