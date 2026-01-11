# Phase 1: Dashboard Enhancement

## Objective
Transform basic dashboard stat cards into visually impressive, production-ready components.

---

## Current State
- 4 plain white stat cards with static values
- No icons or visual indicators
- Missing PageHeader component

---

## Changes

### 1. Create StatsCard Component

**File:** `src/components/common/StatsCard.jsx`

```jsx
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
```

---

### 2. Update Dashboard.jsx

```jsx
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/common/PageHeader";
import StatsCard from "@/components/common/StatsCard";
import RecentAuditLogs from "./components/RecentAuditLogs";
import tokenService from "@/auth/services/tokenService";
import { GraduationCap, BookOpen, FileText, ClipboardList } from "lucide-react";

export default function Dashboard() {
  const role = tokenService.getUserRole();
  const isSuperAdmin = Array.isArray(role)
    ? role.some(r => String(r).toLowerCase() === 'super_admin')
    : String(role || '').toLowerCase() === 'super_admin';

  const stats = [
    { title: "Total Colleges", value: "42", icon: GraduationCap, variant: "indigo", trend: 12 },
    { title: "Total Courses", value: "210", icon: BookOpen, variant: "purple", trend: 8 },
    { title: "Notes Uploaded", value: "350", icon: FileText, variant: "emerald", trend: 15 },
    { title: "Entrance Forms", value: "1,420", icon: ClipboardList, variant: "amber", trend: -3 },
  ];

  return (
    <Layout>
      <PageHeader title="Dashboard" breadcrumbs={[]} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatsCard key={idx} {...stat} />
        ))}
      </div>

      {isSuperAdmin && <RecentAuditLogs />}
    </Layout>
  );
}
```

---

## Verification
- [ ] 4 gradient stat cards visible
- [ ] Each card has unique color and icon
- [ ] Icons animate on hover
- [ ] Responsive on mobile
