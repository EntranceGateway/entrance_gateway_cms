import React, { useState } from "react";
import { Settings, User, Lock, Bell, Mail, Phone, Shield, Save } from "lucide-react";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/common/PageHeader";

export default function AdminSettings() {
  // Mock state for UI demonstration
  const [profile, setProfile] = useState({
    name: "Super Admin",
    email: "superadmin@gmail.com",
    phone: "",
    role: "SUPER_ADMIN"
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: false
  });

  return (
    <Layout>
      <PageHeader
        title="Account Settings"
        subtitle="Manage your profile, security preferences, and notifications"
        breadcrumbs={[{ label: "Settings" }]}
        icon={Settings}
      />

      <div className="max-w-5xl mx-auto pb-12 space-y-8">
        
        {/* Profile Card */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Profile Information
            </h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wide">
              {profile.role.replace('_', ' ')}
            </span>
          </div>
          
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="+977 98XXXXXXXX"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-gray-500 transition-colors" />
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed font-medium select-none"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">Verified</div>
                </div>
                <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Email cannot be changed for security reasons.
                </p>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-end">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-sm shadow-blue-200 hover:shadow-blue-300">
              <Save className="w-4 h-4" />
              Save Profile
            </button>
          </div>
        </section>

        {/* Security Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-orange-600" />
              Security Settings
            </h2>
          </div>
          
          <div className="p-6 md:p-8">
            <div className="max-w-2xl space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                  placeholder="Enter current password"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-end">
             <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all">
              Update Password
            </button>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-600" />
              Notification Preferences
            </h2>
          </div>
          
          <div className="p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all cursor-pointer" onClick={() => setNotifications(prev => ({...prev, email: !prev.email}))}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${notifications.email ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-500">Receive system updates and security alerts via email</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${notifications.email ? 'bg-blue-600' : 'bg-gray-200'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${notifications.email ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-purple-100 hover:bg-purple-50/30 transition-all cursor-pointer" onClick={() => setNotifications(prev => ({...prev, push: !prev.push}))}>
               <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${notifications.push ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'}`}>
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Push Notifications</h3>
                  <p className="text-sm text-gray-500">Receive real-time alerts on your device</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${notifications.push ? 'bg-purple-600' : 'bg-gray-200'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${notifications.push ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}
