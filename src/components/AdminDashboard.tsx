import { useState, useEffect } from "react";
import api from "../api/axios";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Content {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  createdBy?: {
    email: string;
  };
  createdAt: string;
}

interface Analytics {
  approved: number;
  pending: number;
  rejected: number;
  total: number;
}

const COLORS = ["#4ade80", "#fde047", "#f87171"];

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [content, setContent] = useState<Content[]>([]);
  const [recentActivity, setRecentActivity] = useState<Content[]>([]);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const analyticsResponse = await api.get("/content/stats");
      setAnalytics(analyticsResponse.data);

      const allContentResponse = await api.get("/content");
      setContent(allContentResponse.data);

      const recentResponse = await api.get("/content/recent");
      setRecentActivity(recentResponse.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      let url = "/content/search";
      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== "all") {
        params.append("status", statusFilter);
      }
      if (keyword) {
        params.append("keyword", keyword);
      }
      url = `${url}?${params.toString()}`;
      const response = await api.get(url);
      setContent(response.data);
    } catch (error) {
      console.error("Failed to search content:", error);
    }
  };

  const handleAction = async (id: string, action: "approve" | "reject") => {
    try {
      await api.put(`/content/${id}/${action}`);
      fetchDashboardData();
    } catch (error) {
      console.error(`Failed to ${action} content:`, error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  const chartData = analytics
    ? [
        { name: "Approved", value: analytics.approved },
        { name: "Pending", value: analytics.pending },
        { name: "Rejected", value: analytics.rejected },
      ]
    : [];

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-green-500 text-white">
          <CardHeader>
            <CardTitle>Approved</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold">
            {analytics?.approved}
          </CardContent>
        </Card>
        <Card className="bg-yellow-500 text-white">
          <CardHeader>
            <CardTitle>Pending</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold">
            {analytics?.pending}
          </CardContent>
        </Card>
        <Card className="bg-red-500 text-white">
          <CardHeader>
            <CardTitle>Rejected</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold">
            {analytics?.rejected}
          </CardContent>
        </Card>
        <Card className="bg-gray-700 text-white">
          <CardHeader>
            <CardTitle>Total Submissions</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold">
            {analytics?.total}
          </CardContent>
        </Card>
      </div>

      <div className="mb-8 bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Content Status</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {chartData.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mb-8 flex space-x-4">
        <Input
          placeholder="Search by keyword..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="flex-grow"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">All Submissions</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted By</TableHead>
              <TableHead>Actions</TableHead>
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
                <TableCell>{item.createdBy?.email || "N/A"}</TableCell>
                <TableCell>
                  {item.status === "pending" ? (
                    <div className="space-x-2">
                      <Button onClick={() => handleAction(item._id, "approve")}>
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleAction(item._id, "reject")}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <span className="text-gray-500">N/A</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted By</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentActivity.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.title}</TableCell>
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
                    `}
                  >
                    {item.status}
                  </span>
                </TableCell>
                <TableCell>{item.createdBy?.email || "N/A"}</TableCell>
                <TableCell>
                  {new Date(item.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminDashboard;
