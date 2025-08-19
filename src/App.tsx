import React, { useState, useEffect, type JSX } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import SubmitContentPage from "./pages/SubmitContentPage";
import ApprovalsPage from "./pages/ApprovalPage";
import Header from "./components/Header";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  userRole: string | null;
  isAuthenticated: boolean;
  logout: () => void;
  login: (token: string, role: string) => void;
}

export const AuthContext = React.createContext<AuthContextType>({
  userRole: null,
  isAuthenticated: false,
  logout: () => {},
  login: () => {},
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUserRole(decoded.user.role);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("token");
        }
      } catch (e) {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUserRole(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  const login = (token: string, role: string) => {
    localStorage.setItem("token", token);
    setUserRole(role);
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider value={{ userRole, isAuthenticated, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

const PrivateRoute = ({
  children,
  allowedRoles,
}: {
  children: JSX.Element;
  allowedRoles: string[];
}) => {
  const auth = React.useContext(AuthContext);
  if (!auth?.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (
    allowedRoles.length > 0 &&
    auth.userRole &&
    !allowedRoles.includes(auth.userRole)
  ) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRoles={["user", "admin"]}>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/submit"
            element={
              <PrivateRoute allowedRoles={["user"]}>
                <SubmitContentPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/approvals"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <ApprovalsPage />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
