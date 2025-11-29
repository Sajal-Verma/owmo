import { useState, useEffect, useContext } from "react";
import { AgGridReact } from "ag-grid-react";
import { store } from "../context/StoreProvider";
import axiosInstance from "../utils/authInterceptor";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { themeQuartz } from "ag-grid-community";
import LoadingPage  from "../Componets/LoadingPage.jsx";

ModuleRegistry.registerModules([AllCommunityModule]);

const UsersGrid = ({ role }) => {
  const { user } = useContext(store);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);

  const [columnDefs] = useState([
    { field: "_id", hide: true },
    { headerName: "Name", field: "name", sortable: true, filter: true, flex: 1 },
    { headerName: "Email", field: "email", sortable: true, filter: true, flex: 1 },
    { headerName: "Phone", field: "phone", flex: 1 },
    { headerName: "Address", field: "address", sortable: true, filter: true, flex: 1 },
  ]);

  const myTheme = themeQuartz.withParams({
    spacing: 6,
    foregroundColor: "rgb(0, 0, 0)",
    backgroundColor: "rgb(187 189 188)",
    headerBackgroundColor: "rgb(162, 166, 164)",
    rowHoverColor: "rgb(202, 204, 203)",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      setLoading(true); // START loading

      try {
        const res = await axiosInstance.post(`/user/showAll/${user.id}`, {
          role,
        });

        if (res.status !== 200) {
          toast.error(res.data?.message || "Failed to load user data");
          return;
        }

        console.log("Users:", res.data.users);
        setRowData(res.data.users || []);
      } catch (err) {
        console.error("Error fetching user data:", err);
        toast.error("Something went wrong while fetching data");
      } finally {
        setLoading(false); // END loading
      }
    };

    fetchUserData();
  }, [user, role]);

  const rowClick = (e) => {
    navigate(`/user-details/${e.data._id}`);
  };

  // 🔥 SHOW LOADING SCREEN
  if (loading) return <LoadingPage />;

  return (
    <div theme={myTheme} style={{ height: 500 }}>
      <AgGridReact
        theme={myTheme}
        rowData={rowData}
        columnDefs={columnDefs}
        rowSelection="single"
        onRowClicked={rowClick}
      />
    </div>
  );
};

export default UsersGrid;
