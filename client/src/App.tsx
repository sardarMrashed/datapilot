
import { useState } from 'react';
import './App.css'
import Papa from 'papaparse';

export default  function App() {
const [fileName, setFileName] = useState('');
const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
const [csvRows, setCsvRows] = useState<string[][]>([]);
  return (  
    <div >
      <h1>DataPilot Enterprise</h1>
      <p>Manage, validate, and clean your business data.</p> 
      
<div className="parent-container">
      <div className="datasets">
        <h2>Total Datasets</h2>
        <p>0</p>
        <p>No datasets uploaded yet</p>
      </div>

     <div className="records">
        <h2>Records checked</h2>
        <p>No records processed yet</p>
      </div>
     

        <div className="records">
        <h2>issues Found</h2>
        <p>0</p>
        <p>No records processed yet</p>
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

    </tr>
  </thead>

  <tbody>
    {csvRows.map((row, index) => (
  <tr key={index}>
    {row.map((cell, cellIndex) => (
      <td key={cellIndex}>{cell}</td>
    ))}
  </tr>
))}
  </tbody>
</table>
  </section>
      
    </div>
  )
}


