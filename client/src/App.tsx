import { useState } from "react";
import "./App.css";
import Papa from "papaparse";


export default function App() {
  const [fileName, setFileName] = useState("");
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<string[][]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showIssuesOnly, setShowIssuesOnly] = useState(false);
const [isApproved, setIsApproved] = useState(false);


  const missingRows = csvRows.filter((row) => row.some((cell) => cell.trim() === ""));



  const seen = new Set<string>();

  const duplicateRows = csvRows.filter((row) => {
    const signature = JSON.stringify(row);

    if (seen.has(signature)) {
      return true;
    }

    seen.add(signature);
    return false;
  });

  const visibleRows = csvRows
    .map((row, rowIndex) => ({ row, rowIndex }))
    .filter(({ row }) =>
      !showIssuesOnly ||
      duplicateRows.includes(row) ||
      row.some((cell) => cell.trim() === "")
    );

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
              <h3>Records Uploaded</h3>
              <p>{csvRows.length}</p>
            </div>

            <div className="stat-card">
              <h3>Duplicate Records</h3>
              <p>{duplicateRows.length}</p>
            </div>

            <div className="stat-card">
              <h3>Missing Records</h3>
              <p>{missingRows.length}</p>
            </div>

            <div className="stat-card">
              <h3>Clean Records</h3>
              <p>{uniqueRows.length}</p>
              <span className="stat-description">
                After deduplication
              </span>
            </div>
          </div>

          <p>
            DEBUG: Rows={csvRows.length},
            Duplicates={duplicateRows.length},
            Missing={missingRows.length}
          </p>
          <p
            style={{
            color:
              csvRows.length === 0
                ? "#64748b"
                : duplicateRows.length > 0 || missingRows.length > 0
                  ? "#d97706"
                  : "#16a34a",
            fontWeight: "bold",
          }}>
            {csvRows.length === 0
              ? "Upload a CSV file to begin"
              : duplicateRows.length > 0 || missingRows.length > 0
                ? `⚠${duplicateRows.length} ${duplicateRows.length === 1 ? "duplicate" : "duplicates"}, ${missingRows.length} rows with missing values`
                : "✓ Your CSV is ready to export!"}
          </p>
        </section>

        <section className="quick-actions">
          <div className="quick-actions-header">
            <h2>Quick Actions</h2>
            <p>Manage your dataset with ease</p>
          </div>

          <div className="action-grid">

            {/* CLEAR DATASET */}
            <button
              type="button"
              className="action-card action-clear"
              disabled={!fileName}
              onClick={() => {
                if (!window.confirm(
                  "Clear this dataset? Your changes will be lost."
                )) {
                  return;
                }

                setIsApproved(false);
                setFileName("");
                setCsvHeaders([]);
                setCsvRows([]);

                const input =
                  document.querySelector<HTMLInputElement>("#upload");

                if (input) input.value = "";
              }}
            >
              <span className="action-icon" aria-hidden="true">✕</span>
              <span className="action-info">
                <strong>Clear Dataset</strong>
                <small>Remove loaded records</small>
              </span>
            </button>

            {/* UPLOAD CSV */}
            <a
              href="#upload"
              className="action-card action-upload"
            >
              <span className="action-icon" aria-hidden="true">↑</span>
              <span className="action-info">
                <strong>Upload CSV</strong>
                <small>Import a new dataset</small>
              </span>
            </a>

            {/* REVIEW DATA */}
            <a
              href="#datasets"
              className="action-card action-review"
            >
              <span className="action-icon" aria-hidden="true">▦</span>
              <span className="action-info">
                <strong>Review Data</strong>
                <small>Inspect and edit records</small>
              </span>
            </a>

            {/* DOWNLOAD CSV */}
            <button
              type="button"
              className="action-card action-download"
              onClick={handleDownload}
              disabled={!fileName}
            >
              <span className="action-icon" aria-hidden="true">↓</span>
              <span className="action-info">
                <strong>Download CSV</strong>
                <small>Export cleaned records</small>
              </span>
            </button>

          </div>
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
                console.log("CSV Debug:", file?.name, "Size:", file?.size);
                if (file.size === 0) {
                  window.alert("This CSV file is empty. Please upload a valid file.");
                  e.target.value = "";
                  return;
                }

                const content = await file.text();




                const result = Papa.parse<string[]>(content, {
                  skipEmptyLines: true,
                });

                const headers = result.data[0] ?? [];
                const rows = result.data.slice(1);

                // Check column headers
                if (
                  headers.length === 0 ||
                  headers.some((header) => header.trim() === "")
                ) {
                  window.alert("Invalid CSV: Column headers cannot be empty.");
                  e.target.value = "";
                  return;
                }

                // Check data records
                if (rows.length === 0) {
                  window.alert("This CSV contains no data records.");
                  e.target.value = "";
                  return;
                }
setIsApproved(false);
                // Update React state
                setFileName(file.name);
                setCsvHeaders(headers);
                setCsvRows(rows);
              }
            }}
          />





          <button onClick={handleDownload} disabled={!fileName}>
            Download Clean CSV
          </button>
          <p>Selected file: {fileName}</p>
          <label>
            <input
              type="checkbox"
              checked={showIssuesOnly}
              onChange={(e) => setShowIssuesOnly(e.target.checked)}
            />
            Show only records with issues
          </label>

          <p>
            Showing {visibleRows.length} of {csvRows.length} records
          </p>





            <div className="review-panel">
              <h3>Dataset Review</h3>

              <p>
                {!fileName
                  ? "Upload a CSV to begin reviewing."
                  : duplicateRows.length > 0 || missingRows.length > 0
                    ? "⚠ Needs attention: Fix the detected data issues."
                    : isApproved
                      ? "✓ Dataset Approved"
                      : "✓ Ready for review: No duplicate or missing records detected."}
              </p>

              <button
                type="button"
                disabled={
                  !fileName ||
                  csvRows.length === 0 ||
                  duplicateRows.length > 0 ||
                  missingRows.length > 0 ||
                  isApproved
                }
                onClick={() => setIsApproved(true)}
              >
                {isApproved ? "✓ Approved" : "Approve Dataset"}
              </button>
            </div>

            <p className="mobile-scroll-hint">
              ↔ Swipe left or right to view all columns
            </p>
<div className="table-scroll">

          <table id="datasets">
            <thead>
              <tr>
                {csvHeaders.map((header) => (
                  <th key={header}>{header}</th>
                ))}
                <th>status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {visibleRows.map(({ row, rowIndex }) => (

                <tr key={rowIndex } className={duplicateRows.includes(row) ? "duplicate-row" : ""}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className={cell.trim() === "" ? "missing-cell" : ""}>
                      <input
                        type="text"
                        value={cell}
                        placeholder="Enter value"
                        onChange={(e) => {
                          setIsApproved(false);
                          handleCellChange(rowIndex, cellIndex, e.target.value);
                        }}
                      />
                    </td>
                  ))}
                  {fileName && visibleRows.length === 0 && (
                    <tr>
                      <td colSpan={csvHeaders.length + 2}>
                        {showIssuesOnly
                          ? "✓ No records with issues found."
                          : "No records remaining in this dataset."}
                      </td>
                    </tr>
                  )}
                  <td>
                    {duplicateRows.includes(row) ? "Duplicate" : "Original"}
                  </td>

                  <td>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm("Delete this record?")) {
                          setIsApproved(false)
                          setCsvRows((previousRows) =>
                            previousRows.filter((_, index) => index !== rowIndex)
                          );
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                  </tr>
                  ))}

              {fileName && visibleRows.length === 0 && (
                <tr>
                  <td colSpan={csvHeaders.length + 2}>
                    {showIssuesOnly
                      ? "✓ No records with issues found."
                      : "No records remaining in this dataset."}
                  </td>
                </tr>
              )}

            </tbody>
            </table>
</div>
        </section>
      </main>
    </div>
  );
}
