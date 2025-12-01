import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/authInterceptor";
import { store } from "../context/StoreProvider";

const UpdateProfile = () => {
  const { user } = useContext(store);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    zip: "",
    DOB: "",
    shop: false,
    shopName: "",
    qualification: false,
    qualificationName: "",
    experience: "",
    rating: "",
    image: "", 
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  // --------------------------------------------
  // 🔵 FETCH USER DATA
  // --------------------------------------------
  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.id) return;

      try {
        const res = await axiosInstance.get(`/user/show/${user.id}`);
        const u = res.data.user;

        setFormData({
          name: u.name || "",
          email: u.email || "",
          phone: u.phone || "",
          address: u.address || "",
          zip: u.zip || "",
          DOB: u.DOB ? u.DOB.split("T")[0] : "",
          shop: u.shop || false,
          shopName: u.shopName || "",
          qualification: u.qualification || false,
          qualificationName: u.qualificationName || "",
          experience: u.experience || "",
          rating: u.rating || "",
          image: "", // keep empty, only upload if new
        });

        setPreview(u.pic?.[0]?.url || null);
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user]);

  // --------------------------------------------
  // 🔵 HANDLE INPUTS
  // --------------------------------------------
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleRadio = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value === "true" }));
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  // --------------------------------------------
  // 🔵 SUBMIT FORM
  // --------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "image") return;  
      data.append(key, value);
    });

    if (formData.image instanceof File) data.append("image", formData.image);

    try {
      const res = await axiosInstance.put(`/user/update/${user.id}`, data);
      toast.success("Profile updated!");
      navigate("/lala");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="bg-[#BBBDBC] rounded-2xl p-4">
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* ---------- IMAGE UPLOADER ---------- */}
        <div className="relative w-32 h-32 rounded-full border-2 border-gray-300 mx-auto overflow-hidden group cursor-pointer">
          {preview ? (
            <img src={preview} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              Upload Image
            </div>
          )}

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 text-white flex items-center justify-center transition">
            Change Photo
          </div>

          <input type="file" accept="image/*" onChange={handleImage}
            className="absolute inset-0 opacity-0 cursor-pointer" />
        </div>

        {/* ---------- FORM FIELDS ---------- */}
        <div className="grid md:grid-cols-2 gap-6 my-6 mx-4">

          <Input label="Name" name="name" value={formData.name} onChange={handleChange} />
          <Input label="Email" name="email" value={formData.email} onChange={handleChange} />
          <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
          <Input label="Address" name="address" value={formData.address} onChange={handleChange} />
          <Input label="ZIP Code" name="zip" value={formData.zip} onChange={handleChange} />
          <Input label="Date of Birth" type="date" name="DOB" value={formData.DOB} onChange={handleChange} />

          {/* ---------- TECHNICIAN ONLY ---------- */}
          {user.role === "technician" && (
            <>
              <Radio label="Do you have a shop?" name="shop" value={formData.shop} onChange={handleRadio} />

              {formData.shop && (
                <Input label="Shop Name" name="shopName" value={formData.shopName} onChange={handleChange} />
              )}

              <Radio label="Do you have a qualification?" name="qualification" value={formData.qualification} onChange={handleRadio} />

              {formData.qualification && (
                <Input label="Qualification Name" name="qualificationName" value={formData.qualificationName} onChange={handleChange} />
              )}

              <Input label="Experience (years)" type="number" name="experience" value={formData.experience} onChange={handleChange} />
              <Input label="Rating" type="number" name="rating" value={formData.rating} onChange={handleChange} />
            </>
          )}
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-[#52AB98] hover:bg-[#328a77] text-white px-6 py-2 rounded-lg">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

const Input = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-gray-700 font-medium">{label} :</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
    />
  </div>
);

const Radio = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-gray-700 font-medium">{label}</label>
    <div className="flex gap-6">
      <label className="flex items-center gap-2">
        <input type="radio" name={name} value="true" checked={value === true} onChange={onChange} />
        Yes
      </label>
      <label className="flex items-center gap-2">
        <input type="radio" name={name} value="false" checked={value === false} onChange={onChange} />
        No
      </label>
    </div>
  </div>
);

export default UpdateProfile;
