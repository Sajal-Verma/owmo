import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/authInterceptor";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { store } from "../context/StoreProvider"

export default function Tab({ tabs }) {

  const navigate = useNavigate();

  //store the index of array of object
  const [activeIndex, setActiveIndex] = useState(0);

  const { logoutUser, user } = useContext(store);
  const [name, setName] = useState("");
  const [preview, setPreview] = useState(null);

  //API for logout
  const LogOutApi = async () => {
    try {
      const res = await axiosInstance.post("/user/logout");
      if (res.status === 200) {
        toast.success("✅ Logout successful!");
        logoutUser();
        navigate("/");
      } else {
        toast.error("❌ Logout failed. Try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Something went wrong in Logout.");
    }
  };


  //some information of the user
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;
      try {
        const res = await axiosInstance.get(`/user/show/${user.id}`);
        if (res.status !== 200) {
          toast.error(res.data?.message || "Failed to load user data");
          return;
        }

        const u = res.data.user;
        console.log(u);
        setName(u.name || "");
        setPreview(u.pic?.[0]?.url || null);
      } catch (err) {
        console.error("Error fetching user data:", err);
        toast.error("Something went wrong while loading data");
      }
    };
    fetchUserData();
  }, [user]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#F2F0EF]">
      <div className="grid md:grid-cols-[14rem_1fr] gap-6 w-5/6 max-w-4xl my-6">
        {/* Left Sidebar */}
        <div className="bg-[#BBBDBC] shadow-md rounded-md flex flex-col items-center p-4">
          {/* Top section */}
          <div className="flex flex-col items-center">
            {/* Avatar */}
            <img
              src={preview || "/default-avatar.png"}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover bg-gray-200"
            />
            {/* Username */}
            <h2 className="mt-2 text-[#2B6777] font-semibold">{name}</h2>
            <hr className="w-full border-gray-400 my-2" />
          </div>

          {/* Menu */}
          <div className="text-center space-y-1 text-black font-medium w-full m-2 h-40 overflow-y-auto hide-scrollbar rounded-xl drop-shadow-md">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-full p-2 text-left rounded-xl transition-colors flex justify-between ${activeIndex === index
                    ? "bg-[#cccfcd] font-semibold border border-[#3c8da3]"
                    : "bg-[#aeaeae] hover:bg-[#dddedd]"
                  }`}
              >
                <span>{tab.label}</span>
                <span className={activeIndex === index ? "text-[#3c8da3]" : "text-gray-700"}>
                  &gt;
                </span>
              </button>

            ))}
          </div>

          {/* Logout */}
          <button className="mt-4 text-green-700 font-semibold hover:underline" onClick={() => LogOutApi()}>
            Log Out
          </button>
            {/* 
          <Link
            to="/Request"
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 w-full text-center"
          >
            Book a Repair
          </Link>
            */}
        </div>

        {/* Right Content */}
        <div className="bg-white rounded-2xl h-96 shadow-lg overflow-y-auto hide-scrollbar">
          {tabs[activeIndex].content}
        </div>
      </div>
    </div>
  );
}
