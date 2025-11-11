import React from 'react';
import { Card, CardHeader } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function StatsCards({ title, value, icon: Icon, bgColor, trend }) {
  return (
    <Card className="relative overflow-hidden border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <div className={`absolute top-0 right-0 w-24 h-24 transform translate-x-8 -translate-y-8 ${bgColor} rounded-full opacity-20`} />
      <CardHeader className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">
              {value}
            </p>
          </div>
          <div className={`p-3 rounded-xl ${bgColor} bg-opacity-20 ml-4`}>
            <Icon className={`w-6 h-6 ${bgColor.replace('bg-', 'text-')}`} />
          </div>
        </div>
        {trend && (
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
            <span className="text-green-600 font-medium">{trend}</span>
          </div>
        )}
      </CardHeader>
    </Card>
  );
}