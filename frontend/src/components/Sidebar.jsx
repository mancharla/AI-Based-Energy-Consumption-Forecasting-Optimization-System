import { NavLink } from "react-router-dom";

function Sidebar() {
  const links = [
    { path: "/", label: "📊 Dashboard" },
    { path: "/upload", label: "📁 Upload Dataset" },
    { path: "/forecast", label: "📈 Forecast" },
    { path: "/peaks", label: "🚨 Peak Usage" },
    { path: "/anomalies", label: "⚠️ Anomalies" },
    { path: "/recommendations", label: "💡 Recommendations" },
    { path: "/simulation", label: "🧪 Simulation" },
    { path: "/reports", label: "📄 Reports" },
  ];

  return (
    <aside className="sidebar">
      <h2>⚡ Energy AI</h2>

      <nav>
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;