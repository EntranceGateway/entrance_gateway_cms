# Phase 3: Badge System Standardization

## Objective
Create unified badge system for consistent visual language.

---

## Current Problem
Different tables use inconsistent badge styles.

---

## Changes

### 1. Create Badge Constants

**File:** `src/constants/badges.js`

```javascript
export const BADGE_VARIANTS = {
  subject: 'bg-purple-50 text-purple-700 border-purple-200',
  course: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  code: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  affiliation: 'bg-blue-50 text-blue-700 border-blue-200',
  semester: 'bg-amber-50 text-amber-700 border-amber-200',
  year: 'bg-gray-100 text-gray-700 border-gray-200',
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  inactive: 'bg-gray-100 text-gray-600 border-gray-200',
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  create: 'bg-green-50 text-green-700 border-green-200',
  update: 'bg-blue-50 text-blue-700 border-blue-200',
  delete: 'bg-red-50 text-red-700 border-red-200',
  default: 'bg-gray-100 text-gray-700 border-gray-200',
};
```

---

### 2. Create Badge Component

**File:** `src/components/common/Badge.jsx`

```jsx
import React from "react";
import { BADGE_VARIANTS } from "@/constants/badges";

const Badge = ({ variant = "default", size = "sm", children }) => {
  const colors = BADGE_VARIANTS[variant] || BADGE_VARIANTS.default;
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${colors} ${sizes[size]}`}>
      {children}
    </span>
  );
};

export default Badge;
```

---

### 3. Usage in Tables

```diff
+ import Badge from "@/components/common/Badge";

- <span className="px-2 py-1 text-xs font-semibold rounded-md bg-purple-100 text-purple-700">
-   {row.subjectCode || "N/A"}
- </span>
+ <Badge variant="code">{row.subjectCode || "N/A"}</Badge>
```

---

## Color Reference

| Variant | Color | Usage |
|---------|-------|-------|
| `subject` | Purple | Subject names |
| `course` | Emerald | Course names |
| `code` | Indigo | Subject codes |
| `affiliation` | Blue | Universities |
