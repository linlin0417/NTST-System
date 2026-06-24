let irikaLogger: any;
try {
  irikaLogger = require('irika-system-logger');
} catch (e) {
  console.warn("Could not load irika-system-logger, using console as fallback");
  irikaLogger = console;
}

export const logger = {
  info: (msg: string, ...args: any[]) => {
    if (typeof irikaLogger === 'function') {
        irikaLogger(msg, ...args);
    } else if (irikaLogger && typeof irikaLogger.info === 'function') {
        irikaLogger.info(msg, ...args);
    } else if (irikaLogger && typeof irikaLogger.log === 'function') {
        irikaLogger.log(msg, ...args);
    } else {
        console.log(msg, ...args);
    }
  },
  error: (msg: string, ...args: any[]) => {
    if (irikaLogger && typeof irikaLogger.error === 'function') {
        irikaLogger.error(msg, ...args);
    } else {
        console.error(msg, ...args);
    }
  },
  warn: (msg: string, ...args: any[]) => {
    if (irikaLogger && typeof irikaLogger.warn === 'function') {
        irikaLogger.warn(msg, ...args);
    } else {
        console.warn(msg, ...args);
    }
  }
};
