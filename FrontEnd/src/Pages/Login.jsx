import { useState, useContext } from "react";
import OwmoLog from '../assets/image/owmo.png';
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../api/axios";
import { store } from "../context/StoreProvider";



//login componet
export default function Login() {

  const { loginUser } = useContext(store);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [pop, setPop] = useState(false);


  //for the navigate through hook
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validation
  const validate = () => {
    let newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  //call the api on submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      LoginApi();
    }
  };


  // Login API
  const LoginApi = async () => {
    try {
      const res = await axiosInstance.post("/user/login", formData);

      if (res.status === 200) {

        console.log(res.data);
        console.log("this is type of user:" + res.data.role + "and the hired :" + res.data.hired);
        if ((res.data.user.role === "technician" && !res.data.user.hired)) {
          
          /*
          if(!res.data.user.pass){
            navigate("/Quiz");
          }
          console.log("this is pop");
           */
          setPop(true);
        }
        else {

          toast.success("✅ Login successful!");

          //set id and user in useContext
          loginUser(res.data.user);

          // Redirect to dashboard/home
          navigate("/");
        }
      } else {
        toast.error("❌ Login failed. Try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "❌ Something went wrong.");
    }
  };

  //ui desing of the Login Page
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F2F0EF] px-4">
      <div className="flex flex-col md:flex-row bg-[#BBBDBC] rounded-2xl shadow-lg overflow-hidden max-w-3xl w-5/6">

        {/* Left Side (Form) */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-center text-2xl font-bold mb-6">Log in</h2>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-gray-700">Email :</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-teal-300"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700">Password :</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-teal-300"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Buttons */}
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition cursor-pointer"
            >
              Sign in
            </button>
          </form>

          {/* Extra Links */}
          <div className="flex justify-between text-sm mt-4 text-gray-600">
            <Link to = {"/forgot"} className="hover:underline">Forgot Password?</Link>
            <Link to={"/signup"} className="hover:underline">Sign up</Link>
          </div>
        </div>

        {/* Right Side (Welcome) */}
        <div className="w-full md:w-1/2 bg-[#52AB98] text-white flex flex-col justify-center items-center p-6">
          <Link to="/">
            <img
              src={OwmoLog}
              alt="logo"
              className="w-38 mb-2"
            />
          </Link>
          <p className="text-4xl">Welcome</p>
        </div>
      </div>

      {/*------------------Popup---------------------------------*/}
      {pop && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-[#BBBDBC] p-6 rounded-2xl shadow-lg w-80 text-center">
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">Verification in progress</h2>
            <p className="text-gray-600 mb-4">
              Your technician profile is currently under verification by the Admin. You will be able to log in once all hiring steps are completed.
            </p>
            <p className="text-gray-600 mb-4">
              We will notify you immediately once your account is approved.
            </p>
            <p className="text-gray-600 mb-4">
              Thank you for your patience.
            </p>
            <Link to="/">
            <button
              onClick={() => setPop(false)}
              className="w-full bg-[#52AB98] text-white py-2 rounded-lg hover:bg-[#3e8374] transition"
            >
              ok
            </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
