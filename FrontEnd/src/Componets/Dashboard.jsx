import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import axiosInstance from "../utils/authInterceptor";
import { useEffect, useState, useContext } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry, themeQuartz } from "ag-grid-community";
import { toast } from "react-toastify";
import { store } from "../context/StoreProvider";

ModuleRegistry.registerModules([AllCommunityModule]);

const COLORS = ["#4CAF50", "#FF5252", "#FFC107"]; // Completed, Pending, In-progress

const Dashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(store);

  const columnDefs = [
    { headerName: "Brand", field: "brand", sortable: true, filter: true, flex: 1 },
    { headerName: "Model", field: "model", sortable: true, filter: true, flex: 1 },

    {
      headerName: "Updated Date",
      field: "updatedAt",
      sortable: true,
      filter: true,
      flex: 1,
      valueFormatter: (p) =>
        p.value ? new Date(p.value).toLocaleDateString() : "N/A",
    },

    { headerName: "Issue", field: "issue", sortable: true, filter: true, flex: 1 },

    {
      headerName: "Status",
      field: "status",
      flex: 1,
      cellRenderer: (p) => {
        const s = p.value?.toLowerCase();
        let color = "blue";

        if (s === "completed") color = "green";
        else if (s === "pending") color = "red";
        else if (s === "in progress") color = "orange";

        return (
          <span style={{ fontWeight: "bold", color }}>{p.value}</span>
        );
      },
    },
  ];

  const myTheme = themeQuartz.withParams({
    spacing: 6,
    foregroundColor: "rgb(0, 0, 0)",
    backgroundColor: "rgb(187 189 188)",
    headerBackgroundColor: "rgb(162, 166, 164)",
    rowHoverColor: "rgb(202, 204, 203)",
  });

  // Fetch all requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        if (!user) {
          toast.error("No user data found. Login again.");
          setLoading(false);
          return;
        }

        const res = await axiosInstance.post("/request/seeall", {
          id: user.id,
          role: user.role,
        });


        
        if (res.status === 200 || res.status === 201) {
          const reqs = res.data.requests || [];
          reqs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          console.log(reqs);
          setRequests(reqs);
        } else {
          toast.error("Unable to load data.");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user]);


  const rowClick = (e) => {
    navigate(`/request-details/${e.data._id}`);
  };

  // Pie chart counts
  const completeCount = requests.filter((r) => r.status === "completed").length;
  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const progressCount = requests.filter((r) => r.status === "in progress").length;

  const chartData = [
    { name: "Completed", value: completeCount },
    { name: "Pending", value: pendingCount },
    { name: "In Progress", value: progressCount },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-10 px-4">

      {loading ? (
        <p className="text-gray-600">⏳ Loading...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-600">No requests found.</p>
      ) : (
        <>
          {/* Pie Chart */}
          <div className="w-40 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={(p) => `${p.name}: ${p.value}`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex gap-6 mt-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Completed ({completeCount})</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>Pending ({pendingCount})</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span>In Progress ({progressCount})</span>
            </div>
          </div>

          <h2 className="text-lg font-bold text-gray-700 mt-6">Requests</h2>

          {/* AG Grid */}
          <div
            className="ag-theme-quartz mt-6 w-full max-w-5xl"
            style={{ height: 450 }}
          >
            <AgGridReact
              rowData={requests}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={10}
              theme={myTheme}
              onRowClicked={rowClick}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
