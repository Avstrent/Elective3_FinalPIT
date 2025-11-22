/**
 * RFID Dashboard - Main Application Component
 * 
 * This is the homepage component that displays real-time RFID scan logs
 * from an ESP32 device. It fetches data from a PHP API endpoint every second
 * and displays it in two synchronized views:
 * 1. A list of unique RFID tags with their current status (left side)
 * 2. A comprehensive table of all log entries (right side)
 */

// Import React hooks for state management and side effects
import { useEffect, useState } from "react";

// Import Axios for making HTTP requests to the API
import axios from "axios";

// Import Bootstrap CSS (note: this is redundant as it's already imported in _app.js)
import "bootstrap/dist/css/bootstrap.min.css";

/**
 * Dashboard Component
 * Main component that manages RFID data fetching and display
 */
export default function Dashboard() {
  // State: Array of all RFID log entries fetched from the API
  // Each log has: { rfid, status, rfid_message, date_time }
  const [logs, setLogs] = useState([]);
  
  // State: Array of unique RFID tags that have been detected
  // Maintains order of first appearance, prevents duplicates
  const [rfidList, setRfidList] = useState([]);

  /**
   * fetchData - Fetches RFID log data from the ESP32 backend
   * 
   * This function:
   * 1. Makes an HTTP GET request to the PHP API endpoint
   * 2. Validates the response is an array
   * 3. Updates the logs state with all received data
   * 4. Extracts unique RFID tags and adds new ones to rfidList
   * 
   * Called immediately on component mount and then every 1 second
   */
  const fetchData = async () => {
    try {
      // Make GET request to ESP32 PHP API endpoint
      // Expected response: Array of log objects with { rfid, status, rfid_message, date_time }
      const res = await axios.get("http://10.141.68.150/esp32/get_logs.php");
      
      // Validate that the API returned an array (not an object or error)
      if (Array.isArray(res.data)) {
        // Update logs state with all received data
        setLogs(res.data);
        
        // Extract unique RFID values from the current batch
        // Uses Set to automatically remove duplicates, then converts back to array
        const uniquesFromBatch = [...new Set(res.data.map((l) => l.rfid))];

        // Update rfidList by adding only new RFIDs (prevents duplicates)
        setRfidList((prev) => {
          // Create Set from existing RFIDs for O(1) lookup performance
          const seen = new Set(prev);
          
          // Array to store new RFIDs that aren't already in the list
          const appended = [];
          
          // Check each RFID from current batch
          for (const r of uniquesFromBatch) 
            // If RFID not already in list, add to appended array
            if (!seen.has(r)) 
              appended.push(r);
          
          // Only update state if there are new RFIDs (optimization to prevent unnecessary re-renders)
          return appended.length ? [...prev, ...appended] : prev;
        });
      } else {
        // Log error if response is not an array (unexpected format)
        console.error("Data is not an array:", res.data);
      }
    } catch (error) {
      // Log error if HTTP request fails (network error, API down, etc.)
      console.error("Failed to fetch RFID logs:", error);
    }
  };

  /**
   * useEffect Hook - Sets up data fetching on component mount
   * 
   * This effect:
   * 1. Runs once when component first mounts (empty dependency array [])
   * 2. Fetches data immediately
   * 3. Sets up an interval to fetch data every 1 second (1000ms)
   * 4. Returns cleanup function to clear interval on unmount
   * 
   * The cleanup function is important to prevent memory leaks when
   * the component is removed from the DOM
   */
  useEffect(() => {
    // Fetch data immediately when component mounts
    fetchData();
    
    // Set up interval to fetch data every 1 second (polling for real-time updates)
    const interval = setInterval(fetchData, 1000);
    
    // Cleanup function: clear the interval when component unmounts
    // This prevents the interval from continuing after the component is destroyed
    return () => clearInterval(interval);
  }, []); // Empty dependency array means this effect runs only once on mount

  /**
   * formatDate - Converts date string to human-readable format
   * 
   * @param {string} dateStr - Date string from API (e.g., "2025-11-22 14:30:45")
   * @returns {string} Formatted date (e.g., "November 22, 2025, 2:30 PM")
   * 
   * Examples:
   * - Input:  "2025-11-22 14:30:45"
   * - Output: "November 22, 2025, 2:30 PM"
   */
  const formatDate = (dateStr) => {
    // Convert string to Date object
    const date = new Date(dateStr);
    
    // Check if date is valid (isNaN checks if date parsing failed)
    if (isNaN(date)) return dateStr; // Return original string if invalid
    
    // Format date using US locale with custom options
    return date.toLocaleString("en-US", {
      month: "long",      // Full month name (e.g., "November")
      day: "numeric",     // Day number (e.g., "22")
      year: "numeric",    // Full year (e.g., "2025")
      hour: "numeric",    // Hour (e.g., "2")
      minute: "2-digit",  // Zero-padded minute (e.g., "05")
      hour12: true,       // 12-hour format with AM/PM
    });
  };

  // JSX Return - Render the UI
  return (
    // Bootstrap container with vertical margin (my-4 = margin-y 1.5rem)
    <div className="container my-4">
      {/* Bootstrap grid row with gap between columns (g-2 = 0.5rem gap) */}
      <div className="row g-2">
        
        {/* LEFT COLUMN: RFID List Card (25% width on medium+ screens) */}
        <div className="col-md-3">
          {/* Dark themed card with auto height */}
          <div className="card bg-dark text-white h-auto">
            {/* Card header showing "RFID" title */}
            <div className="card-header text-center fw-bold">RFID</div>
            
            {/* List group for displaying RFIDs */}
            <ul className="list-group list-group-flush" style={{ borderRadius: "0" }}>
              {rfidList
                // FILTER: Only show RFIDs that are valid (not "RFID NOT FOUND")
                .filter((rfid) => {
                  // Find the latest log entry for this RFID
                  const latest = logs.find((l) => l.rfid === rfid);
                  
                  // Keep RFID only if log exists AND message is not "RFID NOT FOUND"
                  return latest && latest.rfid_message !== "RFID NOT FOUND";
                })
                
                // MAP: Convert each valid RFID to a list item
                .map((rfid, index) => {
                  // Get the latest log for this RFID (to display current status)
                  const latest = logs.find((l) => l.rfid === rfid);
                  
                  // Extract status (1 = ON, 0 = OFF)
                  const status = latest ? latest.status : null;

                  return (
                    // List item with flexbox layout (space between number and toggle)
                    <li
                      key={rfid}
                      className="list-group-item d-flex justify-content-between align-items-center bg-dark text-white border-0"
                    >
                      {/* Left side: RFID number and value */}
                      <span>{index + 1}. {rfid}</span>
                      
                      {/* Right side: Status toggle switch */}
                      <div className="d-flex align-items-center gap-2">
                        <div className="form-check form-switch">
                          {/* Bootstrap toggle switch showing status */}
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            disabled  /* Read-only, user cannot toggle */
                            checked={status === 1 || status === "1"}  /* ON if status is 1 (handles both string and number) */
                          />
                        </div>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: Logs Table (75% width on medium+ screens) */}
        <div className="col-md-9">
          {/* Card that fills available height (h-100 = height 100%) */}
          <div className="card h-100">
            {/* Card body with no padding (table goes edge-to-edge) */}
            <div className="card-body p-0">
              {/* Responsive table wrapper (adds horizontal scroll on small screens) */}
              <div className="table-responsive">
                {/* Bootstrap table with striped rows and hover effect */}
                <table className="table table-striped table-hover mb-0">
                  
                  {/* TABLE HEADER */}
                  <thead className="table-dark">
                    <tr>
                      <th className="text-center">RFID</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Date & Time</th>
                    </tr>
                  </thead>
                  
                  {/* TABLE BODY */}
                  <tbody>
                    {/* Map each log entry to a table row */}
                    {logs.map((log, index) => (
                      <tr key={index}>
                        
                        {/* COLUMN 1: RFID Value */}
                        <td className="text-center">{log.rfid}</td>
                        
                        {/* COLUMN 2: Status Badge */}
                        <td className="text-center">
                          {/* Check if RFID was not found (invalid/unauthorized) */}
                          {log.rfid_message === "RFID NOT FOUND" ? (
                            // Red badge for not found
                            <span className="badge bg-danger">{log.rfid_message}</span>
                          ) : (
                            // Status badge: Blue for 1 (ON), Gray for 0 (OFF)
                            <span
                              className={`badge ${
                                log.status === "1" || log.status === 1 ? "bg-primary" : "bg-secondary"
                              }`}
                            >
                              {/* Display "1" for ON, "0" for OFF */}
                              {log.status === "1" || log.status === 1 ? "1" : "0"}
                            </span>
                          )}
                        </td>
                        
                        {/* COLUMN 3: Formatted Date & Time */}
                        <td className="text-center">{formatDate(log.date_time)}</td>
                      </tr>
                    ))}
                    
                    {/* EMPTY STATE: Show message when no logs exist */}
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
      </div>
    </div>
  );
}
