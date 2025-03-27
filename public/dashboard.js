document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (token) {

       const API_BASE_URL = window.location.origin;
        fetch(`${API_BASE_URL}/api/protected-route`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch data: ' + response.statusText);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching protected data:', error);
            window.location.href = '/login.html';
        });
    } else {
        window.location.href = '/login.html';
    }
});
