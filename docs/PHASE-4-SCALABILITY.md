# Phase 4: Scalability (Long-term)

**Priority**: Low | **Timeline**: 2-4 weeks | **Risk Level**: Medium

---

## 4.1 Split Routes by Module

### Problem
`App.jsx` contains 45+ routes in a single file (194 lines), making it hard to maintain.

### Solution
Create modular route files:

```
src/
├── routes/
│   ├── index.jsx           # Main router
│   ├── admin.routes.jsx
│   ├── college.routes.jsx
│   ├── course.routes.jsx
│   ├── notes.routes.jsx
│   ├── blog.routes.jsx
│   ├── quiz.routes.jsx
│   └── ads.routes.jsx
```

#### Example: `src/routes/college.routes.jsx`
```jsx
import { lazy } from "react";

const CollegeForm = lazy(() => import("@pages/college/components/form/Form"));
const AddCollege = lazy(() => import("@pages/college/AddCollege"));
const EditCollege = lazy(() => import("@pages/college/EditCollege"));
const CollegeAll = lazy(() => import("@pages/college/CollegeAll"));
const AddCourseToCollege = lazy(() => import("@pages/college/AddCourseToCollege"));

export const collegeRoutes = [
  { path: "/college", element: <CollegeForm /> },
  { path: "/college/add", element: <AddCollege /> },
  { path: "/college/edit/:id", element: <EditCollege /> },
  { path: "/college/all", element: <CollegeAll /> },
  { path: "/college/:id/courses", element: <AddCourseToCollege /> },
];
```

#### Main Router: `src/routes/index.jsx`
```jsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/verification/ProtectedRoute";
import { collegeRoutes } from "./college.routes";
import { courseRoutes } from "./course.routes";
import { notesRoutes } from "./notes.routes";
// ... other imports

export const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/admin/login" element={<Login />} />
    <Route path="/admin/register" element={<AdminRegister />} />

    {/* Protected Routes */}
    <Route element={<ProtectedRoute />}>
      <Route path="/" element={<Dashboard />} />
      
      {collegeRoutes.map(route => (
        <Route key={route.path} {...route} />
      ))}
      {courseRoutes.map(route => (
        <Route key={route.path} {...route} />
      ))}
      {/* ... other module routes */}
    </Route>
  </Routes>
);
```

---

## 4.2 Create Shared Component Library

### Components to Create

| Component | Purpose | Props |
|-----------|---------|-------|
| `DataTable` | Reusable table with pagination, sorting | `data`, `columns`, `loading`, `onSort` |
| `ConfirmModal` | Delete/action confirmation | `isOpen`, `title`, `onConfirm`, `onCancel` |
| `FormField` | Standardized form input | `label`, `error`, `required`, `children` |
| `PageHeader` | Page title + action buttons | `title`, `actions`, `breadcrumbs` |
| `EmptyState` | "No data" display | `icon`, `title`, `description`, `action` |
| `LoadingState` | Skeleton loaders | `type` ("table", "card", "form") |

#### Example: `src/components/common/DataTable.jsx`
```jsx
import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

const DataTable = ({ 
  data = [], 
  columns = [], 
  loading = false,
  pagination = null,
  onPageChange,
  onSort,
  emptyMessage = "No data found"
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
    onSort?.(key, direction);
  };

  if (loading) return <TableSkeleton columns={columns.length} />;
  if (data.length === 0) return <EmptyState message={emptyMessage} />;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(col => (
              <th 
                key={col.key}
                onClick={() => col.sortable && handleSort(col.key)}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase ${col.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}`}
              >
                {col.label}
                {col.sortable && sortConfig.key === col.key && (
                  sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, idx) => (
            <tr key={row.id || idx}>
              {columns.map(col => (
                <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {pagination && <Pagination {...pagination} onPageChange={onPageChange} />}
    </div>
  );
};

export default DataTable;
```

#### Example: `src/components/common/ConfirmModal.jsx`
```jsx
const ConfirmModal = ({ 
  isOpen, 
  title = "Confirm Action",
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger", // "danger" | "warning" | "info"
  onConfirm, 
  onCancel 
}) => {
  if (!isOpen) return null;

  const variants = {
    danger: "bg-red-600 hover:bg-red-700",
    warning: "bg-yellow-600 hover:bg-yellow-700",
    info: "bg-blue-600 hover:bg-blue-700",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 border rounded hover:bg-gray-50">
            {cancelText}
          </button>
          <button onClick={onConfirm} className={`px-4 py-2 text-white rounded ${variants[variant]}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
```

---

## 4.3 Add React Query for Data Fetching

### Problem
Direct axios calls lack caching, refetching, and optimistic updates.

### Installation
```bash
npm install @tanstack/react-query
```

### Setup: `src/main.jsx`
```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <App />
    </Provider>
  </QueryClientProvider>
);
```

### Custom Hooks: `src/hooks/useNotes.js`
```jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotes, createNote, deleteNote } from '@http/notes';

export const useNotes = (params) => {
  return useQuery({
    queryKey: ['notes', params],
    queryFn: () => getNotes(params),
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};
```

### Usage in Components
```jsx
import { useNotes, useDeleteNote } from '@/hooks/useNotes';

const NotesPage = () => {
  const { data, isLoading, error } = useNotes({ page: 0, size: 10 });
  const deleteNoteMutation = useDeleteNote();

  const handleDelete = (id) => {
    deleteNoteMutation.mutate(id);
  };

  if (isLoading) return <LoadingState type="table" />;
  if (error) return <ErrorState message={error.message} />;

  return <DataTable data={data.content} columns={columns} />;
};
```

---

## Implementation Priority

| Task | Effort | Value | Priority |
|------|--------|-------|----------|
| Route splitting | Medium | High | 1 |
| DataTable component | Medium | High | 2 |
| ConfirmModal | Low | Medium | 3 |
| React Query setup | Medium | High | 4 |
| Form components | High | Medium | 5 |

---

## Verification Checklist

- [x] Routes split into module files
- [x] App.jsx reduced to <50 lines
- [x] DataTable used in 5+ pages (Integrated in 12+ management pages)
- [x] ConfirmModal used for all delete actions in refactored pages
- [x] React Query caching working
- [x] Network tab shows fewer duplicate requests
