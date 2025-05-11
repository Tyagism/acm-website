// Server check script - Simplified version
document.addEventListener('DOMContentLoaded', function() {
    // Check if server is running
    fetch('http://localhost:8081/api/ping', { 
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        timeout: 2000
    })
    .then(response => {
        if (response.ok) {
            console.log('Server is already running');
        }
    })
    .catch(error => {
        console.log('Server is not running, attempting to start it...');
        
        // Create hidden iframe to run batch file
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = 'file:///C:/Users/Harshit/Desktop/acm-website/start_server.bat';
        document.body.appendChild(iframe);
        
        // Remove the iframe after a short delay
        setTimeout(() => {
            if (document.body.contains(iframe)) {
                document.body.removeChild(iframe);
            }
        }, 1000);
    });
}); 