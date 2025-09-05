
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

    // Generic window management function
    function setupWindow(window, header, type) {
        if (!window || !header) return;
        
        let isMaximized = false;
        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;
        let originalWidth, originalHeight, originalTop, originalLeft;

        // Get window control buttons
        const minimizeButton = window.querySelector('.minimize');
        const maximizeButton = window.querySelector('.maximize');
        const closeButton = window.querySelector('.close');

        // Dragging functionality
        header.addEventListener('mousedown', (e) => {
            if (isMaximized) return;
            isDragging = true;
            const rect = window.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging || isMaximized) return;
            const x = e.clientX - dragOffsetX;
            const y = e.clientY - dragOffsetY;
            const maxX = window.innerWidth - window.offsetWidth;
            const maxY = window.innerHeight - window.offsetHeight;
            window.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
            window.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Window controls
        if (minimizeButton) {
            minimizeButton.addEventListener('click', () => {
                window.style.display = 'none';
            });
        }

        if (maximizeButton) {
            maximizeButton.addEventListener('click', () => {
                if (isMaximized) {
                    window.style.width = originalWidth;
                    window.style.height = originalHeight;
                    window.style.top = originalTop;
                    window.style.left = originalLeft;
                    window.style.resize = 'both';
                    isMaximized = false;
                } else {
                    originalWidth = window.style.width || window.offsetWidth + 'px';
                    originalHeight = window.style.height || window.offsetHeight + 'px';
                    originalTop = window.style.top || window.offsetTop + 'px';
                    originalLeft = window.style.left || window.offsetLeft + 'px';
                    window.style.width = '100vw';
                    window.style.height = '100vh';
                    window.style.top = '0';
                    window.style.left = '0';
                    window.style.resize = 'none';
                    isMaximized = true;
                }
            });
        }

        if (closeButton) {
            closeButton.addEventListener('click', () => {
                window.style.display = 'none';
                isMaximized = false;
            });
        }
    }
});