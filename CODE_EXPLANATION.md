# RFID Dashboard - Complete Code Explanation

This document provides a comprehensive, line-by-line explanation of the RFID Dashboard application to help you understand the complete flow of the project.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [File-by-File Explanation](#file-by-file-explanation)
5. [Application Flow](#application-flow)
6. [Data Flow Diagram](#data-flow-diagram)

---

## Project Overview

This is a **Next.js** web application that displays real-time RFID (Radio-Frequency Identification) logs from an ESP32 device. The application:
- Fetches RFID data from a remote PHP API endpoint every second
- Displays a list of unique RFID tags with their current status
- Shows a comprehensive log table of all RFID scan events
- Uses Bootstrap for styling and React for state management

---

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0.1 | React framework for server-side rendering and routing |
| React | 19.2.0 | UI library for building components |
| TypeScript | ^5 | Type-safe JavaScript |
| Bootstrap | ^5.3.8 | CSS framework for responsive design |
| Axios | ^1.13.2 | HTTP client for API requests |
| Tailwind CSS | ^4 | Utility-first CSS framework |
| ESLint | ^9 | Code linting and quality checks |

---

## Project Structure

```
Elective3_FinalPIT/
├── README.md.txt                    # Top-level readme (minimal)
└── rfid_dashboard/                  # Main application directory
    ├── .gitignore                   # Git ignore rules
    ├── README.md                    # Next.js project documentation
    ├── eslint.config.mjs            # ESLint configuration
    ├── next.config.ts               # Next.js configuration
    ├── package.json                 # Project dependencies and scripts
    ├── package-lock.json            # Locked dependency versions
    ├── postcss.config.mjs           # PostCSS configuration for Tailwind
    ├── tsconfig.json                # TypeScript configuration
    ├── pages/                       # Next.js pages (routing)
    │   ├── _app.js                  # Custom App component
    │   └── index.js                 # Main dashboard page (homepage)
    ├── styles/                      # Global styles
    │   └── globals.css              # Global CSS styles
    └── public/                      # Static assets
        ├── file.svg
        ├── globe.svg
        ├── next.svg
        ├── vercel.svg
        └── window.svg
```

---

## File-by-File Explanation

### 1. `package.json` - Project Dependencies and Scripts

```json
{
  "name": "rfid_dashboard",              // Project name
  "version": "0.1.0",                    // Current version
  "private": true,                       // Not published to npm
  "scripts": {
    "dev": "next dev",                   // Start development server (localhost:3000)
    "build": "next build",               // Build production-ready app
    "start": "next start",               // Start production server
    "lint": "eslint"                     // Run linting checks
  },
  "dependencies": {                      // Production dependencies
    "axios": "^1.13.2",                  // For HTTP requests to API
    "bootstrap": "^5.3.8",               // UI component library
    "next": "16.0.1",                    // Next.js framework
    "react": "19.2.0",                   // React library
    "react-dom": "19.2.0"                // React DOM rendering
  },
  "devDependencies": {                   // Development-only dependencies
    "@tailwindcss/postcss": "^4",        // Tailwind CSS integration
    "@types/node": "^20",                // TypeScript types for Node.js
    "@types/react": "^19",               // TypeScript types for React
    "@types/react-dom": "^19",           // TypeScript types for React DOM
    "eslint": "^9",                      // Linting tool
    "eslint-config-next": "16.0.1",      // ESLint config for Next.js
    "tailwindcss": "^4",                 // CSS utility framework
    "typescript": "^5"                   // TypeScript compiler
  }
}
```

**Purpose**: Defines the project configuration, dependencies, and npm scripts for development and production.

---

### 2. `pages/_app.js` - Custom App Component

```javascript
// pages/_app.js

// Line 1-2: Import Bootstrap CSS and global styles
// These imports apply styles globally to all pages in the application
import 'bootstrap/dist/css/bootstrap.min.css';  // Bootstrap framework styles
import '../styles/globals.css';                 // Custom global styles

// Line 5-7: Custom App Component
// This is a special Next.js component that wraps all pages
// It's called once when the app initializes
export default function MyApp({ Component, pageProps }) {
  // Component: The active page component
  // pageProps: Props passed to the page
  
  // Return the page component with its props
  return <Component {...pageProps} />;
}
```

**Purpose**: 
- Entry point for the entire Next.js application
- Loads global CSS files (Bootstrap and custom styles)
- Wraps all page components
- Allows you to keep state when navigating between pages
- Adds global layouts or providers

**Flow**:
1. Next.js loads this file first
2. Imports are processed (CSS is injected into the app)
3. The requested page component is passed as `Component`
4. The page is rendered with its props spread

---

### 3. `pages/index.js` - Main Dashboard Component

This is the heart of the application. Let's break it down section by section:

#### **Imports (Lines 1-3)**

```javascript
import { useEffect, useState } from "react";  // React hooks for state and side effects
import axios from "axios";                    // HTTP client for API requests
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap styles (redundant - already in _app.js)
```

**Explanation**:
- `useState`: Manages component state (logs, RFID list)
- `useEffect`: Handles side effects (data fetching, intervals)
- `axios`: Makes HTTP requests to the PHP backend
- Bootstrap import is redundant here since it's already in `_app.js`

---

#### **Component Definition and State (Lines 5-7)**

```javascript
export default function Dashboard() {
  const [logs, setLogs] = useState([]);         // State: Array of all RFID log entries
  const [rfidList, setRfidList] = useState([]); // State: Array of unique RFID tags
```

**Explanation**:
- **`logs`**: Stores all RFID scan events from the API
  - Structure: `[{ rfid, status, rfid_message, date_time }, ...]`
- **`rfidList`**: Stores unique RFID tags that have been detected
  - Structure: `['RFID_123', 'RFID_456', ...]`
- Both use `useState` hook to trigger re-renders when data changes

---

#### **Data Fetching Function (Lines 9-28)**

```javascript
const fetchData = async () => {
  try {
    // Line 11: Make GET request to PHP API endpoint
    // The API returns an array of RFID log objects
    const res = await axios.get("http://10.141.68.150/esp32/get_logs.php");
    
    // Line 12: Validate that response is an array
    if (Array.isArray(res.data)) {
      // Line 13: Update logs state with new data
      setLogs(res.data);
      
      // Line 14: Extract unique RFID values from current batch
      // Uses Set to remove duplicates, then spreads back to array
      const uniquesFromBatch = [...new Set(res.data.map((l) => l.rfid))];

      // Line 16-21: Update rfidList without duplicates
      setRfidList((prev) => {
        const seen = new Set(prev);           // Create Set of existing RFIDs
        const appended = [];                  // Array for new RFIDs
        
        // For each RFID in current batch
        for (const r of uniquesFromBatch) 
          if (!seen.has(r))                   // If not already in list
            appended.push(r);                 // Add to new items
        
        // Only update state if there are new items (prevents unnecessary re-renders)
        return appended.length ? [...prev, ...appended] : prev;
      });
    } else {
      // Line 23: Log error if data format is unexpected
      console.error("Data is not an array:", res.data);
    }
  } catch (error) {
    // Line 26: Log error if API request fails
    console.error("Failed to fetch RFID logs:", error);
  }
};
```

**Explanation**:
- **Purpose**: Fetches RFID data from the ESP32 backend
- **API Endpoint**: `http://10.141.68.150/esp32/get_logs.php`
- **Response Format**: Array of objects like:
  ```json
  [
    {
      "rfid": "AB:CD:EF:12:34",
      "status": "1",
      "rfid_message": "Access Granted",
      "date_time": "2025-11-22 10:30:45"
    }
  ]
  ```
- **Logic**:
  1. Fetch data from API
  2. Validate it's an array
  3. Update `logs` with all data
  4. Extract unique RFID tags
  5. Add only new unique tags to `rfidList` (maintains order, no duplicates)

---

#### **Effect Hook - Auto-fetch Setup (Lines 30-34)**

```javascript
useEffect(() => {
  // Line 31: Fetch data immediately when component mounts
  fetchData();
  
  // Line 32: Set up interval to fetch data every 1 second (1000ms)
  const interval = setInterval(fetchData, 1000);
  
  // Line 33: Cleanup function - clear interval when component unmounts
  // This prevents memory leaks
  return () => clearInterval(interval);
}, []); // Empty dependency array = run only once on mount
```

**Explanation**:
- **Purpose**: Sets up automatic data polling
- **Flow**:
  1. Component mounts → `fetchData()` runs immediately
  2. Interval created → `fetchData()` runs every 1 second
  3. Component unmounts → interval is cleared
- **Empty dependency array `[]`**: Effect runs only once when component mounts

---

#### **Date Formatting Function (Lines 36-47)**

```javascript
const formatDate = (dateStr) => {
  // Line 37: Convert string to Date object
  const date = new Date(dateStr);
  
  // Line 38: Check if date is valid
  if (isNaN(date)) return dateStr;  // Return original if invalid
  
  // Line 39-46: Format date using locale-specific formatting
  return date.toLocaleString("en-US", {
    month: "long",      // "November" instead of "11"
    day: "numeric",     // "22"
    year: "numeric",    // "2025"
    hour: "numeric",    // "10"
    minute: "2-digit",  // "05" instead of "5"
    hour12: true,       // "10 AM" instead of "10:00"
  });
};
```

**Explanation**:
- **Input**: `"2025-11-22 10:05:30"`
- **Output**: `"November 22, 2025, 10:05 AM"`
- **Purpose**: Makes dates user-friendly and readable
- **Error Handling**: Returns original string if date parsing fails

---

#### **JSX Render - Main Layout (Lines 49-51)**

```javascript
return (
  <div className="container my-4">      // Bootstrap container with vertical margin
    <div className="row g-2">           // Bootstrap row with gap between columns
```

**Explanation**:
- `container`: Bootstrap class for responsive centered content
- `my-4`: Margin on Y-axis (top and bottom)
- `row g-2`: Flexbox row with 2-unit gap between columns

---

#### **Left Column - RFID List (Lines 52-89)**

```javascript
{/* Left: RFID list */}
<div className="col-md-3">              // 3 columns wide on medium+ screens (25% width)
  <div className="card bg-dark text-white h-auto">  // Dark Bootstrap card
    
    {/* Card header */}
    <div className="card-header text-center fw-bold">RFID</div>
    
    {/* List of RFIDs */}
    <ul className="list-group list-group-flush" style={{ borderRadius: "0" }}>
      {rfidList
        // Line 59-62: Filter out invalid RFIDs
        // Only show RFIDs where latest log is NOT "RFID NOT FOUND"
        .filter((rfid) => {
          const latest = logs.find((l) => l.rfid === rfid);  // Find latest log for this RFID
          return latest && latest.rfid_message !== "RFID NOT FOUND";
        })
        
        // Line 63-86: Map each valid RFID to a list item
        .map((rfid, index) => {
          const latest = logs.find((l) => l.rfid === rfid);  // Get latest log
          const status = latest ? latest.status : null;      // Extract status
          
          return (
            <li
              key={rfid}
              className="list-group-item d-flex justify-content-between align-items-center bg-dark text-white border-0"
            >
              {/* Left side: RFID number */}
              <span>{index + 1}. {rfid}</span>
              
              {/* Right side: Status toggle */}
              <div className="d-flex align-items-center gap-2">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    disabled                    // Read-only, can't be toggled
                    checked={status === 1 || status === "1"}  // ON if status is 1
                  />
                </div>
              </div>
            </li>
          );
        })}
    </ul>
  </div>
</div>
```

**Explanation**:
- **Column Width**: Takes 25% of row width on medium+ screens
- **Filter Logic**: 
  - Gets latest log for each RFID
  - Only shows RFIDs that were found (not "RFID NOT FOUND")
- **Toggle Switch**: 
  - Shows current status (1 = ON, 0 = OFF)
  - Disabled (read-only display)
  - Status can be string "1" or number 1 (handles both)

---

#### **Right Column - Logs Table (Lines 91-137)**

```javascript
{/* Right: Table */}
<div className="col-md-9">              // 9 columns wide (75% width)
  <div className="card h-100">          // Card that fills available height
    <div className="card-body p-0">     // Card body with no padding
      <div className="table-responsive"> // Makes table scrollable on small screens
        
        <table className="table table-striped table-hover mb-0">
          {/* Table Header */}
          <thead className="table-dark">
            <tr>
              <th className="text-center">RFID</th>
              <th className="text-center">Status</th>
              <th className="text-center">Date & Time</th>
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody>
            {logs.map((log, index) => (   // Map each log to a table row
              <tr key={index}>
                
                {/* RFID Column */}
                <td className="text-center">{log.rfid}</td>
                
                {/* Status Column */}
                <td className="text-center">
                  {log.rfid_message === "RFID NOT FOUND" ? (
                    // Show red badge for not found
                    <span className="badge bg-danger">{log.rfid_message}</span>
                  ) : (
                    // Show blue badge for status 1 (ON), gray for 0 (OFF)
                    <span
                      className={`badge ${
                        log.status === "1" || log.status === 1 ? "bg-primary" : "bg-secondary"
                      }`}
                    >
                      {log.status === "1" || log.status === 1 ? "1" : "0"}
                    </span>
                  )}
                </td>
                
                {/* Date & Time Column */}
                <td className="text-center">{formatDate(log.date_time)}</td>
              </tr>
            ))}
            
            {/* Empty State - shown when no logs */}
            {logs.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center text-muted py-3">
                  No logs available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
```

**Explanation**:
- **Column Width**: Takes 75% of row width
- **Table Features**:
  - Striped rows (alternating colors)
  - Hover effect on rows
  - Responsive (scrollable on mobile)
- **Status Display**:
  - Red badge: "RFID NOT FOUND"
  - Blue badge: Status = 1 (ON/Active)
  - Gray badge: Status = 0 (OFF/Inactive)
- **Date Display**: Uses `formatDate()` for readable dates
- **Empty State**: Shows "No logs available" if logs array is empty

---

### 4. `styles/globals.css` - Global Styles

```css
/* Line 1-2: Standard CSS Reset/Base Styles */
/* Removes default browser margins and padding */
html,
body {
    padding: 0;              /* Remove default padding */
    margin: 0;               /* Remove default margin */
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
        Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    /* System font stack for best performance and native look */
}

/* Line 10-13: Link styles */
a {
    color: inherit;          /* Links inherit color from parent */
    text-decoration: none;   /* Remove underline from links */
}

/* Line 15-17: Box-sizing for all elements */
* {
    box-sizing: border-box;  /* Include padding and border in element width */
}
```

**Purpose**: 
- Provides consistent baseline styles across all browsers
- Removes default browser styling
- Sets up modern box-sizing model
- Uses system fonts for better performance

---

### 5. `next.config.ts` - Next.js Configuration

```typescript
import type { NextConfig } from "next";

// Configuration object for Next.js
const nextConfig: NextConfig = {
  /* config options here */
  // Currently using all defaults
};

export default nextConfig;
```

**Purpose**: 
- Configures Next.js build and runtime behavior
- Currently empty (using all defaults)
- Can be used to add:
  - Custom webpack configuration
  - Environment variables
  - Image optimization settings
  - Redirects and rewrites
  - API routes configuration

---

### 6. `tsconfig.json` - TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2017",                    // Compile to ES2017 JavaScript
    "lib": ["dom", "dom.iterable", "esnext"],  // Include type definitions
    "allowJs": true,                       // Allow JavaScript files
    "skipLibCheck": true,                  // Skip type checking of declaration files
    "strict": true,                        // Enable all strict type-checking options
    "noEmit": true,                        // Don't emit JavaScript (Next.js handles it)
    "esModuleInterop": true,               // Enable interop between CommonJS and ES modules
    "module": "esnext",                    // Use latest module system
    "moduleResolution": "bundler",         // Use bundler module resolution
    "resolveJsonModule": true,             // Allow importing JSON files
    "isolatedModules": true,               // Ensure each file can be safely transpiled
    "jsx": "react-jsx",                    // Use new JSX transform
    "incremental": true,                   // Enable incremental compilation
    "plugins": [
      {
        "name": "next"                     // Next.js TypeScript plugin
      }
    ],
    "paths": {
      "@/*": ["./*"]                       // Alias @ to root directory
    }
  },
  "include": [                             // Files to include in compilation
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]              // Exclude node_modules
}
```

**Purpose**: 
- Configures TypeScript compiler
- Enables type checking for the project
- Sets up module resolution
- Defines which files to compile

---

### 7. `eslint.config.mjs` - ESLint Configuration

```javascript
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Line 5-16: ESLint configuration
const eslintConfig = defineConfig([
  ...nextVitals,              // Next.js Core Web Vitals rules
  ...nextTs,                  // Next.js TypeScript rules
  
  // Line 8-15: Override default ignores
  globalIgnores([
    ".next/**",               // Ignore build output
    "out/**",                 // Ignore export output
    "build/**",               // Ignore build artifacts
    "next-env.d.ts",          // Ignore Next.js type definitions
  ]),
]);

export default eslintConfig;
```

**Purpose**: 
- Configures code linting rules
- Uses Next.js recommended configurations
- Ignores build artifacts and generated files
- Helps maintain code quality and consistency

---

### 8. `postcss.config.mjs` - PostCSS Configuration

```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},  // Enable Tailwind CSS processing
  },
};

export default config;
```

**Purpose**: 
- Configures CSS processing
- Enables Tailwind CSS integration
- Processes CSS files during build

---

### 9. `.gitignore` - Git Ignore Rules

```
# Dependencies
/node_modules               # Don't commit npm packages (too large, auto-installed)

# Next.js
/.next/                     # Don't commit build output
/out/                       # Don't commit export output

# Production
/build                      # Don't commit production builds

# Misc
.DS_Store                   # Don't commit macOS system files
*.pem                       # Don't commit SSL certificates

# Debug logs
npm-debug.log*              # Don't commit debug logs

# Environment variables
.env*                       # Don't commit environment variables (may contain secrets)

# TypeScript
*.tsbuildinfo               # Don't commit TypeScript build info
next-env.d.ts               # Don't commit Next.js type definitions
```

**Purpose**: 
- Specifies files that Git should not track
- Prevents committing large or sensitive files
- Keeps repository clean and small

---

## Application Flow

### 1. **Application Startup Flow**

```
Browser Request
    ↓
Next.js Server
    ↓
Load _app.js (Custom App Component)
    ↓
  - Import Bootstrap CSS
  - Import global styles
    ↓
Load pages/index.js (Dashboard Component)
    ↓
Initialize React Component
    ↓
  - Set up empty states (logs, rfidList)
  - Run useEffect hook
    ↓
Render initial UI (empty state)
```

### 2. **Data Fetching Flow**

```
useEffect Hook Triggers (on component mount)
    ↓
fetchData() called immediately
    ↓
  - Send HTTP GET request to API endpoint
  - Wait for response
    ↓
Response Received
    ↓
Validate response is an array
    ↓
  YES → Process data
  NO → Log error
    ↓
Update State
    ↓
  - setLogs(response data)
  - Extract unique RFIDs
  - Add new RFIDs to rfidList
    ↓
React Re-renders Component
    ↓
UI Updates with new data
```

### 3. **Continuous Polling Flow**

```
setInterval(fetchData, 1000)
    ↓
Every 1 second:
    ↓
fetchData() is called
    ↓
[Same flow as Data Fetching Flow]
    ↓
UI updates in real-time
```

### 4. **Component Unmount Flow**

```
User navigates away
    ↓
Component unmounts
    ↓
useEffect cleanup function runs
    ↓
clearInterval(interval)
    ↓
Polling stops
```

### 5. **Render Flow**

```
Component Renders
    ↓
Build JSX Structure
    ↓
├── Container Div
│   └── Row Div
│       ├── Left Column (25% width)
│       │   └── RFID List Card
│       │       ├── Header: "RFID"
│       │       └── List of unique RFIDs
│       │           ├── Filter out invalid RFIDs
│       │           └── For each valid RFID:
│       │               ├── Show RFID number
│       │               └── Show toggle (status 1/0)
│       │
│       └── Right Column (75% width)
│           └── Logs Table Card
│               ├── Header Row (RFID, Status, Date & Time)
│               └── Data Rows
│                   └── For each log:
│                       ├── Show RFID
│                       ├── Show Status Badge
│                       │   ├── Red: "RFID NOT FOUND"
│                       │   ├── Blue: Status = 1
│                       │   └── Gray: Status = 0
│                       └── Show Formatted Date
    ↓
React commits to DOM
    ↓
Browser renders UI
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    ESP32 Device + PHP Backend                │
│                  http://10.141.68.150/esp32/                 │
│                      get_logs.php                            │
└────────────────────────┬────────────────────────────────────┘
                         │ (HTTP GET Request every 1 second)
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                      Axios HTTP Client                       │
│                  (pages/index.js - Line 11)                  │
└────────────────────────┬────────────────────────────────────┘
                         │ (Returns JSON array)
                         │
                         ↓
         ┌───────────────────────────────┐
         │      Validate Response        │
         │   Is it an array? (Line 12)   │
         └───────┬───────────────────────┘
                 │
       ┌─────────┴─────────┐
       │ YES               │ NO
       ↓                   ↓
   Process Data     Log Error
       │
       ↓
┌──────────────────────────────────────┐
│         Update React State           │
├──────────────────────────────────────┤
│  1. setLogs(res.data) - Line 13      │
│     → All log entries                │
│                                      │
│  2. Extract unique RFIDs - Line 14   │
│     → uniquesFromBatch               │
│                                      │
│  3. Update rfidList - Lines 16-21    │
│     → Add only new unique RFIDs      │
└──────────────┬───────────────────────┘
               │
               ↓ (State change triggers re-render)
┌──────────────────────────────────────┐
│         Component Re-renders          │
└──────────────┬───────────────────────┘
               │
               ↓
       ┌───────┴────────┐
       │                │
       ↓                ↓
┌─────────────┐  ┌─────────────┐
│  RFID List  │  │  Logs Table │
│  (Left)     │  │  (Right)    │
├─────────────┤  ├─────────────┤
│ Filter      │  │ Map logs    │
│ valid RFIDs │  │ to rows     │
│             │  │             │
│ Show each:  │  │ Show each:  │
│ - Number    │  │ - RFID      │
│ - RFID      │  │ - Status    │
│ - Toggle    │  │ - DateTime  │
└─────────────┘  └─────────────┘
       │                │
       └────────┬───────┘
                ↓
    ┌────────────────────┐
    │   Browser Renders   │
    │   Updated UI        │
    └────────────────────┘
```

---

## Key Concepts Explained

### React State Management

**What is State?**
State is data that changes over time and triggers UI updates when modified.

**In this app:**
```javascript
const [logs, setLogs] = useState([]);
```
- `logs`: Current state value (array of log objects)
- `setLogs`: Function to update state
- `useState([])`: Initialize with empty array

**When state changes:**
1. `setLogs([...newData])` is called
2. React detects state change
3. Component re-renders with new data
4. UI updates automatically

### React Hooks

**useEffect Hook:**
```javascript
useEffect(() => {
  // This runs after component renders
  fetchData();
  const interval = setInterval(fetchData, 1000);
  return () => clearInterval(interval); // Cleanup
}, []); // Dependencies
```

- **Purpose**: Handle side effects (API calls, timers, subscriptions)
- **Empty `[]`**: Run only once when component mounts
- **Cleanup function**: Run when component unmounts (prevent memory leaks)

### API Integration

**Axios GET Request:**
```javascript
const res = await axios.get("http://10.141.68.150/esp32/get_logs.php");
```

- **`await`**: Wait for response before continuing
- **`async`**: Marks function as asynchronous
- **`try/catch`**: Handle errors gracefully

**Expected API Response:**
```json
[
  {
    "rfid": "AB:CD:EF:12:34:56",
    "status": "1",
    "rfid_message": "Access Granted",
    "date_time": "2025-11-22 14:30:45"
  },
  {
    "rfid": "12:34:56:AB:CD:EF",
    "status": "0",
    "rfid_message": "Access Denied",
    "date_time": "2025-11-22 14:29:12"
  }
]
```

### Bootstrap Grid System

**Layout Structure:**
```html
<div className="container">       <!-- Fixed-width responsive container -->
  <div className="row">           <!-- Flex row -->
    <div className="col-md-3">    <!-- 25% width on medium+ screens -->
      <!-- RFID List -->
    </div>
    <div className="col-md-9">    <!-- 75% width on medium+ screens -->
      <!-- Logs Table -->
    </div>
  </div>
</div>
```

**Grid System:**
- 12-column layout
- `col-md-3`: 3 of 12 columns = 25%
- `col-md-9`: 9 of 12 columns = 75%
- `md`: Applies to medium screens and larger
- Mobile: Stacks vertically (100% width each)

---

## Common Operations Explained

### 1. Adding New RFID to List (Without Duplicates)

```javascript
setRfidList((prev) => {
  const seen = new Set(prev);        // Convert array to Set for O(1) lookup
  const appended = [];               // Store new items
  
  for (const r of uniquesFromBatch) {
    if (!seen.has(r)) {              // If RFID not already in list
      appended.push(r);              // Add to new items
    }
  }
  
  // Only update if there are new items (optimization)
  return appended.length ? [...prev, ...appended] : prev;
});
```

**Why this approach?**
- Maintains order of RFIDs (first seen = first in list)
- No duplicates
- Efficient O(n) time complexity
- Only triggers re-render if list actually changes

### 2. Filtering Valid RFIDs

```javascript
rfidList.filter((rfid) => {
  const latest = logs.find((l) => l.rfid === rfid);  // Find latest log
  return latest && latest.rfid_message !== "RFID NOT FOUND";
})
```

**Logic:**
1. For each RFID in rfidList
2. Find its latest log entry
3. Keep RFID only if:
   - Log exists AND
   - Message is NOT "RFID NOT FOUND"

### 3. Date Formatting

```javascript
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr;
  return date.toLocaleString("en-US", { /* options */ });
};
```

**Transformation:**
- Input: `"2025-11-22 14:30:45"`
- Output: `"November 22, 2025, 2:30 PM"`

**Options:**
- `month: "long"`: Full month name
- `day: "numeric"`: Day number
- `year: "numeric"`: Full year
- `hour: "numeric"`: Hour
- `minute: "2-digit"`: Zero-padded minutes
- `hour12: true`: 12-hour format with AM/PM

---

## Development Commands

### Install Dependencies
```bash
cd rfid_dashboard
npm install
```

### Run Development Server
```bash
npm run dev
```
- Starts server at `http://localhost:3000`
- Hot reload enabled (auto-refresh on file changes)

### Build for Production
```bash
npm run build
```
- Creates optimized production build
- Output in `.next/` directory

### Start Production Server
```bash
npm run start
```
- Runs production build
- Must run `npm run build` first

### Lint Code
```bash
npm run lint
```
- Checks code for errors and style issues
- Uses ESLint with Next.js configuration

---

## Troubleshooting

### Common Issues

**1. API Connection Failed**
- **Error**: "Failed to fetch RFID logs"
- **Cause**: ESP32 device is offline or IP address changed
- **Fix**: Verify `http://10.141.68.150/esp32/get_logs.php` is accessible

**2. No Data Showing**
- **Error**: "No logs available"
- **Cause**: API returns empty array or wrong format
- **Fix**: Check API response in browser console

**3. Bootstrap Styles Not Loading**
- **Error**: UI looks unstyled
- **Cause**: Bootstrap CSS import failed
- **Fix**: Verify `node_modules/bootstrap` exists, run `npm install`

**4. TypeScript Errors**
- **Error**: Type checking errors
- **Cause**: `.js` files being treated as TypeScript
- **Fix**: Either add type annotations or rename to `.jsx`

---

## Security Considerations

1. **Hardcoded API URL**: 
   - Currently: `http://10.141.68.150/esp32/get_logs.php`
   - Better: Use environment variable (`process.env.NEXT_PUBLIC_API_URL`)

2. **No Authentication**:
   - API endpoint is public
   - Consider adding API key or token authentication

3. **CORS**:
   - Backend must allow cross-origin requests
   - ESP32/PHP should send appropriate CORS headers

4. **Data Validation**:
   - App validates response is array
   - Consider validating structure of each log object

---

## Future Improvements

1. **Error Handling UI**:
   - Show error message when API fails
   - Add retry button

2. **Loading States**:
   - Show spinner while fetching initial data
   - Add skeleton loaders

3. **Pagination**:
   - Limit logs shown (e.g., last 50)
   - Add "Load More" button

4. **Search/Filter**:
   - Search by RFID
   - Filter by date range
   - Filter by status

5. **Real-time Updates**:
   - Use WebSockets instead of polling
   - More efficient and instant updates

6. **Data Persistence**:
   - Store logs in browser localStorage
   - Maintain history across page refreshes

7. **Export Functionality**:
   - Export logs to CSV
   - Print-friendly view

8. **Mobile Optimization**:
   - Improve responsive design
   - Add touch-friendly controls

---

## Summary

This RFID Dashboard is a **real-time monitoring application** that:

1. **Fetches** data from an ESP32 device via HTTP API every second
2. **Displays** two synchronized views:
   - List of unique RFID tags with current status
   - Complete log table of all scan events
3. **Updates** automatically without page refresh
4. **Uses** modern web technologies:
   - Next.js for framework
   - React for UI components
   - Bootstrap for styling
   - Axios for API calls

**Core Flow**:
```
ESP32 Device → PHP API → Axios → React State → UI Rendering
```

**Key Files**:
- `pages/_app.js`: App initialization and global styles
- `pages/index.js`: Main dashboard logic and UI
- `package.json`: Dependencies and scripts
- `tsconfig.json`: TypeScript configuration
- `styles/globals.css`: Global CSS styles

This documentation should help you understand how each part works and how data flows through the application!
