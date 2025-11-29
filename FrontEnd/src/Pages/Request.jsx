import { useEffect, useState, useContext } from "react";
import { ModleData, issueData, Service, UrgencyData, brand as brandList } from "../assets/data";
import axiosInstance from "../utils/authInterceptor";
import { toast } from "react-toastify";
import { store } from "../context/StoreProvider";


function Request() {


    const { user } = useContext(store);



    const [step, setStep] = useState(0);
    const [selected, setSelected] = useState("");
    const [issue, setIssue] = useState("");
    const [otherText, setOtherText] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [model, setModel] = useState("");
    const [imei, setImei] = useState("");
    const [serviceType, setServiceType] = useState("Pickup by Yourelf");
    const [urgency, setUrgency] = useState("Normal");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [pincode, setPincode] = useState("");
    const [uploadedImages, setUploadedImages] = useState([]);

    const [technicians, setTechnicians] = useState([]);

    const [selectTechnician, setSelectTechnician] = useState(null);


    const [dragActive, setDragActive] = useState(false);


    // Device selection
    const modele = ModleData.map((data, index) => (
        <label
            key={index}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl shadow cursor-pointer transition border-2 
        ${selected === data.head
                    ? "border-blue-500 bg-[#adbeb6]"
                    : "border-transparent bg-[#BBBDBC]"
                } w-35 md:w-40`}
        >
            <input
                type="radio"
                name="device"
                value={data.head}
                checked={selected === data.head}
                onChange={() => setSelected(data.head)}
                onClick={() => setStep(1)}
                className="hidden"
            />
            <img
                src={data.im}
                alt={data.head}
                className="w-16 h-16 mb-3 rounded-md object-cover"
            />
            <span className="text-gray-700 font-medium">{data.head}</span>
        </label>
    ));




    // Issue selection
    const issues = issueData.map((data, index) => (
        <label
            key={index}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl shadow cursor-pointer transition border-2 
        ${issue === data.data
                    ? "border-blue-500 bg-[#adbeb6]"
                    : "border-transparent bg-[#BBBDBC]"
                } ${data.data === "Battery & Charging" ? "row-span-3" : ""} 
          ${data.data === "Screen Issues" ? "row-span-3" : ""} 
        w-36 md:w-40 text-center`}
        >
            {data.ic && (
                <img src={data.ic} alt={data.data} className="w-20 m-8" />
            )}

            <input
                type="radio"
                id={`issue-${index}`}
                name="issue"
                value={data.data}
                checked={issue === data.data}
                onChange={() => setIssue(data.data)}
                className="hidden"
            />
            <span className="text-gray-700 font-medium w-36 md:w-40 text-center">
                {data.data}
            </span>
        </label>
    ));




    //service selection
    const Services = Service.map((data, index) => (
        <label
            key={index}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl shadow cursor-pointer transition border-2 
        ${serviceType === data ? "border-blue-500 bg-[#a19fe6]" : "border-transparent bg-[#BBBDBC]"} w-35 md:w-40`}
        >
            <input
                type="radio"
                name="service"
                value={data}
                checked={serviceType === data}
                onChange={() => setServiceType(data)}
                className="hidden"
            />
            <span className="text-gray-700 font-medium">{data}</span>
        </label>
    ));




    //ur selection
    const Urgencys = UrgencyData.map((data, index) => (
        <label
            key={index}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl shadow cursor-pointer transition border-2 
        ${urgency === data ? "border-blue-500 bg-[#a19fe6]" : "border-transparent bg-[#BBBDBC]"} w-35 md:w-40`}
        >
            <input
                type="radio"
                name="urgency"
                value={data}
                checked={urgency === data}
                onChange={() => setUrgency(data)}
                className="hidden"
            />
            <span className="text-gray-700 font-medium">{data}</span>
        </label>
    ));



    const handleFiles = (files) => {
        const newFiles = Array.from(files).map((file) =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
            })
        );
        setUploadedImages([...uploadedImages, ...newFiles]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleRemove = (index) => {
        const updatedImages = uploadedImages.filter((_, i) => i !== index);
        setUploadedImages(updatedImages);
    };



    //Api for fatching the tecnician according to the zip code . that have same Zip code
    useEffect(() => {
        const fetchTechnicians = async () => {
            try {
                // Only run if pincode has a valid length (e.g., 6 digits)
                if (pincode && pincode.length === 6) {
                    const res = await axiosInstance.get(`/user/TechByPin?pincode=${pincode}`);

                    if (res.data && res.data.users) {
                        setTechnicians(res.data.users);
                    } else {
                        setTechnicians([]);
                    }
                }
            } catch (error) {
                console.error("Error fetching technicians:", error);
                toast.error("Error fetching technicians: " + error.message);
            }
        };

        fetchTechnicians();
    }, [pincode]);




    //handleFinalSubmit
    const handleFinalSubmit = async () => {
        try {
            if (!selected || !selectedBrand || !model || !issue ||
                !address || !city || !pincode || !selectTechnician) {
                toast.error("Please complete all required fields");
                return;
            }

            const formData = new FormData();

            // Device
            formData.append("type", selected.toLowerCase());
            formData.append("brand", selectedBrand.toLowerCase());
            formData.append("model", model);
            formData.append("imei", imei || "");

            // Issue
            const selectedIssue = issue === "Other" ? "other" : issue;
            formData.append("issue", selectedIssue);

            if (selectedIssue === "other") {
                formData.append("issueDescription", otherText);
            }

            // Service
            formData.append("serviceType", serviceType);
            formData.append("urgency", urgency);

            // Address (nested JSON)
            const addrObj = {
                street: address,
                city: city,
                pincode: pincode,
            };

            formData.append("address", JSON.stringify(addrObj));

            // User
            formData.append("userId", user.id);

            // Technician
            formData.append("technicianId", selectTechnician._id);
            formData.append("technicianName", selectTechnician.name);

            // Images
            uploadedImages.forEach((image) => {
                formData.append("image", image.file || image);
            });

            const response = await axiosInstance.post(
                "/request/create",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (response.status === 201) {
                toast.success("Request submitted successfully!");
            }

        } catch (error) {
            console.error("Submit Error:", error);
            toast.error(error.response?.data?.message || "Error submitting request");
        }
    };








    //to upload the data of the request
    const uploadDate = async () => {
        try {

        } catch (error) {

        }
    }

    return (
        <div className="py-28 bg-[#F2F0EF] px-4">
            {/* Step 0: Device selection */}
            {step === 0 && (
                <div className="flex flex-col items-center justify-center">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-800">
                            What kind of device are you having trouble with?
                        </h1>
                        <p className="text-gray-500">
                            Our experts will assess your device and get it back to you in no
                            time.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 place-items-center md:grid-cols-4 gap-6 w-full max-w-3xl">
                        {modele}
                    </div>
                    {selected && (
                        <p className="mt-6 text-blue-600 font-medium">
                            You selected: {selected}
                        </p>
                    )}
                </div>
            )}

            {/* Step 1: Issue selection */}
            {step === 1 && (
                <div className="flex flex-col items-center justify-center">
                    <div className="w-5/6 max-w-4xl flex flex-col items-center justify-center rounded-lg">
                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-semibold text-gray-800">
                                What's wrong with it?
                            </h1>
                            <p className="text-gray-500">Don’t worry, we will fix it!</p>
                        </div>

                        <div className="place-items-center md:gap-6 w-full max-w-3xl my-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 place-items-center">
                                {issues}
                            </div>

                            {/* Show textarea if "Other" is selected */}
                            {issue.toLowerCase() === "other" && (
                                <div className="mt-4 w-full max-w-xl p-2">
                                    <textarea
                                        name="issueDescription"
                                        value={otherText}
                                        onChange={(e) => setOtherText(e.target.value)}
                                        rows="3"
                                        className="mt-4 w-full max-w-xl p-2 border rounded-lg"
                                        placeholder="Please describe the issue..."
                                    />
                                </div>
                            )}
                        </div>

                        {/* Navigation buttons */}
                        <div className="flex justify-around my-2 w-full max-w-3xl">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded-lg"
                                onClick={() => setStep(0)} // ✅ fixed typo
                            >
                                Go back
                            </button>
                            <button
                                className={`px-4 py-2 rounded-lg ${issue ? "bg-[#52AB98] text-white" : "bg-gray-400 cursor-not-allowed"
                                    }`}
                                onClick={() => issue && setStep(2)} // ✅ only continue if selected
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Step 2: Brand & Model Info */}
            {step === 2 && (
                <div className="max-w-2xl mx-auto bg-[#BBBDBC] shadow-lg rounded-2xl p-6 space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl text-[#2B6777] font-bold flex items-center justify-center gap-2">
                            Device Details
                        </h2>
                        <p className="text-[#FFFFFF]  text-shadow-lg mt-1">
                            Tell us the brand and model of your device to help us serve you better
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* Brand Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-[#555555] mb-1">
                                Select Brand
                            </label>
                            <select
                                value={selectedBrand}
                                onChange={(e) => setSelectedBrand(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="" className="bg-[#BBBDBC]">Choose a Brand</option>
                                {brandList.map((b, idx) => (
                                    <option key={idx} value={b} className="bg-[#BBBDBC]">
                                        {b}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Model Input */}
                        <div>
                            <label className="block text-sm font-medium text-[#555555] mb-1">
                                Device Model
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., iPhone 13 Pro Max"
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        {/* IMEI Input */}
                        <div>
                            <label className="block text-sm font-medium text-[#555555] mb-1">
                                IMEI (Optional)
                            </label>
                            <input
                                type="text"
                                placeholder="Enter IMEI number (optional)"
                                value={imei}
                                onChange={(e) => setImei(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-4">
                        <button
                            className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
                            onClick={() => setStep(1)}
                        >
                            Go back
                        </button>
                        <button
                            className={`px-6 py-2 rounded-xl ${selectedBrand && model
                                ? "bg-[#52AB98] text-white hover:bg-[#2e5f54]"
                                : "bg-gray-400 text-white cursor-not-allowed"
                                }`}
                            onClick={() => selectedBrand && model && setStep(3)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}



            {step === 3 && (
                <div className="max-w-2xl mx-auto bg-[#BBBDBC] shadow-lg rounded-2xl p-6 space-y-6">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Service Option
                        </h1>
                        <p className="text-gray-500">Let Konw your preferred service and urgency</p>
                    </div>

                    <div className="block text-sm my-2 font-medium text-[#555555] mb-1">
                        <h1 className=" text-lg py-2">Choose Service Type</h1>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 place-items-center">
                            {Services}
                        </div>
                    </div>

                    <div className="block text-sm my-2 font-medium text-[#555555] mb-1">
                        <h1 className=" text-lg py-2">Urgency</h1>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 place-items-center">
                            {Urgencys}
                        </div>
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex justify-between pt-4 mt-4">
                        <button
                            className="px-4 py-2 bg-gray-300 rounded-lg"
                            onClick={() => setStep(2)} // ✅ fixed typo
                        >
                            Go back
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg ${serviceType ? "bg-[#52AB98] text-white" : "bg-gray-400 cursor-not-allowed"}`}
                            onClick={() => serviceType && urgency && setStep(4)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}



            {step === 4 && (
                <div className="max-w-2xl mx-auto bg-[#BBBDBC] shadow-lg rounded-2xl p-6 space-y-6">

                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Pickup / Delivery Address
                        </h1>
                        <p className="text-gray-500">Enter your address if you want pickup and drop service.</p>
                    </div>

                    {/* Address Form */}
                    <div className="space-y-4">
                        {/* Street Address */}
                        <div className="block text-sm my-2 font-medium text-[#555555] mb-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Street Address
                            </label>
                            <textarea
                                rows="3"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter your complete street address"
                                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        {/* City & Pincode */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    City
                                </label>
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="Enter your city"
                                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Pincode
                                </label>
                                <input
                                    type="text"
                                    value={pincode}
                                    onChange={(e) => setPincode(e.target.value)}
                                    placeholder="Enter pincode"
                                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex justify-between pt-4 mt-4">
                        <button
                            className="px-4 py-2 bg-gray-300 rounded-lg"
                            onClick={() => setStep(3)}
                        >
                            Go back
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg ${(address && city && pincode) ? "bg-[#52AB98] text-white" : "bg-gray-400 cursor-not-allowed"}`}
                            onClick={() => address && city && pincode && setStep(5)}
                        >
                            Next
                        </button>
                    </div>

                </div>
            )}



            {step === 5 && (
                <div className="max-w-2xl mx-auto flex flex-col items-center py-10">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        Upload Device Photo
                    </h2>
                    <p className="text-gray-500 text-center mb-6">
                        Upload clear photos of your device and the damaged part (optional but recommended).
                    </p>

                    <div
                        className={`w-full p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition
        ${dragActive ? "border-[#346d61] bg-[#52AB98]" : "border-gray-300 bg-white"}`}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setDragActive(true);
                        }}
                        onDragLeave={(e) => {
                            e.preventDefault();
                            setDragActive(false);
                        }}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById("fileInput").click()}
                    >
                        <p className="text-gray-400 mb-2">Drag & Drop or Click to Upload</p>
                        <p className="text-gray-400 text-sm">Supported formats: JPG, PNG</p>
                        <input
                            id="fileInput"
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFiles(e.target.files)}
                        />
                    </div>

                    {uploadedImages.length > 0 && (
                        <div className="mt-6 grid grid-cols-3 gap-4 w-full">
                            {uploadedImages.map((file, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={file.preview}
                                        alt={`upload-${index}`}
                                        className="w-full h-32 object-cover rounded-lg border"
                                    />
                                    <button
                                        onClick={() => handleRemove(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}


                    {/* Navigation buttons */}
                    <div className="flex justify-between pt-4 mt-4">
                        <button
                            className="px-4 py-2 mr-10 bg-gray-300 rounded-lg"
                            onClick={() => setStep(4)}
                        >
                            Go back
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg ml-10 ${uploadedImages ? "bg-[#52AB98] text-white" : "bg-gray-400 cursor-not-allowed"}`}
                            onClick={() => uploadedImages && setStep(6)}
                        >
                            Next
                        </button>
                    </div>
                </div>

            )}


            {/*choice the tecnician*/}
            {step === 6 && (
                <div className="flex flex-col text-center items-center">
                    <h1 className="text-2xl font-semibold text-gray-800">Available Technicians</h1>

                    {technicians.length > 0 ? (<>
                        <div className="grid grid-cols-1 justify-items-center mt-4 w-5/6 max-w-4xl h-96 max-h-11/12 overflow-y-auto hide-scrollbar bg-[#BBBDBC] md:grid-cols-3 rounded-xl">
                            {technicians.map((tech, index) => (
                                <div
                                    key={tech._id || index}
                                    className={`bg-white p-4 m-4 rounded-xl shadow-md text-center flex flex-col items-center ${selectTechnician?._id === tech._id ? "border-4 border-[#2B6777]" : ""
                                        }`}

                                    onClick={() => setSelectTechnician(tech)}
                                >
                                    <img
                                        src={tech.pic[0]}
                                        alt={tech.name}
                                        className="w-24 h-24 rounded-full mx-16 object-cover border"
                                    />
                                    <h2 className="text-lg font-semibold text-[#2B6777]">{tech.name}</h2>
                                    <p className="text-gray-600">{tech.shopName}</p>
                                    <p className="text-sm text-gray-500">Experience: {tech.experience}</p>
                                    <p className="text-sm text-gray-500">Charges: {tech.prize}</p>
                                </div>
                            ))}
                        </div>
                        <div className="m-5 w-5/6 max-w-4xl flex justify-around">
                            <button onClick={() => setStep(5)} className="px-4 py-2 mr-10 bg-gray-300 rounded-lg">
                                Go Back
                            </button>
                            <button onClick={() => selectTechnician && setStep(7)}
                                className={`px-4 py-2 rounded-lg 
        ${selectTechnician ? "bg-[#52AB98] text-white" : "bg-gray-400 cursor-not-allowed"}`}
                                disabled={!selectTechnician}>
                                Submit
                            </button>
                        </div>
                    </>
                    ) : (
                        <p className="mt-4 text-gray-600">No technicians found for this area.</p>
                    )}
                </div>
            )
            }

            {/* Step 7: Review */}
            {step === 7 && (
                <div className="max-w-3xl mx-auto p-6">

                    {/* DEVICE LINE */}
                    <div className="flex items-center my-6">
                        <div className="flex border border-t"></div>
                        <span className="mx-4 text-gray-700 font-medium">Device Information</span>
                        <div className="flex border-t"></div>
                    </div>

                    <p><strong>Device:</strong> {selected}</p>
                    <p><strong>Brand:</strong> {selectedBrand}</p>
                    <p><strong>Model:</strong> {model}</p>
                    {imei && <p><strong>IMEI:</strong> {imei}</p>}

                    {/* ISSUE LINE */}
                    <div className="flex items-center my-6">
                        <div className="flex border-t"></div>
                        <span className="mx-4 text-gray-700 font-medium">Issue Details</span>
                        <div className="flex border-t"></div>
                    </div>

                    <p><strong>Issue:</strong> {issue}</p>
                    {issue?.toLowerCase() === "other" && (
                        <p><strong>Description:</strong> {otherText}</p>
                    )}

                    {/* SERVICE LINE */}
                    <div className="flex items-center my-6">
                        <div className="flex border-t"></div>
                        <span className="mx-4 text-gray-700 font-medium">Service Information</span>
                        <div className="flex border-t"></div>
                    </div>

                    <p><strong>Service:</strong> {serviceType}</p>
                    <p><strong>Urgency:</strong> {urgency}</p>

                    {/* ADDRESS LINE */}
                    <div className="flex items-center my-6">
                        <div className="flex border-t"></div>
                        <span className="mx-4 text-gray-700 font-medium">Address</span>
                        <div className="flex border-t"></div>
                    </div>

                    <p><strong>Address:</strong> {address}</p>
                    <p><strong>City:</strong> {city}</p>
                    <p><strong>Pincode:</strong> {pincode}</p>

                    {/* IMAGES LINE */}
                    <div className="flex items-center my-6">
                        <div className="flex border-t"></div>
                        <span className="mx-4 text-gray-700 font-medium">Uploaded Images</span>
                        <div className="flex border-t"></div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {uploadedImages?.map((img, i) => (
                            <img
                                key={i}
                                src={img.preview}
                                className="w-full h-24 object-cover rounded-md border"
                            />
                        ))}
                    </div>

                    {/* TECHNICIAN LINE */}
                    <div className="flex items-center my-6">
                        <div className="flex border-t"></div>
                        <span className="mx-4 text-gray-700 font-medium">Technician</span>
                        <div className="flex border-t"></div>
                    </div>

                    {selectTechnician ? (
                        <div className="flex items-center gap-4">
                            <img
                                src={selectTechnician?.pic?.[0] || "/default.jpg"}
                                className="w-20 h-20 rounded-full object-cover border"
                            />
                            <div>
                                <p><strong>Name:</strong> {selectTechnician.name}</p>
                                <p><strong>Shop:</strong> {selectTechnician.shopName}</p>
                                <p><strong>Experience:</strong> {selectTechnician.experience}</p>
                                <p><strong>Charges:</strong> {selectTechnician.prize}</p>
                            </div>
                        </div>
                    ) : (
                        <p>No technician selected.</p>
                    )}

                    {/* BUTTONS */}
                    <div className="flex justify-between mt-8">
                        <button
                            onClick={() => setStep(6)}
                            className="px-4 py-2 bg-gray-300 rounded-lg"
                        >
                            Back
                        </button>

                        <button
                            onClick={() => handleFinalSubmit()}
                            className="px-6 py-2 bg-[#52AB98] text-white rounded-lg hover:bg-[#2e5f54]"
                        >
                            Confirm & Submit
                        </button>
                    </div>

                </div>
            )}




        </div >
    );
}

export default Request;
