import { useSelector, useDispatch } from "react-redux";
import { saveMedicineDoseAction, removeMedicineDoseAction, savePatientMedicineDoseAction } from "../redux/actions";

const Doses = () => {
  const dispatch = useDispatch();
  const medicines = useSelector((state) => state.medicine);
  const dosage = useSelector((state) => state.dose);

  const renderTable = () => {
    if (!medicines || Object.keys(medicines).length === 0) {
      return (
        <p></p>
      );
    }

    return (
      <table className="w-full text-left">
        <thead className="font-bold">
          <tr>
            <td className="px-4 py-2">Medicine</td>
            <td className="px-4 py-2">Dose</td>
          </tr>
        </thead>
        <tbody>
          {Object.keys(medicines).map((id) => {
            const dose = dosage[id] ? dosage[id].dose : "";
            return (
              <tr key={id}>
                <td className="border px-4 py-2">{medicines[id].name}</td>
                <td className="border px-4 py-2">
                  <input
                    type="text"
                    className="border rounded-md px-3 py-2 w-full"
                    placeholder="Enter dose"
                    value={dose}
                    onChange={(e) => updateDose(id, e.target.value)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const updateDose = (id, dose) => {
    if (dose === "") {
      dispatch(removeMedicineDoseAction(id));
    } else {
      const updatedDosage = {
        ...dosage,
        [id]: {
          ...medicines[id],
          dose: dose,
        },
      };
  
      dispatch(saveMedicineDoseAction(id, updatedDosage[id]));
      dispatch(savePatientMedicineDoseAction(id, updatedDosage[id]));
    }
  };

  return (
    <div className="p-4">
      {medicines && Object.keys(medicines).length > 0 &&
        <h1 className="font-bold text-2xl mb-4">Medicine Doses</h1>
      }
      {renderTable()}
    </div>
  );
};

export default Doses;   
