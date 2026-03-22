function fitTerminal(term, fitAddon, ptyProcess) {
    const terminalView = document.getElementById('terminal');
    terminalView.getElementsByClassName('xterm-screen')[0].style.height = window.innerHeight - 10 + 'px'; // Ensure the terminal fills the container

    // Do a brief resize to get the text to fit/wrap
    window.resizeBy(1, 1);
    window.resizeBy(-1, -1);

    fitAddon.fit();
    term.refresh(0, term.rows - 1);
    ptyProcess.updateSize(term.cols, term.rows);
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

    const ptyProcess = attachPtyProcess(term, fitAddon);

    fitTerminal(term, fitAddon, ptyProcess);

    term.zoomIn = function() {
        term.options.fontSize += 2; // Increase font size to zoom in
        fitTerminal(term, fitAddon, ptyProcess);
    }

    term.zoomOut = function() {
        term.options.fontSize -= 2; // Decrease font size to zoom out
        fitTerminal(term, fitAddon, ptyProcess);
    }

    term.resetZoom = function() {
        term.options.fontSize = 13; // Decrease font size to zoom out
        fitTerminal(term, fitAddon, ptyProcess);
    }

    // Handle window resize events to keep the terminal fitting the container
    window.onresize = () => {
        fitTerminal(term, fitAddon, ptyProcess);
    };

    return term;
};

module.exports = { createTerminal }