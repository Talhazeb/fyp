import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Collapse,
} from "@mui/material";
import { Search } from "@mui/icons-material";

const PatientSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isDoseOpen, setIsDoseOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  //   Call from backend
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/allPatients");
        const data = await response.json();
        setPatients(JSON.parse(data["patients"]));
        console.log(JSON.parse(data["patients"]));
      } catch (error) {
        console.error(error);
      }
    };

    fetchPatients();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleHover = (patient) => {
    setHoveredPatient(patient);
  };

  const handleClose = () => {
    setHoveredPatient(null);
  };

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    setSelectedPatient(null);
  };

  const filteredPatients = Array.isArray(patients)
    ? patients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="flex flex-col items-center">
      <TextField
        id="search"
        label="Search"
        variant="outlined"
        margin="dense"
        size="small"
        value={searchTerm}
        onChange={handleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        className="w-11/12 mt-4"
      />

      <TableContainer component={Paper} className="w-11/12 mt-4">
        <Table>
          <TableHead>
            <TableRow className="bg-gray-50">
              <TableCell className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</TableCell>
              <TableCell className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</TableCell>
              <TableCell className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow
                key={patient.id}
                hover
                onMouseEnter={() => handleHover(patient)}
                onMouseLeave={handleClose}
              >
                <TableCell className="py-3">{patient.id}</TableCell>
                <TableCell className="py-3">{patient.name}</TableCell>
                <TableCell className="py-3">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleViewDetails(patient)}
                    className="text-sm"
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="md">
  {selectedPatient && (
    <>
      <DialogTitle className="text-lg font-bold mb-3">Patient Details</DialogTitle>
      <DialogContent>
        <div className="flex flex-col gap-3">
          <div className="flex gap-3 items-center">
            <strong className="w-16">ID:</strong>
            <DialogContentText>{selectedPatient.id}</DialogContentText>
          </div>
          <div className="flex gap-2 items-center">
            <strong className="w-16">Name:</strong>
            <DialogContentText>{selectedPatient.name}</DialogContentText>
          </div>
          <div className="flex gap-2 items-center">
            <strong className="w-32">Transcription:</strong>
            <DialogContentText>{selectedPatient.transcription}</DialogContentText>
          </div>

          {/* Collapsible section for dose */}
          <div className="flex justify-between items-center cursor-pointer border-b-2 border-gray-300 pb-2">
            <strong onClick={() => setIsDoseOpen(!isDoseOpen)}>Dose:</strong>
            <button onClick={() => setIsDoseOpen(!isDoseOpen)} className="text-sm font-medium">
              {isDoseOpen ? 'Hide' : 'Show'}
            </button>
          </div>
          <Collapse in={isDoseOpen}>
            <Table className="my-3">
              <TableBody>
                {Object.entries(selectedPatient.dose).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell>{key}</TableCell>
                    <TableCell>{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Collapse>

          {/* Collapsible section for information */}
          <div className="flex justify-between items-center cursor-pointer border-b-2 border-gray-300 pb-2">
            <strong onClick={() => setIsInfoOpen(!isInfoOpen)}>Information:</strong>
            <button onClick={() => setIsInfoOpen(!isInfoOpen)} className="text-sm font-medium">
              {isInfoOpen ? 'Hide' : 'Show'}
            </button>
          </div>
          <Collapse in={isInfoOpen}>
            <Table className="my-3">
              <TableBody>
                {Object.entries(selectedPatient.information).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell>{key}</TableCell>
                    <TableCell>{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Collapse>
        </div>
      </DialogContent>
    </>
  )}
  <DialogActions className="flex justify-end gap-2 pt-4">
    <Button onClick={handleDialogClose} color="primary">
      Close
    </Button>
    <Button onClick={() => window.print()} color="primary" variant="contained">
      Print Report
    </Button>
  </DialogActions>
</Dialog>
    </div>
  );
};

export default PatientSearch;