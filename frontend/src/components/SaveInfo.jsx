import React from "react";
import { Button, CircularProgress } from "@mui/material";
import { Stack } from "@mui/system";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SaveIcon from '@mui/icons-material/Save';
import { useSelector, useDispatch } from "react-redux";
import { resetStore, savePatientIDAction } from "../redux/actions";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SaveInfo() {
    const dispatch = useDispatch();
    const patientInfo = useSelector((state) => state.patient);
    const [loading, setLoading] = React.useState(false);
    const [rloading, setRLoading] = React.useState(false);

    const handleClickReset = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    const handleClickSave = () => {
        setRLoading(true);
        setTimeout(() => {
            setRLoading(false);
        }, 2000);
    };

    const savePatientInfo = async (patientInfo) => {
        handleClickSave();
        dispatch(savePatientIDAction());
        try {
          const response = await fetch('http://127.0.0.1:5000/savePatientInfo', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ patientInfo })
          });
          const data = await response.json();
          if(data.result === "success") {
            toast.success("Patient Info Saved!", {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 2000,
            });
          } else {
            toast.error("Patient Info Not Saved!", {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 2000,
            });
          }

        } catch (error) {
          console.error(error);
        }
      };

    const resetAllFields = () => {
        handleClickReset();
        dispatch(resetStore());
        window.location.reload();
        
    };

    
      

    return (
        <div>
            <Stack direction="row" spacing={1} className="mt-5 mb-5">
                <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    startIcon={loading ? <CircularProgress size={20} /> : <RestartAltIcon />}
                    style={{ marginLeft: "21rem" }}
                    onClick={resetAllFields}
                    disabled={patientInfo.name.length === 0}
                >
                    Reset All
                </Button>
                <Button
                    id="viewReport"
                    variant="outlined"
                    size="large"
                    sx={{ marginTop: "20px", color: "#4caf50"}}
                    startIcon={rloading ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={patientInfo.name.length === 0}
                    onClick={() => savePatientInfo(patientInfo)}
                >
                    Save Patient Info
                </Button>
            </Stack>
        </div>
    );
}