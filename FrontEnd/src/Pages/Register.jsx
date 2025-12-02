import { useState } from "react";
import OwmoLog from '../assets/image/owmo.png';
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";


import axiosInstance from "../api/axios";


//ok ok ok ok ok
export default function Register() {

  const navgation = useNavigate();
  const [loading, setLoading] = useState(false);


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });



  const [errors, setErrors] = useState({});

  // Handle change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validation rules
  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    return newErrors;
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      RegisterApi();
    }
  };

  // Handle clear
  const handleClear = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "user",
    });
    setErrors({});
  };

  //api handel

  const RegisterApi = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/user/register", formData);
      console.log(res);

      if (res.status === 201) {
        toast.success("Registration successful! Please login.");
        handleClear();
        navgation("/login");
        if (res.status === 400) {
          toast.info("User already exists with this email");
          handleClear();
        }
      } else {
        toast.error("Registration failed. Try again.");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F2F0EF] px-4">
      <div className="flex flex-col md:flex-row bg-[#BBBDBC] rounded-lg shadow-lg w-5/6 max-w-4xl overflow-hidden">

        {/* Left Section */}
        <div className="bg-[#52AB98] text-white flex flex-col items-center justify-center md:w-1/2 w-full p-6 md:rounded-l-lg">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Link to={"/"}>
                <img
                  src={OwmoLog}
                  alt="logo"
                  className="w-38"
                />
              </Link>
            </div>
            <p className="text-3xl">Register once</p>
            <p className="text-2xl">Repair smarter forever</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Create an Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name */}
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full px-3 py-2 border rounded-full bg-gray-100 focus:outline-none focus:ring focus:ring-teal-300"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-3 py-2 border rounded-full bg-gray-100 focus:outline-none focus:ring focus:ring-teal-300"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full px-3 py-2 border rounded-full bg-gray-100 focus:outline-none focus:ring focus:ring-teal-300"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-3 py-2 border rounded-full bg-gray-100 focus:outline-none focus:ring focus:ring-teal-300"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full px-3 py-2 border rounded-full bg-gray-100 focus:outline-none focus:ring focus:ring-teal-300"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Role */}
            <div className="flex items-center justify-around">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={formData.role === "user"}
                  onChange={handleChange}
                  className="cursor-pointer"
                />
                <span>User</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="role"
                  value="technician"
                  checked={formData.role === "technician"}
                  onChange={handleChange}
                  className="cursor-pointer"
                />
                <span>Technician</span>
              </label>
            </div>
            {errors.role && (
              <p className="text-red-500 text-sm text-center">{errors.role}</p>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 rounded-full flex items-center justify-center gap-2
    ${loading ? "bg-teal-200 cursor-not-allowed text-black" : "bg-teal-600 text-white hover:bg-teal-700"}`}
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    >
                      <Loader2 className="w-5 h-5" />
                    </motion.div>
                    Processing...
                  </>
                ) : (
                  "Submit"
                )}
              </button>


              <button
                onClick={handleClear}
                type="button"
                className="px-6 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 cursor-pointer"
              >
                Clear
              </button>
            </div>

            {/* <div className="flex justify-center mt-4">
              <button
                type="button"
                className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700"
              >
                Google
              </button>
            </div> */}

            <p className="text-center text-sm mt-2">
              Have you any account?{" "}
              <Link to={"/login"} className="text-teal-600 font-medium">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
