# RFID Dashboard - Application Flow Diagram

This document provides visual representations of how the application works.

---

## 1. Application Initialization Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ Step 1: Browser Requests http://localhost:3000                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 2: Next.js Server Starts Processing Request                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 3: Load pages/_app.js (Custom App Component)               │
│                                                                  │
│  • Import Bootstrap CSS (bootstrap.min.css)                     │
│  • Import Global CSS (globals.css)                              │
│  • Wrap all pages with MyApp component                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 4: Load pages/index.js (Dashboard Component)               │
│                                                                  │
│  • Initialize state:                                            │
│    - logs = []                                                  │
│    - rfidList = []                                              │
│                                                                  │
│  • Set up useEffect hook (will run after first render)          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 5: First Render with Empty State                           │
│                                                                  │
│  • Left side: Empty RFID list                                   │
│  • Right side: "No logs available" message                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 6: useEffect Hook Triggers                                 │
│                                                                  │
│  • fetchData() called immediately                               │
│  • setInterval(fetchData, 1000) starts polling                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 7: Data Fetching Begins                                    │
│                                                                  │
│  (See "Data Fetching Flow" for details)                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Data Fetching Flow (fetchData function)

```
┌─────────────────────────────────────────────────────────────────┐
│ fetchData() Called                                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│ Send HTTP GET Request                                            │
│                                                                  │
│  URL: http://10.141.68.150/esp32/get_logs.php                   │
│  Method: GET                                                     │
│  Library: Axios                                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
                    ┌────┴─────┐
                    │  Result  │
                    └────┬─────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ↓                ↓                ↓
    SUCCESS          NETWORK           SERVER
    (200 OK)          ERROR            ERROR
        │                │                │
        │                └────────┬───────┘
        │                         │
        │                         ↓
        │              ┌──────────────────────┐
        │              │ catch (error) Block  │
        │              │                      │
        │              │ console.error(...)   │
        │              │ Keep old data        │
        │              └──────────────────────┘
        │
        ↓
┌─────────────────────────────────────────────────────────────────┐
│ Validate Response: Is res.data an Array?                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                    ┌────┴─────┐
                    │          │
                    ↓          ↓
                  YES          NO
                    │          │
                    │          ↓
                    │    ┌─────────────────────────────────────┐
                    │    │ console.error("Not an array")       │
                    │    │ Keep old data                       │
                    │    └─────────────────────────────────────┘
                    │
                    ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 1: Update logs State                                       │
│                                                                  │
│  setLogs(res.data)                                              │
│                                                                  │
│  Example: [                                                     │
│    { rfid: "AB:CD:EF", status: "1", ... },                     │
│    { rfid: "12:34:56", status: "0", ... }                      │
│  ]                                                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 2: Extract Unique RFIDs from Response                       │
│                                                                  │
│  res.data.map(l => l.rfid)                                      │
│  → ["AB:CD:EF", "12:34:56", "AB:CD:EF"]                        │
│                                                                  │
│  new Set([...])                                                 │
│  → {"AB:CD:EF", "12:34:56"}                                    │
│                                                                  │
│  [...new Set(...)]                                              │
│  → ["AB:CD:EF", "12:34:56"]                                    │
│                                                                  │
│  uniquesFromBatch = ["AB:CD:EF", "12:34:56"]                   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 3: Update rfidList (Add Only New RFIDs)                    │
│                                                                  │
│  Previous rfidList: ["AB:CD:EF"]                                │
│  uniquesFromBatch:  ["AB:CD:EF", "12:34:56"]                   │
│                                                                  │
│  Algorithm:                                                     │
│  1. Create Set from previous: {"AB:CD:EF"}                      │
│  2. Loop through uniquesFromBatch:                              │
│     • "AB:CD:EF" → already in Set, skip                        │
│     • "12:34:56" → not in Set, add to appended                 │
│  3. appended = ["12:34:56"]                                     │
│  4. Return: [...prev, ...appended]                              │
│                                                                  │
│  New rfidList: ["AB:CD:EF", "12:34:56"]                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 4: State Updated → React Re-renders Component              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│ UI Updates with New Data                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Render Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ Dashboard Component Renders                                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│ Build JSX Tree                                                   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│ <div className="container my-4">                                │
│   └─ <div className="row g-2">                                 │
│       ├─ LEFT COLUMN (col-md-3)                                │
│       │    └─ RFID List Card                                   │
│       │                                                          │
│       └─ RIGHT COLUMN (col-md-9)                               │
│            └─ Logs Table Card                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
          ┌──────────────┴──────────────┐
          │                             │
          ↓                             ↓
┌────────────────────┐      ┌────────────────────┐
│  RENDER LEFT       │      │  RENDER RIGHT      │
│  (RFID List)       │      │  (Logs Table)      │
└─────────┬──────────┘      └─────────┬──────────┘
          │                           │
          ↓                           ↓
┌────────────────────┐      ┌────────────────────┐
│ Filter rfidList    │      │ Map logs array     │
│                    │      │                    │
│ Keep only valid:   │      │ For each log:      │
│ • Has log entry    │      │ • Create <tr>      │
│ • Not "NOT FOUND"  │      │ • Add RFID         │
└─────────┬──────────┘      │ • Add Status       │
          │                 │ • Add DateTime     │
          ↓                 └─────────┬──────────┘
┌────────────────────┐               │
│ Map filtered list  │               ↓
│                    │      ┌────────────────────┐
│ For each RFID:     │      │ Apply conditional  │
│ • Create <li>      │      │ styling:           │
│ • Show number      │      │                    │
│ • Show RFID        │      │ IF "NOT FOUND":    │
│ • Show toggle      │      │   → Red badge      │
│   (based on status)│      │                    │
└─────────┬──────────┘      │ ELSE IF status=1:  │
          │                 │   → Blue badge "1" │
          │                 │                    │
          │                 │ ELSE:              │
          │                 │   → Gray badge "0" │
          │                 └─────────┬──────────┘
          │                           │
          └───────────┬───────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────────┐
│ React Commits Changes to DOM                                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│ Browser Paints UI                                                │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                     RFID Dashboard                       │   │
│  ├──────────────┬──────────────────────────────────────────┤   │
│  │ RFID         │  RFID   │ Status │ Date & Time          │   │
│  ├──────────────┼─────────┼────────┼──────────────────────┤   │
│  │ 1. AB:CD:EF  │ AB:CD   │   1    │ Nov 22, 2025, 2:30 PM│   │
│  │    [ON]      │         │        │                      │   │
│  │              ├─────────┼────────┼──────────────────────┤   │
│  │ 2. 12:34:56  │ 12:34   │   0    │ Nov 22, 2025, 2:29 PM│   │
│  │    [OFF]     │         │        │                      │   │
│  └──────────────┴─────────┴────────┴──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Continuous Polling Loop

```
┌─────────────────────────────────────────────────────────────────┐
│ Component Mounted                                                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│ useEffect Hook Creates Interval                                  │
│                                                                  │
│  setInterval(fetchData, 1000)                                   │
│                                                                  │
│  Returns: interval ID (e.g., 42)                                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
                    ┌────┴──────────────────────┐
                    │                           │
                    ↓                           │
        ┌─────────────────────┐                │
        │ Wait 1000ms (1 sec) │                │
        └─────────┬───────────┘                │
                  │                             │
                  ↓                             │
        ┌─────────────────────┐                │
        │ fetchData() called  │                │
        └─────────┬───────────┘                │
                  │                             │
                  ↓                             │
        ┌─────────────────────┐                │
        │ Fetch from API      │                │
        │ Update state        │                │
        │ Re-render UI        │                │
        └─────────┬───────────┘                │
                  │                             │
                  └─────────────────────────────┘
                                (Loop continues forever)

┌─────────────────────────────────────────────────────────────────┐
│ When Component Unmounts (user navigates away)                   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│ useEffect Cleanup Function Runs                                  │
│                                                                  │
│  clearInterval(interval)                                        │
│                                                                  │
│  • Stops the polling loop                                       │
│  • Prevents memory leaks                                        │
│  • No more API calls                                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. State Management Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ Initial State                                                    │
│                                                                  │
│  logs = []                                                       │
│  rfidList = []                                                   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│ First API Call Returns Data                                      │
│                                                                  │
│  [                                                               │
│    { rfid: "AA:BB", status: "1", rfid_message: "OK", ... },    │
│    { rfid: "CC:DD", status: "0", rfid_message: "OK", ... }     │
│  ]                                                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│ State Update #1                                                  │
│                                                                  │
│  logs = [                                                        │
│    { rfid: "AA:BB", status: "1", ... },                         │
│    { rfid: "CC:DD", status: "0", ... }                          │
│  ]                                                               │
│                                                                  │
│  rfidList = ["AA:BB", "CC:DD"]                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓ (Re-render with new data)
┌─────────────────────────────────────────────────────────────────┐
│ UI Now Shows:                                                    │
│  • Left: 2 RFIDs with toggles                                   │
│  • Right: 2 rows in table                                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓ (After 1 second)
┌─────────────────────────────────────────────────────────────────┐
│ Second API Call Returns Updated Data                             │
│                                                                  │
│  [                                                               │
│    { rfid: "AA:BB", status: "0", rfid_message: "OK", ... },    │
│    { rfid: "CC:DD", status: "1", rfid_message: "OK", ... },    │
│    { rfid: "EE:FF", status: "1", rfid_message: "OK", ... }     │
│  ]                                                               │
│                                                                  │
│  (Note: AA:BB status changed from 1→0,                          │
│         CC:DD status changed from 0→1,                          │
│         EE:FF is a new RFID)                                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│ State Update #2                                                  │
│                                                                  │
│  logs = [                                                        │
│    { rfid: "AA:BB", status: "0", ... },  ← Status changed      │
│    { rfid: "CC:DD", status: "1", ... },  ← Status changed      │
│    { rfid: "EE:FF", status: "1", ... }   ← New entry           │
│  ]                                                               │
│                                                                  │
│  rfidList = ["AA:BB", "CC:DD", "EE:FF"]  ← New RFID added      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓ (Re-render with new data)
┌─────────────────────────────────────────────────────────────────┐
│ UI Now Shows:                                                    │
│  • Left: 3 RFIDs (EE:FF added, toggles updated)                 │
│  • Right: 3 rows in table (all data refreshed)                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Data Transformation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ API Response (Raw JSON)                                          │
│                                                                  │
│  [                                                               │
│    {                                                             │
│      "rfid": "AB:CD:EF:12:34:56",                               │
│      "status": "1",                                             │
│      "rfid_message": "Access Granted",                          │
│      "date_time": "2025-11-22 14:30:45"                         │
│    }                                                             │
│  ]                                                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
          ┌──────────────┴──────────────┐
          │                             │
          ↓                             ↓
┌─────────────────────┐      ┌─────────────────────┐
│ Transform for       │      │ Transform for       │
│ RFID List (Left)    │      │ Table (Right)       │
└──────────┬──────────┘      └──────────┬──────────┘
           │                             │
           ↓                             ↓
┌─────────────────────┐      ┌─────────────────────┐
│ Extract unique      │      │ Format each field:  │
│ RFID values:        │      │                     │
│                     │      │ • rfid: as-is       │
│ "AB:CD:EF:12:34:56" │      │                     │
└──────────┬──────────┘      │ • status:           │
           │                 │   "1" → Blue badge  │
           ↓                 │   "0" → Gray badge  │
┌─────────────────────┐      │                     │
│ Get latest log      │      │ • date_time:        │
│ to check status     │      │   "2025-11-22..."   │
│                     │      │   ↓                 │
│ status = "1"        │      │   "November 22..."  │
└──────────┬──────────┘      └──────────┬──────────┘
           │                             │
           ↓                             ↓
┌─────────────────────┐      ┌─────────────────────┐
│ Render as:          │      │ Render as:          │
│                     │      │                     │
│ 1. AB:CD:EF...      │      │ Row in table with   │
│    [Toggle: ON]     │      │ formatted data      │
└─────────────────────┘      └─────────────────────┘
```

---

## 7. React Component Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│ MOUNTING PHASE                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. constructor() [implicit in functional components]           │
│     • Initialize state with useState                            │
│     • logs = [], rfidList = []                                  │
│                                                                  │
│  2. render()                                                     │
│     • Build JSX tree                                            │
│     • Return virtual DOM                                        │
│                                                                  │
│  3. React updates DOM                                            │
│     • Compare virtual DOM with real DOM                         │
│     • Apply minimal changes                                     │
│                                                                  │
│  4. useEffect() hook runs                                        │
│     • fetchData() called immediately                            │
│     • setInterval() starts polling                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ UPDATING PHASE (Triggered by state change)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. State update triggered                                       │
│     • setLogs() or setRfidList() called                         │
│                                                                  │
│  2. render()                                                     │
│     • Re-build JSX tree with new data                           │
│     • Create new virtual DOM                                    │
│                                                                  │
│  3. React updates DOM                                            │
│     • Diff virtual DOM with real DOM                            │
│     • Apply only changed elements                               │
│     • Efficient updates (doesn't re-render entire page)         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ UNMOUNTING PHASE                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Component about to be removed                                │
│     • User navigates away from page                             │
│                                                                  │
│  2. useEffect() cleanup function runs                            │
│     • clearInterval() stops polling                             │
│     • Prevent memory leaks                                      │
│                                                                  │
│  3. Component removed from DOM                                   │
│     • Memory freed                                              │
│     • Event listeners removed                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ fetchData() Called                                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│ try { ... }                                                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                    ┌────┴─────┐
                    │          │
            SUCCESS │          │ ERROR
                    ↓          ↓
        ┌───────────────┐  ┌──────────────────────────────────┐
        │ Process data  │  │ catch (error) {                  │
        │ Update state  │  │                                  │
        └───────────────┘  │   Error Types:                   │
                           │                                  │
                           │   1. Network Error               │
                           │      • Internet down             │
                           │      • Server unreachable        │
                           │      • Timeout                   │
                           │                                  │
                           │   2. Invalid Response            │
                           │      • Not an array              │
                           │      • Malformed JSON            │
                           │                                  │
                           │   3. Server Error                │
                           │      • 500 Internal Error        │
                           │      • 404 Not Found             │
                           │                                  │
                           │   Action:                        │
                           │   • console.error(error)         │
                           │   • Keep old data in state       │
                           │   • UI continues showing old data│
                           │   • Try again in 1 second        │
                           │ }                                │
                           └──────────────────────────────────┘
```

---

## Summary

These diagrams illustrate the complete flow of the RFID Dashboard application:

1. **Initialization**: App starts → Loads components → Sets up polling
2. **Data Fetching**: API calls every second → Validate → Update state
3. **Rendering**: State changes → Re-render → Update UI
4. **Polling**: Continuous loop fetching fresh data
5. **State Management**: Track logs and unique RFIDs
6. **Transformations**: Raw API data → Formatted UI elements
7. **Lifecycle**: Mount → Update → Unmount with cleanup
8. **Error Handling**: Graceful failures with logging

The app maintains a real-time connection to the ESP32 device and provides immediate visual feedback when RFID tags are scanned.
