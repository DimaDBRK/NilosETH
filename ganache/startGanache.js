const { exec } = require('child_process');
const path = require('path');

// Directory where the Ganache workspace will be saved
const workspaceDir = path.join(__dirname, 'ganache_workspace');

// Configure Ganache's startup options
const ganacheOptions = `-p 8545 -e 1000 --db "${workspaceDir}"`;

// Launch Ganache
const ganache = exec(`ganache-cli ${ganacheOptions}`, (err, stdout, stderr) => {
    if (err) {
        console.error(`exec error: ${err}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
});

console.log(`Ganache started on port 8545 with workspace at ${workspaceDir}`);

// Handling Ganache process output
ganache.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

ganache.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

// Handling Ganache process close
ganache.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});