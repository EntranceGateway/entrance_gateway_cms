# Phase 3: Code Quality (Medium-term)

**Priority**: Medium | **Timeline**: 1-2 weeks | **Risk Level**: Low

---

## 3.1 Add Path Aliases

### Problem
Deep relative imports are hard to read and maintain:
```jsx
import Layout from "../../../components/layout/Layout";
import tokenService from "../../auth/services/tokenService";
```

### Solution
Configure Vite path aliases in `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@http': path.resolve(__dirname, './src/http'),
      '@store': path.resolve(__dirname, './src/store'),
      '@auth': path.resolve(__dirname, './src/auth'),
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://api.entrancegateway.com',
        changeOrigin: true,
        secure: false,
      },
    },
  }
})
```

### Usage After Change
```jsx
import Layout from "@components/layout/Layout";
import tokenService from "@auth/services/tokenService";
import { createNote } from "@http/notes";
```

---

## 3.2 Add Axios Auth Interceptor

### Problem
Every HTTP function requires `token` parameter, leading to repetitive code.

### Current Pattern
```jsx
export const createNote = async (formData, token) => {
  return await api.post("/api/v1/notes", formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
```

### Solution
Add request interceptor in `src/http/index.js`:

```javascript
import axios from "axios";
import { API_ENDPOINTS } from "../auth/config/securityConfig";
import tokenService from "../auth/services/tokenService";

const API = axios.create({
  baseURL: API_ENDPOINTS.baseUrl,
  timeout: 30000,
  headers: { 'Accept': 'application/json' },
});

// Auto-attach auth token
API.interceptors.request.use((config) => {
  const token = tokenService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
```

### Simplified API Functions
```jsx
// Before
export const createNote = async (formData, token) => {
  return await api.post("/api/v1/notes", formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// After
export const createNote = async (formData) => {
  return await api.post("/api/v1/notes", formData);
};
```

---

## 3.3 Separate UI Constants from API Files

### Problem
`src/http/ads.js` mixes API calls with UI constants (AD_POSITIONS, AD_STATUSES).

### Solution

#### Create Constants Directory
```bash
mkdir -p src/constants
```

#### Create Constants File
**Path**: `src/constants/ads.constants.js`

```javascript
export const AD_POSITIONS = [
  { value: "horizontal_1", label: "Horizontal 1" },
  { value: "horizontal_2", label: "Horizontal 2" },
  { value: "horizontal_3", label: "Horizontal 3" },
  { value: "vertical_1", label: "Vertical 1" },
  { value: "vertical_2", label: "Vertical 2" },
  { value: "vertical_3", label: "Vertical 3" },
  { value: "vertical_4", label: "Vertical 4" },
];

export const AD_STATUSES = [
  { value: "DRAFT", label: "Draft" },
  { value: "ACTIVE", label: "Active" },
  { value: "PAUSED", label: "Paused" },
  { value: "EXPIRED", label: "Expired" },
];

export const AD_PRIORITIES = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
];
```

#### Update Imports
```diff
- import { createAd, AD_POSITIONS, AD_STATUSES } from "@http/ads";
+ import { createAd } from "@http/ads";
+ import { AD_POSITIONS, AD_STATUSES } from "@constants/ads.constants";
```

---

## 3.4 Standardize Error Handling

### Problem
Inconsistent error formats across HTTP services:
```jsx
// Some files
throw err.response?.data || err;

// Other files  
throw err.response?.data || { error: "Failed to fetch ads." };
```

### Solution
Create error utility:

**Path**: `src/http/utils/errorHandler.js`

```javascript
export class ApiError extends Error {
  constructor(error) {
    const message = error.response?.data?.message 
                 || error.response?.data?.error 
                 || error.message 
                 || 'An unexpected error occurred';
    
    super(message);
    this.name = 'ApiError';
    this.status = error.response?.status;
    this.data = error.response?.data;
  }
}

export const handleApiError = (error) => {
  throw new ApiError(error);
};
```

### Usage
```jsx
import { handleApiError } from './utils/errorHandler';

export const getAds = async (params = {}) => {
  try {
    return await api.get("/api/v1/ads", { params });
  } catch (err) {
    handleApiError(err);
  }
};
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `vite.config.js` | Add path aliases |
| `src/http/index.js` | Add auth interceptor |
| `src/http/ads.js` | Remove constants, remove token param |
| `src/http/notes.js` | Remove token param |
| `src/http/colleges.js` | Remove token param |
| All other HTTP files | Remove token param |
| All page components | Remove token passing |

---

## Verification Checklist

- [ ] Path aliases working (`@/`, `@components/`, etc.)
- [ ] API requests include auth header automatically
- [ ] Constants imported from dedicated files
- [ ] No token parameters in HTTP functions
- [ ] Error handling consistent across all services
