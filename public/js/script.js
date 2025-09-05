
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

    // Store original window state
    let isMaximized = false;
    let originalWidth = '350px';
    let originalHeight = '500px';
    let originalTop = '50px';
    let originalLeft = '100px';

    // Window dragging functionality
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    const windowHeader = document.querySelector('.window-header-spotify');
    
    if (windowHeader && spotifyWindow) {
        windowHeader.addEventListener('mousedown', (e) => {
            if (isMaximized) return; // Don't allow dragging when maximized
            
            isDragging = true;
            const rect = spotifyWindow.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;
            
            // Prevent text selection during drag
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging || isMaximized) return;
            
            const x = e.clientX - dragOffsetX;
            const y = e.clientY - dragOffsetY;
            
            // Constrain to viewport
            const maxX = window.innerWidth - spotifyWindow.offsetWidth;
            const maxY = window.innerHeight - spotifyWindow.offsetHeight;
            
            spotifyWindow.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
            spotifyWindow.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
            spotifyWindow.style.position = 'fixed';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                // Save current position
                if (!isMaximized) {
                    originalTop = spotifyWindow.style.top;
                    originalLeft = spotifyWindow.style.left;
                }
            }
        });
    }

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
            if (spotifyWindow) {
                if (isMaximized) {
                    // Restore to original size
                    spotifyWindow.style.width = originalWidth;
                    spotifyWindow.style.height = originalHeight;
                    spotifyWindow.style.top = originalTop;
                    spotifyWindow.style.left = originalLeft;
                    spotifyWindow.style.resize = 'both';
                    isMaximized = false;
                } else {
                    // Save current size before maximizing (if manually resized)
                    const computedStyle = window.getComputedStyle(spotifyWindow);
                    if (spotifyWindow.style.width && spotifyWindow.style.width !== '100vw') {
                        originalWidth = spotifyWindow.style.width;
                    }
                    if (spotifyWindow.style.height && spotifyWindow.style.height !== '100vh') {
                        originalHeight = spotifyWindow.style.height;
                    }
                    if (spotifyWindow.style.top && spotifyWindow.style.top !== '0px') {
                        originalTop = spotifyWindow.style.top;
                    }
                    if (spotifyWindow.style.left && spotifyWindow.style.left !== '0px') {
                        originalLeft = spotifyWindow.style.left;
                    }
                    
                    // Maximize
                    spotifyWindow.style.width = '100vw';
                    spotifyWindow.style.height = '100vh';
                    spotifyWindow.style.top = '0';
                    spotifyWindow.style.left = '0';
                    spotifyWindow.style.resize = 'none';
                    isMaximized = true;
                }
            }
        });
    }

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            if (spotifyWindow) {
                spotifyWindow.style.display = 'none';
                // Reset state when closing
                isMaximized = false;
            }
        });
    }
});