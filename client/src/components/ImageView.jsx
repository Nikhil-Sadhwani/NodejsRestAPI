// Hooks
import React, { useEffect, useState } from "react";

// Axios for integrate backend with frontend
import axios from "axios";

// fetch query parameter
import { useParams } from "react-router-dom";

export default function ImageView() {
  // Query parameter
  const { id } = useParams();

  // Variables
  const [image, setImage] = useState("");

  useEffect(() => {
    // eslint-disable-next-line
    // fetch and set the image name in variable
    axios
      .get(`http://localhost:8080/users/image/${id}`)
      .then((response) => {
        setImage(response.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <div className="flex justify-center items-center h-[100vh] bg-black bg-opacity-[0.5]">
        <img
          src={`http://localhost:8080/Images/${image}`}
          alt="Loading..."
          className="w-[90%] h-[90%]"
        />
      </div>
    </>
  );
}
