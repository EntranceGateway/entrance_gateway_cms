# CMS Design System - Colors & Typography

## Overview
This document defines the color palette and typography standards for the Entrance Gateway CMS.

---

## Color Palette

### Primary Colors (Indigo)
Main action color used for buttons, links, active states.

| Name | Tailwind Class | Hex | Usage |
|------|---------------|-----|-------|
| Primary-50 | `bg-indigo-50` | #EEF2FF | Hover backgrounds, badges |
| Primary-100 | `bg-indigo-100` | #E0E7FF | Light accents |
| Primary-500 | `bg-indigo-500` | #6366F1 | Gradients, accents |
| Primary-600 | `bg-indigo-600` | #4F46E5 | **Primary buttons, links** |
| Primary-700 | `bg-indigo-700` | #4338CA | Button hover states |

---

### Secondary Colors (Violet)
Used for sidebar accents, special highlights.

| Name | Tailwind Class | Hex | Usage |
|------|---------------|-----|-------|
| Violet-400 | `text-violet-400` | #A78BFA | Active icon highlights |
| Violet-500 | `text-violet-500` | #8B5CF6 | Sidebar accents |
| Violet-600 | `bg-violet-600` | #7C3AED | Submenu active states |

---

### Semantic Colors

#### Success (Emerald/Green)
| Name | Tailwind Class | Hex | Usage |
|------|---------------|-----|-------|
| Emerald-50 | `bg-emerald-50` | #ECFDF5 | Success badge bg |
| Emerald-500 | `bg-emerald-500` | #10B981 | Stat card gradient |
| Emerald-700 | `text-emerald-700` | #047857 | Success text |
| Green-600 | `text-green-600` | #16A34A | View action icons |

#### Warning (Amber/Yellow)
| Name | Tailwind Class | Hex | Usage |
|------|---------------|-----|-------|
| Amber-50 | `bg-amber-50` | #FFFBEB | Warning badge bg |
| Amber-500 | `bg-amber-500` | #F59E0B | Stat card gradient |
| Amber-700 | `text-amber-700` | #B45309 | Warning text |

#### Error (Red)
| Name | Tailwind Class | Hex | Usage |
|------|---------------|-----|-------|
| Red-50 | `bg-red-50` | #FEF2F2 | Error backgrounds |
| Red-100 | `bg-red-100` | #FEE2E2 | Error badge border |
| Red-500 | `bg-red-500` | #EF4444 | Notification dots |
| Red-600 | `text-red-600` | #DC2626 | **Delete buttons, errors** |
| Red-700 | `text-red-700` | #B91C1C | Error text |

---

### Neutral Colors (Gray)

| Name | Tailwind Class | Hex | Usage |
|------|---------------|-----|-------|
| Gray-50 | `bg-gray-50` | #F9FAFB | Page backgrounds, inputs |
| Gray-100 | `bg-gray-100` | #F3F4F6 | Card backgrounds, skeletons |
| Gray-200 | `border-gray-200` | #E5E7EB | Borders, dividers |
| Gray-300 | `border-gray-300` | #D1D5DB | Input borders |
| Gray-400 | `text-gray-400` | #9CA3AF | Placeholder text, icons |
| Gray-500 | `text-gray-500` | #6B7280 | Secondary text |
| Gray-600 | `text-gray-600` | #4B5563 | Icons, labels |
| Gray-700 | `text-gray-700` | #374151 | Body text |
| Gray-800 | `bg-gray-800` | #1F2937 | Sidebar active items |
| Gray-900 | `bg-gray-900` | #111827 | **Sidebar background** |

---

### Badge Color System

| Badge Type | Background | Text | Border | Usage |
|------------|------------|------|--------|-------|
| Subject | `bg-purple-50` | `text-purple-700` | `border-purple-200` | Subject names |
| Course | `bg-emerald-50` | `text-emerald-700` | `border-emerald-200` | Course names |
| Code | `bg-indigo-50` | `text-indigo-700` | `border-indigo-200` | Subject codes |
| Affiliation | `bg-blue-50` | `text-blue-700` | `border-blue-200` | Universities |
| Semester | `bg-amber-50` | `text-amber-700` | `border-amber-200` | Semester tags |

---

## Typography

### Font Family

**Recommended:** Use system fonts for performance, or add Inter from Google Fonts.

```css
/* Tailwind default - already configured */
font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 
             "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

/* Optional: Add Inter for premium feel */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
```

### Font Sizes

| Element | Tailwind Class | Size | Weight | Usage |
|---------|---------------|------|--------|-------|
| Page Title | `text-3xl font-extrabold` | 30px | 800 | Main page headers |
| Section Title | `text-2xl font-bold` | 24px | 700 | Card headers |
| Card Title | `text-xl font-semibold` | 20px | 600 | Widget titles |
| Body Text | `text-base` | 16px | 400 | General content |
| Table Headers | `text-xs font-semibold uppercase` | 12px | 600 | Column headers |
| Labels | `text-sm font-medium` | 14px | 500 | Form labels |
| Small Text | `text-xs` | 12px | 400 | Timestamps, metadata |
| Badge Text | `text-xs font-semibold` | 12px | 600 | Status badges |

---

## Usage Examples

### Button Variants

```jsx
// Primary Button
className="bg-indigo-600 text-white hover:bg-indigo-700 font-semibold"

// Secondary Button
className="bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"

// Danger Button
className="bg-red-600 text-white hover:bg-red-700 font-semibold"

// Ghost Button  
className="text-indigo-600 hover:bg-indigo-50"
```

### Card Styling

```jsx
// Standard Card
className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"

// Elevated Card
className="bg-white rounded-2xl shadow-lg p-6"

// Filter Card
className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
```

### Form Inputs

```jsx
// Standard Input
className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
           focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"

// Error State
className="border-red-500 focus:ring-red-500"
```

---

## Quick Reference

| Context | Primary | Secondary | Text |
|---------|---------|-----------|------|
| Sidebar | `bg-gray-900` | `bg-gray-800` | `text-gray-100` |
| Navbar | `bg-white` | `border-gray-200` | `text-gray-800` |
| Content | `bg-gray-50` | `bg-white` | `text-gray-700` |
| Active State | `bg-indigo-600` | `bg-violet-600` | `text-white` |
| Hover | `hover:bg-gray-100` | `hover:bg-indigo-50` | - |
