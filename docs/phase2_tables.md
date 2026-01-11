# Phase 2: Table & Pagination Polish

## Objective
Fix table issues and enhance data display components.

---

## Issues

| Issue | Impact |
|-------|--------|
| Pagination shows "1 to 0 of 0" when data exists | High |
| Empty state icon too generic | Medium |

---

## Changes

### 1. Fix Pagination Logic

**File:** `src/components/common/DataTable.jsx`

**Line 131-136:**
```diff
- Showing {pagination.currentPage * pagination.pageSize + 1}
+ Showing {pagination.totalItems > 0 ? pagination.currentPage * pagination.pageSize + 1 : 0}
```

---

### 2. Improve Empty State

```jsx
if (data.length === 0) {
  return (
    <div className="flex flex-col items-center justify-center p-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <p className="text-gray-700 font-semibold text-lg mb-1">{emptyMessage}</p>
      <p className="text-gray-400 text-sm">Try adjusting your filters or add new content</p>
    </div>
  );
}
```

---

### 3. Improve Loading Skeleton

```jsx
if (loading) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="h-12 bg-gray-100 animate-pulse" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 border-t border-gray-100 flex items-center px-6 gap-4">
          <div className="h-4 bg-gray-100 rounded w-1/4 animate-pulse" />
          <div className="h-4 bg-gray-100 rounded w-1/5 animate-pulse" />
          <div className="h-4 bg-gray-100 rounded w-1/6 animate-pulse" />
          <div className="flex-1" />
          <div className="h-4 bg-gray-100 rounded w-20 animate-pulse" />
        </div>
      ))}
    </div>
  );
}
```

---

## Verification
- [ ] Pagination shows correct count
- [ ] Empty state displays illustration
- [ ] Loading skeleton matches row structure
