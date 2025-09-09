import fs from 'fs'
import path from 'path';
import os from 'os';
import { exec } from 'child_process';

let user_name = process.env.USER || os.userInfo().username;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function terminal() {
    const computer_name = "user@clamos:~$";
    const home_dir = path.join(os.homedir(), user_name);
    process.chdir(home_dir);

    rl.on('line', (intake_full) => {
        const input_split = intake_full.split();
        const intake = input_split[0];

        switch (intake) {
            case "exit":
                rl.close();
                break;
            case "ls":
                fs.readdir(process.cwd(), (err, files) => {
                    if (err) throw err;
                    console.log(files.join('\n'));
                });
                break;
            case "pwd":
                console.log(process.cwd());
                break;
            case "cd":
                const pathToChange = input_split[1];
                process.chdir(pathToChange);
                break;
            case "touch":
                const fileToCreate = input_split[1];
                fs.writeFile(fileToCreate, '', (err) => {
                    if (err) throw err;
                });
                break;
            case "mkdir":
                fs.mkdir(input_split[1], (err) => {
                    if (err) throw err;
                });
                break;
            case "rm":
                const fileToRemove = input_split[1];
                fs.unlink(fileToRemove, (err) => {
                    if (err) throw err;
                });
                break;
            case "rmdir":
                const dirToRemove = input_split[1];
                fs.rmdir(dirToRemove, (err) => {
                    if (err) throw err;
                });
                break;
            case "cat":
                const fileToRead = input_split[1];
                fs.readFile(fileToRead, 'utf8', (err, data) => {
                    if (err) throw err;
                    console.log(data);
                });
                break;
            case "clear":
                exec('clear');
                break;
            case "cls":
                exec('cls');
                break;
            case "mint":
                exec('root');
                break;
            case "fetchdev":
                console.log(`
                Fetching Dev...

                     _   _ ___ _____ ____   ___   
| \ | |_ _|_   _|  _ \ / _ \ / ___| ____| \ | | 
|  \| || |  | | | |_) | | | | |  _|  _| |  \| |  
| |\  || |  | | |  _ <| |_| | |_| | |___| |\  |
|_|_\_|___|_|_| |_| \_\\___/ \____|_____|_| \_|
                                                              

                CPU: ${os.cpus()[0].model}
                OS: ${os.platform()}
                RAM: ${Math.round(os.totalmem() / (1024 ** 3))} GB
                GPU: ${os.arch()}
                OS Version: ${os.release()}
                Node.js Version: ${process.version}
                `);
                break;
            case "help":
                console.log(`
                List of Commands:
                help - Displays the list of commands.
                exit - Exits the terminal.
                ls - Lists all files in the directory.
                pwd - Displays the current directory.
                cd - Changes the directory.
                touch - Creates a file.
                mkdir - Creates a directory.
                rm - Removes a file.
                rmdir - Removes a directory.
                cat - Displays the contents of a file.
                `);
                break;
            default:
                console.log("Command not recognized.");
        }
    });
}

terminal();