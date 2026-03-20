function createTerminal() {
    // Create the terminal instance and fit it to the container
    const term = new Terminal({
        cursorBlink: true,
        scrollback: 9999999,
        scrollOnEraseInDisplay: true,
    });
    term.options.fontSize = 13;   
    const fitAddon = new FitAddon.FitAddon();
    term.loadAddon(fitAddon);
    term.open(document.getElementById('terminal'));
    document.getElementById('terminal').getElementsByClassName('xterm-screen')[0].style.height = window.innerHeight + 'px'; // Ensure the terminal fills the container
    fitAddon.fit();

    // Establish WebSocket connection to the server-side component
    let socket;
    while (true) {
        try {
            socket = new WebSocket('ws://localhost:45875');

            // Handle connection failures through events
            socket.onerror = (error) => {
                console.error('WebSocket connection failed, retrying in 5 seconds...', error);
                setTimeout(() => location.reload(), 5000);
            };
    
            socket.onopen = () => {
                console.log('WebSocket connected successfully');
            };

            socket.onclose = (result) => {
                if (result.wasClean) {
                    window.close();
                } else {
                    window.electron.showErrorDialog('The terminal session has abruptly ended due to an error.')
                    window.close();
                }
            }

            break; // Exit the loop if connection is successful
        } catch (e) {
            console.error('WebSocket connection failed, retrying in 5 seconds...', e);
            setTimeout(() => location.reload(), 5000);
            return;
        }
    }
    // Forward terminal input to the server and display server output in the terminal
    socket.onmessage = (e) => term.write(e.data);
    term.onData((data) => socket.send(data));

    // Handle window resize events to keep the terminal fitting the container
    window.onresize = () => {
        fitAddon.fit()
        term.refresh(0, term.rows - 1); // Refresh the terminal to apply the new size
        document.getElementById('terminal').getElementsByClassName('xterm-screen')[0].style.height = window.innerHeight + 'px'; // Ensure the terminal fills the container
    };

    return term;
};