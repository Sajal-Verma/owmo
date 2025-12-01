import axiosInstance from "../utils/authInterceptor";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry, themeQuartz } from "ag-grid-community";
import { toast } from "react-toastify";
import { store } from "../context/StoreProvider";

ModuleRegistry.registerModules([AllCommunityModule]);

// Status colors map
const STATUS_COLORS = {
  completed: "green",
  pending: "red",
  "in progress": "orange",
  assigned: "purple",
  cancelled: "gray",
};

const ChatRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(store);
  const navigate = useNavigate();

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
      cellRenderer: (params) => {
        const value = (params.value || "").toLowerCase(); // normalize
        let color = "blue"; // default

        switch (value) {
          case "completed":
            color = "green";
            break;
          case "pending":
            color = "red";
            break;
          case "in progress":
          case "in_progress":
            color = "orange";
            break;
          case "assigned":
            color = "purple";
            break;
          case "cancelled":
            color = "gray";
            break;
          default:
            color = "blue";
        }

        return (
          <span
            style={{
              fontWeight: "bold",
              color,
              textTransform: "capitalize",
            }}
          >
            {params.value}
          </span>
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
    navigate(`/request-Chats/${e.data._id}`);
  };



  return (
    <div className=" flex flex-col items-center bg-gray-100">

      {loading ? (
        <p className="text-gray-600">⏳ Loading...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-600">No requests found.</p>
      ) : (
        <>
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

export default ChatRequests;
