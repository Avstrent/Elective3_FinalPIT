

import "bootstrap/dist/css/bootstrap.min.css";


export default function Dashboard() {
    return (
        <div className="container my-4">
            <div className="row g-2">
                {/* sa RFID NGA LIST NI */}
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
            </div>
        </div>
    );
}

