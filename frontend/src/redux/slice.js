import { combineReducers, createSlice } from '@reduxjs/toolkit';

const transcriptionSlice = createSlice({
    name: 'transcription',
    initialState: '',
    reducers: {
      saveTranscription: (state, action) => {
        return state + action.payload;
      },
    },  
  });

const medicineSlice = createSlice({
  name: 'medicine',
  initialState: [],
  reducers: {
    saveMedicines: (state, action) => {
      return action.payload;
    }
  }
})

const doseSlice = createSlice({
  name: 'dose',
  initialState: {},
  reducers: {
    saveDose: (state, action) => {
      const { id, dose } = action.payload;
      return {
        ...state,
        [id]: dose,
      };
    },
    removeDose: (state, action) => {
      const id = action.payload;
      const newState = { ...state };
      delete newState[id];
      return newState;
    }
  }
})

const informationSlice = createSlice({
    name: 'information',
    initialState: {
      temperature: '',
      bloodPressure: '',
      symptoms: '',
      medication: '',
      disease: '',
      cause: '',
      test: ''
    },
    reducers: {
      updateInformation: (state, action) => {
        return {
          ...state,
          ...action.payload
        };
      },
    },
  });

  const patientSlice = createSlice({
    name: 'patient',
    initialState: {
      id: '',
      name: '',
      transcription: '',
      medicines: [],
      dose: [],
      information: {
        temperature: '',
        bloodPressure: '',
        symptoms: '',
        medication: '',
        disease: '',
        cause: '',
        test: ''
      }
    },
    reducers: {
      updatePatientID: (state) => {
        const id = Math.random().toString(36).substring(2, 8);
        return {
          ...state,
          id,
        };
      },
      updatePatientName: (state, action) => {
        const name = action.payload;
        return {
          ...state,
          name,
        };
      },
      updatePatientTranscription: (state, action) => {
        const transcription = action.payload;
        return {
          ...state,
          transcription,
        };
      },
      addPatientMedicine: (state, action) => {
        const medicine = action.payload;
        const newMedicines = [...state.medicines, medicine];
        return {
          ...state,
          medicines: newMedicines,
        };
      },
      updatePatientMedicineDose: (state, action) => {
        const { id, dose } = action.payload;
        return {
          ...state,
          dose: {
            ...state.dose,
            [id]: {
              ...state.dose[id],
              ...dose,
            },
          },
        };
      },
      
      
      removePatientMedicine: (state, action) => {
        const id = action.payload;
        const newMedicines = state.medicines.filter(medicine => medicine.id !== id);
        const newDose = { ...state.dose };
        delete newDose[id];
        return {
          ...state,
          medicines: newMedicines,
          dose: newDose,
        };
      },
      updatePatientInformation: (state, action) => {
        const information = action.payload;
        return {
          ...state,
          information,
        };
      },
    },
  });

const activePanelSlice = createSlice({
    name: 'activePanel',
    initialState: '',
    reducers: {
        updateActivePanel: (state, action) => {
            return action.payload;
        },
    },
});

const userProfileSlice = createSlice({
    name: 'userProfile',
    initialState: {
        email : '',
        firstname : '',
        lastname : '',
    },
    reducers: {
        updateEmail: (state, action) => {
            return {    
                ...state,
                email: action.payload,
            };
        },
        updateFirstname: (state, action) => {
            return {
                ...state,
                firstname: action.payload,  
            };
        },
        updateLastname: (state, action) => {
            return {
                ...state,
                lastname: action.payload,
            };
        },
    },
});

const languageSlice = createSlice({
    name: 'language',
    initialState: 'english',
    reducers: {
        updateLanguage: (state, action) => {
            return action.payload;
        },
    },
});

const rootReducer = combineReducers({
  transcription: transcriptionSlice.reducer,
  medicine: medicineSlice.reducer,
  dose: doseSlice.reducer,
  information: informationSlice.reducer,
  patient: patientSlice.reducer,
  activePanel: activePanelSlice.reducer,
    userProfile: userProfileSlice.reducer,
    language: languageSlice.reducer,
})

export const { saveTranscription } = transcriptionSlice.actions;
export const { saveMedicines } = medicineSlice.actions;
export const { saveDose, removeDose } = doseSlice.actions;
export const { updateInformation } = informationSlice.actions;
export const { updatePatientID, updatePatientName, updatePatientTranscription, addPatientMedicine, updatePatientMedicineDose, removePatientMedicine, updatePatientInformation } = patientSlice.actions;
export const { updateActivePanel } = activePanelSlice.actions;
export const { updateEmail, updateFirstname, updateLastname } = userProfileSlice.actions;
export const { updateLanguage } = languageSlice.actions;

export default rootReducer;
