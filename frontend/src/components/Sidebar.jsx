import React from "react";
import { useNavigate } from "react-router-dom";
import { Link as LinkScroll } from "react-scroll";

import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import Listener from "./Listener";
import Information from "./Information";
import Medicine from "./Medicine";
import Summary from "./Summary";
import Invoice from "./Invoice";
import Profile from "./Profile";
import Faq from "./Faq";
import Calender from "./Calender";

import logo from "../assets/logo.svg";

const card = "border border-gray-200 rounded-lg px-6 py-8 w-full";
const invoice_card =
  "border border-green-500 bg-green-100 rounded-lg px-6 py-8 w-full";

export default function App() {
  const navigate = useNavigate();

  const [data, setData] = React.useState([]);
  const [symptoms, setSymptoms] = React.useState([]);
  const [disease, setDisease] = React.useState([]);
  const [cause, setCause] = React.useState([]);
  const [medicine, setMedicine] = React.useState([]);

  const [tran, setTran] = React.useState([]);

  const getTranscription = (transcription) => {
    setTran(transcription);
    console.log("Transcription: ", transcription);
    tran.push(transcription);
    console.log("Tran: ", tran);
  };

  const getData = (tempData) => {
    setData(tempData);
    console.log("Temp: ", tempData);
    data.push(tempData);
    console.log("Data: ", data);

    // Empty the array
    symptoms.length = 0;
    disease.length = 0;
    cause.length = 0;
    medicine.length = 0;

    symptoms.push(tempData["symptoms"]);
    disease.push(tempData["disease"]);
    cause.push(tempData["cause"]);
    medicine.push(tempData["medication"]);

    console.log("Symptoms: ", symptoms);
    console.log("Disease: ", disease);
    console.log("Cause: ", cause);
    console.log("Medicine: ", medicine);
  };

  const [invoiceMedicine, setInvoiceMedicine] = React.useState([]);

  const getMedicines = (tempMedicine) => {
    setInvoiceMedicine(tempMedicine);
    // console.log("Temp: ", tempMedicine);
    invoiceMedicine.push(tempMedicine);
    // console.log("Invoice Medicine: ", invoiceMedicine);
  };

  return (
    <div
      id="app"
      className="flex flex-col h-screen"
    >
      <Sidebar style={{ height: "200vh", position: "fixed" }}>
        <Menu>
          <MenuItem
            icon={<MenuOutlinedIcon />}
            onClick={() => {
              collapseSidebar();
            }}
            style={{
              textAlign: "center",
              marginTop: "2rem",
              marginBottom: "2rem",
            }}
          >
            <img
              src={logo}
              alt="logo"
              style={{ width: "180px", height: "180px" }}
            />
          </MenuItem>
          <MenuItem icon={<HomeOutlinedIcon />}>
            <LinkScroll
              to="home"
              smooth={true}
              duration={500}
              spy={true}
              exact="true"
              offset={-40}
            >
              Home
            </LinkScroll>
          </MenuItem>
          <MenuItem icon={<InfoOutlinedIcon />}>
            <LinkScroll
              to="information"
              smooth={true}
              duration={500}
              spy={true}
              exact="true"
              offset={-40}
            >
              Information
            </LinkScroll>
          </MenuItem>
          <MenuItem icon={<PeopleOutlinedIcon />}>
            <LinkScroll
              to="summary"
              smooth={true}
              duration={500}
              spy={true}
              exact="true"
              offset={-40}
            >
              Summary
            </LinkScroll>
          </MenuItem>
          <MenuItem icon={<ContactsOutlinedIcon />}>
            <LinkScroll
              to="invoice"
              smooth={true}
              duration={500}
              spy={true}
              exact="true"
              offset={-40}
            >
              Invoice
            </LinkScroll>
          </MenuItem>
          <MenuItem icon={<ReceiptOutlinedIcon />}>
            <LinkScroll
              to="profile"
              smooth={true}
              duration={500}
              spy={true}
              exact="true"
              offset={-40}
            >
              Profile
            </LinkScroll>
          </MenuItem>
          <MenuItem icon={<HelpOutlineOutlinedIcon />}>
            <LinkScroll
              to="faq"
              smooth={true}
              duration={500}
              spy={true}
              exact="true"
              offset={-40}
            >
              FAQ
            </LinkScroll>
          </MenuItem>
          {/* <LinkScroll
            to="calender"
            smooth={true}
            duration={500}
            spy={true}
            exact="true"
            offset={-40}
          >
            <MenuItem icon={<CalendarTodayOutlinedIcon />}>Calender</MenuItem>
          </LinkScroll> */}w
          <MenuItem
            icon={<ExitToAppOutlinedIcon />}
            onClick={() => {
              navigate("/");
            }}
          >
            Log Out
          </MenuItem>
        </Menu>
      </Sidebar>

      <main style={{ marginLeft: "16rem", width: "75%" }}>
        <div className={card} id="home">
          <Listener />
        </div>

        <div className={card} id="information">
          <Information heading="Symptoms" cardData={symptoms} />
          <Information heading="Disease" cardData={disease} />
          <Information heading="Cause" cardData={cause} />
          <Information heading="Medicine" cardData={medicine} />
        </div>

        <div className={card} id="Medicine">
          <Medicine />
        </div>

        <div className={card} id="summary">
          <Summary />
        </div>

        <div className={invoice_card} id="invoice">
          <Invoice />
        </div>

        <div className={card} id="profile">
          <Profile />
        </div>

        <div className={card} id="faq">
          <Faq />
        </div>

        {/* <div style={card} id="calender">
          <Calender />
        </div> */}
        {/* Add spacing at end */}
        <div style={{ height: "5rem" }}></div>
      </main>
    </div>
  );
}
