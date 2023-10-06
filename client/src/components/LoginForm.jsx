// Hooks
import React, { useContext, useState } from "react";

// For navigation and to fetch query parameter
import { useNavigate } from "react-router-dom";

// Axios for integrate backend with frontend
import axios from "axios";

// Contexts
import LogContext from "../context/logState/LogContext";
import AlertContext from "../context/alertState/AlertContext";

export default function LoginForm() {
  // Object of contexts
  const LogObj = useContext(LogContext);
  const AlertObj = useContext(AlertContext);

  // Navigate to use push page in stack
  const navigate = useNavigate();

  // variables and object
  const [input, setInput] = useState({
    user_email: "",
    user_password: "",
  });

  // Storing input values in object
  const handleChange = (e) => {
    setInput((values) => ({ ...values, [e.target.name]: e.target.value }));
  };

  // Call the Login API and check the fields are empty or not
  const handleLogin = () => {
    if (input.user_email !== "") {
      if (/.+@.+\.[A-Za-z]+$/.test(input.user_email)) {
        if (input.user_password !== "") {
          axios
            .post("http://localhost:8080/users/login", input)
            .then((response) => {
              if (
                response.data.message === "User is not exists" ||
                response.data.message === "Incorrct Password"
              ) {
                AlertObj.showAlert(response.data.message, "Warning", "yellow");
              } else {
                AlertObj.showAlert(response.data.message, "Success", "green");
                LogObj.handleCookies(response.data);
                navigate("/");
              }
            })
            .catch((err) => console.log(err));
        } else {
          AlertObj.showAlert("Password field is empty", "Warning", "yellow");
        }
      } else {
        AlertObj.showAlert("Email syntax is invalid", "Warning", "yellow");
      }
    } else {
      AlertObj.showAlert("Email field is empty", "Warning", "yellow");
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="w-full max-w-xs">
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-center mb-4 text-[32px] font-bold">Login</h2>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="email"
                name="user_email"
                placeholder="Email"
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="password"
                name="user_password"
                placeholder="******************"
                onChange={(e) => handleChange(e)}
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={handleLogin}
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
