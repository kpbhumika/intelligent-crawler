import { io } from "socket.io-client";
import React, { useEffect, useState } from "react";
import { Button, Collapse, Card } from "react-bootstrap";

const LogDisplayer = () => {
  const [logs, setLogs] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    <div className="log-displayer container mt-4">
      <h2 className="mb-3">Log Output</h2>
      <Button
        variant="primary"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-controls="log-collapse"
        aria-expanded={!isCollapsed}
        className="mb-3"
      >
        {isCollapsed ? "Show Logs" : "Hide Logs"}
      </Button>
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
              <div className="text-muted">No logs available</div>
            )}
          </Card.Body>
        </Card>
      </Collapse>
    </div>
  );
};

export default LogDisplayer;