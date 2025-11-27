import React, { useState } from 'react';
import axios from 'axios';

export default function CreditAnalyzer(){
  const [result, setResult] = useState(null);

  const upload = async(e)=>{
    const file = e.target.files[0];
    const fd = new FormData();
    fd.append("file", file);
    const res = await axios.post('/api/analyze', fd);
    setResult(res.data.summary);
  };

  return (<div>
    <h2>Credit Analyzer</h2>
    <input type="file" onChange={upload}/>
    <pre>{JSON.stringify(result,null,2)}</pre>
  </div>);
}
