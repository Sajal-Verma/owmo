
import Tab from "../Componets/ProfileTab";
import Dashboard from "../Componets/Dashboard"
import ProfileData from "../Componets/ProfileData";
import UsersGrid from "./allUser";
import { store } from "../context/StoreProvider";
import { useContext } from "react";


/*
*/
export default function Profile() {
  const { user } = useContext(store);

  if (!user) return <p>Loading...</p>;

  let tabData = [];

  switch (user.role) {
    case "admin":
      tabData = [
        { label: "My Profile", content: <ProfileData /> },
        { label: "Users", content: <UsersGrid role="user" />},
        { label: "Technicians", content: <UsersGrid role="technician" /> },
        { label: "Requests", content: <Dashboard /> },
        { label: "Update Quiz", content: <Dashboard /> },
      ];
      break;

    case "technician":
      tabData = [
        { label: "My Profile", content: <ProfileData /> },
        { label: "Requests", content: <Dashboard /> },
        { label: "Chat", content: "radhe radhe" },
        { label: "Dashboard", content: <Dashboard /> },
      ];
      break;

    default:
      tabData = [
        { label: "My Profile", content: <ProfileData /> },
        { label: "All Requests", content: <Dashboard /> },
        { label: "Free Diagnostic", content: "radhe radhe" },
        { label: "Chat", content: <Dashboard /> },
      ];
  }

  return (
    <div>
      <Tab tabs={tabData} />
    </div>
  );
}

