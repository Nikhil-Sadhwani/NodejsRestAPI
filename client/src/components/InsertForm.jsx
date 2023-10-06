// Hooks
import React, { useContext, useEffect, useState } from "react";

// Axios for integrate backend with frontend
import axios from "axios";

// For navigation and to fetch query parameter
import { useNavigate, useParams } from "react-router-dom";

// Contexts
import LogContext from "../context/logState/LogContext";
import AlertContext from "../context/alertState/AlertContext";

export default function InsertForm() {
  // Object of contexts
  const LogObj = useContext(LogContext);
  const AlertObj = useContext(AlertContext);

  // variables and object
  const [prevImg, setPrevImg] = useState("");
  const [inputs, setInputs] = useState({
    user_name: "",
    user_email: "",
    user_password: "",
    password_confirmation: "",
    user_image: "",
    total_orders: null,
  });

  // Navigate to use push page in stack
  const navigate = useNavigate();

  // Query parameter
  const { userid } = useParams();

  useEffect(() => {
    // eslint-disable-next-line
    // set data when we want to update details
    if (userid) {
      getData();
    }
  }, []);

  // Fetch the details of individual customer from the database
  const getData = async () => {
    await axios
      .get(`http://localhost:8080/users/details/${userid}`)
      .then((response) => {
        setInputs(response.data);
        setPrevImg(response.data.user_image);
      })
      .catch((err) => console.log(err));
  };

  // Storing input values in object
  const handleChange = (e) => {
    let name = e.target.name;
    if (name !== "user_image") {
      setInputs((values) => ({ ...values, [name]: e.target.value }));
    } else {
      setInputs((values) => ({ ...values, [name]: e.target.files[0] }));
    }
  };

  // Call Update and Insert API , also check the fields are empty or not
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputs.user_name !== "") {
      if (inputs.user_email !== "") {
        if (/.+@.+\.[A-Za-z]+$/.test(inputs.user_email)) {
          if (inputs.user_password !== "" && !userid) {
            if (inputs.password_confirmation !== "" && !userid) {
              if (
                inputs.password_confirmation === inputs.user_password &&
                !userid
              ) {
                if (inputs.total_orders !== null) {
                  if (inputs.user_image !== "") {
                    const formData = new FormData();
                    formData.append("user_image", inputs.user_image);
                    formData.append("user_name", inputs.user_name);
                    formData.append("user_email", inputs.user_email);
                    formData.append("user_password", inputs.user_password);
                    formData.append("total_orders", inputs.total_orders);

                    axios("http://localhost:8080/users/insert", {
                      headers: {
                        "Content-Type": "multipart/form-data",
                        "x-access-token": LogObj.cookies.token,
                      },
                      method: "POST",
                      data: formData,
                    })
                      .then((response) => {
                        if (
                          response.data.message === "Email is already exists" ||
                          response.data.message ===
                            "Failed to authenticate because Token is not passed" ||
                          response.data.message === "Failed to authenticate"
                        ) {
                          AlertObj.showAlert(
                            response.data.message,
                            "Warning",
                            "yellow"
                          );
                        } else {
                          AlertObj.showAlert(
                            response.data.message,
                            "Success",
                            "green"
                          );
                          navigate("/");
                        }
                      })
                      .catch((err) => console.log(err));
                  } else {
                    AlertObj.showAlert(
                      "Empty image is not acceptable",
                      "Warning",
                      "yellow"
                    );
                  }
                } else {
                  AlertObj.showAlert(
                    "Total order field is empty",
                    "Warning",
                    "yellow"
                  );
                }
              } else {
                AlertObj.showAlert(
                  "Password is not equals to Password Confirmation",
                  "Warning",
                  "yellow"
                );
              }
            } else {
              AlertObj.showAlert(
                "Password Confirmation field is empty",
                "Warning",
                "yellow"
              );
            }
          } else if (userid) {
            const formData = new FormData();
            formData.append("user_image", inputs.user_image);
            formData.append("user_name", inputs.user_name);
            formData.append("user_email", inputs.user_email);
            formData.append("total_orders", inputs.total_orders);

            formData.append("user_id", inputs.user_id);
            axios("http://localhost:8080/users/update", {
              headers: {
                "Content-Type": "multipart/form-data",
                "x-access-token": LogObj.cookies.token,
              },
              method: "PUT",
              data: formData,
            })
              .then((response) => {
                if (
                  response.data.message ===
                    "Failed to authenticate because Token is not passed" ||
                  response.data.message === "Failed to authenticate"
                ) {
                  AlertObj.showAlert(
                    response.data.message,
                    "Warning",
                    "yellow"
                  );
                } else {
                  AlertObj.showAlert(response.data, "Success", "green");
                  navigate(`/details/${userid}`);
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
    } else {
      AlertObj.showAlert("Full Name field is empty", "Warning", "yellow");
    }
  };

  return (
    <div className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
      <div className="max-w-xl lg:max-w-3xl p-[15px] shadow-md shadow-gray-500">
        <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
          {/* Handle update and insert form in one component  */}

          {userid ? "Update Customer Details" : "Insert Customer Details"}
        </h1>

        <form
          className="mt-8 grid grid-cols-6 gap-6"
          encType="multipart/form-data"
        >
          <div className="col-span-6">
            <label
              htmlFor="FullName"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>

            <input
              value={inputs.user_name}
              id="fullname"
              type="text"
              name="user_name"
              onChange={(e) => handleChange(e)}
              className="mt-1 w-full h-[30px] border rounded-md border-black bg-white  text-sm text-gray-700 shadow-sm"
            />
          </div>

          <div className="col-span-6">
            <label
              htmlFor="Email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              value={inputs.user_email}
              type="email"
              id="email"
              name="user_email"
              onChange={(e) => handleChange(e)}
              className="mt-1 w-full h-[30px] border rounded-md border-black bg-white text-sm text-gray-700 shadow-sm"
            />
          </div>

          {userid ? (
            <></>
          ) : (
            <>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="Password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>

                <input
                  value={inputs.user_password}
                  id="password"
                  type={userid ? "text" : "password"}
                  name="user_password"
                  onChange={(e) => handleChange(e)}
                  className="mt-1 w-full h-[30px] border  rounded-md border-black bg-white text-sm text-gray-700 shadow-sm"
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="PasswordConfirmation"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password Confirmation
                </label>

                <input
                  type={userid ? "text" : "password"}
                  name="password_confirmation"
                  id="passwordconfirm"
                  onChange={(e) => handleChange(e)}
                  className="mt-1 w-full h-[30px] border  rounded-md border-black bg-white text-sm text-gray-700 shadow-sm"
                />
              </div>
            </>
          )}

          <div className="col-span-6">
            <label
              htmlFor="totalorder"
              className="block text-sm font-medium text-gray-700"
            >
              Total Order
            </label>

            <input
              value={inputs.total_orders}
              type="text"
              id="totalorder"
              name="total_orders"
              onChange={(e) => handleChange(e)}
              className="mt-1 w-full h-[30px] border  rounded-md border-black bg-white text-sm text-gray-700 shadow-sm"
            />
          </div>

          {/* If we want to open the form for updation then it appears  */}
          {userid ? (
            <div className="col-span-6">
              <img
                src={`http://localhost:8080/Images/${prevImg}`}
                alt="Loading..."
                className="w-[200px] h-[200px]"
              />
            </div>
          ) : (
            <></>
          )}
          <div className="col-span-6">
            <label
              className="block mb-2 text-sm font-medium text-gray-900  "
              htmlFor="file_input"
            >
              Upload file
            </label>
            <input
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none "
              aria-describedby="file_input_help"
              id="file_input"
              type="file"
              name="user_image"
              onChange={(e) => handleChange(e)}
            />
            <p className="mt-1 text-sm text-gray-500" id="file_input_help">
              SVG, PNG, JPG, JPEG or GIF .
            </p>
          </div>

          <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
            <button
              className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
              onClick={(e) => handleSubmit(e)}
            >
              {userid ? "Update" : "Create an account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
