// Hooks
import React, { useContext, useEffect, useState } from "react";

// Axios for integrate backend with frontend
import axios from "axios";

// For navigation and to fetch query parameter
import { useNavigate, useParams } from "react-router-dom";

// Contexts
import AlertContext from "../context/alertState/AlertContext";

export default function CustomerDetails() {
  // Object of Context
  const AlertObj = useContext(AlertContext);

  // Variables
  const [fetchData, setFetchData] = useState([]);
  const [imageShow, setImageShow] = useState(false);

  // Navigate to use push page in stack
  const navigate = useNavigate();

  // Query parameter
  const { id } = useParams();

  useEffect(() => {
    // eslint-disable-next-line
    getData();
    setImageShow(false);
  }, []);

  // Fetch the details of individual customer from the database
  const getData = async () => {
    await axios
      .get(`http://localhost:8080/users/details/${id}`)
      .then((response) => {
        setFetchData(response.data);
      })
      .catch((err) => console.log(err));
  };

  // Delete the data
  const handleDelete = async () => {
    await axios
      .delete(`http://localhost:8080/users/delete/${id}`)
      .then((response) => {
        AlertObj.showAlert(response.data, "Success", "green");
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {/* Image View   */}
      <div
        className={`absolute flex flex-col justify-center items-center w-[100%] h-[100vh] bg-black bg-opacity-[0.8] 
        p-[30px] sm:p-[100px]
          ${imageShow ? "" : "hidden"}
        `}
      >
        <div className="text-left w-[100%] ml-3 mb-[10px]">
          <button
            className=" inline-block shrink-0 rounded-md border  px-12 py-3 text-sm font-medium text-white transition "
            onClick={() => setImageShow(false)}
          >
            Back
          </button>
        </div>

        <img
          src={`http://localhost:8080/Images/${fetchData.user_image}`}
          alt="Loading..."
          className="w-[100%] h-[90%] sm:h-[100%] 2xl:w-[50%] 2xl:h-[95%]"
        />
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg border">
        <div className=" px-4 py-5 sm:px-6">
          <img
            src={`http://localhost:8080/Images/${fetchData.user_image}`}
            alt="Loading..."
            className="w-[200px] h-[200px]"
          />
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <h2 className="text-sm font-medium text-gray-500">Full name</h2>
              <p className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {fetchData.user_name}
              </p>
            </div>
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <h2 className="text-sm font-medium text-gray-500">
                Email address
              </h2>
              <p className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {fetchData.user_email}
              </p>
            </div>

            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <h2 className="text-sm font-medium text-gray-500">
                Total Orders
              </h2>
              <p className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {fetchData.total_orders}
              </p>
            </div>
          </dl>
        </div>
      </div>
      <div className="col-span-6 mt-2 mx-2 sm:flex sm:items-center sm:gap-4">
        <button
          className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500 m-[10px]"
          onClick={() => navigate(`/createcustomer/${id}`)}
        >
          Edit
        </button>
        <button
          className="inline-block shrink-0 rounded-md border border-red-600 bg-red-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-red-600 focus:outline-none focus:ring active:text-red-500 m-[10px]"
          onClick={handleDelete}
        >
          Delete
        </button>
        <button
          className="inline-block shrink-0 rounded-md border border-black bg-black px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-black focus:outline-none focus:ring active:text-black m-[10px]"
          onClick={() => setImageShow(true)}
        >
          View Image
        </button>
      </div>
    </>
  );
}
