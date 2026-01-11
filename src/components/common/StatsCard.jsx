import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const VARIANTS = {
  indigo: "from-indigo-500 to-indigo-600",
  purple: "from-purple-500 to-purple-600", 
  emerald: "from-emerald-500 to-emerald-600",
  amber: "from-amber-500 to-amber-600",
};

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  variant = "indigo",
  trend,
  trendLabel 
}) => {
  return (
    <div className={`bg-gradient-to-br ${VARIANTS[variant]} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
          {trend !== undefined && (
            <p className={`text-xs mt-2 flex items-center gap-1 ${trend >= 0 ? 'text-white/70' : 'text-red-200'}`}>
              {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(trend)}% {trendLabel || 'from last month'}
            </p>
          )}
        </div>
        <div className="bg-white/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
          {Icon && <Icon className="text-white" size={28} />}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
