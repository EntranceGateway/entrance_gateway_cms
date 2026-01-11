import Layout from "@/components/layout/Layout";
import React from "react";
import tokenService from "../../../src/auth/services/tokenService";
import RecentAuditLogs from "./components/RecentAuditLogs";
import PageHeader from "@/components/common/PageHeader";
import StatsCard from "@/components/common/StatsCard";
import { GraduationCap, BookOpen, FileText, ClipboardList } from "lucide-react";

export default function Dashboard() {
  const role = tokenService.getUserRole();
  const isSuperAdmin = Array.isArray(role)
    ? role.some((r) => String(r).toLowerCase() === "super_admin")
    : String(role || "").toLowerCase() === "super_admin";

  // Static stats data as per Phase 1 plan
  // In a real implementation, these would be fetched from an API
  const stats = [
    {
      title: "Total Colleges",
      value: "42",
      icon: GraduationCap,
      variant: "indigo",
      trend: 12,
    },
    {
      title: "Total Courses",
      value: "210",
      icon: BookOpen,
      variant: "purple",
      trend: 8,
    },
    {
      title: "Notes Uploaded",
      value: "350",
      icon: FileText,
      variant: "emerald",
      trend: 15,
    },
    {
      title: "Entrance Forms",
      value: "1,420",
      icon: ClipboardList,
      variant: "amber",
      trend: -3,
    },
  ];

  return (
    <Layout>
      <PageHeader title="Dashboard" breadcrumbs={[]} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <StatsCard key={idx} {...stat} />
        ))}
      </div>

      {/* Recent Audit Logs (Only for Super Admin) */}
      {isSuperAdmin && <RecentAuditLogs />}
    </Layout>
  );
}

