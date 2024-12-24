import React from "react";
import { Button } from "@/components/ui/button";

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => onSelectCategory(category)}
          className="capitalize"
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
