import { useState, useEffect } from "react";
import OwmoLog from "../assets/image/owmo.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../api/axios";

export default function ForgotPassword() {
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const [errors, setErrors] = useState({});
  const [pop, setPop] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown
  const navigate = useNavigate();

  // ----------------- OTP Timer -----------------
  useEffect(() => {
    if (!pop) return; // Timer starts only when popup opens

    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [pop, timeLeft]);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // ------------------------------------------------

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.emailOrPhone) {
      newErrors.emailOrPhone = "Email or phone is required";
    } else if (
      !/\S+@\S+\.\S+/.test(formData.emailOrPhone) &&
      !/^\d{10}$/.test(formData.emailOrPhone)
    ) {
      newErrors.emailOrPhone = "Enter valid email or 10-digit phone number";
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

    return newErrors;
  };

  // Step 1 → Send OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    try {
      const res = await axiosInstance.post("/user/createOtp", {
        emailOrPhone: formData.emailOrPhone,
      });
      if (res.status === 200) {
        toast.success("OTP sent successfully!");
        setPop(true);
        setTimeLeft(300); // Reset timer when popup shows
      } else {
        toast.error("Failed to send OTP");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong!");
    }
  };

  // Step 2 → Verify OTP
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    if (!formData.otp) {
      toast.error("Please enter OTP");
      return;
    }

    try {
      const res = await axiosInstance.post("/user/verifyOtp", {
        emailOrPhone: formData.emailOrPhone,
        otp: formData.otp,
      });

      if (res.status === 200 && res.data.success) {
        toast.success("OTP Verified!");
        setPop(false);

        await axiosInstance.post("/user/forgot", {
          emailOrPhone: formData.emailOrPhone,
          password: formData.password,
        });

        toast.success("Password updated successfully!");
        navigate("/login");
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    }
  };

  const handleClear = () => {
    setFormData({
      emailOrPhone: "",
      password: "",
      confirmPassword: "",
      otp: "",
    });
    setErrors({});
  };

  // Resend OTP
  const resendOtp = async () => {
    try {
      await axiosInstance.post("/user/createOtp", {
        emailOrPhone: formData.emailOrPhone,
      });

      toast.success("OTP Resent!");
      setTimeLeft(300); // restart timer
    } catch (err) {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F2F0EF] px-4">
      <div className="flex flex-col md:flex-row bg-[#BBBDBC] rounded-lg shadow-lg max-w-3xl w-5/6 overflow-hidden">
        {/* Left Section */}
        <div className="bg-[#52AB98] text-white flex flex-col items-center justify-center md:w-1/2 w-full p-6 md:rounded-l-lg">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Link to={"/"}>
                <img src={OwmoLog} alt="logo" className="w-38" />
              </Link>
            </div>
            <p className="text-3xl">Reset Password</p>
            <p className="text-2xl">Secure your account</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-xl font-semibold mb-4 text-center">Forgot Password</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email or Phone */}
            <div>
              <input
                type="text"
                name="emailOrPhone"
                value={formData.emailOrPhone}
                onChange={handleChange}
                placeholder="Email or Phone"
                className="w-full px-3 py-2 border rounded-full bg-gray-100 focus:outline-none focus:ring focus:ring-teal-300"
              />
              {errors.emailOrPhone && (
                <p className="text-red-500 text-sm mt-1">{errors.emailOrPhone}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="New Password"
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
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 cursor-pointer"
              >
                Send OTP
              </button>

              <button
                onClick={handleClear}
                type="button"
                className="px-6 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 cursor-pointer"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* OTP Popup */}
      {pop && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-[#BBBDBC] p-6 rounded-2xl shadow-lg w-80 text-center">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">Enter OTP</h2>
            <p className="text-gray-600 mb-3">
              Please enter the OTP sent to your email or phone.
            </p>


            {/* OTP Input */}
            <form onSubmit={handleOtpVerify}>
              <input
                type="number"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                placeholder="Enter OTP"
                className="w-full px-3 py-2 mb-4 border rounded-full bg-gray-100 focus:outline-none focus:ring focus:ring-teal-300"
              />

              <button
                type="submit"
                className="w-full bg-[#52AB98] text-white py-2 rounded-lg hover:bg-[#3e8374] transition"
              >
                Verify OTP
              </button>
            </form>

            {/* Resend OTP Button */}
            {timeLeft === 0 ? (
              <button
                onClick={resendOtp}
                className="mt-3 text-sm text-blue-600 underline"
              >
                Resend OTP
              </button>
            ) : (
              <p className="mt-3 text-sm text-gray-700">
                You can resend OTP after: <b>{formatTime()}</b>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
