import React from "react";

const Home = () => {
  return <div>Home</div>;
};

export default Home;

/* ]

"use client";
import React, { useState } from "react";
import { TextField, Button } from "@mui/material";

const Home: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageBase64, setImageBase64] = useState<string>("");

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const base64 = await convertToBase64(file);
      setImageBase64(base64 as string);
    }
  };

  const convertToBase64 = (
    file: File
  ): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
  };

  return (
    <div>
      <TextField
        label="Image URL"
        variant="outlined"
        fullWidth
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <Button variant="contained" component="label">
        Upload Image
        <input type="file" hidden onChange={handleFileChange} />
      </Button>
      <div>
        {imageUrl && <img src={imageUrl} alt="From URL" />}
        {imageBase64 && <img src={imageBase64} alt="From Base64" />}
      </div>
    </div>
  );
};

export default Home;
 */
