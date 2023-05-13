import React from "react";
import { Button, CircularProgress } from "@mui/material";
import { Stack } from "@mui/system";
import SummaryReportIcon from "@mui/icons-material/Description";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useSelector } from "react-redux";

export default function Invoice() {
    const invoiceMedicine = useSelector((state) => state.medicine);
    const [loading, setLoading] = React.useState(false);
    const [rloading, setRLoading] = React.useState(false);

    const handleClick = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setRLoading(true);
        }, 5000);
    };

    const viewReport = () => {
        localStorage.setItem("invoiceMedicine", JSON.stringify(invoiceMedicine));
        window.open("/invoicePDF", "_blank");
    };

    return (
        <div>
            <Stack direction="row" spacing={1} className="mt-5 mb-5">
                <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    startIcon={loading ? <CircularProgress size={20} /> : <SummaryReportIcon />}
                    style={{ marginLeft: "21rem" }}
                    onClick={handleClick}
                    disabled={invoiceMedicine.length === 0}
                >
                    Generate
                </Button>
                <Button
                    id="viewReport"
                    variant="outlined"
                    size="large"
                    sx={{ marginTop: "20px", color: "#4caf50"}}
                    startIcon={<VisibilityIcon />}
                    disabled={rloading? false : true}
                    onClick={viewReport}
                >
                    View Invoice
                </Button>
            </Stack>
        </div>
    );
}