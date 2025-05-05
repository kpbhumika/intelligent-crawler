// This component connects to a WebSocket server to display real-time logs.
// It provides functionality to toggle log visibility and clear logs.

import { io } from "socket.io-client";
import React, { useEffect, useState } from "react";
import { Button, Collapse, Card } from "react-bootstrap";

const LogDisplayer = () => {
  const [logs, setLogs] = useState([]); // State to store log messages
  const [isCollapsed, setIsCollapsed] = useState(false); // State to toggle log visibility

  useEffect(() => {
    // Step 1: Connect to the socket server. Same URL as client
    const { protocol, hostname, port } = window.location;
    const host = `${protocol}//${hostname}${port ? `:${port}` : ""}`;
    const newSocket = io(host, { path: "/socket.io" }); // Adjust the path if necessary

    // Handle incoming log messages
    newSocket.on("log", (message) => {
      setLogs((prevLogs) => {
        // Limit logs to the last 100 messages for performance
        const updatedLogs = [...prevLogs, message];
        return updatedLogs.slice(-100);
      });
    });

    // Handle socket connection errors
    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    // Cleanup function to disconnect the socket when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <div className="log-displayer mt-4">
      <h2 className="mb-3">Real time Logs</h2>
      <div className="d-flex mb-3">
        {/* Button to toggle log visibility */}
        <Button
          variant="primary"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-controls="log-collapse"
          aria-expanded={!isCollapsed}
          className="me-2"
        >
          {isCollapsed ? "Show Logs" : "Hide Logs"}
        </Button>
        {/* Button to clear all logs */}
        <Button variant="danger" onClick={() => setLogs([])}>
          Clear Logs
        </Button>
      </div>
      {/* Collapsible section to display logs */}
      <Collapse in={!isCollapsed}>
        <Card id="log-collapse" className="border">
          <Card.Body
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              backgroundColor: "#f8f9fa",
            }}
          >
            {logs.length > 0 ? (
              // Render each log message
              logs.map((log, index) => (
                <div
                  key={index}
                  className="log-message p-2 mb-2 rounded"
                  style={{
                    backgroundColor: "#e9ecef",
                    border: "1px solid #dee2e6",
                  }}
                >
                  {log}
                </div>
              ))
            ) : (
              // Message when no logs are available
              <div className="text-muted">No logs available</div>
            )}
          </Card.Body>
        </Card>
      </Collapse>
    </div>
  );
};

export default LogDisplayer;
