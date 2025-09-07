import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { PythonShell } from 'python-shell';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;




const pythonScriptPath = './public/py/nitrogeneration.py';
let pythonOutputBuffer = '';
const pythonProcess = spawn('python3', [pythonScriptPath]);

pythonProcess.stdout.on('data', (data) => {
    pythonOutputBuffer += data.toString();
});

pythonProcess.stderr.on('data', (data) => {
    pythonOutputBuffer += '\n' + data.toString();
});

pythonProcess.on('close', (code) => {
    console.log(`Child process exited with code ${code}`);
});


app.post('/api/terminal', express.json(), (req, res) => {
    const { command } = req.body;
    if (!command) return res.status(400).json({ error: 'No command provided' });
    pythonProcess.stdin.write(command + '\n');
    setTimeout(() => {
        if (pythonOutputBuffer.length > 10000) {
            pythonOutputBuffer = pythonOutputBuffer.slice(-10000);
        }
        const output = pythonOutputBuffer;
        pythonOutputBuffer = '';
        res.json({ output });
    }, 300); // Adjust delay as needed
});





app.use((req, res, next) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'templates', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
