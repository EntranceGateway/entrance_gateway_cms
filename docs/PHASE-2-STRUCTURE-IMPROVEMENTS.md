# Phase 2: Structure Improvements (Short-term)

**Priority**: Medium | **Timeline**: 3-5 days | **Risk Level**: Medium

---

## 2.1 Consolidate Component Folders

### Problem
Components are scattered across two locations:
- `/components/` (Sidebar, Spinner, layout, navbar)
- `/src/components/` (FileViewer, pdfview)

### Migration Steps

#### Step 1: Create unified structure
```bash
mkdir -p src/components/layout
mkdir -p src/components/navigation
mkdir -p src/components/common
mkdir -p src/components/pdf
```

#### Step 2: Move files
```bash
# Move from root /components to /src/components
mv components/layout/Layout.jsx src/components/layout/
mv components/Sidebar/Sidebar.jsx src/components/navigation/
mv components/navbar/Navbar.jsx src/components/navigation/
mv components/Spinner/Spinner.jsx src/components/common/

# Move existing src/components
mv src/components/FileViewer/* src/components/pdf/
mv src/components/pdfview/* src/components/pdf/
```

#### Step 3: Update imports in all files
```diff
- import Layout from "../../../components/layout/Layout";
+ import Layout from "@/components/layout/Layout";

- import Sidebar from "../../components/Sidebar/Sidebar";
+ import Sidebar from "@/components/navigation/Sidebar";
```

#### Step 4: Delete empty folders
```bash
rm -rf components/
rm -rf src/components/FileViewer
rm -rf src/components/pdfview
```

### Files Requiring Import Updates
| File Pattern | Count (approx) |
|--------------|----------------|
| `src/pages/**/**.jsx` | 40+ |
| `src/App.jsx` | 1 |

---

## 2.2 Move Redux Store to src

### Problem
Redux store is at `/store/` instead of `/src/store/`.

### Migration Steps

```bash
# Move store folder
mv store/ src/store/

# Update imports in:
# - src/App.jsx
# - Any file importing from "../store/" or "../../store/"
```

### Files to Update

| File | Current Import | New Import |
|------|---------------|------------|
| `src/App.jsx` | `../store/store` | `./store/store` |
| `src/pages/login/Adminlogin.jsx` | `../../../store/authSlice` | `@/store/authSlice` |

---

## 2.3 Fix Malformed Folder Name

### Problem
`src/pages/notes/components/form.jsx/` is a folder with `.jsx` extension.

### Solution
```bash
mv "src/pages/notes/components/form.jsx" "src/pages/notes/components/form"
```

### Update Import
```diff
- import NoteForm from "./components/form.jsx/NotesFrom";
+ import NoteForm from "./components/form/NotesFrom";
```

---

## 2.4 Normalize Folder Casing

### Problem
Inconsistent casing: `Banner`, `Category`, `Verification` vs `pages`, `http`.

### Solution
```bash
# Rename to lowercase
mv src/Banner src/banner
mv src/Category src/category
mv src/Verification src/verification
```

### Update Imports
```diff
- import ProtectedRoute from "./Verification/ProtectedRoute";
+ import ProtectedRoute from "./verification/ProtectedRoute";

- import AddBanner from "./Banner/Form/AddBanner";
+ import AddBanner from "./banner/Form/AddBanner";
```

---

## Final Structure

```
src/
├── components/
│   ├── common/
│   │   └── Spinner.jsx
│   ├── layout/
│   │   └── Layout.jsx
│   ├── navigation/
│   │   ├── Sidebar.jsx
│   │   └── Navbar.jsx
│   └── pdf/
│       ├── FileViewer.jsx
│       └── PdfView.jsx
├── store/
│   ├── store.js
│   └── authSlice.js
├── verification/
│   └── ProtectedRoute.jsx
├── banner/
├── category/
├── auth/
├── http/
├── pages/
│   └── notes/
│       └── components/
│           └── form/          # ← Fixed name
│               └── NotesFrom.jsx
└── quiz/
```

---

## Verification Checklist

- [x] All imports resolve correctly
- [x] `npm run dev` starts without errors
- [x] `npm run build` completes successfully
- [ ] No 404 errors when navigating pages (Manual verification required)
- [x] Git shows clean rename tracking
