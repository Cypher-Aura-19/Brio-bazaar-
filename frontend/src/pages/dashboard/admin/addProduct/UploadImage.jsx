import React, { useState } from "react";
import axios from "axios";
//for admin
const UploadImage = ({ name, setImage }) => {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const uploadSingleImage = (base64) => {
    const timestamp = Date.now();
    console.log("Uploading image at timestamp:", timestamp);
    console.log("Image Base64 Length:", base64.length);

    setLoading(true);
    axios
      .post("http://localhost:5000/uploadImage", { image: base64, timestamp })
      .then((res) => {
        const imageUrl = res.data;
        setUrl(imageUrl);
        alert("Image uploaded successfully");
        setImage(imageUrl);
      })
      .catch((error) => {
        console.error("Error uploading image:", error.response?.data || error.message);
      })
      .finally(() => setLoading(false));
  };

  const uploadImage = async (event) => {
    const files = event.target.files;

    if (files.length === 1) {
      const base64 = await convertBase64(files[0]);
      uploadSingleImage(base64);
      return;
    }

    const base64s = [];
    for (let i = 0; i < files.length; i++) {
      const base = await convertBase64(files[i]);
      base64s.push(base);
    }

    // Handle multiple image uploads if needed
  };

  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-400"
      >
        Image
      </label>
      <input
        onChange={uploadImage}
        name={name}
        id={name}
        type="file"
        className="border rounded-md px-3 py-2 bg-black text-white border border-gray-700 focus:outline-none focus:ring-2 "
      />
      {loading && (
        <div className="mt-2 text-sm text-gray-400">
          <p>Uploading...</p>
        </div>
      )}
      {url && (
        <div className="mt-2 text-sm text-green-600">
          <p>Image uploaded successfully!</p>
          <img
            src={url}
            alt="Uploaded"
            className="mt-2 max-h-48 w-auto rounded-lg border border-gray-700 shadow-md"
          />
        </div>
      )}
    </div>
  );
};

export default UploadImage;
