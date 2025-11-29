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
    image: "", // can hold either URL or File object
  });

  const [preview, setPreview] = useState(null); // ✅ for image preview
  const [loading, setLoading] = useState(true);

  // ✅ Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;
      try {
        const res = await axiosInstance.get(`/user/show/${user.id}`);
        if (res.status !== 200) {
          toast.error(res.data?.message || "Failed to load user data");
          setLoading(false);
          return;
        }

        const u = res.data.user;
        console.log(u);
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
        });
        setPreview(u.pic[0].url || null);
      } catch (err) {
        console.error("Error fetching user data:", err);
        toast.error("Something went wrong while loading data");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    console.log(e.target);
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle radio buttons
  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value === "true" }));
  };

  // ✅ Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file)); // temporary preview URL
    }
  };

  // ✅ Submit updated profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      // Append primitive fields explicitly so their form-names are guaranteed
      data.append("name", formData.name || "");
      data.append("email", formData.email || "");
      data.append("phone", formData.phone || "");
      data.append("address", formData.address || "");
      data.append("zip", formData.zip || "");
      data.append("DOB", formData.DOB || "");
      data.append("shop", String(formData.shop)); // send booleans as strings or 0/1 based on backend
      data.append("shopName", formData.shopName || "");
      data.append("qualification", String(formData.qualification));
      data.append("qualificationName", formData.qualificationName || "");
      data.append("experience", formData.experience || "");
      data.append("rating", formData.rating || "");

      // Append the image only if it's a File (new upload). If image is a URL string (existing),
      // skip or include a different field depending on your backend API.
      if (formData.image && formData.image instanceof File) {
        // 'image' must match the field name your backend expects (e.g. 'image' or 'pic')
        console.log("image"+formData.image);
        data.append("image", formData.image);
      } else {
        // Optionally, if backend needs the existing url, append it as another field:
        // data.append("existingImage", formData.image || "");
      }

      // === Debug: inspect FormData contents in console ===
      // (FormData doesn't let you console.log the object directly; iterate entries)
      for (const pair of data.entries()) {
        console.log(pair[0], pair[1]);
      }

      // IMPORTANT: Do NOT set Content-Type manually.
      // Let the browser set the correct multipart boundary header.
      const res = await axiosInstance.put(`/user/update/${user.id}`, data /*, no headers */);

      if (res.status === 200) {
        toast.success("Profile updated successfully!");
        navigate("/lala");
      } else {
        toast.error(res.data?.message || "Update failed");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Something went wrong while updating profile");
    }
  };


  if (loading) return <div className="text-center text-gray-500 p-6">Loading...</div>;

  return (
    <div className="bg-[#BBBDBC]  rounded-2xl p-4 border-gray-100">

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* ✅ File input + Preview */}
        <div className="relative w-32 h-32 rounded-full border-2 border-gray-300 overflow-hidden group cursor-pointer mx-auto ">
          {/* 🖼️ Show image or placeholder */}
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              Upload Image
            </div>
          )}

          {/*Transparent overlay on hover */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Change Photo
          </div>

          {/*Hidden input covering entire image */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 my-8 mx-4">
        {/* ✅ Basic Fields */}
        <InputField label="Name" name="name" value={formData.name} onChange={handleChange} />
        <InputField label="Email" name="email" value={formData.email} onChange={handleChange} />
        <InputField label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
        <InputField label="Address" name="address" value={formData.address} onChange={handleChange} />
        <InputField label="ZIP Code" name="zip" value={formData.zip} onChange={handleChange} />
        <InputField label="Date of Birth" name="DOB" type="date" value={formData.DOB} onChange={handleChange} />

        {/* ✅ Technician-only fields */}
        {user.role === "technician" && (
          <>
            <RadioGroup
              label="Do you have a shop?"
              name="shop"
              value={formData.shop}
              onChange={handleRadioChange}
            />
            {formData.shop && (
              <InputField
                label="Shop Name"
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
              />
            )}

            <RadioGroup
              label="Do you have a qualification?"
              name="qualification"
              value={formData.qualification}
              onChange={handleRadioChange}
            />
            {formData.qualification && (
              <InputField
                label="Qualification Name"
                name="qualificationName"
                value={formData.qualificationName}
                onChange={handleChange}
              />
            )}

            <InputField
              label="Experience (years)"
              name="experience"
              type="number"
              value={formData.experience}
              onChange={handleChange}
            />
            <InputField
              label="Rating"
              name="rating"
              type="number"
              value={formData.rating}
              onChange={handleChange}
            />
          </>
        )}
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-[#52AB98] hover:bg-[#328a77] text-white font-medium py-2 px-6 rounded-lg transition-all duration-200"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

// ✅ Input Field
const InputField = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-gray-700 font-medium">{label} :</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
    />
  </div>
);

// ✅ Radio Group
const RadioGroup = ({ label, name, value, onChange }) => (
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
