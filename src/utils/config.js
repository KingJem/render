const puppeteer = require("puppeteer");
require('dotenv').config();
let envs = process.env;

const calculateValue = () => {
    for (const name in envs) {

        value = {
            // app config
            disallowRobot: envs.DISALLOW_ROBOT !== '0' && envs.DISALLOW_ROBOT !== 'false',
            enableCluster: envs.ENABLE_CLUSTER,
            isPackage: envs.IS_PACKAGE,
            nodeName: envs.NODE_NAME,
            nodeEnv: envs.NODE_ENV,
            puppeteerWSEndpoint: envs.PUPPETEER_WS_ENDPOINT,
            chromiumExecutablePath: envs.CHROMIUM_EXECUTABLE_PATH || puppeteer.executablePath(),
            // chromiumExecutablePath: envs.CHROMIUM_EXECUTABLE_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            // network
            connect: {
                port: envs.PORT || 8001, // 监听端口
                socket: envs.SOCKET || null, // 监听 Unix Socket, null 为禁用
            },

            // proxy
            proxyUri: envs.PROXY_URI,
            proxy: {
                protocol: envs.PROXY_PROTOCOL,
                host: envs.PROXY_HOST,
                port: envs.PROXY_PORT,
                auth: envs.PROXY_AUTH,
                url_regex: envs.PROXY_URL_REGEX || '.*',
            },
            proxyStrategy: envs.PROXY_STRATEGY || 'all', // all / on_retry
            reverseProxyUrl: envs.REVERSE_PROXY_URL,

            // logging
            // 是否显示 Debug 信息，取值 'true' 'false' 'some_string' ，取值为 'true' 时永久显示，取值为 'false' 时永远隐藏，取值为 'some_string' 时请求带上 '?debug=some_string' 显示
            debugInfo: envs.DEBUG_INFO || 'true',
            loggerLevel: envs.LOGGER_LEVEL || 'info',
            noLogfiles: envs.NO_LOGFILES,
            showLoggerTimestamp: envs.SHOW_LOGGER_TIMESTAMP,
        };
    }
};
calculateValue();

module.exports = {
    set: (env) => {
        envs = Object.assign(process.env, env);
        calculateValue();
    },
    get value() {
        return value;
    },
};
