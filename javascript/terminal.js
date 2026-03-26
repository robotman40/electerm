function fitTerminal(term, fitAddon) {
    const terminalView = document.getElementById('terminal');
    terminalView.getElementsByClassName('xterm-screen')[0].style.height = window.innerHeight - 10 + 'px'; // Ensure the terminal fills the container

    // Do a brief resize to get the text to fit/wrap
    fitAddon.fit();
    term.refresh(0, term.options.rows - 1);
    window.app.resizePTY(term.rows, term.cols)
}

function adjustWindowSize(term, value) {
    new_width = (window.innerWidth * ((term.options.fontSize + value) / term.options.fontSize)) - window.innerWidth;
    new_height = (window.innerHeight * ((term.options.fontSize + value) / term.options.fontSize)) - window.innerHeight;

    term.options.fontSize += value;
    window.resizeBy(new_width, new_height);
}

function resetWindowSize(term, width, height, size) {
    term.options.fontSize = size;
    window.resizeTo(width, height)
}

function createTerminal() {
    // Create the terminal instance and fit it to the container
    const term = new Terminal({
        cursorBlink: true,
        scrollOnEraseInDisplay: true,
        convertEol: true
    });
    term.options.fontSize = 13;   

    const fitAddon = new FitAddon.FitAddon();
    term.loadAddon(fitAddon);
    term.open(document.getElementById('terminal'));

    window.app.createPTYSession(term.rows, term.cols);

    fitTerminal(term, fitAddon);

    term.zoomIn = function() {
        adjustWindowSize(term, 2);
        fitTerminal(term, fitAddon);
    }

    term.zoomOut = function() {
        adjustWindowSize(term, -2);
        fitTerminal(term, fitAddon);
    }

    term.resetZoom = function() {
        resetWindowSize(term, 800, 500, 13);
        fitTerminal(term, fitAddon);
    }

    // Handle window resize events to keep the terminal fitting the container
    window.onresize = () => {
        fitTerminal(term, fitAddon);
    };

    window.app.sendDataToTerm((data) => {
        term.write(data);
    })

    term.onData((data) => window.app.sendDataToPTY(data));

    return term;
};