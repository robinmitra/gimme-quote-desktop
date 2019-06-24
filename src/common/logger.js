const LOG_LEVEL_ERROR = 2;
const LOG_LEVEL_INFO = 3;
const LOG_LEVEL_VERBOSE = 4;

const logLevel = Number(process.env.LOG_LEVEL) || 3;

exports.info = (...data) => {
  if (logLevel >= LOG_LEVEL_INFO) console.log(...data);
};

exports.log = (...data) => {
  if (logLevel >= LOG_LEVEL_VERBOSE) console.log(...data);
};

exports.error = (...data) => {
  if (logLevel >= LOG_LEVEL_ERROR) console.log(...data);
};