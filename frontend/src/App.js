import './App.css';
import React, { useEffect, useState } from 'react';


function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/users')
      .then(res => res.json())
      .then(data => {
        setData(data);
        console.log(data);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
      });
  }, []);

  return (
    <div>
      <h1>Data dari Backend:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default App;
