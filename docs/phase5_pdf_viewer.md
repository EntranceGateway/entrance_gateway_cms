# Phase 5: PDF Viewer UI Polish

## Objective
Enhance the PDF viewer interface to match production CMS standards.

---

## Current State Analysis

**PdfViewer.jsx (510 lines):**
- ✅ IndexedDB caching for offline use
- ✅ Keyboard navigation (Arrow keys, PageUp/Down)
- ✅ Wheel/scroll navigation between pages
- ⚠️ Basic gray button styling
- ⚠️ No zoom controls
- ⚠️ No fullscreen mode
- ⚠️ No download button in viewer

**FileViewer.jsx (226 lines):**
- ✅ Multi-format support (PDF, Image, Video)
- ✅ Download functionality
- ✅ Good error states
- ⚠️ Minimal styling

---

## Proposed Changes

### 1. Enhanced Navigation Bar

**Current:**
```jsx
<button className="px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300">
```

**Improved:**
```jsx
<button className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 text-indigo-700 font-medium rounded-lg hover:bg-indigo-100 transition-colors disabled:opacity-50">
  <ChevronLeft size={18} />
  Previous
</button>
```

---

### 2. Add Toolbar with Actions

```jsx
<div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
  {/* Left: Navigation */}
  <div className="flex items-center gap-2">
    <button onClick={goToPrevPage} disabled={currentPage <= 1}>
      <ChevronLeft size={20} />
    </button>
    <span className="px-3 py-1 bg-white border rounded-lg text-sm">
      {currentPage} / {numPages}
    </span>
    <button onClick={goToNextPage} disabled={currentPage >= numPages}>
      <ChevronRight size={20} />
    </button>
  </div>

  {/* Center: Page Input */}
  <form onSubmit={handleGoToPageSubmit} className="flex items-center gap-2">
    <span className="text-sm text-gray-500">Go to:</span>
    <input type="text" className="w-16 px-2 py-1 border rounded-lg text-center" />
    <button type="submit">Go</button>
  </form>

  {/* Right: Actions */}
  <div className="flex items-center gap-2">
    <button onClick={handleZoomIn} className="p-2 hover:bg-gray-100 rounded-lg">
      <ZoomIn size={18} />
    </button>
    <button onClick={handleZoomOut} className="p-2 hover:bg-gray-100 rounded-lg">
      <ZoomOut size={18} />
    </button>
    <button onClick={handleDownload} className="p-2 hover:bg-gray-100 rounded-lg">
      <Download size={18} />
    </button>
    <button onClick={toggleFullscreen} className="p-2 hover:bg-gray-100 rounded-lg">
      <Maximize2 size={18} />
    </button>
  </div>
</div>
```

---

### 3. Page Wrapper Styling

```diff
- className="flex-1 flex flex-col items-center py-4 overflow-y-auto bg-gray-100"
+ className="flex-1 flex flex-col items-center py-6 overflow-y-auto bg-gradient-to-b from-gray-100 to-gray-50"
```

---

### 4. Better Loading State

```jsx
if (isLoading) {
  return (
    <div className="flex flex-col justify-center items-center h-64">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-indigo-100 rounded-full animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <FileText className="text-indigo-600" size={24} />
        </div>
      </div>
      <p className="mt-4 text-gray-600 font-medium">Loading document...</p>
      {loadProgress > 0 && (
        <div className="w-48 h-1.5 bg-gray-200 rounded-full mt-3 overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${loadProgress}%` }}
          />
        </div>
      )}
    </div>
  );
}
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/pdf/PdfViewer.jsx` | Enhanced toolbar, better buttons, loading state |
| `src/pages/oldQuestions/ViewOldQuestion.jsx` | Add page title from API data |
| `src/pages/notes/components/viewsNotes/` | Consistent styling |

---

## Priority
- **Impact:** Medium (improves document viewing experience)
- **Effort:** Medium
- **Priority:** P1 (after core table/dashboard fixes)

---

## Verification
- [ ] PDF opens with enhanced toolbar
- [ ] Navigation buttons have indigo styling
- [ ] Loading state shows animated icon
- [ ] Zoom controls work (if implemented)
