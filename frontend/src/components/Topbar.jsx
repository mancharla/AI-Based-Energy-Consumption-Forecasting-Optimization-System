import { useNavigate } from "react-router-dom";

function Topbar() {
  const navigate = useNavigate();

  const user = localStorage.getItem("currentUser");

  const logout = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("token");

  navigate("/login");
};

  return (
    <header className="topbar">
      <div>
        <h1>⚡ Energy AI Dashboard</h1>
        <p>Welcome, {user}</p>
      </div>

      <button onClick={logout}>Logout</button>
    </header>
  );
}

export default Topbar;