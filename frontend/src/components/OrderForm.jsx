import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const OrderForm = ({ product, onSubmit, onClose, isProcessing }) => {
  const [formData, setFormData] = useState({
    buyerName: "",
    buyerEmail: "",
    buyerAddress: "",
    buyerCell: "",
    quantity: 1,
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.buyerName.trim()) newErrors.buyerName = "Name is required";
    if (!formData.buyerEmail.trim()) newErrors.buyerEmail = "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(formData.buyerEmail))
      newErrors.buyerEmail = "Invalid email format";
    if (!formData.buyerCell.trim())
      newErrors.buyerCell = "Phone number is required";
    if (!formData.buyerAddress.trim())
      newErrors.buyerAddress = "Address is required";
    if (formData.quantity < 1)
      newErrors.quantity = "Quantity must be at least 1";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit({
      productId: product.id,
      ...formData,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Order: {product.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="buyerName">Full Name</Label>
            <Input
              id="buyerName"
              name="buyerName"
              value={formData.buyerName}
              onChange={handleChange}
              placeholder="John Doe"
              className={errors.buyerName ? "border-red-500" : ""}
            />
            {errors.buyerName && (
              <p className="text-sm text-red-500">{errors.buyerName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="buyerEmail">Email</Label>
            <Input
              id="buyerEmail"
              name="buyerEmail"
              type="buyerEmail"
              value={formData.buyerEmail}
              onChange={handleChange}
              placeholder="john@example.com"
              className={errors.buyerEmail ? "border-red-500" : ""}
            />
            {errors.buyerEmail && (
              <p className="text-sm text-red-500">{errors.buyerEmail}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="buyerCell">Phone Number</Label>
            <Input
              id="buyerCell"
              name="buyerCell"
              type="tel"
              value={formData.buyerCell}
              onChange={handleChange}
              placeholder="123-456-7890"
              className={errors.buyerCell ? "border-red-500" : ""}
            />
            {errors.buyerCell && (
              <p className="text-sm text-red-500">{errors.buyerCell}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="buyerAddress">Delivery Address</Label>
            <Input
              id="buyerAddress"
              name="buyerAddress"
              value={formData.buyerAddress}
              onChange={handleChange}
              placeholder="123 Main St, City, Country"
              className={errors.buyerAddress ? "border-red-500" : ""}
            />
            {errors.buyerAddress && (
              <p className="text-sm text-red-500">{errors.buyerAddress}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              className={errors.quantity ? "border-red-500" : ""}
            />
            {errors.quantity && (
              <p className="text-sm text-red-500">{errors.quantity}</p>
            )}
          </div>

          <div className="flex justify-between mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Order Now - $${(product.price * formData.quantity).toFixed(2)}`
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderForm;
