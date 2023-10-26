require('dotenv').config();
let envs = process.env;
let value;

const calculateValue = () => {
    for (const name in envs) {

        value = {
            // app config
            disallowRobot: envs.DISALLOW_ROBOT !== '0' && envs.DISALLOW_ROBOT !== 'false',
            enableCluster: envs.ENABLE_CLUSTER,
            isPackage: envs.IS_PACKAGE,
            nodeName: envs.NODE_NAME,
            puppeteerWSEndpoint: envs.PUPPETEER_WS_ENDPOINT,
            // chromiumExecutablePath: envs.CHROMIUM_EXECUTABLE_PATH || '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
            chromiumExecutablePath: envs.CHROMIUM_EXECUTABLE_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            // network
            connect: {
                port: envs.PORT || 8001, // 监听端口
                socket: envs.SOCKET || null, // 监听 Unix Socket, null 为禁用
            },
            requestRetry: parseInt(envs.REQUEST_RETRY) || 2, // 请求失败重试次数
            requestTimeout: parseInt(envs.REQUEST_TIMEOUT) || 30000, // Milliseconds to wait for the server to end the response before aborting the request
            // proxy
            proxyUri: envs.PROXY_URI || 'socks5://127.0.0.1:7890',
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
            sentry: {
                dsn: envs.SENTRY,
                routeTimeout: parseInt(envs.SENTRY_ROUTE_TIMEOUT) || 30000,
            },
            // feed config
            hotlink: {
                template: envs.HOTLINK_TEMPLATE,
                includePaths: envs.HOTLINK_INCLUDE_PATHS && envs.HOTLINK_INCLUDE_PATHS.split(','),
                excludePaths: envs.HOTLINK_EXCLUDE_PATHS && envs.HOTLINK_EXCLUDE_PATHS.split(','),
            },
            feature: {
                allow_user_hotlink_template: envs.ALLOW_USER_HOTLINK_TEMPLATE === 'true',
                filter_regex_engine: envs.FILTER_REGEX_ENGINE || 're2',
                allow_user_supply_unsafe_domain: envs.ALLOW_USER_SUPPLY_UNSAFE_DOMAIN === 'true',
            },
            suffix: envs.SUFFIX,
            titleLengthLimit: parseInt(envs.TITLE_LENGTH_LIMIT) || 150,
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
