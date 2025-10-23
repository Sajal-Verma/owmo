import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import axiosInstance from "../utils/authInterceptor";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const COLORS = ["#4CAF50", "#E0E0E0"]; // green & gray


//componet
const Dashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const cookieUser = Cookies.get("user");
        const parsedData = cookieUser ? JSON.parse(cookieUser) : null;

        if (!parsedData) {
          toast.error("No user data found. Please login again.");
          setLoading(false);
          return;
        }

        const formData = { id: parsedData.id, role: parsedData.role };
        const res = await axiosInstance.post("/request/seeall", formData);

        if (res.status === 200 || res.status === 201) {
          const reqs = res.data.requests || [];
          
          // Sort latest updated first
          reqs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          setRequests(reqs);
        } else {
          toast.error("Data not found. Please reload the page");
        }
      } catch (error) {
        console.error("API error:", error);
        toast.error(error.response?.data?.message || "❌ Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Pie chart data
  const completeCount = requests.filter((r) => r.status === "completed").length;
  const pendingCount = requests.filter((r) => r.status !== "completed").length;
  const progressCount = requests.filter((r) => r.status === "in progress").length;

  const chartData = [
    { name: "Complete", value: completeCount },
    { name: "Pending", value: pendingCount },
    { name: "in progress", value: progressCount },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-10 px-4">
      {/* Loading / Empty State */}
      {loading ? (
        <p className="text-gray-600">⏳ Loading requests...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-600">No requests found.</p>
      ) : (
        <>
          {/* Pie Chart */}
          <div className="w-40 h-40 relative z-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) =>
                    `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex gap-6 mt-3 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Complete ({completeCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <span>Pending ({pendingCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <span>in progress({progressCount})</span>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-lg font-bold text-gray-700 mt-6">Requests</h2>

          {/* Table */}
          <div className="mt-6 overflow-x-auto w-full max-w-4xl">
            <table className="w-full bg-gray-200 rounded-lg overflow-hidden shadow-md">
              <thead className="bg-gray-300 text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-center">Brand</th>
                  <th className="px-4 py-2 text-center">Model</th>
                  <th className="px-4 py-2 text-center">Updated Date</th>
                  <th className="px-4 py-2 text-center">Issue</th>
                  <th className="px-4 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-300 hover:bg-gray-100"
                  >
                    <td className="px-4 py-2 text-center">{req.brand}</td>
                    <td className="px-4 py-2 text-center">{req.model}</td>
                    <td className="px-4 py-2 text-center">
                      {req.updatedAt
                        ? new Date(req.updatedAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-4 py-2 text-center">{req.issue}</td>
                    <td
                      className={`px-4 py-2 font-semibold  text-center ${req.status === "Complete"
                          ? "text-green-600"
                          : req.status === "Pending"
                            ? "text-yellow-600"
                            : "text-blue-600"
                        }`}
                    >
                      {req.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
