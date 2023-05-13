import { useSelector, useDispatch } from "react-redux";
import { saveInformationAction, savePatientInformationAction } from "../redux/actions";
import { Button, CircularProgress } from "@mui/material";
import {FaRobot} from "react-icons/fa";
import React, { useEffect } from "react";
import { styled } from "@mui/material/styles";
import { keyframes } from "@mui/material/styles";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const glow = keyframes`
  0% {
    transform: scale(0.5);
    box-shadow: 0 0 0 0 rgba(255, 105, 135, 0.7);
  }
  50% {
    transform: scale(1);
    box-shadow: 0 0 10px 5px rgba(255, 105, 135, 0.3);
  }
  100% {
    transform: scale(0.5);
    box-shadow: 0 0 0 0 rgba(255, 105, 135, 0.7);
  }
}`;

const RainbowButton = styled(Button)(({ theme }) => ({
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    border: 0,
    borderRadius: 5,
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    color: "white",
    height: 48,
    padding: "0 30px",
    transition: "box-shadow 0.3s ease-in-out",
    "&:hover": {
      boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .5)",
    },
    "&:active": {
      boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .7)",
    },
    "&:disabled": {
      opacity: 0.7,
      cursor: "not-allowed",
    },
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      top: "-5px",
      left: "-5px",
      right: "-5px",
      bottom: "-5px",
      borderRadius: 50,
      opacity: 0.4,
      boxShadow: "0 0 10px 3px rgba(255, 105, 135, .3)",
      zIndex: -1,
      animation: "$glow 1.5s ease-in-out infinite",
    },
    "&:hover::before": {
      opacity: 0.6,
    },
    "&::after": {
      content: '""',
      position: "absolute",
      top: "-5px",
      left: "-5px",
      right: "-5px",
      bottom: "-5px",
      borderRadius: 50,
      opacity: 0,
      boxShadow: "0 0 20px 5px rgba(255, 105, 135, .7)",
      zIndex: -2,
      animation: "$glow 3s ease-in-out infinite",
    },
    "&:hover::after": {
      opacity: 1,
    },
    "&::before": {
        // ...
        animation: `${glow} 1.5s ease-in-out infinite`,
      },
      "&::after": {
        // ...
        animation: `${glow} 3s ease-in-out infinite`,
      },
  }));

const Information = () => {
  const information = useSelector((state) => state.information);
  const transcription = useSelector((state) => state.transcription);
  const language = useSelector((state) => state.language);
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(saveInformationAction({ ...information, [name]: value }));
  }; 

  useEffect(() => {
    if(language === "urdu")
    {
        handlePostAnalysis();
    }
  }, [transcription]);

  const handlePostAnalysis = () => {
    if (transcription === "") {
      toast.error("No transcription found!");
      return;
    }
    setLoading(true);
    fetch("http://127.0.0.1:5000/gptAnalysis", {
      method: "POST",
      body: JSON.stringify({
        query: transcription,
        language: language,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json()
        .then((data) => {
            console.log(data["answer"]);
            // console.log(JSON.parse(data["answer"]));
            dispatch(saveInformationAction(data["answer"]));
            dispatch(savePatientInformationAction(data["answer"]));
        }
      )
      .then((data) => console.log(data))
      .catch((error) => console.error(error))
        .finally(() => setLoading(false))
        );
            
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="font-bold text-lg mb-2">Temperature</h2>
          <input
            type="text"
            name="temperature"
            className="border border-gray-300 p-2 rounded-lg w-full"
            value={information.temperature}
            onChange={handleInputChange}
          />
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="font-bold text-lg mb-2">Blood Pressure</h2>
          <input
            type="text"
            name="bloodPressure"
            className="border border-gray-300 p-2 rounded-lg w-full"
            value={information.bloodPressure}
            onChange={handleInputChange}
          />
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="font-bold text-lg mb-2">Symptoms</h2>
          <input
            type="text"
            name="symptoms"
            className="border border-gray-300 p-2 rounded-lg w-full"
            value={information.symptoms}
            onChange={handleInputChange}
          />
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="font-bold text-lg mb-2">Medication</h2>
          <input
            type="text"
            name="medication"
            className="border border-gray-300 p-2 rounded-lg w-full"
            value={information.medication}
            onChange={handleInputChange}
          />
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="font-bold text-lg mb-2">Disease</h2>
          <input
            type="text"
            name="disease"
            className="border border-gray-300 p-2 rounded-lg w-full"
            value={information.disease}
            onChange={handleInputChange}
          />
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="font-bold text-lg mb-2">Cause</h2>
          <input
            type="text"
            name="cause"
            className="border border-gray-300 p-2 rounded-lg w-full"
            value={information.cause}
            onChange={handleInputChange}
          />
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="font-bold text-lg mb-2">Test</h2>
          <input
            type="text"
            name="test"
            className="border border-gray-300 p-2 rounded-lg w-full"
            value={information.test}
            onChange={handleInputChange}
          />
        </div>
        {/* <RainbowButton
            id="viewReport"
            variant="contained"
            size="large"
            sx={{ marginTop: "20px", color: "#ffffff" }}
            startIcon={loading ? <CircularProgress size={20} /> : <FaRobot />}
            disabled={loading}
            onClick={handlePostAnalysis}
        >
      Ask GPT
    </RainbowButton> */}
      </div>
      {/* Add a  */}
      
    </div>
  );
};

export default Information;
