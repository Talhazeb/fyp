import { saveTranscription, saveMedicines, saveDose, removeDose, updateInformation, updatePatientID, updatePatientName, updatePatientTranscription, updatePatientInformation, updatePatientMedicineDose, updateActivePanel, updateEmail, updateFirstname, updateLastname, updateLanguage } from './slice';
import store from './store';

export const saveTranscriptionAction = (transcription) => {
  return (dispatch) => {
    dispatch(saveTranscription(transcription));
  };
};

export const saveMedicinesAction = (medicines) => {
    return (dispatch) => {
    dispatch(saveMedicines(medicines));
    };
};

export const saveMedicineDoseAction = (id, dose) => {
  return (dispatch) => {
    dispatch(saveDose({ id, dose }));
  };
};

export const removeMedicineDoseAction = (id) => {
  return (dispatch) => {
    dispatch(removeDose(id));
  };
};

export const saveInformationAction = (information) => {
    return (dispatch) => {
        dispatch(updateInformation(information));
    };
};

export const savePatientIDAction = () => {
    return (dispatch) => {
        dispatch(updatePatientID());
    };
}

export const savePatientNameAction = (name) => {
    return (dispatch) => {
        dispatch(updatePatientName(name));
    };
}

export const savePatientTranscriptionAction = (transcription) => {
    return (dispatch) => {
        dispatch(updatePatientTranscription(transcription));
    };
}

export const savePatientInformationAction = (information) => {
    return (dispatch) => {
        dispatch(updatePatientInformation(information));
    };
}   

export const savePatientMedicineDoseAction = (id, dose) => {
    return (dispatch) => {
        dispatch(updatePatientMedicineDose({ id, dose }));
    };
}

export const saveActivePanelAction = (panel) => {
    return (dispatch) => {
        dispatch(updateActivePanel(panel));
    };
}

export const saveEmailAction = (email) => {
    return (dispatch) => {
        dispatch(updateEmail(email));
    };
}

export const saveFirstnameAction = (firstname) => {
    return (dispatch) => {
        dispatch(updateFirstname(firstname));
    };
}

export const saveLastnameAction = (lastname) => {   
    return (dispatch) => {
        dispatch(updateLastname(lastname));
    };
}

export const saveLanguageAction = (language) => {
    return (dispatch) => {
        dispatch(updateLanguage(language));
    };
}

export const resetStore = () => {
    return (dispatch) => {
        console.log("State ", store.getState());
        dispatch(saveTranscription(''));
        dispatch(saveMedicines([]));
        dispatch(saveDose(''));
        dispatch(updateInformation(''));
        dispatch(updatePatientName(''));
        dispatch(updatePatientTranscription(''));
        dispatch(updatePatientInformation(''));
        dispatch(updatePatientMedicineDose(''));
        // bring it to Initial State
        store.dispatch({ type: '@@INIT' });
        console.log("State ", store.getState());
        
    };
}