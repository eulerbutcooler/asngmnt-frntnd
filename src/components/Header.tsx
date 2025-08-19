import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "../hooks/useAuth";

const Header = () => {
  const { userRole, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-xl font-bold text-gray-800">
          Content Tool
        </Link>
        <nav className="space-x-4">
          {isAuthenticated ? (
            <>
              {userRole === "user" && (
                <Link to="/submit">
                  <Button variant="ghost">Submit Content</Button>
                </Link>
              )}
              {userRole === "admin" && (
                <Link to="/approvals">
                  <Button variant="ghost">Approvals</Button>
                </Link>
              )}
              <Link to="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Button onClick={handleLogout} variant="destructive">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup">
                <Button variant="ghost">Signup</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
