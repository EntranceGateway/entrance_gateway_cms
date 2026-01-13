/**
 * Lazy Loader for Data Fetching
 * Shows skeleton loaders while data is being fetched
 */

// Skeleton for Table Rows
export const TableSkeleton = ({ rows = 5, columns = 6 }) => {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Header Skeleton */}
      <div className="h-12 bg-gray-50 border-b border-gray-100 flex items-center px-6 gap-4">
        {[...Array(columns)].map((_, i) => (
          <div
            key={i}
            className="h-4 bg-gray-200 rounded animate-pulse"
            style={{ width: `${Math.random() * 30 + 70}px` }}
          />
        ))}
      </div>

      {/* Rows Skeleton */}
      {[...Array(rows)].map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="h-16 border-b border-gray-50 flex items-center px-6 gap-4 last:border-0"
        >
          {[...Array(columns)].map((_, colIdx) => (
            <div
              key={colIdx}
              className="h-4 bg-gray-100 rounded animate-pulse"
              style={{
                width: `${Math.random() * 100 + 50}px`,
                animationDelay: `${rowIdx * 50 + colIdx * 20}ms`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// Skeleton for Cards
export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl border border-gray-200 p-6 space-y-4"
          style={{ animationDelay: `${idx * 100}ms` }}
        >
          {/* Image skeleton */}
          <div className="w-full h-48 bg-gray-200 rounded-lg animate-pulse" />

          {/* Title skeleton */}
          <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />

          {/* Description skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-100 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-4/6 animate-pulse" />
          </div>

          {/* Button skeleton */}
          <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse" />
        </div>
      ))}
    </div>
  );
};

// Skeleton for Form
export const FormSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      {[...Array(5)].map((_, idx) => (
        <div key={idx} className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
          <div className="h-10 bg-gray-100 rounded-lg w-full animate-pulse" />
        </div>
      ))}
      <div className="flex gap-3 pt-4">
        <div className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse" />
        <div className="h-10 bg-gray-100 rounded-lg w-24 animate-pulse" />
      </div>
    </div>
  );
};

// Skeleton for Stats Cards
export const StatsSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(count)].map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl border border-gray-200 p-6 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
            <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse" />
          </div>
          <div className="h-8 bg-gray-200 rounded w-24 animate-pulse" />
          <div className="h-3 bg-gray-100 rounded w-32 animate-pulse" />
        </div>
      ))}
    </div>
  );
};

// Spinner for inline loading
export const InlineSpinner = ({ size = 'md', color = 'indigo' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  const colors = {
    indigo: 'border-indigo-600',
    gray: 'border-gray-600',
    white: 'border-white',
    green: 'border-green-600',
    red: 'border-red-600',
  };

  return (
    <div
      className={`${sizes[size]} border-2 ${colors[color]} border-t-transparent rounded-full animate-spin`}
    />
  );
};

// Full page spinner
export const FullPageSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="h-16 w-16 border-4 border-indigo-200 rounded-full animate-spin border-t-indigo-600 mx-auto" />
          <div className="absolute inset-0 h-16 w-16 border-4 border-transparent rounded-full animate-ping border-t-indigo-400 mx-auto" />
        </div>
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
};

// Dots loader for buttons
export const DotsLoader = ({ color = 'white' }) => {
  const dotColor = {
    white: 'bg-white',
    indigo: 'bg-indigo-600',
    gray: 'bg-gray-600',
  };

  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`h-2 w-2 rounded-full ${dotColor[color]} animate-bounce`}
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
};

// Pulse loader for content
export const PulseLoader = ({ lines = 3 }) => {
  return (
    <div className="space-y-3">
      {[...Array(lines)].map((_, idx) => (
        <div
          key={idx}
          className="h-4 bg-gray-200 rounded animate-pulse"
          style={{
            width: `${100 - idx * 15}%`,
            animationDelay: `${idx * 100}ms`,
          }}
        />
      ))}
    </div>
  );
};

export default {
  TableSkeleton,
  CardSkeleton,
  FormSkeleton,
  StatsSkeleton,
  InlineSpinner,
  FullPageSpinner,
  DotsLoader,
  PulseLoader,
};
