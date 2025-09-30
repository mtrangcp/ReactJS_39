import React, { useState } from "react";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

const KEY_LC = "Products";

export default function Bai3() {
  const initList: Product[] = JSON.parse(localStorage.getItem(KEY_LC) || "[]");
  const [products, setProducts] = useState<Product[]>(initList);

  const [proAdd, setProAdd] = useState<Product>({
    id: 0,
    name: "",
    price: 0,
    description: "",
    imageUrl: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProAdd({ ...proAdd, [name]: name === "price" ? Number(value) : value });
  };

  // Upload ảnh lên Cloudinary
  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "mtrang_ss39"); // thay bằng preset của bạn
    formData.append("cloud_name", "dttookk0w"); // thay bằng cloud_name của bạn

    try {
      setIsUploading(true);
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dttookk0w/image/upload",
        formData
      );
      setProAdd({ ...proAdd, imageUrl: res.data.secure_url });
    } catch (err) {
      console.error("Upload error: ", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!proAdd.name.trim())
      newErrors.name = "Tên sản phẩm không được để trống";
    if (!proAdd.price || proAdd.price <= 0)
      newErrors.price = "Giá sản phẩm phải lớn hơn 0";
    if (!proAdd.description.trim())
      newErrors.description = "Mô tả không được để trống";
    if (!proAdd.imageUrl) newErrors.imageUrl = "Vui lòng upload ảnh sản phẩm";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newProduct: Product = {
      ...proAdd,
      id: Date.now(),
    };

    const updatedList = [...products, newProduct];
    setProducts(updatedList);
    localStorage.setItem(KEY_LC, JSON.stringify(updatedList));

    // reset form
    setProAdd({
      id: 0,
      name: "",
      price: 0,
      description: "",
      imageUrl: "",
    });
    setErrors({});
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) {
      const updatedList = products.filter((el) => el.id !== id);
      setProducts(updatedList);
      localStorage.setItem(KEY_LC, JSON.stringify(updatedList));
    }
  };

  return (
    <div className="ex3">
      <form onSubmit={handleAdd}>
        <h2>Quản lý sản phẩm</h2>

        <div className="item-input">
          <label>Tên sản phẩm</label>
          <input
            type="text"
            placeholder="Nhập tên sản phẩm"
            name="name"
            value={proAdd.name}
            onChange={handleChange}
            style={{ border: errors.name ? "1px solid red" : "" }}
          />
          {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
        </div>

        <div className="item-input">
          <label>Giá sản phẩm</label>
          <input
            type="number"
            placeholder="Nhập giá sản phẩm"
            name="price"
            value={proAdd.price || ""}
            onChange={handleChange}
            style={{ border: errors.price ? "1px solid red" : "" }}
          />
          {errors.price && <p style={{ color: "red" }}>{errors.price}</p>}
        </div>

        <div className="item-input">
          <label>Mô tả sản phẩm</label>
          <textarea
            placeholder="Nhập mô tả sản phẩm"
            name="description"
            value={proAdd.description}
            onChange={handleChange}
            style={{ border: errors.description ? "1px solid red" : "" }}
          />
          {errors.description && (
            <p style={{ color: "red" }}>{errors.description}</p>
          )}
        </div>

        <div className="item-input">
          <label>Ảnh sản phẩm</label>
          <input
            type="file"
            id="product-upload"
            className="product-file-input"
            onChange={handleUploadImage}
          />
          <label htmlFor="product-upload" className="upload-box-style">
            <span className="plus-sign">+</span>
            <span className="upload-text">
              {isUploading ? "Đang tải..." : "Upload"}
            </span>
          </label>
          {errors.imageUrl && <p style={{ color: "red" }}>{errors.imageUrl}</p>}
          {proAdd.imageUrl && (
            <img src={proAdd.imageUrl} alt="preview" width={100} />
          )}
        </div>

        <button type="submit">Thêm sản phẩm</button>
      </form>

      <div className="list-data">
        {products.map((el) => {
          return (
            <div className="item" key={el.id}>
              <img src={el.imageUrl} alt="img" width={100} />
              <div className="content">
                <h4>{el.name}</h4>
                <p>{el.description}</p>
                <p>
                  <b>{el.price} VND</b>
                </p>
              </div>
              <button onClick={() => handleDelete(el.id)}>Xóa</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
