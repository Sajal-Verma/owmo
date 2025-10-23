import { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../utils/authInterceptor";
import {store} from "../context/StoreProvider"

//Utility function for capitalizing keys
const capitalizeWords = (str) => {
  return str
    .split(/(?=[A-Z])|_/g) // split camelCase, snake_case into words
    .map(
      word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
};

const ProfileData = () => {
  const [profile, setProfile] = useState({
    pic: [],
    name: "",
    dob: "",
    mobile: "",
    address: "",
    gmail: "",
    shop: false,
    shopName: "",
    qualification: false,
    qualificationName: "",
    experience: 0,
  });

  const handleChange = (key, value) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const cookieUser = Cookies.get("user");
        const parsedData = cookieUser ? JSON.parse(cookieUser) : null;
        
        if (!parsedData) {
          toast.error("User not found in the system");
          return;
        }

        const res = await axiosInstance.get(`/user/show/${parsedData.id}`);
        if (res.status === 200 && res.data.user) {

          const IGNORED_KEYS = ["__v", "updatedAt", "createdAt", "_id", "otpVerified", "role"];

          const data = res.data.user;

          const normalized = Object.fromEntries(
            Object.keys(data)
              .filter((key) => {
                if (user.role === "admin" || user.role === "user") {
                  //console.log("the key is "+ key +"and the value is " +!IGNORED_KEYS.includes(key));
                  return UserIgnored.includes(key);
                }
                return true;
              })
              .filter((key) => !IGNORED_KEYS.includes(key))
              .map((key) => {
                let value = data[key];
                if (key === "DOB" && value)
                  return ["dob", new Date(value).toISOString().split("T")[0]];
                if (key === "phone") return ["mobile", value];
                if (key === "email") return ["gmail", value];
                return [key, value ?? ""];
              })
          );

          setProfile(prev => ({ ...prev, ...normalized }));
        } else {
          toast.error("Profile data not found. Please reload the page");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch profile");
      }
    };


    fetchProfile();
  }, []);


  //api for update
  const UpdateApi = async () => {
    try {
      const cookieUser = Cookies.get("user");
      const parsedData = cookieUser ? JSON.parse(cookieUser) : null;

      if (!parsedData) {
        toast.error("User not found in the system");
        return;
      }

      const res = await axiosInstance.put(`/user/update/${parsedData.id}`, profile);

      if (res.status === 200) {
        toast.success(res.data.message);
      } else {
        toast.info(res.data.message);
      }


    } catch (error) {
      toast.error("Failed to fetch profile");
    }
  };

  return (
    <div className="bg-gray-100 shadow rounded-xl p-4 grid grid-cols-2 space-x-2">

      {/* Render inputs dynamically */}
      {Object.keys(profile).map(key => {
        // handle array
        if (Array.isArray(profile[key])) {
          return (
            <div key={key} className="mb-2">
              <strong>{capitalizeWords(key)}:</strong>{" "}
              {JSON.stringify(profile[key])}
            </div>
          );
        }

        // handle boolean → checkbox
        if (typeof profile[key] === "boolean") {
          return (
            <div key={key} className="mb-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={profile[key]}
                  onChange={e => handleChange(key, e.target.checked)} // ✅ Boolean
                />
                <span>{capitalizeWords(key)}</span>
              </label>
            </div>
          );
        }

        // handle number → numeric input
        if (typeof profile[key] === "number") {
          return (
            <div key={key} className="mb-2">
              <h1 className="font-semibold mb-1">{`${capitalizeWords(key)}:`}</h1>
              <input
                type="number"
                value={profile[key] ?? ""}
                onChange={e => handleChange(key, Number(e.target.value))}
                className="border p-2 w-full rounded"
              />
            </div>
          );
        }

        // handle date
        if (key === "dob") {
          return (
            <div key={key} className="mb-2">
              <h1 className="font-semibold mb-1">{`${capitalizeWords(key)}:`}</h1>
              <input
                type="date"
                value={profile[key] ?? ""}
                onChange={e => handleChange(key, e.target.value)}
                className="border p-2 w-full rounded"
              />
            </div>
          );
        }

        // default → text
        return (
          <div key={key} className="mb-2">
            <h1 className="font-semibold mb-1">{`${capitalizeWords(key)}:`}</h1>
            <input
              type="text"
              placeholder={`Enter ${capitalizeWords(key)}`}
              value={profile[key] ?? ""}
              onChange={e => handleChange(key, e.target.value)}
              className="border p-2 w-full rounded"
            />
          </div>
        );
      })}

      <button className="rounded-3xl bg-[#52AB98] hover:bg-[#3d7e70]" onClick={UpdateApi}>
        Save Change
      </button>
    </div>
  );
};

export default ProfileData;
