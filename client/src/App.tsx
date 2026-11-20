import { useState } from "react";
import "./App.css";
import Papa from "papaparse";

export default function App() {
  const [fileName, setFileName] = useState("");
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<string[][]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const missingRows = csvRows.filter((row) => row.some((cell) => cell.trim() === ""));
  const seenRows = new Set<string>();

  const duplicateRows = csvRows.filter((row) => {
    const signature = JSON.stringify(row);

    if (seenRows.has(signature)) {
      return true;
    }

    seenRows.add(signature);

    return false;
  });
  const uniqueRows = csvRows.filter((row) => !duplicateRows.includes(row));

  const cleanCsvText = Papa.unparse([csvHeaders, ...uniqueRows]);
  const handleDownload = () => {
    const blob = new Blob([cleanCsvText], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "datapilot-cleaned.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCellChange = (rowIndex: number, cellIndex: number, newValue: string) => {
    setCsvRows((previousRows) =>
      previousRows.map((row, index) =>
        index === rowIndex ? row.map((cell, i) => (i === cellIndex ? newValue : cell)) : row,
      ),
    );
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h2 className="sidebar-logo">◆ DataPilot</h2>
        <p className="sidebar-subtitle">Enterprise</p>
  {/* Button OUTSIDE  */}

          <button type="button"
          className="mobile-menu-button"

            onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen}>

            {menuOpen ? "X close" : "☰ Menu"}
        </button>
        {/*naigation blow butoon */}
        <nav className={menuOpen ? "menu-open" : ""}
          onClick={() => setMenuOpen(false)}>
          <p className="active">
            <a href="#dashboard">▦ Dashboard</a>
          </p>
          <p>
            <a href="#analytics">📊 Analytics</a>
          </p>
          <p>
            <a href="#datasets">▤ Datasets</a>
          </p>
          <p>
            <a href="#upload">↑ Upload</a>
          </p>
          <p>Review</p>
          <p>History</p>
          <p>Settings</p>
        </nav>
      </aside>
      <main className="dashboard-content">
        <h1 id="dashboard">DataPilot Enterprise</h1>
        <p>Manage, validate, and clean your business data.</p>
        <section id="analytics">
          <h2>Analytics Overview</h2>

          <div className="analytics-stats">
            <div className="stat-card">
              <p>Records uploaded {csvRows.length}</p>
            </div>

            <div className="stat-card">
              <p>Duplicate records:{duplicateRows.length}</p>
            </div>

            <div className="stat-card">
              <p>
                Missing record
                {missingRows.length}
              </p>
            </div>
          </div>
        </section>

        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <a href="upload">↑ Upload CSV</a>

        </section>
        <div className="parent-container">
          <div className="datasets">
            <h2>Total Datasets</h2>
            <p>{fileName ? 1 : 0}</p>
            <p>{fileName ? "Dataset uploaded successfully" : "No datasets uploaded yet"}</p>
          </div>

          <div className="records">
            <h2>Records Checked</h2>
            <p>{csvRows.length}</p>
            <p>
              {csvRows.length > 0 ? "Records processed successfully" : "No records processed yet"}
            </p>
          </div>

          <div className="records">
            <h2>Duplicate records:</h2>
            <p>{duplicateRows.length}</p>
            <p>
              {csvRows.length > 0 ? "Records processed successfully" : "No records processed yet"}
            </p>
          </div>
        </div>

        <section>
          <h2>Uploaded Dataset</h2>
          <input
            id="upload"
            type="file"
            accept=".csv"
            onChange={async (e) => {
              const file = e.target.files?.[0];

              if (file) {
                setFileName(file.name);
                const content = await file.text();
                const result = Papa.parse<string[]>(content, {
                  skipEmptyLines: true,
                });
                setCsvHeaders(result.data[0] ?? []);
                setCsvRows(result.data.slice(1));
              }
            }}
          />
          <button onClick={handleDownload} disabled={!fileName}>
            Download Clean CSV
          </button>
          <p>Selected file: {fileName}</p>
          <table id="datasets">
            <thead>
              <tr>
                {csvHeaders.map((header) => (
                  <th key={header}>{header}</th>
                ))}
                <th>status</th>
              </tr>
            </thead>

            <tbody>
              {csvRows.map((row, index) => (
                <tr key={index} className={duplicateRows.includes(row) ? "duplicate-row" : ""}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className={cell.trim() === "" ? "missing-cell" : ""}>
                      <input
                        type="text"
                        value={cell}
                        placeholder="Enter value"
                        onChange={(e) => handleCellChange(index, cellIndex, e.target.value)}
                      />
                    </td>
                  ))}
                  <td>{duplicateRows.includes(row) ? "Duplicate" : "Original"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
