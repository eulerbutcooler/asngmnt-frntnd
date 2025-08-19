import { useState, useEffect } from "react";
import api from "../api/axios";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

interface Content {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  createdBy?: {
    email: string;
  };
}

const ApprovalsPage = () => {
  const [pendingContent, setPendingContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingContent = async () => {
    try {
      const response = await api.get("/content/search?status=pending");
      setPendingContent(response.data);
    } catch (error) {
      console.error("Failed to fetch pending content:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingContent();
  }, []);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    try {
      await api.put(`/content/${id}/${action}`);
      fetchPendingContent();
    } catch (error) {
      console.error(`Failed to ${action} content:`, error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Approvals Page</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Pending Submissions</h2>
        {pendingContent.length === 0 ? (
          <p className="text-gray-500">No pending content to approve.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingContent.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.createdBy?.email || "N/A"}</TableCell>
                  <TableCell className="space-x-2">
                    <Button onClick={() => handleAction(item._id, "approve")}>
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleAction(item._id, "reject")}
                    >
                      Reject
                    </Button>
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

export default ApprovalsPage;
