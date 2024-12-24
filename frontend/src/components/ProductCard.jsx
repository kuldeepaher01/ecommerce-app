import React from "react";
import { ShoppingCart, Pencil, Trash2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ProductCard = ({ product, onEdit, onDelete, onOrder }) => {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="relative p-0 overflow-hidden">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        )}
        <div className="absolute right-2 top-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => onEdit(product)}
            className="h-8 w-8 bg-white/90 hover:bg-white"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => onDelete(product)}
            className="h-8 w-8 bg-white/90 hover:bg-white text-destructive hover:text-destructive/90"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h2 className="text-xl font-bold group-hover:text-primary transition-colors mb-2">
          {product.name}
        </h2>
        {product.category && (
          <Badge variant="secondary" className="capitalize mb-2">
            {product.category}
          </Badge>
        )}
        <p className="text-gray-600 text-sm line-clamp-2">
          {product.description}
        </p>
        {product.stock && (
          <p className="text-sm text-gray-500 mt-2">
            {product.stock} items in stock
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4">
        <div className="space-y-1">
          <p className="text-2xl font-bold">${product.price}</p>
          {product.discount && (
            <p className="text-sm text-green-600">Save {product.discount}%</p>
          )}
        </div>
        <Button onClick={() => onOrder(product)} className="relative">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Order
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
