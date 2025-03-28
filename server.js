const { SerialPort } = require('serialport'); 
const { ReadlineParser } = require('@serialport/parser-readline');

const PORT = '/dev/input/mouse0';  // Zameniti sa stvarnim Bluetooth portom
const BAUDRATE = 38400;  // Standardna brzina za ELM327

const port = new SerialPort({
    path: PORT,
    baudRate: BAUDRATE
});


const parser = port.pipe(new ReadlineParser({ delimiter: '\r' }));

port.on('open', () => {
    console.log('Connected to ELM327!');


    sendCommand('AT Z');  // Resetuj ELM327
    sendCommand('AT SP 0');  // Automatski odabir protokola

    // Čitanje podataka
    sendCommand('010C');  // Čitaj RPM
    sendCommand('010D');  // Čitaj brzinu
});


parser.on('data', (data) => {
    console.log('ECU Response:', data.trim());
});


function sendCommand(cmd) {
    console.log('Sending:', cmd);
    port.write(cmd + '\r'); 
}