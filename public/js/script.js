
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

    // Window dragging functionality (using global system now)
    let isDragging = false;

    const windowHeader = document.querySelector('.window-header-spotify');
    
    if (windowHeader && spotifyWindow) {
        // Use global window management for Spotify too
        setupWindow(spotifyWindow, windowHeader, 'spotify');
    }

    // Spotify window controls now handled by setupWindow function

    // BROWSER WINDOW FUNCTIONALITY
    const browserWindow = document.getElementById('browser-window');
    const browserHeader = document.querySelector('.window-header-browser');
    setupWindow(browserWindow, browserHeader, 'browser');

    // Browser navigation functionality
    const browserUrl = document.getElementById('browser-url');
    const browserFrame = document.getElementById('browser-frame');
    const browserGo = document.getElementById('browser-go');
    const browserBack = document.getElementById('browser-back');
    const browserForward = document.getElementById('browser-forward');
    const browserRefresh = document.getElementById('browser-refresh');

    let browserHistory = ['https://www.google.com'];
    let browserHistoryIndex = 0;

    function navigateToUrl(url) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        browserFrame.src = url;
        browserUrl.value = url;
        
        // Update history
        if (browserHistoryIndex < browserHistory.length - 1) {
            browserHistory = browserHistory.slice(0, browserHistoryIndex + 1);
        }
        browserHistory.push(url);
        browserHistoryIndex = browserHistory.length - 1;
        
        updateBrowserButtons();
    }

    function updateBrowserButtons() {
        browserBack.disabled = browserHistoryIndex <= 0;
        browserForward.disabled = browserHistoryIndex >= browserHistory.length - 1;
    }

    browserGo.addEventListener('click', () => {
        navigateToUrl(browserUrl.value);
    });

    browserUrl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            navigateToUrl(browserUrl.value);
        }
    });

    browserBack.addEventListener('click', () => {
        if (browserHistoryIndex > 0) {
            browserHistoryIndex--;
            const url = browserHistory[browserHistoryIndex];
            browserFrame.src = url;
            browserUrl.value = url;
            updateBrowserButtons();
        }
    });

    browserForward.addEventListener('click', () => {
        if (browserHistoryIndex < browserHistory.length - 1) {
            browserHistoryIndex++;
            const url = browserHistory[browserHistoryIndex];
            browserFrame.src = url;
            browserUrl.value = url;
            updateBrowserButtons();
        }
    });

    browserRefresh.addEventListener('click', () => {
        browserFrame.src = browserFrame.src;
    });

    // TERMINAL WINDOW FUNCTIONALITY
    const terminalWindow = document.getElementById('terminal-window');
    const terminalHeader = document.querySelector('.window-header-terminal');
    setupWindow(terminalWindow, terminalHeader, 'terminal');

    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    let commandHistory = [];
    let historyIndex = -1;

    const commands = {
        help: () => {
            return `Available commands:
help - Show this help message
clear - Clear the terminal
date - Show current date and time
echo <text> - Echo text back
whoami - Show current user
pwd - Show current directory
ls - List directory contents
cat <file> - Show file contents (simulated)
mkdir <dir> - Create directory (simulated)
rmdir <dir> - Remove directory (simulated)
history - Show command history
clam - Show ClamOS info`;
        },
        
        clear: () => {
            terminalOutput.innerHTML = '';
            return '';
        },
        
        date: () => {
            return new Date().toString();
        },
        
        echo: (args) => {
            return args.join(' ');
        },
        
        whoami: () => {
            return 'user';
        },
        
        pwd: () => {
            return '/home/user';
        },
        
        ls: () => {
            return `Desktop    Documents    Downloads    Pictures    Videos
Music      Public       Templates    .bashrc      .profile`;
        },
        
        cat: (args) => {
            const file = args[0];
            if (!file) return 'cat: missing file operand';
            return `cat: ${file}: No such file or directory (this is a simulated terminal)`;
        },
        
        mkdir: (args) => {
            const dir = args[0];
            if (!dir) return 'mkdir: missing operand';
            return `mkdir: created directory '${dir}' (simulated)`;
        },
        
        rmdir: (args) => {
            const dir = args[0];
            if (!dir) return 'rmdir: missing operand';
            return `rmdir: removed directory '${dir}' (simulated)`;
        },
        
        history: () => {
            return commandHistory.map((cmd, i) => `${i + 1}  ${cmd}`).join('\n');
        },
        
        clam: () => {
            return `ClamOS - A web-based operating system
Version: 1.0
Created with: HTML, CSS, JavaScript
Features: Windows, Terminal, Browser, Spotify
🐚 Welcome to ClamOS! 🐚`;
        }
    };

    function addTerminalLine(text, className = '') {
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        line.textContent = text;
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    function processCommand(input) {
        const parts = input.trim().split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        addTerminalLine(`user@clamos:~$ ${input}`, 'terminal-command');
        
        if (command === '') return;
        
        commandHistory.push(input);
        historyIndex = commandHistory.length;
        
        if (commands[command]) {
            const result = commands[command](args);
            if (result) {
                result.split('\n').forEach(line => addTerminalLine(line));
            }
        } else {
            addTerminalLine(`bash: ${command}: command not found`, 'terminal-error');
        }
    }

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = terminalInput.value;
            processCommand(command);
            terminalInput.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                terminalInput.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                terminalInput.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                terminalInput.value = '';
            }
        }
    });

    // Focus terminal input when terminal window is clicked
    if (terminalWindow) {
        terminalWindow.addEventListener('click', () => {
            terminalInput.focus();
        });
    }

    // Global window management system
    let currentDraggingWindow = null;
    let globalDragOffsetX = 0;
    let globalDragOffsetY = 0;

    // Single global mouse event listeners
    document.addEventListener('mousemove', (e) => {
        if (!currentDraggingWindow) return;
        e.preventDefault();
        const x = e.clientX - globalDragOffsetX;
        const y = e.clientY - globalDragOffsetY;
        const maxX = window.innerWidth - currentDraggingWindow.offsetWidth;
        const maxY = window.innerHeight - currentDraggingWindow.offsetHeight;
        currentDraggingWindow.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
        currentDraggingWindow.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
    });

    // Multiple event listeners to ensure we catch mouse release
    document.addEventListener('mouseup', () => {
        currentDraggingWindow = null;
    });
    
    document.addEventListener('mouseleave', () => {
        currentDraggingWindow = null;
    });

    // Also handle touch events for mobile
    document.addEventListener('touchend', () => {
        currentDraggingWindow = null;
    });

    // Generic window management function
    function setupWindow(windowElement, header, type) {
        if (!windowElement || !header) return;
        
        let isMaximized = false;
        let originalWidth, originalHeight, originalTop, originalLeft;

        // Get window control buttons
        const minimizeButton = windowElement.querySelector('.minimize');
        const maximizeButton = windowElement.querySelector('.maximize');
        const closeButton = windowElement.querySelector('.close');

        // Dragging functionality
        header.addEventListener('mousedown', (e) => {
            if (isMaximized) return;
            
            // Clear any existing dragging first
            currentDraggingWindow = null;
            
            // Start new drag
            currentDraggingWindow = windowElement;
            const rect = windowElement.getBoundingClientRect();
            globalDragOffsetX = e.clientX - rect.left;
            globalDragOffsetY = e.clientY - rect.top;
            e.preventDefault();
            e.stopPropagation();
            
            // Bring window to front
            windowElement.style.zIndex = Math.max(1000, parseInt(windowElement.style.zIndex || 1000) + 1);
        });

        // Additional safety: stop dragging if mouse leaves this window's header
        header.addEventListener('mouseleave', (e) => {
            if (currentDraggingWindow === windowElement && e.buttons !== 1) {
                currentDraggingWindow = null;
            }
        });

        // Window controls
        if (minimizeButton) {
            minimizeButton.addEventListener('click', () => {
                windowElement.style.display = 'none';
            });
        }

        if (maximizeButton) {
            maximizeButton.addEventListener('click', () => {
                if (isMaximized) {
                    windowElement.style.width = originalWidth;
                    windowElement.style.height = originalHeight;
                    windowElement.style.top = originalTop;
                    windowElement.style.left = originalLeft;
                    windowElement.style.resize = 'both';
                    isMaximized = false;
                } else {
                    originalWidth = windowElement.style.width || windowElement.offsetWidth + 'px';
                    originalHeight = windowElement.style.height || windowElement.offsetHeight + 'px';
                    originalTop = windowElement.style.top || windowElement.offsetTop + 'px';
                    originalLeft = windowElement.style.left || windowElement.offsetLeft + 'px';
                    windowElement.style.width = '100vw';
                    windowElement.style.height = '100vh';
                    windowElement.style.top = '0';
                    windowElement.style.left = '0';
                    windowElement.style.resize = 'none';
                    isMaximized = true;
                }
            });
        }

        if (closeButton) {
            closeButton.addEventListener('click', () => {
                windowElement.style.display = 'none';
                isMaximized = false;
            });
        }
    }
});