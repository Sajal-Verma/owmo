import { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/authInterceptor";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export default function Tab({ tabs }) {

  const navigate = useNavigate();

  //store the index of array of object
  const [activeIndex, setActiveIndex] = useState(0);


  //API for logout
  const LogOutApi = async () => {
    try {
      const res = await axiosInstance.post("/user/logout");

      if (res.status === 200) {
        toast.success("✅ Logout successful!");

        // Remove user cookie
        Cookies.remove("user", { path: "/" });

        // Redirect to home/dashboard
        navigate("/"); // make sure navigate is imported from react-router-dom
      } else {
        toast.error("❌ Logout failed. Try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Something went wrong in Logout.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#F2F0EF]">
      <h1>Dasboard</h1>
      <div className="flex flex-col md:flex-row gap-6 w-5/6 max-w-4xl">
        {/* Left Sidebar */}
        <div className="w-full md:w-56 bg-[#BBBDBC] shadow-md rounded-md flex flex-col items-center p-4">
          {/* Top section */}
          <div className="flex flex-col items-center">
            {/* Avatar */}
            <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center">
              <span className="text-2xl text-gray-700">👤</span>
            </div>

            {/* Username */}
            <h2 className="mt-2 text-[#2B6777] font-semibold">Username</h2>
            <hr className="w-full border-gray-400 my-2" />
          </div>

          {/* Menu */}
          <div className="text-center space-y-1 text-black font-medium w-full m-2">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-full p-2 text-left rounded-xl transition-colors bg-[#aeaeae] flex flex-row justify-between ${activeIndex === index
                  ? "bg-[#cccfcd] font-semibold border-1 border-[#3c8da3]"
                  : "hover:bg-[#dddedd]"
                  }`}
              >
                <div>
                  {tab.label}
                </div>
                <div className={` rounded-xl size-6 text-center ${activeIndex === index
                  ? "bg-[#cccfcd] font-semibold text-[#3c8da3]"
                  : "hover:bg-[#dddedd]"
                  }`}>
                  &gt;
                </div>
              </button>
            ))}
          </div>

          {/* Logout */}
          <button className="mt-4 text-green-700 font-semibold hover:underline" onClick={() => LogOutApi()}>
            Log Out
          </button>

          {/* Repair Button */}
          <Link
            to="/Request"
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 w-full text-center"
          >
            Book a Repair
          </Link>
        </div>

        {/* Right Content */}
        <div className="bg-amber-950 shadow-md rounded-md p-4 flex-1 overflow-y-auto scrollbar-hide">
          {tabs[activeIndex].content}
        </div>
      </div>
    </div>
  );
}
