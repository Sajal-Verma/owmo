import axiosInstance from "../utils/authInterceptor";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { store } from "../context/StoreProvider";

const RequestDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(store);

    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);

    // Technician update states
    const [statusUpdate, setStatusUpdate] = useState("");
    const [amountUpdate, setAmountUpdate] = useState("");
    const [newImages, setNewImages] = useState([]);

    // Role detection
    const isTechnician = user?.role === "technician";
    const isAdmin = user?.role === "admin";
    const isUser = user?.role === "user";

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const res = await axiosInstance.get(`/request/show/${id}`);
                if (res.status === 200) {
                    setRequest(res.data);
                    setStatusUpdate(res.data.status);
                    setAmountUpdate(res.data.paymentAmount || "");
                }
            } catch (error) {
                toast.error("Error fetching request");
            } finally {
                setLoading(false);
            }
        };

        fetchRequest();
    }, [id]);

    // ------------------------------
    // Technician updates request
    // ------------------------------
    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append("status", statusUpdate);
            formData.append("paymentAmount", amountUpdate);

            newImages.forEach((img) => {
                formData.append("image", img);
            });

            const res = await axiosInstance.put(
                `/request/update/${request._id}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (res.status === 200) {
                toast.success("Updated successfully!");
                setRequest(res.data);
            }
        } catch (error) {
            toast.error("Update failed");
        }
    };

    // ------------------------------
    // Admin Delete Request
    // ------------------------------
    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this request?")) return;

        try {
            const res = await axiosInstance.delete(`/request/delete/${id}`);

            if (res.status === 200) {
                toast.success("Request deleted!");
                navigate("/admin/dashboard");
            }
        } catch (error) {
            toast.error("Failed to delete request.");
        }
    };

    // ------------------------------
    // User Make Payment
    // ------------------------------
    const handlePayment = () => {
        navigate(`/payment/${request._id}`);
    };

    if (loading) return <p className="p-4">Loading...</p>;
    if (!request) return <p className="p-4">No data found.</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto bg-gray-100 min-h-screen rounded-lg shadow-md">

            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
                ⬅ Back
            </button>

            {/* Admin Delete */}
            {isAdmin && (
                <button
                    onClick={handleDelete}
                    className="mb-4 ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                    🗑 Delete Request
                </button>
            )}

            <h2 className="text-2xl font-bold mb-6 text-gray-800">Request Details</h2>

            {/* Grid Two Column */}
            <div className="grid md:grid-cols-2 gap-6">

                {/* Left Column */}
                <div className="space-y-3 text-gray-700 bg-white p-4 rounded-xl shadow">
                    <h3 className="text-xl font-semibold mb-3">Device Information</h3>
                    <p><strong>Type:</strong> {request.type}</p>
                    <p><strong>Brand:</strong> {request.brand}</p>
                    <p><strong>Model:</strong> {request.model}</p>
                    <p><strong>IMEI:</strong> {request.imei || "Not Provided"}</p>
                    <p><strong>Issue:</strong> {request.issue}</p>
                    <p><strong>Issue Description:</strong> {request.issueDescription}</p>
                    <p><strong>Status:</strong> {request.status}</p>
                </div>

                {/* Right Column */}
                <div className="space-y-3 text-gray-700 bg-white p-4 rounded-xl shadow">
                    <h3 className="text-xl font-semibold mb-3">Payment Info</h3>

                    {request.paymentAmount ? (
                        <>
                            <p><strong>Payment Status:</strong> {request.paymentStatus}</p>
                            <p><strong>Amount:</strong> ₹{request.paymentAmount}</p>
                        </>
                    ) : (
                        <p>Amount not added yet.</p>
                    )}

                    {/* USER: Payment button */}
                    {isUser && request.paymentAmount > 0 && request.paymentStatus !== "Paid" && (
                        <button
                            onClick={handlePayment}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg mt-3"
                        >
                            💳 Make Payment
                        </button>
                    )}

                    {/* Technician Amount */}
                    {isTechnician && (
                        <>
                            <label className="font-medium">Update Amount</label>
                            <input
                                type="number"
                                value={amountUpdate}
                                onChange={(e) => setAmountUpdate(e.target.value)}
                                className="w-full p-2 border rounded-lg"
                            />
                        </>
                    )}

                    <h3 className="text-xl font-semibold mt-6 mb-3">Address</h3>
                    <p><strong>Street:</strong> {request.address?.street}</p>
                    <p><strong>City:</strong> {request.address?.city}</p>
                    <p><strong>Pincode:</strong> {request.address?.pincode}</p>
                </div>

                {/* Service Details */}
                <div className="mt-8 bg-white p-4 rounded-xl shadow md:col-span-2">
                    <h3 className="text-xl font-semibold mb-3 text-gray-800">Service Details</h3>

                    <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                        <p><strong>Service Type:</strong> {request.serviceType}</p>
                        <p><strong>Urgency:</strong> {request.urgency}</p>
                        <p><strong>Issue Category:</strong> {request.issue}</p>
                        <p><strong>Issue Description:</strong> {request.issueDescription || "Not Provided"}</p>
                        <p><strong>Technician Assigned:</strong> {request.technicianName || "Not Assigned"}</p>
                        <p><strong>Status:</strong> {request.status}</p>
                    </div>
                </div>

                {/* Images */}
                <div className="mt-8 bg-white p-4 rounded-xl shadow md:col-span-2">
                    <h3 className="text-xl font-semibold mb-3">Images</h3>

                    {request.pic?.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {request.pic.map((img) => (
                                <img
                                    key={img._id}
                                    src={img.url}
                                    alt=""
                                    className="w-full h-40 object-cover rounded-lg shadow-md"
                                />
                            ))}
                        </div>
                    ) : (
                        <p>No images uploaded.</p>
                    )}

                    {isTechnician && (
                        <div className="mt-4">
                            <label className="font-medium">Add More Images</label>
                            <input
                                type="file"
                                multiple
                                onChange={(e) =>
                                    setNewImages((prev) => [...prev, ...e.target.files])
                                }
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                    )}
                </div>

                {/* Technician Controls */}
                {isTechnician && (
                    <div className="mt-8 bg-white p-4 rounded-xl shadow md:col-span-2">
                        <h3 className="text-xl font-semibold mb-4">Technician Controls</h3>

                        <label className="font-medium">Update Request Status</label>

                        <select
                            value={statusUpdate}
                            onChange={(e) => setStatusUpdate(e.target.value)}
                            className="w-full p-2 border rounded-lg mb-4"
                        >
                            {["Pending", "Assigned", "In Progress", "Completed", "Cancelled"].map((st) => (
                                <option key={st} value={st}>{st}</option>
                            ))}
                        </select>

                        <button
                            onClick={handleUpdate}
                            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                        >
                            ✔ Save Updates
                        </button>
                    </div>
                )}

                {/* Timestamp */}
                <div className="mt-8 bg-white p-4 rounded-xl shadow md:col-span-2">
                    <h3 className="text-xl font-semibold mb-3">Timestamps</h3>
                    <p><strong>Created At:</strong> {new Date(request.createdAt).toLocaleString()}</p>
                    <p><strong>Updated At:</strong> {new Date(request.updatedAt).toLocaleString()}</p>
                </div>

            </div>
        </div>
    );
};

export default RequestDetails;
