
document.addEventListener('DOMContentLoaded', () => {

    const loadingDiv = document.getElementById("loading");
    const hotbar = document.getElementById("hotbar");

    setTimeout(() => {
        console.log('Loading ClamOS...');
        loadingDiv.style.display = 'none';
        hotbar.style.display = 'flex';
    }, 6000);

    minimizeButton.addEventListener('click', () => {
        window.classList.remove('show');
    });

    maximizeButton.addEventListener('click', () => {
        if (window.style.width === '100vw') {
            window.style.width = initialWidth;
            window.style.height = initialHeight;
            window.style.top = '50px';
            window.style.left = '100px';
        } else {
            initialWidth = window.style.width;
            initialHeight = window.style.height;
            window.style.width = '100vw';
            window.style.height = '100vh';
            window.style.top = '0';
            window.style.left = '0';
        }
    });

    closeButton.addEventListener('click', () => {
        window.classList.remove('show');
    });


    
});