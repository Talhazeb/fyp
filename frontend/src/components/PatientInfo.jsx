import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { savePatientNameAction } from '../redux/actions';

const PatientInfo = () => {
  const dispatch = useDispatch();
  const [patientName, setPatientName] = useState('');

  const handlePatientNameChange = (e) => {
    setPatientName(e.target.value);
    dispatch(savePatientNameAction(e.target.value));
  };

  return (
    <div className="p-6">
      <div className="flex items-center border-b-2 border-gray-200 py-2">
        <label className="text-gray-700 font-semibold text-lg mr-4 w-32" htmlFor="patientName">
          Patient Name:
        </label>
        <input
          className="appearance-none bg-transparent border-none w-full text-gray-700 py-2 leading-tight focus:outline-none"
          id="patientName"
          type="text"
          placeholder="Enter patient name"
          value={patientName}
          onChange={handlePatientNameChange}
          required
        />
      </div>
    </div>
  );
};

export default PatientInfo;
