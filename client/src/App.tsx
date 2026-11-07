
import { useState } from 'react';
import './App.css'
import Papa from 'papaparse'; 

export default function App() {
  const [fileName, setFileName] = useState('');
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<string[][]>([]);
const seenRows = new Set<string>();

const duplicateRows =csvRows.filter((row)=> {

  const singature = JSON.stringify(row)
  
  if(seenRows.has(singature)){
    return true
  }
  seenRows.add(singature)
  return false
  
});

  const missingRows = csvRows.filter((row) =>
    row.some((cell) => cell.trim() === '')
  );


return(
    <div >
     
      <h1>DataPilot Enterprise</h1>
      <p>Manage, validate, and clean your business data.</p> 
      
<div className="parent-container">
      <div className="datasets">
        <h2>Total Datasets</h2>
        <p>{fileName ? 1 : 0 }</p>
        <p>{fileName ? "Dataset uploaded successfully" : "No datasets uploaded yet"}</p>
      </div>

    <div className="records">
  <h2>Records Checked</h2>
  <p>{csvRows.length}</p>
  <p>
    {csvRows.length > 0
      ? "Records processed successfully"
      : "No records processed yet"}
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
 type="file"
 accept='.csv'
 onChange={async (e)=>{

  const file = e.target.files?.[0]
   
   if (file){
    setFileName(file.name)
const content = await file.text();
const result = Papa.parse<string[]>(content, {
  skipEmptyLines: true,
});
setCsvHeaders(result.data[0] ?? []);
setCsvRows(result.data.slice(1));
  
  



   }
   }}
 />
 <p>Selected file: {fileName}</p>
<table>
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
 <tr
  key={index}
  className={duplicateRows.includes(row) ? 'duplicate-row' : ''}
>
    {row.map((cell, cellIndex) => (
      <td
        key={cellIndex}
        className={cell.trim() === '' ? 'missing-cell' : ''}
      >
        {cell.trim() === '' ? 'Missing' : cell}
      </td>
  
    ))}  
      <td>
        {duplicateRows.includes(row) ? 'Duplicate' : 'Original'}
      </td>
  </tr>
))}
  </tbody>
</table>
  </section>
      
    </div>
  )
}


