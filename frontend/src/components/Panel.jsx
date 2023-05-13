import React, { useRef, useEffect } from "react";
import PatientInfo from "./PatientInfo";
import Transcription from "./Transcription";
import Medbay from "./Medbay";
import Invoice from "./Invoice";
import Faq from "./Faq";
import Info from "./Info";
import SaveInfo from "./SaveInfo";
import PatientSearch from "./PatientSearch";
import Summary from "./Summary";
import { useSelector } from "react-redux";
import { animateScroll as scroll } from "react-scroll";
import Profile from "./Profile";

const Panel = ({ collapsed }) => {
  const activeTab = useSelector((state) => state.activePanel);

  const panels = {
    "Patient Information": <PatientInfo />,
    Transcription: <Transcription />,
    Information: <Info />,
    Summary: <Summary />,
    Medication: <Medbay />,
    Invoice: <Invoice />,
    "Save Information": <SaveInfo />,
    FAQ: <Faq />,
    Profile: <Profile />,
  };

  const searchPatientPanel = {
    "Search Patients": <PatientSearch />,
  };

  const targetRef = useRef(null);

  useEffect(() => {
    if (targetRef.current) {
      scroll.scrollTo(targetRef.current.offsetTop, {
        duration: 500,
        smooth: true,
        offset: -200,
      });
    }
  }, [activeTab]);

  return (
    <div className={`flex-col w-full ${collapsed ? 'pl-20' : 'pl-64'} bg-gray-200 transition-all duration-500 ease-in-out`}>
      {activeTab === "Search Patients" ? (
        <div ref={targetRef} key="Search Patients" className="w-full p-6">
          <div className="bg-gray-50 rounded-lg overflow-hidden hover:bg-gray-100 transition-colors duration-300">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-700">
                Search Patients
              </h2>
              {searchPatientPanel[activeTab]}
            </div>
          </div>
        </div>
      ) : (
        <>
          {Object.keys(panels)
            .filter((panel) => panel !== "Search Patients")
            .map((panel) => (
              <div key={panel} className="w-full p-6">
                <div
                  ref={activeTab === panel ? targetRef : null}
                  className="bg-gray-50 rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-700">
                      {panel}
                    </h2>
                    {panels[panel]}
                  </div>
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default Panel;
