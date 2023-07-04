const express = require('express');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const open = import('open');

const app = express();
const port = 3000;

let dirs;

// Get directories in the parent folder
fs.readdir('../', { withFileTypes: true }, (err, files) => {
    if (err) {
        console.error('An error occurred:', err);
        return;
    }

    dirs = files.filter(f => f.isDirectory())
        .map(f => f.name)
        .filter(dir => fs.existsSync(path.join('..', dir, 'index.html')));

    if (dirs.length > 0) {
        // Choose directory
        console.log('Select a directory to serve:');
        dirs.forEach((dir, index) => {
            console.log(`${index + 1}. ${dir}`);
        });

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('Enter your choice: ', (answer) => {
            const choice = Number(answer);
            if (choice >= 1 && choice <= dirs.length) {
                app.use(express.static(path.join('..', dirs[choice - 1])));

                app.listen(port, async () => {
                    console.log(`App serving ${dirs[choice - 1]} at http://localhost:${port}`);
                    // Open the website in the default browser
                    (await open).default(`http://localhost:${port}`);
                });
            } else {
                console.error('Invalid choice');
            }

            rl.close();
        });
    } else {
        console.error('No directories found with an index.html file.');
    }
});
