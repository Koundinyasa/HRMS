import { useState } from "react";
import { ROLES_ACCESS_SIDEBAR_TABS } from "../constants/userManagementConstants";

const RolesAccessSidebar = () => {
  const [active, setActive] = useState(ROLES_ACCESS_SIDEBAR_TABS[0]);

  return (
    <div className="flex gap-3 mb-5">
      {ROLES_ACCESS_SIDEBAR_TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
            active === tab ? "bg-green-500 text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default RolesAccessSidebar;
