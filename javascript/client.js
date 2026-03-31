var sessions = 0;

async function buildShellMenu() {
    var shellMenu;
    const os = await window.app.getOS();

    // For buttons, we will change how they work based off the platform
    if (os === 'darwin') {
        shellMenu = {
                'Shell': {'New Window' : function () {
                    window.app.createNewWindow();
                }, 
                'Settings': function () {
                    window.app.openSettings();
                },
                'Close Window': function () {
                    window.close();
                },
                'Quit' : function () {
                    window.app.quitApp();
                }
            }
        }
    } else {
        shellMenu = {
                'Shell': {'New Window' : function () {
                    window.app.createNewWindow();
                }, 
                'Settings': function () {
                    window.app.openSettings();
                },
                'Exit' : function () {
                    term.endSession();
                    window.close();
                }
            }
        }
    }

    return shellMenu;
}

async function createView() {
    sessions += 1;
    const mainView = document.getElementById('main-view');
    const tableCell = document.createElement('tr');
    const divItem = document.createElement('div');
    divItem.className = "terminal";
    divItem.id = `terminal-${sessions}`;
    tableCell.appendChild(divItem);

    mainView.insertBefore(tableCell, mainView.firstChild);

    // create Terminal and attach to the terminal viewport
    await createTerminal(divItem);

    return document.getElementById(`terminal-${sessions}`);
}

window.onload = async function() {
    // Create a view
    await createView();

    // Listen for the quit signal from the PTY session and end the terminal session when it is received
    window.app.onQuitTermSignal((value) => {
        console.log('Received quit signal from PTY session: ', value);
        window.close();
    });

    // Create the Shell Menu option depending on the platform
    const shellMenu = await buildShellMenu();

    // Create menu bar buttons
    const menuBar = document.getElementById('menu-bar'); // Get the menu-bar element

    // Create the menu option set combining shellMenu and the other options
    const buttons = Object.assign({}, shellMenu, {
        'Edit': {'Cut' : function () {
            const selectedText = term.getSelection().toString();
            if (selectedText) {
                navigator.clipboard.writeText(selectedText).then(() => {
                    console.log('Text copied to clipboard');
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                });
            }
        }, 'Copy' : function () {
            const selectedText = term.getSelection().toString();
            if (selectedText) {
                navigator.clipboard.writeText(selectedText).then(() => {
                    console.log('Text copied to clipboard');
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                });
            }
        }, 'Paste' : function () {
            navigator.clipboard.readText().then(text => {
                term.paste(text);
            }).catch(err => {
                console.error('Failed to read clipboard contents: ', err);
            });
        }},
        'View': {'Enlarge Text' : function () {
            // Zoom In functionality
            term.zoomIn();
        }, 'Shrink Text' : function () {
            term.zoomOut(); // Decrease font size to zoom out
        }, 'Reset Zoom' : function () {
            term.resetZoom(); // Reset to default font size
        }},
        'Help': {'About' : function () {
            window.app.showAboutWindow();
        }}
    });

    // Create buttons and dropdowns for the menu bar
    for (const [btnText, subButtons] of Object.entries(buttons)) {
        const btn = document.createElement('button');
        btn.textContent = btnText;
        btn.style.fontFamily = 'office-code-pro';
        btn.style.backgroundColor = 'darkslategray';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.padding = '5px 10px';
        btn.style.marginRight = '10px';
        btn.onmouseover = () => {
            btn.style.backgroundColor = 'slategray';
            dropdown.style.display = 'flex'; // Show dropdown on hover
        };
        btn.onmouseout = () => {
            btn.style.backgroundColor = 'darkslategray';
            dropdown.style.display = 'none'; // Hide dropdown on mouse out
        };
        const dropdown = document.createElement('div');
        dropdown.style.position = 'absolute';
        dropdown.style.backgroundColor = 'white';
        dropdown.style.border = '1px solid #ccc';
        dropdown.style.display = 'none';
        dropdown.style.minWidth = '100px';
        dropdown.style.zIndex = '1000';
        dropdown.style.flexDirection = 'column';
        Object.entries(subButtons).forEach(([subBtnText, subBtnFunction]) => {
            const subBtn = document.createElement('button');
            subBtn.textContent = subBtnText;
            subBtn.style.fontFamily = 'office-code-pro';
            subBtn.style.textAlign = 'left';
            subBtn.style.backgroundColor = 'white';
            subBtn.style.color = 'black';
            subBtn.style.border = 'none';
            subBtn.style.padding = '5px 10px';
            subBtn.onmouseover = () => subBtn.style.backgroundColor = '#a19b9b';
            subBtn.onmouseout = () => subBtn.style.backgroundColor = 'white';
            subBtn.onclick = () => subBtnFunction(); // Call the corresponding function on click
            dropdown.appendChild(subBtn);
        });
        btn.appendChild(dropdown);
        btn.onclick = () => {
            dropdown.style.display = dropdown.style.display === 'none' ? 'flex' : 'none';
        }
        menuBar.appendChild(btn);
    };

    // Set up cut, copy, and paste events
    document.oncut(() => {
        navigator.clipboard.writeText(term.selectedText);
    });

    document.oncopy(() => {
        navigator.clipboard.writeText(term.selectedText);
    });

    document.onpaste(() => {
        navigator.clipboard.readText().then(text => {
            term.write(text);
        })
    });
}