import winston from 'winston'


const customLevelOptions = {
    levels: {
        debug: 0,
        http: 1,
        info: 2,
        warning: 3,
        error: 4,
        fatal: 5,
    }
}

// const logColors = {
//     debug: 'blue',
//     http: 'green',
//     info: 'cyan',
//     warning: 'yellow',
//     error: 'red',
//     fatal: 'magenta',
//   };

// Configuración para entorno de desarrollo
const developmentLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    format: winston.format.combine(
      //winston.format.colorize({ all: true }),
      winston.format.simple()
    ),
    transports: [new winston.transports.Console({ 
        level: 'debug', 
        format: winston.format.simple()
    })],
  });
  
  // Configuración para entorno de producción
  const productionLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    format: winston.format.json(), // Utilizar formato JSON en producción
    transports: [
        new winston.transports.Console({ level: 'info' }), 
        new winston.transports.File({ filename: './errors.log', level: 'error' }),
    ],
  });


  // Configuración del nivel para cada entorno
if (process.env.NODE_ENV !== 'production') {
    developmentLogger.level = 'debug';
  } else {
    productionLogger.level = 'info';
}


// Usa el logger correspondiente según el entorno
const logger = process.env.NODE_ENV !== 'production' ? developmentLogger : productionLogger;

export const addLogger = (req, res, next) => {
    req.logger = logger
    req.logger.info(`[${req.method}] ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()
}

