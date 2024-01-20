const { exec } = require('child_process');
const path = require('path');

// Ganache workspace will be saved = DB
const workspaceDir = path.join(__dirname, 'ganache_workspace');

// Startup options
const ganacheOptions = `-p 8545 -e 1000 --db "${workspaceDir}"`;

// Start Ganache => pay attention on limitations 
const ganache = exec(`ganache-cli ${ganacheOptions}`, (err, stdout, stderr) => {
    if (err) {
        console.error(`exec error: ${err}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
});

console.log(`Ganache started on port 8545 with workspace at ${workspaceDir}`);

// On Process output
ganache.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

// Error
ganache.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

// On Process close
ganache.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});