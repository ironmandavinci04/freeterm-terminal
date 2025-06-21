import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';

// Initialize Terminal
const term = new Terminal({
    cursorBlink: true,
    fontFamily: "'Fira Code', monospace",
    fontSize: 14,
    theme: {
        background: '#1a1b1e',
        foreground: '#e2e2e2',
        cursor: '#ffffff',
        selection: 'rgba(255, 255, 255, 0.3)',
        black: '#000000',
        red: '#e06c75',
        green: '#98c379',
        yellow: '#d19a66',
        blue: '#61afef',
        magenta: '#c678dd',
        cyan: '#56b6c2',
        white: '#ffffff',
    },
    allowTransparency: true,
    rendererType: 'canvas'
});

// Terminal State
let commandHistory = [];
let historyIndex = -1;
let currentCommand = '';
let currentPrompt = '$ ';

// Initialize Terminal
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Open terminal in container
        term.open(document.getElementById('terminal-container'));
        
        // Set initial prompt
        writePrompt();

        // Setup terminal size
        const fitAddon = new FitAddon.FitAddon();
        term.loadAddon(fitAddon);
        fitAddon.fit();

        // Handle window resize
        window.addEventListener('resize', () => {
            fitAddon.fit();
        });

        // Setup command history UI
        setupCommandHistory();
        
        // Setup new tab button
        setupNewTab();

    } catch (error) {
        console.error('Error initializing terminal:', error);
    }
});

// Write prompt to terminal
function writePrompt() {
    term.write('\r\n' + currentPrompt);
}

// Handle terminal input
term.onKey(({ key, domEvent }) => {
    const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

    if (domEvent.keyCode === 13) { // Enter key
        handleCommand();
    } else if (domEvent.keyCode === 8) { // Backspace
        if (term._core.buffer.x > currentPrompt.length) {
            term.write('\b \b');
            currentCommand = currentCommand.slice(0, -1);
        }
    } else if (printable) {
        term.write(key);
        currentCommand += key;
    }
});

// Handle command execution
function handleCommand() {
    const command = currentCommand.trim();
    
    if (command) {
        // Add to history
        commandHistory.unshift(command);
        updateCommandHistoryUI();
        
        // Execute command (mock implementation)
        term.write('\r\n');
        executeCommand(command);
    } else {
        writePrompt();
    }
    
    currentCommand = '';
}

// Mock command execution
function executeCommand(command) {
    switch (command) {
        case 'clear':
            term.clear();
            break;
        case 'help':
            term.write('Available commands:\r\n');
            term.write('  clear - Clear terminal\r\n');
            term.write('  help  - Show this help message\r\n');
            writePrompt();
            break;
        default:
            term.write(`Command not found: ${command}\r\n`);
            writePrompt();
    }
}

// Update command history UI
function updateCommandHistoryUI() {
    const historyContainer = document.getElementById('command-history');
    historyContainer.innerHTML = '';
    
    commandHistory.slice(0, 10).forEach(cmd => {
        const cmdElement = document.createElement('div');
        cmdElement.className = 'px-3 py-2 rounded hover:bg-gray-700 cursor-pointer text-sm';
        cmdElement.textContent = cmd;
        cmdElement.onclick = () => {
            currentCommand = cmd;
            term.write(cmd);
        };
        historyContainer.appendChild(cmdElement);
    });
}

// Setup new tab functionality
function setupNewTab() {
    const newTabButton = document.getElementById('new-tab');
    newTabButton.onclick = () => {
        // Mock implementation - just show an alert for now
        alert('New tab functionality coming soon!');
    };
}

// Handle terminal resize
function handleResize() {
    const dimensions = term.proposeGeometry();
    term.resize(dimensions.cols, dimensions.rows);
}

// Error handling wrapper
window.onerror = function(msg, source, lineNo, columnNo, error) {
    console.error('FreeTerm Error:', { msg, source, lineNo, columnNo, error });
    return false;
};
