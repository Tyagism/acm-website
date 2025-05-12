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

    // Check main server status
    fetch('http://localhost:8081/api/ping', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors'
    })
    .then(response => {
        console.log('Main server (8081) is active');
    })
    .catch(error => {
        console.warn('Main server (8081) might be offline', error);
    });

    // Check export server status
    fetch('http://localhost:8082/export/applications?test=1', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors'
    })
    .then(response => {
        console.log('Export server (8082) is active');
    })
    .catch(error => {
        console.warn('Export server (8082) might be offline', error);
    });

    // Check team data loading
    setTimeout(() => {
        const teamMembers = document.getElementById('team-members');
        if (teamMembers && teamMembers.children.length > 0) {
            console.log('Team members loaded successfully:', teamMembers.children.length);
            
            // Check if our target images are loaded correctly
            const allImages = teamMembers.querySelectorAll('img');
            let hasHarshitImage = false;
            let hasSumitImage = false;
            
            allImages.forEach(img => {
                const src = img.getAttribute('src');
                if (src && src.includes('harshit.jpg')) {
                    hasHarshitImage = true;
                    console.log('Harshit image found:', src);
                }
                if (src && src.includes('sumit.jpg')) {
                    hasSumitImage = true;
                    console.log('Sumit image found:', src);
                }
            });
            
            if (!hasHarshitImage || !hasSumitImage) {
                console.warn('Missing expected team images!');
            }
        } else {
            console.warn('No team members loaded or team section not found');
        }
    }, 2000);
}); 