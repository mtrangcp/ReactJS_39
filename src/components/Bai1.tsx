import axios from "axios";
import React, { useState } from "react";

export default function Bai1() {
  const [files, setFiles] = useState<File[]>([]);
  const [imgReses, setImgRes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      setFiles(Array.from(fileList));
    }
  };

  const handleClick = async () => {
    if (files.length === 0) {
      alert("Vui long chon file");
      return;
    }

    try {
      setIsLoading(true);

      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "mtrang_ss39");
        formData.append("cloud_name", "dttookk0w");

        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dttookk0w/image/upload",
          formData
        );

        return res.data.secure_url;
      });

      const results = await Promise.all(uploadPromises);
      setImgRes(results);
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ss1-ctn">
      <div className="ss1">
        <input type="file" multiple onChange={handleChangeFile} />

        <button onClick={handleClick}>Upload</button>
      </div>
      {isLoading ? (
        <div>Dang tai anh....</div>
      ) : (
        <div>
          {imgReses.map((url, idx) => (
            <img key={idx} src={url} alt={`anh-${idx}`} width={200} />
          ))}
        </div>
      )}
    </div>
  );
}
