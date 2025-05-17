import { jwtDecode } from 'jwt-decode';

function fetchIdFromToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        return null;
    }
    try {
        const decodeJWT = jwtDecode(token); 
        return decodeJWT.id;
    } catch(err) {
        return null;
    }
}

export default fetchIdFromToken;