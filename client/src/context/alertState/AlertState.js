import { useState } from "react";
import AlertContext from "./AlertContext";

const AlertState = (props) => {
  const [alert, setAlert] = useState(null);

  // Set the message, type and color of alert
  const showAlert = (message, type, colo) => {
    setAlert({
      message: message,
      type: type,
      colo: colo,
    });

    // remove the alert after some time
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };
  return (
    <AlertContext.Provider value={{ alert, showAlert }}>
      {props.children}
    </AlertContext.Provider>
  );
};

export default AlertState;