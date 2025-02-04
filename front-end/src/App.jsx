import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [searchType, setSearchType] = useState('symbol'); // Toggle between 'symbol' and 'disease'

    const fetchData = async () => {
        if (!searchTerm) {
            setError('Please enter a value.');
            return;
        }

        try {
            setError('');
            const endpoint = searchType === 'symbol' ? `ncRNA/${searchTerm}` : `ncRNA/disease/${searchTerm}`;
            const response = await axios.get(`http://127.0.0.1:8000/${endpoint}`);
            setData(response.data);
        } catch (err) {
            setData([]);
            setError(err.response?.data?.error || "Error fetching data");
        }
    };
    const columnOrder = [
        "PubMed ID", "ncRNA Symbol", "ncRNA Category", "Species", "Disease Name",
        "Sample", "Dysfunction Pattern", "Validated Method",  "Causality"
    ];

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0', textAlign: 'center' }}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', height: '40vh',width: '100vw', justifyContent: 'center'}}>
            <h2>ncRNA Data Fetcher</h2>

            {/* Toggle Switch */}
            <div style={{ marginBottom: '10px' }}>
                <label>
                    <input
                        type="radio"
                        name="searchType"
                        value="symbol"
                        checked={searchType === 'symbol'}
                        onChange={() => setSearchType('symbol')}
                    />
                    Search by Symbol
                </label>
                &nbsp;&nbsp;
                <label>
                    <input
                        type="radio"
                        name="searchType"
                        value="disease"
                        checked={searchType === 'disease'}
                        onChange={() => setSearchType('disease')}
                    />
                    Search by Disease
                </label>
            </div>

            {/* Search Box */}
            <input
                type="text"
                placeholder={searchType === 'symbol' ? "Enter ncRNA Symbol" : "Enter Disease Name"}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '8px', width: '60%', marginBottom: '10px', borderRadius: '30px' }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        fetchData();
                    }
                }}
            />
            <button onClick={fetchData} style={{ padding: '10px', marginLeft: '5px', cursor: 'pointer', borderRadius: '50px' }}>
            🔍Search
            </button>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Display Results in Table */}
            <div style={{display: 'flex', alignItems: 'center'}}>
            {data.length > 0 && (
               <table border="1" style={{ borderColor: 'blue' }}>
               <thead>
                   <tr style={{ background: '#3d4f63' }}>
                       {columnOrder.map((key) => (
                           <th key={key} style={{ padding: '8px', color: 'Black' }}>{key}</th>
                       ))}
                   </tr>
               </thead>
               <tbody>
                   {data.map((item, index) => (
                       <tr key={index}>
                           {columnOrder.map((key, i) => (
                               <td key={i} style={{ padding: '15px' }}>{item[key]}</td>
                           ))}
                       </tr>
                   ))}
               </tbody>
           </table>
            )}
            </div>
        </div>
    );
}

export default App;
