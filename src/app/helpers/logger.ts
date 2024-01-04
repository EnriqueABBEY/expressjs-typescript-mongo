import * as fs from 'fs';
import { format } from 'date-fns';

function logToFile(message: String, folder?: String) {    
    const date = format(new Date(), 'yyyy-MM-dd');
    fs.mkdir(`logs/${folder}`, { recursive: true }, (err) => {
        if (err) console.log(err.message);
    });

    const logStream = fs.createWriteStream(`logs/${folder}/${date}.log`, { flags: 'a' });
    logStream.write(`${format(new Date(), 'HH:mm:ss')} ${message}\n`, (err) => {
        if (err) console.log(err.message);
    });
    logStream.end();
}
const logger = {
    info: (message: String, folder?: String) => logToFile(`[INFO] ${message}`, folder ? folder : 'app'),
    warn: (message: String, folder?: String) => logToFile(`[WARN] ${message}`, folder ? folder : 'app'),
    error: (message: String, folder?: String) => logToFile(`[ERROR] ${message}`, folder ? folder : 'app'),
};

export default logger;