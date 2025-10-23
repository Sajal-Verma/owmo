
import Tab from "../Componets/ProfileTab";
import Dashboard from "../Componets/Dashboard"
import ProfileData from "../Componets/ProfileData";



export default function Profile() {
  const tabData = [
    { label: "My Profile", content: <ProfileData/> },
    { label: "Profil", content:"jay siya ram" },
    { label: "Settings", content: "radhe radhe" },
    { label: "Dashboards", content: <Dashboard/> },
  ];

  return (
    <div>
      <Tab tabs={tabData} />
    </div>
  );
}
