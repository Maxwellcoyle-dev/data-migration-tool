import React, { useState, useEffect } from "react";
import { Collapse } from "antd";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

const LogDisplay = ({ responseLogs }) => {
  const [showSuccessLogs, setShowSuccessLogs] = useState(true);
  const [showErrorLogs, setShowErrorLogs] = useState(true);

  useEffect(() => {
    console.log(responseLogs);
  }, [responseLogs]);

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <h4>Logs</h4>

      <div style={{ overflowX: "scroll", width: "100%" }}>
        <Collapse>
          <button
            onClick={() => setShowErrorLogs(!showErrorLogs)}
            style={{
              backgroundColor: "#f8d7da",
              border: "none",
              padding: "0.5em",
              width: "100%",
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            {showSuccessLogs ? (
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <p>Hide Success Logs</p>
                <IoIosArrowUp style={{ fontSize: 25 }} />
              </div>
            ) : (
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <p>Show Success Logs</p>
                <IoIosArrowDown style={{ fontSize: 25 }} />
              </div>
            )}
          </button>
          {showSuccessLogs && (
            <table
              style={{
                width: "100%",
                maxWidth: "100%",
                borderCollapse: "collapse",
                marginBottom: "1em",
              }}
            >
              <thead style={{ backgroundColor: "#d4edda" }}>
                <tr>
                  <th
                    style={{
                      borderBottom: "1px solid #ddd",
                      padding: "0.5em",
                      textAlign: "left",
                    }}
                  >
                    Success Logs
                  </th>
                </tr>
              </thead>
              <tbody>
                {responseLogs.map((log, index) => {
                  if (log.success === true)
                    return (
                      <tr
                        key={index}
                        style={{ borderBottom: "1px solid #ddd" }}
                      >
                        <td style={{ padding: "0.5em" }}>{log}</td>
                      </tr>
                    );
                })}
              </tbody>
            </table>
          )}
        </Collapse>

        <Collapse>
          <button
            onClick={() => setShowErrorLogs(!showErrorLogs)}
            style={{
              backgroundColor: "#f8d7da",
              border: "none",
              padding: "0.5em",
              width: "100%",
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            {showErrorLogs ? (
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <p>Hide Error Logs</p>
                <IoIosArrowUp style={{ fontSize: 25 }} />
              </div>
            ) : (
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <p>Show Error Logs</p>
                <IoIosArrowDown style={{ fontSize: 25 }} />
              </div>
            )}
          </button>
          {showErrorLogs && (
            <table
              style={{
                width: "100%",
                maxWidth: "100%",
                borderCollapse: "collapse",
                marginBottom: "1em",
              }}
            >
              <thead style={{ backgroundColor: "#f8d7da" }}>
                <tr>
                  <th
                    style={{
                      borderBottom: "1px solid #ddd",
                      padding: "0.5em",
                      textAlign: "left",
                    }}
                  >
                    CSV Row #
                  </th>
                  <th
                    style={{
                      borderBottom: "1px solid #ddd",
                      padding: "0.5em",
                      textAlign: "left",
                    }}
                  >
                    Error Message
                  </th>
                </tr>
              </thead>
              <tbody>
                {responseLogs.map((log, index) => {
                  if (log.success === false)
                    return (
                      <tr
                        key={index}
                        style={{ borderBottom: "1px solid #ddd" }}
                      >
                        <td style={{ padding: "0.5em" }}>
                          Row #{log.row_index + 1}
                        </td>
                        <td style={{ padding: "0.5em" }}>{log.message}</td>
                      </tr>
                    );
                })}
              </tbody>
            </table>
          )}
        </Collapse>
      </div>
    </div>
  );
};

export default LogDisplay;
