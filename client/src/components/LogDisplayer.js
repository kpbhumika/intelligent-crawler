import { io } from "socket.io-client";
import React, { useEffect, useState } from "react";

const LogDisplayer = () => {
  const [logs, setLogs] = useState([]);

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
  }, [io]);

  return (
    <div className="log-displayer">
      <h2>Log Output</h2>
      <div className="log-messages">
        {logs.map((log, index) => (
          <div key={index} className="log-message">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogDisplayer;
