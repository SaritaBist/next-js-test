"use client";

import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  color?: "default" | "blue" | "green" | "yellow" | "red";
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color = "default" }) => {
  const getColorClasses = () => {
    switch (color) {
      case "blue":
        return "text-blue-600";
      case "green":
        return "text-green-600";
      case "yellow":
        return "text-yellow-600";
      case "red":
        return "text-red-600";
      default:
        return "text-gray-900";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className={`text-3xl font-bold mt-2 ${getColorClasses()}`}>{value}</p>
    </div>
  );
};

export default StatCard;