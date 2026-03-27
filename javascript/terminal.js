function fitTerminal(ptyId, term, fitAddon) {
    // Handle refitting the terminal

    // Get the terminal element in the window and make sure it is refitting in the window
    const terminalView = document.getElementById('terminal');
    terminalView.getElementsByClassName('xterm-screen')[0].style.height = window.innerHeight - 10 + 'px'; // Ensure the terminal fills the container

    // Perform the logic for refitting the terminal contents
    fitAddon.fit();
    term.refresh(0, term.options.rows - 1);
    window.app.resizePTY(ptyId, term.rows, term.cols)
}

function adjustWindowSize(term, value) {
    // Handle window size readjustments
    new_width = (window.innerWidth * ((term.options.fontSize + value) / term.options.fontSize)) - window.innerWidth;
    new_height = (window.innerHeight * ((term.options.fontSize + value) / term.options.fontSize)) - window.innerHeight;

    term.options.fontSize += value;
    window.resizeBy(new_width, new_height);
}

function resetWindowSize(term, width, height, size) {
    // Resize the window size
    term.options.fontSize = size;
    window.resizeTo(width, height)
}

async function createTerminal() {
    // Create the terminal instance and fit it to the container
    const term = new Terminal({
        cursorBlink: true,
        scrollOnEraseInDisplay: true,
        convertEol: true
    });
    // Set the default font size
    term.options.fontSize = 13;   

    // Create the fit object and load the terminal element from the HTML into the term object
    const fitAddon = new FitAddon.FitAddon();
    term.loadAddon(fitAddon);
    const terminalView = document.getElementById('terminal');
    term.open(terminalView);
    terminalView.ondragover = function(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    };
    terminalView.ondrop = function(event) {
        event.preventDefault();

        const file = event.dataTransfer?.files[0];
        if (file) {
            const fullPath = window.app.getFilePath(file);
            term.paste(`'${fullPath}'`);
        }
    };

    // Start the PTY session and get the ID of
    const ptyId = await window.app.createPTYSession(term.rows, term.cols);

    // Fit the terminal
    fitTerminal(ptyId, term, fitAddon);

    // Functions for handling terminal resizing
    term.zoomIn = function() {
        adjustWindowSize(term, 2);
        fitTerminal(ptyId, term, fitAddon);
    }

    term.zoomOut = function() {
        adjustWindowSize(term, -2);
        fitTerminal(ptyId, term, fitAddon);
    }

    term.resetZoom = function() {
        resetWindowSize(term, 800, 500, 13);
        fitTerminal(ptyId, term, fitAddon);
    }

    // Handle window resize events to keep the terminal fitting the container
    window.onresize = () => {
        fitTerminal(ptyId, term, fitAddon);
    };

    term.endSession = function() {
        window.app.endPTYProcess(ptyId);
    }

    // Receive data from the PTY session and write it to the terminal
    window.app.sendDataToTerm((data) => {
        term.write(data);
    })

    // Send data from the terminal to the PTY session
    term.onData((data) => window.app.sendDataToPTY(ptyId, data));

    return term; // Return the terminal object
};