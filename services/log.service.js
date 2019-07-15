const fs = require('fs');

const log = (message, e, filename = 'logs.txt') => {
    const today = new Date()
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const time = `${today.toLocaleDateString('EN-en', options)} - ${today.toLocaleTimeString()}`
    const logmsg = `[${time}]: ${message}`
    const errormsg = `[${time}]: ${e}`
    if(process.env.NODE_ENV != 'testing'){
        //  Print to console
        console.log(logmsg);
        //  Save in log 
        fs.appendFileSync(filename, `${logmsg}.\n`)
      if(e){
        console.error(errormsg);
        fs.appendFileSync(filename, `${errormsg}.\n`)
      }
    }
}

const terminalLog = (msg) => {
    console.log('---------------------------------------------------')
    console.log(msg)
    console.log('---------------------------------------------------')
}

module.exports = {
    log,
    terminalLog
}