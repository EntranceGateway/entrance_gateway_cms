# Phase 1: Critical Fixes (Immediate)

**Priority**: High | **Timeline**: 1-2 days | **Risk Level**: Low

---

## 1.1 Fix Dashboard Hooks Violation

### Problem
Dashboard.jsx uses `useState` and `useEffect` inside an IIFE (Immediately Invoked Function Expression), which violates React hooks rules.

```jsx
// ❌ Current anti-pattern (lines 36-118)
{(() => {
  const [logs, setLogs] = useState([]);      // ← Hooks inside IIFE!
  const [loading, setLoading] = useState(true);
  useEffect(() => { ... }, []);
  return (...);
})()}
```

### Solution
Extract audit logs section into a separate component.

#### Create New File
**Path**: `src/pages/admin/components/RecentAuditLogs.jsx`

```jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, Clock, ArrowRight } from "lucide-react";
import auditLogService from "../../../http/auditLogService";

const RecentAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentLogs = async () => {
      try {
        const response = await auditLogService.getAllAuditLogs({ 
          page: 0, size: 5, sortDir: 'desc' 
        });
        setLogs(response.data?.content || []);
      } catch (error) {
        console.error("Failed to load recent logs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentLogs();
  }, []);

  return (
    <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* ... existing JSX from Dashboard ... */}
    </div>
  );
};

export default RecentAuditLogs;
```

#### Modify Dashboard.jsx
```jsx
import RecentAuditLogs from "./components/RecentAuditLogs";
import tokenService from "../../../src/auth/services/tokenService";

export default function Dashboard() {
  const role = tokenService.getUserRole();
  const isSuperAdmin = Array.isArray(role) 
    ? role.some(r => String(r).toLowerCase() === 'super_admin') 
    : String(role || '').toLowerCase() === 'super_admin';

  return (
    <Layout>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stats cards */}
      </div>
      
      {isSuperAdmin && <RecentAuditLogs />}
    </Layout>
  );
}
```

---

## 1.2 Standardize Token Access

### Problem
Multiple files bypass the secure `tokenService` by using direct `localStorage.getItem("token")`.

### Files to Update

| File | Line | Current Code |
|------|------|--------------|
| `src/pages/notes/AddForm.jsx` | 7 | `localStorage.getItem("token")` |

### Solution
Replace all direct localStorage access with tokenService:

```diff
- const token = localStorage.getItem("token");
+ import tokenService from "../../auth/services/tokenService";
+ const token = tokenService.getAccessToken();
```

### Search Command
Run to find all occurrences:
```bash
grep -rn "localStorage.getItem.*token" src/
```

---

## 1.3 Remove Unused Import

### Problem
vite.config.js imports `Server` from `lucide-react` but never uses it.

### Solution
```diff
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'
  import tailwindcss from '@tailwindcss/vite'
- import { Server } from 'lucide-react'
  
  export default defineConfig({
```

---

## 1.4 Fix Duplicate Export

### Problem
tokenService.js line 372 has duplicate `isAuthenticated` export.

### Solution
```diff
  export default {
    storeTokens,
    getAccessToken,
    getRefreshToken,
    getUserId,
    getUserRole,
    isTokenExpired,
    shouldRefreshToken,
    clearTokens,
    updateAccessToken,
    isAuthenticated,
-   isAuthenticated,
    getTokenInfo,
    parseJwt,
  };
```

---

## Verification Checklist

- [ ] Dashboard renders without console errors
- [ ] React DevTools shows proper hook hierarchy
- [ ] Notes creation works with tokenService
- [ ] `npm run build` completes without warnings
- [ ] `npm run lint` passes

---

## Estimated Impact

| Metric | Before | After |
|--------|--------|-------|
| Console Errors | Potential | None |
| Security | Bypassed | Enforced |
| Build Warnings | 1+ | 0 |
