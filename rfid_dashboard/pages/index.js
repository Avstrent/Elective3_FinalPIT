import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Dashboard() {
    return (
    <div className="container my-4">
      <div className="row g-2">
        {/* Left: RFID list */}
        <div className="col-md-3">
          <div className="card bg-dark text-white h-auto">
            <div className="card-header text-center fw-bold">RFID</div>
            <ul className="list-group list-group-flush" style={{ borderRadius: "0" }}>
              {rfidList.map((rfid, index) => {
                const latest = logs.find((l) => l.rfid === rfid);
                const status = latest ? latest.status : null;
                const message = latest?.rfid_message;
                return (
                  <li
                    key={rfid}
                    className="list-group-item d-flex justify-content-between align-items-center bg-dark text-white border-0"
                  >
                    <span>{index + 1}. {rfid}</span>
                    <div className="d-flex align-items-center gap-2">
                      {message === "RFID NOT FOUND" ? (
                        <span className="badge bg-danger">{message}</span>
                      ) : (
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            disabled
                            checked={status === 1 || status === "1"}
                          />
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        
        {/* Right: Table */}
        <div className="col-md-9">
          <div className="card h-100">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-striped table-hover mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th className="text-center">RFID</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, index) => (
                      <tr key={index}>
                        <td className="text-center">{log.rfid}</td>
                        <td className="text-center">
                          {log.rfid_message === "RFID NOT FOUND" ? (
                            <span className="badge bg-danger">{log.rfid_message}</span>
                          ) : (
                            <span
                              className={`badge ${
                                log.status === "1" || log.status === 1 ? "bg-primary" : "bg-secondary"
                              }`}
                            >
                              {log.status === "1" || log.status === 1 ? "1" : "0"}
                            </span>
                          )}
                        </td>
                        <td className="text-center">{formatDate(log.date_time)}</td>
                      </tr>
                    ))}
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
