import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import AdminDashboard from "../components/AdminDashboard";

interface Content {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  createdBy?: {
    email: string;
  };
}

const DashboardPage = () => {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const { userRole } = useAuth();

  useEffect(() => {
    // Only fetch content for regular users
    if (userRole === "user") {
      const fetchContent = async () => {
        try {
          const response = await api.get("/content");
          setContent(response.data);
        } catch (error) {
          console.error("Failed to fetch content:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchContent();
    } else {
      setLoading(false);
    }
  }, [userRole]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // Conditionally render based on user role
  if (userRole === "admin") {
    return <AdminDashboard />;
  }

  // Regular user dashboard content
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Your Submissions</h2>
        {content.length === 0 ? (
          <p className="text-gray-500">You have no submissions yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {content.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium
                    ${
                      item.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : ""
                    }
                    ${
                      item.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : ""
                    }
                    ${
                      item.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : ""
                    }
                    `}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
