// Hooks
import React, { useContext, useEffect, useState } from "react";

// For navigation
import { Link, useNavigate } from "react-router-dom";

// Axios for integrate backend with frontend
import axios from "axios";

// Contexts
import LogContext from "../context/logState/LogContext";
import AlertContext from "../context/alertState/AlertContext";

export default function AllCustomers() {
  // Objct of context
  const LogObj = useContext(LogContext);
  const AlertObj = useContext(AlertContext);

  // Navigate to use push page in stack
  const navigate = useNavigate();

  // variables
  const [data, setData] = useState([]);

  useEffect(() => {
    getAllData();
    // eslint-disable-next-line
  }, []);

  // Fetch all customers from the database
  async function getAllData() {
    await axios
      .get("http://localhost:8080/users")
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => console.log(err));
  }

  // Manage cookies after logout
  const handleLogout = () => {
    LogObj.handleCookies(null);
    AlertObj.showAlert("Log out successful", "Success", "green");
    navigate("/login");
  };

  return (
    <>
      {/* Button for Login and Logout*/}
      {!LogObj.cookies["token"] ? (
        <Link
          to="/login"
          className="bg-black text-white absolute top-[20px] left-[20px] text-[18px] px-[5px] hover:bg-white hover:text-black"
          style={{ border: "2px solid black", borderRadius: "10px" }}
        >
          Log in
        </Link>
      ) : (
        <button
          className="bg-black text-white absolute top-[20px] left-[20px] text-[18px] px-[5px] hover:bg-white hover:text-black"
          style={{ border: "2px solid black", borderRadius: "10px" }}
          onClick={handleLogout}
        >
          Log out
        </button>
      )}
      <div className="relative top-[100px]">
        <h2 className="h-[61px] text-5xl font-extrabold text-center text-black  mb-7">
          Customers List
        </h2>
        <div
          className="overflow-x-auto p-5 shadow-lg w-[98%] m-auto "
          style={{ border: "2px solid #ebdcdc" }}
        >
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead className="ltr:text-left rtl:text-right">
              <tr>
                <th className=" whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Customer Name
                </th>
                <th className=" whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Email
                </th>
                <th className=" whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Total Order
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {/* Loop to show all users info */}
              {data.map((user, key) => {
                if (user.user_name !== "admin") {
                  return (
                    <>
                      <tr
                        key={key}
                        className="odd:bg-gray-50 hover:bg-gray-200 cursor-pointer"
                        onClick={() => navigate(`/details/${user.user_id}`)}
                      >
                        <td className="text-center whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                          {user.user_name}
                        </td>
                        <td className="text-center whitespace-nowrap px-4 py-2 text-gray-700">
                          {user.user_email}
                        </td>
                        <td className="text-center whitespace-nowrap px-4 py-2 text-gray-700">
                          {user.total_orders}
                        </td>
                      </tr>
                    </>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Button for insert new customer  */}
      <Link
        to="/createcustomer"
        className="bg-white text-black absolute bottom-[20px] right-[20px] text-[21px] p-[10px] hover:bg-black hover:text-white"
        style={{ border: "2px solid black", borderRadius: "10px" }}
      >
        New Customer
      </Link>
    </>
  );
}
