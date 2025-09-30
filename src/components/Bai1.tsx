import axios from "axios";
import React, { useState } from "react";

export default function Bai1() {
  const [file, setFile] = useState<null>(null);
  const [imgRes, setImgRes] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files[0]);
  };

  const handleClick = async () => {
    if (!file) {
      alert("Vui long chon file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "mtrang_ss39");
    formData.append("cloud_name", "dttookk0w");

    try {
      setIsLoading(true);
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dttookk0w/image/upload",
        formData
      );
      console.log("Res: ", res);

      if (res.status === 200) {
        setImgRes(res.data.secure_url);
      }
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ss1-ctn">
      <div className="ss1">
        <input type="file" onChange={handleChangeFile} />

        <button onClick={handleClick}>Upload</button>
      </div>
      {isLoading ? <div>Dang tai anh....</div> : <img src={imgRes} alt="anh" />}
    </div>
  );
}
