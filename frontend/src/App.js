import './App.css';
import React, { useEffect, useState } from 'react';

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data.data);
        console.log(data);
      })
      .catch(err => {
        console.error('Error fetching users:', err);
      });
  }, []);

  return (
    <div className="App">
      <h1>Daftar Pengguna</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <strong>{user.username}</strong> - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
