
document.addEventListener('DOMContentLoaded', () => {

    const loadingDiv = document.getElementById("loading");
    const hotbar = document.getElementById("hotbar");

    setTimeout(() => {
        console.log('Loading ClamOS...');
        loadingDiv.style.display = 'none';
        hotbar.style.display = 'flex';
    }, 6000);

    // Get window control buttons
    const minimizeButton = document.querySelector('.minimize');
    const maximizeButton = document.querySelector('.maximize');
    const closeButton = document.querySelector('.close');
    const spotifyWindow = document.getElementById('spotify-window');

    // Only add event listeners if buttons exist
    if (minimizeButton) {
        minimizeButton.addEventListener('click', () => {
            if (spotifyWindow) {
                spotifyWindow.style.display = 'none';
            }
        });
    }

    if (maximizeButton) {
        maximizeButton.addEventListener('click', () => {
            if (spotifyWindow && spotifyWindow.style.width === '100vw') {
                spotifyWindow.style.width = '';
                spotifyWindow.style.height = '';
                spotifyWindow.style.top = '50px';
                spotifyWindow.style.left = '100px';
            } else if (spotifyWindow) {
                spotifyWindow.style.width = '100vw';
                spotifyWindow.style.height = '100vh';
                spotifyWindow.style.top = '0';
                spotifyWindow.style.left = '0';
            }
        });
    }

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            if (spotifyWindow) {
                spotifyWindow.style.display = 'none';
            }
        });
    }
});