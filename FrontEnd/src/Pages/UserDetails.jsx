import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/authInterceptor";
import { toast } from "react-toastify";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);

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
    role: "",
    hired: false,  // ✅ Added
  });



  // FETCH USER
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axiosInstance.get(`/user/show/${id}`);
        const u = res.data.user;

        console.log("the data" + u);
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
          role: u.role || "",
          hired: u.hired || false,  // ✅ This was missing
        });

        console.log(formData.role);

        setPreview(u.pic?.length ? u.pic[0].url : null);
      } catch (err) {
        toast.error("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [id]);


  //update the hired 
  const handleHired = async () => {
    try {
      const res = await axiosInstance.put(`/user/update/${id}`, {
        hired: true
      });

      if (res.status === 200) {
        toast.success("Technician hired successfully!");

        // 🔥 Update state so button disappears instantly
        setFormData((prev) => ({ ...prev, hired: true }));
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Something went wrong while updating profile");
    }
  };







  // READ-ONLY FIELD COMPONENT
  const DisplayField = ({ label, value }) => (
    <div>
      <label className="block text-gray-700 font-medium">{label} :</label>
      <p className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2">
        {value || "—"}
      </p>
    </div>
  );

  // DELETE USER
  const handleDelete = async () => {
    try {
      const res = await axiosInstance.delete(`/user/del/${id}`, { hired: true });
      if (res.status === 200) {
        toast.info("The account is deleted successfully");
        navigate(-1);
      }
    } catch (error) {
      toast.error("Error deleting account");
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="flex flex-col space-y-12 py-10 items-center bg-[#F2F0EF] w-full max-x-4xl px-4 scroll-smooth" >

      <div className="bg-[#BBBDBC] rounded-2xl p-4 border-gray-100 w-5/6 max-w-4xl">

        {/* IMAGE PREVIEW */}
        <div className="relative w-32 h-32 rounded-full border-2 border-gray-300 overflow-hidden mx-auto mb-6">
          {preview ? (
            <img src={preview} className="w-full h-full object-cover" alt="Profile" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              No Image
            </div>
          )}
        </div>


        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-6 my-8 mx-4">
          <DisplayField label="Name" value={formData.name} />
          <DisplayField label="Email" value={formData.email} />
          <DisplayField label="Phone" value={formData.phone} />
          <DisplayField label="Address" value={formData.address} />
          <DisplayField label="ZIP Code" value={formData.zip} />
          <DisplayField label="Date of Birth" value={formData.DOB} />


          {formData.role === "technician" &&
            <DisplayField
              label="Do you have a shop?"
              value={formData.shop ? "Yes" : "No"}
            />
          }


          {formData.role == "technician" &&
            formData.shop && (
              <DisplayField label="Shop Name" value={formData.shopName} />
            )}


          {formData.role === "technician" &&
            <DisplayField
              label="Do you have a qualification?"
              value={formData.qualification ? "Yes" : "No"}
            />
          }


          {formData.role === "technician" &&
            formData.qualification && (
              <DisplayField
                label="Qualification Name"
                value={formData.qualificationName}
              />
            )
          }

          {formData.role === "technician" &&
            <DisplayField label="Experience" value={formData.experience} />
          }

          {formData.role === "technician" &&
            <DisplayField label="Rating" value={formData.rating} />
          }
        </div>

        {/* BUTTONS */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-6 py-2 rounded-lg"
          >
            Delete
          </button>

          <button
            onClick={() => navigate(-1)}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg"
          >
            Go Back
          </button>


          {formData.role === "technician" && !formData.hired && (
            <button
              onClick={handleHired}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg"
            >
              Hired
            </button>
          )}


        </div>
      </div>
    </div>
  );
};

export default UserDetails;
