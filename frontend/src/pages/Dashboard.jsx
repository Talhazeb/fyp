import React, { useState } from "react";
import Sidebar from "../components/Sidebar2";
import Panel from "../components/Panel";

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <div>You are not authorized to access this page. Please log in.</div>;
  }

  return (
    <React.Fragment>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Panel collapsed={collapsed} />
    </React.Fragment>
  );
}
