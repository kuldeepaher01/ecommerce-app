"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Mail, Package, Loader2, Hash, XCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Orders = () => {
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState("email");
  const [searchValue, setSearchValue] = useState("");

  const fetchOrders = async () => {
    if (!searchValue) return;

    setLoading(true);
    console.log("Fetching orders with:", {
      [searchType === "email" ? "buyerEmail" : "orderId"]: searchValue,
    });

    try {
      const params = {
        [searchType === "email" ? "buyerEmail" : "orderId"]: searchValue,
      };
      const queryKey = Object.keys(params)[0];
      const queryValue = encodeURIComponent(params[queryKey]);
      const url = `https://ecommerce-app-bnmg.onrender.com/api/orders?${queryKey}=${queryValue}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();

      console.log("Response:", data);
      const orderData = Array.isArray(data) ? data : [data];
      setOrders(orderData);
      console.log("Fetched orders:", orderData);

      toast.success(
        `Found ${data.length} order${data.length !== 1 ? "s" : ""}`,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } catch (error) {
      console.error("Error fetching orders:", error);
      const errorMessage =
        error.response?.status === 404
          ? "No orders found."
          : "Failed to fetch orders. Please try again.";

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "recieved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";

      case "processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      console.log("Cancelling order:", orderId);
      const response = await fetch(
        `https://ecommerce-app-bnmg.onrender.com/api/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "cancelled" }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel order");
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "cancelled" } : order
        )
      );
      toast.success(`Order cancelled successfully`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error(`Failed to cancel order`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const renderOrdersTable = () => {
    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      return (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No Orders Found</h3>
            <p className="text-gray-500">
              Search by {searchType === "email" ? "email address" : "order ID"}{" "}
              to view orders.
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px] min-w-[250px]">
                  Product
                </TableHead>
                <TableHead className="w-[200px] min-w-[200px]">
                  Order Details
                </TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Date</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="hover:bg-gray-50">
                  <TableCell className="p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                      <div className="flex-shrink-0">
                        {order.Product?.imageUrl ? (
                          <img
                            src={order.Product.imageUrl}
                            alt={order.Product.name}
                            className="h-16 w-16 rounded-md object-cover"
                            onError={(e) => {
                              e.target.src = "/api/placeholder/64/64";
                              e.target.alt = "Product image not available";
                            }}
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-md bg-gray-200 flex items-center justify-center">
                            <Package className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {order.Product?.name || "N/A"}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${order.Product?.price || "N/A"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">#{order.id}</p>
                      <p className="text-sm text-gray-500">
                        {order.buyerEmail}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-gray-100">
                      <span className="font-medium">{order.quantity || 1}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status || "Unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="gap-2">
                      <span>
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : "Not available"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {!["cancelled", "recieved"].includes(
                      order.status?.toLowerCase()
                    ) && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will cancel
                              your order.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>
                              No, keep my order
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleCancelOrder(order.id)}
                            >
                              Yes, cancel order
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6" />
            Order History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={searchType}
            onValueChange={setSearchType}
            className="mb-6"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Search by Email</TabsTrigger>
              <TabsTrigger value="orderId">Search by Order ID</TabsTrigger>
            </TabsList>
          </Tabs>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="relative flex-1">
              {searchType === "email" ? (
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              ) : (
                <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              )}
              <Input
                type={searchType === "email" ? "email" : "text"}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={
                  searchType === "email"
                    ? "Enter your email address"
                    : "Enter order ID"
                }
                className="pl-10"
                required
              />
            </div>
            <Button type="submit" disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              Search Orders
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-gray-600">Loading orders...</p>
        </div>
      ) : (
        renderOrdersTable()
      )}
    </div>
  );
};

export default Orders;
