const old = {};

const log = (...params) => {
    old.log(`[${new Date().toLocaleString()}]`, ...params);
};

const info = (...params) => {
    old.info(`[${new Date().toLocaleString()}]`, ...params);
};

const warn = (...params) => {
    old.warn(`[${new Date().toLocaleString()}]`, ...params);
};

const error = (...params) => {
    old.error(`[${new Date().toLocaleString()}]`, ...params);
};

module.exports = {
    integrate: () => {
        old.log = console.log;
        old.info = console.info;
        old.warn = console.warn;
        old.error = console.error;

        console.log = log;
        console.info = info;
        console.warn = warn;
        console.error = error;
    }
};
