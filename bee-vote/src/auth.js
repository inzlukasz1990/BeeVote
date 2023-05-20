import axios from 'axios';

// Zapisz tokeny w localStorage
function setTokens(access, refresh) {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
}

// Ustaw token jako nagłówek autoryzacji
function setAuthHeader(token) {
    axios.defaults.headers.common['Authorization'] = `Token ${token}`;
}

export {setTokens, setAuthHeader};
