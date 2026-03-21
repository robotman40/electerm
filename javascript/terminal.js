function createTerminal() {
    // Create the terminal instance and fit it to the container
    const term = new Terminal({
        cursorBlink: true,
        scrollOnEraseInDisplay: true,
    });
    term.options.fontSize = 13;   
    const fitAddon = new FitAddon.FitAddon();
    term.loadAddon(fitAddon);
    term.open(document.getElementById('terminal'));
    document.getElementById('terminal').getElementsByClassName('xterm-screen')[0].style.height = window.innerHeight + 'px'; // Ensure the terminal fills the container
    fitAddon.fit();

    // Handle window resize events to keep the terminal fitting the container
    window.onresize = () => {
        fitAddon.fit()
        term.refresh(0, term.rows - 1); // Refresh the terminal to apply the new size
        document.getElementById('terminal').getElementsByClassName('xterm-screen')[0].style.height = window.innerHeight + 'px'; // Ensure the terminal fills the container
    };

    attachPtyProcess(term);

    return term;
};

module.exports = { createTerminal }