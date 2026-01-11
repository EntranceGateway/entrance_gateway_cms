# Phase 4: Icon Consistency

## Objective
Standardize icon usage across the sidebar.

---

## Issues

| Issue | Location |
|-------|----------|
| Mixed icon sizes (18px vs 20px) | `Sidebar.jsx` |
| Duplicate `FileText` icon | Lines 57, 89 |

---

## Changes

### 1. Standardize Icon Sizes

**File:** `src/components/navigation/Sidebar.jsx`

```diff
- { name: "Training", icon: <BookOpen size={18} />, path: "/training/add" },
+ { name: "Training", icon: <BookOpen size={20} />, path: "/training/add" },
```

---

### 2. Fix Duplicate Icons

```diff
+ import { Archive, Presentation } from "lucide-react";

- { name: "Old Questions", icon: <FileText size={20} />, ... }
+ { name: "Old Questions", icon: <Archive size={20} />, ... }

- { name: "Training", icon: <BookOpen size={18} />, path: "/training/add" },
+ { name: "Training", icon: <Presentation size={20} />, path: "/training/add" },
```

---

## Icon Mapping

| Menu Item | Icon |
|-----------|------|
| Dashboard | `Home` |
| Audit Logs | `Shield` |
| Admin Users | `Users` |
| Courses | `FileText` |
| Notes | `BookOpen` |
| Syllabus | `FileCheck` |
| Ads | `Image` |
| **Old Questions** | `Archive` |
| Notices | `Bell` |
| Blogs | `Newspaper` |
| Colleges | `GraduationCap` |
| Settings | `Settings` |
| **Training** | `Presentation` |
| Quiz Management | `HelpCircle` |

---

## Verification
- [ ] All icons are 20px
- [ ] No duplicate icons
