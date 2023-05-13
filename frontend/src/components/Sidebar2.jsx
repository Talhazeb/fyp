import React, { useState } from "react";
import { FaHeadset, FaInfoCircle, FaListAlt, FaFileInvoice, FaUser, FaQuestionCircle, FaPowerOff, FaBars, FaSearch, FaIdCard, FaBriefcaseMedical } from 'react-icons/fa';
import { useDispatch } from "react-redux";
import { saveActivePanelAction } from "../redux/actions";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Sidebar = ({ collapsed, setCollapsed }) => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState("Patient Information");

    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    }

    const tabs = [
        { id: 1, name: "Patient Information", icon: <FaIdCard />, },
        { id: 2, name: "Transcription", icon: <FaHeadset />, },
        { id: 3, name: "Information", icon: <FaInfoCircle />, },
        { id: 4, name: "Medicine", icon: <FaBriefcaseMedical />, },
        { id: 5, name: "Summary", icon: <FaListAlt />, },
        { id: 7 , name: "Invoice", icon: <FaFileInvoice />, },
        { id: 8, name: "Profile", icon: <FaUser />, },
        { id: 9, name: "Search Patients", icon: <FaSearch />, },
        { id: 10, name: "FAQ", icon: <FaQuestionCircle />, },
        { id: 6, name: "Logout", icon: <FaPowerOff />},
    ];

    const handleActiveTab = (tabName) => {
        dispatch(saveActivePanelAction(tabName));
        setActiveTab(tabName);
        if (tabName === "Logout") {
            localStorage.clear();
            window.location.reload();
            window.location.href = "/";
            toast.success("Logged out successfully");
        }
    };

    return (
        <div className={`bg-gray-200 h-screen flex-shrink-0 overflow-hidden shadow-lg fixed transition-all duration-500 ease-in-out ${collapsed ? 'w-20' : 'w-64'}`}>
            <div className="p-4 flex items-center justify-center">
                <div className="text-gray-800 text-2xl font-bold">
                    <div className={`flex items-center justify-center rounded-md transform ${collapsed ? 'rotate-180' : ''}`}>
                        <FaBars className="text-gray-800 text-xl cursor-pointer animate-spin-slow" onClick={toggleCollapse} />
                        {!collapsed && <span className="ml-5">Compod</span>}
                    </div>
                </div>
            </div>
            <ul className={`px-4 py-6 ${collapsed ? 'justify-center' : ''}`}>
                {tabs.map((tab) => (
                    <li
                        key={tab.id}
                        className={`flex items-center px-2 py-3 cursor-pointer ${
                            activeTab === tab.name
                                ? "text-white bg-gray-800 rounded-md shadow-md"
                                : "text-gray-800 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                        }`}
                        onClick={() => handleActiveTab(tab.name)}
                    >
                        <div className={`flex items-center justify-center w-7 h-7 rounded-md ${collapsed ? 'mx-auto' : ''}`}>
                            {tab.icon}
                        </div>
                        <span className={`ml-3 text-sm font-medium transition-all duration-500 ${collapsed ? 'hidden' : 'block'}`}>{tab.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;

