# Loader Implementation Guide

## Overview
Two types of loaders have been implemented:
1. **Progressive Loader** - Top progress bar for route transitions
2. **Lazy Loaders** - Skeleton loaders for data fetching

---

## 1. Progressive Loader (Route Transitions)

### Location
`src/components/loaders/ProgressiveLoader.jsx`

### Features
- Smooth top progress bar
- Gradient animation (indigo → purple → pink)
- Shimmer effect
- Auto-completes on route load

### Usage
Already integrated in `src/App.jsx`:

```jsx
import { ProgressiveLoader } from "@/components/loaders";

<BrowserRouter>
  <ProgressiveLoader />  {/* Add this */}
  <AppRoutes />
</BrowserRouter>
```

### How it works
- Monitors `useNavigation()` state from React Router
- Shows when `navigation.state === 'loading'`
- Progressively fills from 0% to 90%
- Completes to 100% when route loads
- Fades out after 300ms

---

## 2. Lazy Loaders (Data Fetching)

### Location
`src/components/loaders/LazyLoader.jsx`

### Available Loaders

#### A. TableSkeleton
For table data loading:
```jsx
import { TableSkeleton } from "@/components/loaders";

{isLoading ? (
  <TableSkeleton rows={10} columns={6} />
) : (
  <DataTable data={data} />
)}
```

**Props:**
- `rows` - Number of skeleton rows (default: 5)
- `columns` - Number of skeleton columns (default: 6)

#### B. CardSkeleton
For card grid layouts:
```jsx
import { CardSkeleton } from "@/components/loaders";

{isLoading ? (
  <CardSkeleton count={6} />
) : (
  <div className="grid grid-cols-3 gap-6">
    {items.map(item => <Card {...item} />)}
  </div>
)}
```

**Props:**
- `count` - Number of skeleton cards (default: 3)

#### C. FormSkeleton
For form loading:
```jsx
import { FormSkeleton } from "@/components/loaders";

{isLoading ? <FormSkeleton /> : <MyForm />}
```

#### D. StatsSkeleton
For dashboard stats cards:
```jsx
import { StatsSkeleton } from "@/components/loaders";

{isLoading ? (
  <StatsSkeleton count={4} />
) : (
  <StatsCards data={stats} />
)}
```

**Props:**
- `count` - Number of stat cards (default: 4)

#### E. InlineSpinner
For inline loading (buttons, small sections):
```jsx
import { InlineSpinner } from "@/components/loaders";

<button disabled={isLoading}>
  {isLoading ? <InlineSpinner size="sm" color="white" /> : "Submit"}
</button>
```

**Props:**
- `size` - 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
- `color` - 'indigo' | 'gray' | 'white' | 'green' | 'red' (default: 'indigo')

#### F. FullPageSpinner
For full page loading:
```jsx
import { FullPageSpinner } from "@/components/loaders";

{isInitializing && <FullPageSpinner message="Loading application..." />}
```

**Props:**
- `message` - Loading message (default: 'Loading...')

#### G. DotsLoader
For button loading states:
```jsx
import { DotsLoader } from "@/components/loaders";

<button disabled={isSubmitting}>
  {isSubmitting ? <DotsLoader color="white" /> : "Save"}
</button>
```

**Props:**
- `color` - 'white' | 'indigo' | 'gray' (default: 'white')

#### H. PulseLoader
For content placeholders:
```jsx
import { PulseLoader } from "@/components/loaders";

{isLoading ? <PulseLoader lines={5} /> : <Content />}
```

**Props:**
- `lines` - Number of skeleton lines (default: 3)

---

## 3. Implementation Examples

### Example 1: Blog Table (Already Updated)
```jsx
// src/pages/blog/components/BlogTable.jsx
import { TableSkeleton } from "@/components/loaders";

const BlogTable = () => {
  const { data, isLoading } = useBlogs();

  return (
    <>
      {isLoading ? (
        <TableSkeleton rows={10} columns={6} />
      ) : (
        <DataTable data={data} columns={columns} />
      )}
    </>
  );
};
```

### Example 2: Form with Submit Button
```jsx
import { FormSkeleton, DotsLoader } from "@/components/loaders";

const AddBlogForm = () => {
  const { data: courses, isLoading } = useCourses();
  const createMutation = useCreateBlog();

  if (isLoading) return <FormSkeleton />;

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={createMutation.isLoading}>
        {createMutation.isLoading ? (
          <DotsLoader color="white" />
        ) : (
          "Create Blog"
        )}
      </button>
    </form>
  );
};
```

### Example 3: Dashboard Stats
```jsx
import { StatsSkeleton } from "@/components/loaders";

const Dashboard = () => {
  const { data: stats, isLoading } = useStats();

  return (
    <div>
      <h1>Dashboard</h1>
      {isLoading ? (
        <StatsSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {stats.map(stat => <StatsCard {...stat} />)}
        </div>
      )}
    </div>
  );
};
```

### Example 4: Card Grid
```jsx
import { CardSkeleton } from "@/components/loaders";

const CollegeList = () => {
  const { data: colleges, isLoading } = useColleges();

  return (
    <>
      {isLoading ? (
        <CardSkeleton count={9} />
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {colleges.map(college => <CollegeCard {...college} />)}
        </div>
      )}
    </>
  );
};
```

---

## 4. Styling & Animations

### Tailwind Animations Used
All loaders use Tailwind's built-in animations:
- `animate-pulse` - Pulsing effect
- `animate-spin` - Spinning effect
- `animate-bounce` - Bouncing effect
- `animate-ping` - Ping effect

### Custom Shimmer Animation
Add to your `tailwind.config.js` or `index.css`:

```css
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
```

---

## 5. Best Practices

### ✅ DO:
- Use `TableSkeleton` for table data
- Use `CardSkeleton` for grid layouts
- Use `InlineSpinner` for button states
- Use `FullPageSpinner` for initial app load
- Match skeleton structure to actual content

### ❌ DON'T:
- Don't use multiple full-page loaders simultaneously
- Don't show loaders for < 200ms operations (feels janky)
- Don't use spinners where skeletons would be better
- Don't forget to handle error states

---

## 6. Migration Checklist

Replace old `LoadingState` component with new loaders:

- [x] `src/App.jsx` - Added ProgressiveLoader
- [x] `src/components/common/DataTable.jsx` - Added TableSkeleton
- [x] `src/pages/blog/components/BlogTable.jsx` - Added TableSkeleton
- [x] `src/pages/ads/components/AdsTable.jsx` - Added TableSkeleton
- [ ] `src/pages/college/components/CollegeTable.jsx` - TODO
- [ ] `src/pages/course/components/CourseTable.jsx` - TODO
- [ ] `src/pages/notes/components/NotesTable.jsx` - TODO
- [ ] All other table components - TODO

---

## 7. Performance Tips

1. **Lazy Load Routes:**
```jsx
const BlogPage = lazy(() => import('./pages/blog/BlogPage'));
const AdsPage = lazy(() => import('./pages/ads/AllAds'));
```

2. **Debounce Search:**
```jsx
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 300);
```

3. **Optimize Images:**
```jsx
<img 
  src={imageUrl} 
  loading="lazy"  // Native lazy loading
  alt="..."
/>
```

---

## 8. Troubleshooting

### Progressive Loader Not Showing?
- Ensure you're using React Router v6.4+ with data APIs
- Check that `<ProgressiveLoader />` is inside `<BrowserRouter>`

### Skeleton Doesn't Match Content?
- Adjust `rows` and `columns` props
- Customize skeleton structure in `LazyLoader.jsx`

### Animations Not Working?
- Ensure Tailwind CSS is properly configured
- Check that `animate-*` classes are not purged

---

## 9. Future Enhancements

- [ ] Add skeleton for PDF viewer
- [ ] Add skeleton for image galleries
- [ ] Add skeleton for charts/graphs
- [ ] Add custom skeleton builder utility
- [ ] Add loading state persistence across navigations
- [ ] Add error state loaders

---

**Created:** January 13, 2026
**Last Updated:** January 13, 2026
