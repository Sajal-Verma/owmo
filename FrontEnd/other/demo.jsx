


import { useState } from "react";

export default function UploadPhotoStep() {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);

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

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center py-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
        📸 Upload Device Photo
      </h2>
      <p className="text-gray-500 text-center mb-6">
        Upload clear photos of your device and the damaged part (optional but recommended).
      </p>

      <div
        className={`w-full p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition
        ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"}`}
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
    </div>
  );
}



















import { useState } from "react";

const technicians = [
  { id: 1, name: "Rahul Sharma", experience: "5 yrs", rating: 4.8, img: "/tech1.jpg" },
  { id: 2, name: "Priya Singh", experience: "3 yrs", rating: 4.6, img: "/tech2.jpg" },
  { id: 3, name: "Anil Kumar", experience: "7 yrs", rating: 4.9, img: "/tech3.jpg" },
];

function Step8ChooseTechnician({ onNext, onBack }) {
  const [selectedTech, setSelectedTech] = useState("");

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      {/* Heading */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">🛠️ Select a Technician</h1>
        <p className="text-gray-500 mt-2">
          Pick from our available certified technicians, or let us auto-assign the best one for you.
        </p>
      </div>

      {/* Technician Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Auto-Assign option */}
        <div
          onClick={() => setSelectedTech("auto")}
          className={`cursor-pointer flex flex-col items-center justify-center p-4 rounded-2xl border-2 shadow transition
            ${selectedTech === "auto" ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"}
          `}
        >
          <div className="text-xl font-medium text-gray-700">Auto-Assign</div>
          <p className="text-gray-500 text-sm mt-2">Let us pick the best technician for you</p>
        </div>

        {/* List of technicians */}
        {technicians.map((tech) => (
          <div
            key={tech.id}
            onClick={() => setSelectedTech(tech.id)}
            className={`cursor-pointer flex flex-col items-center justify-center p-4 rounded-2xl border-2 shadow transition
              ${selectedTech === tech.id ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"}
            `}
          >
            <img
              src={tech.img}
              alt={tech.name}
              className="w-20 h-20 rounded-full object-cover mb-3"
            />
            <h2 className="text-gray-800 font-medium">{tech.name}</h2>
            <p className="text-gray-500 text-sm">{tech.experience} experience</p>
            <p className="text-yellow-500 font-semibold">⭐ {tech.rating}</p>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
        >
          Go Back
        </button>
        <button
          onClick={() => selectedTech && onNext(selectedTech)}
          className={`px-4 py-2 rounded-lg transition ${
            selectedTech ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default Step8ChooseTechnician;
























import React from "react";

export default function Step10Review({
  customerInfo = {},
  deviceInfo = {},
  issueInfo = {},
  serviceInfo = {},
  addressInfo = {},
  technicianInfo = {},
  paymentInfo = {},
  onEditStep = () => {},
  onSubmit = () => {},
}) {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 my-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">✅ Review Your Request</h1>
        <p className="text-gray-500 mt-2">
          Check all details carefully before confirming your repair request.
        </p>
      </div>

      <div className="mb-6 border-b pb-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-gray-700">Customer Information</h2>
          <button className="text-blue-500 hover:underline text-sm" onClick={() => onEditStep(1)}>
            Edit
          </button>
        </div>
        <p>Name: {customerInfo.name || "N/A"}</p>
        <p>Phone: {customerInfo.phone || "N/A"}</p>
        <p>Email: {customerInfo.email || "N/A"}</p>
      </div>

      <div className="mb-6 border-b pb-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-gray-700">Device Information</h2>
          <button className="text-blue-500 hover:underline text-sm" onClick={() => onEditStep(2)}>
            Edit
          </button>
        </div>
        <p>Device Type: {deviceInfo.type || "N/A"}</p>
        <p>Brand / Model: {deviceInfo.brandModel || "N/A"}</p>
        <p>IMEI: {deviceInfo.imei || "N/A"}</p>
      </div>

      <div className="mb-6 border-b pb-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-gray-700">Issue Details</h2>
          <button className="text-blue-500 hover:underline text-sm" onClick={() => onEditStep(4)}>
            Edit
          </button>
        </div>
        <p>Issue: {issueInfo.issue || "N/A"}</p>
        {issueInfo.issue && issueInfo.issue.toLowerCase() === "other" && <p>Description: {issueInfo.description || "N/A"}</p>}
        {Array.isArray(issueInfo.photos) && issueInfo.photos.length > 0 && (
          <div className="mt-2 flex gap-2">
            {issueInfo.photos.map((photo, idx) => (
              <img key={idx} src={photo} alt={`Issue ${idx + 1}`} className="w-20 h-20 object-cover rounded-md border" />
            ))}
          </div>
        )}
      </div>

      <div className="mb-6 border-b pb-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-gray-700">Service Preferences</h2>
          <button className="text-blue-500 hover:underline text-sm" onClick={() => onEditStep(5)}>
            Edit
          </button>
        </div>
        <p>Pickup / Drop: {serviceInfo.pickup ? "Yes" : "No"}</p>
        {serviceInfo.pickup && (
          <>
            <p>Date: {serviceInfo.date || "N/A"}</p>
            <p>Time: {serviceInfo.time || "N/A"}</p>
            <p>Urgency: {serviceInfo.urgency || "N/A"}</p>
          </>
        )}
      </div>

      {serviceInfo.pickup && (
        <div className="mb-6 border-b pb-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-gray-700">Pickup Address</h2>
            <button className="text-blue-500 hover:underline text-sm" onClick={() => onEditStep(6)}>
              Edit
            </button>
          </div>
          <p>{addressInfo.street || "N/A"}</p>
          <p>{addressInfo.city || "N/A"} - {addressInfo.pincode || "N/A"}</p>
        </div>
      )}

      <div className="mb-6 border-b pb-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-gray-700">Technician</h2>
          <button className="text-blue-500 hover:underline text-sm" onClick={() => onEditStep(8)}>
            Edit
          </button>
        </div>
        <p>{technicianInfo.name || "N/A"}</p>
        <p>{technicianInfo.contact || "N/A"}</p>
      </div>

      <div className="mb-6 border-b pb-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-gray-700">Payment</h2>
          <button className="text-blue-500 hover:underline text-sm" onClick={() => onEditStep(9)}>
            Edit
          </button>
        </div>
        <p>Method: {paymentInfo.method || "N/A"}</p>
        <p>Amount: ₹{paymentInfo.amount || 0}</p>
      </div>

      <div className="text-center mt-8">
        <button className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition" onClick={onSubmit}>
          Confirm & Submit
        </button>
      </div>
    </div>
  );
}
