import React from "react";

const OptionsTable = ({ options, importOptions, handleOptionChange }) => {
  return (
    options && (
      <div style={{ marginTop: "1em" }}>
        <h3>Import Options</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2", textAlign: "left" }}>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                Option
              </th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                Control
              </th>
              <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(options).map((optionKey) => {
              const optionConfig = options[optionKey];
              let controlElement;
              switch (optionConfig.type) {
                case "boolean":
                  controlElement = (
                    <input
                      type="checkbox"
                      checked={importOptions[optionKey]}
                      onChange={(e) =>
                        handleOptionChange(optionKey, e.target.checked)
                      }
                    />
                  );
                  break;
                case "dropdown":
                  controlElement = (
                    <select
                      value={importOptions[optionKey]}
                      onChange={(e) =>
                        handleOptionChange(optionKey, e.target.value)
                      }
                    >
                      {optionConfig.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  );
                  break;
                case "string":
                case "integer":
                  controlElement = (
                    <input
                      type={optionConfig.type === "integer" ? "number" : "text"}
                      value={importOptions[optionKey]}
                      onChange={(e) =>
                        handleOptionChange(
                          optionKey,
                          optionConfig.type === "integer"
                            ? parseInt(e.target.value, 10)
                            : e.target.value
                        )
                      }
                    />
                  );
                  break;
                default:
                  controlElement = null;
              }
              return (
                <tr key={optionKey}>
                  <td
                    style={{
                      padding: "10px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    {optionConfig.label}
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    {controlElement}
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      borderBottom: "1px solid #ddd",
                      maxWidth: "600px",
                    }}
                  >
                    {optionConfig.description}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    )
  );
};

export default OptionsTable;
