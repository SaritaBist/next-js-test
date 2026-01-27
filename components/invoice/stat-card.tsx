"use client";

import React from "react";
import { TrendingUp, DollarSign, CheckCircle, Clock, AlertCircle } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  color?: "default" | "blue" | "green" | "yellow" | "red";
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color = "default" }) => {
  const getColorClasses = () => {
    switch (color) {
      case "blue":
        return {
          text: "text-blue-400",
          icon: "bg-blue-500",
          Icon: DollarSign
        };
      case "green":
        return {
          text: "text-green-400",
          icon: "bg-green-500",
          Icon: CheckCircle
        };
      case "yellow":
        return {
          text: "text-yellow-400",
          icon: "bg-yellow-500",
          Icon: Clock
        };
      case "red":
        return {
          text: "text-red-400",
          icon: "bg-red-500",
          Icon: AlertCircle
        };
      default:
        return {
          text: "text-cyan-500",
          icon: "bg-cyan-500",
          Icon: TrendingUp
        };
    }
  };

  const colors = getColorClasses();
  const Icon = colors.Icon;

  return (
    <div className={`$ bg-white border border-blue-100 rounded-xl hover:shadow-md   p-6 transform transition-all duration-200 hover:scale-105 `}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide">{title}</p>
        <div className={`${colors.icon} p-2 rounded-lg shadow-md`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </div>
      <p className={`text-3xl font-bold ${colors.text} tracking-tight`}>{value}</p>
    </div>
  );
};

export default StatCard;