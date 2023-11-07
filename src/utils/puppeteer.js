const config = require('./config').value;
const {proxyUri, proxyUrlHandler} = require('./unify-proxy');
let puppeteer = require('puppeteer');
const proxyChain = require('proxy-chain');
const logger = require('./logger');
const path = require("path");
const payWallPath = path.resolve(__dirname, './plugins/bypass-paywalls-chrome/');


// `--user-agent=${config.ua}`


const options = {
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--window-position=0,0',
        '--ignore-certificate-errors',
        '--ignore-certificate-errors-spki-list',
        `--load-extension=${payWallPath}`,
        '--disable-gpu', // GPU硬件加速
        '--disable-dev-shm-usage', // 创建临时文件共享内存
        '--disable-setuid-sandbox', // uid沙盒
        '--no-first-run', // 没有设置首页。在启动的时候，就会打开一个空白页面。
        '--no-sandbox', // 沙盒模式
        '--no-zygote',
        '--single-process', // 单进程运行
    ],
    headless: 'new',
    // headless: true,
    ignoreHTTPSErrors: true,
    autoClose: false

};


/**
 * @param {Object} extraOptions
 * @param {boolean} extraOptions.stealth - Use puppeteer-extra-plugin-stealth
 * @returns Puppeteer browser
 */
module.exports = async (extraOptions = {}) => {

    const {addExtra} = require('puppeteer-extra');
    puppeteer = addExtra(puppeteer);

    require('puppeteer-extra-plugin-stealth/evasions/chrome.app');
    require('puppeteer-extra-plugin-stealth/evasions/chrome.csi');
    require('puppeteer-extra-plugin-stealth/evasions/chrome.loadTimes');
    require('puppeteer-extra-plugin-stealth/evasions/chrome.runtime');
    require('puppeteer-extra-plugin-stealth/evasions/defaultArgs');
    require('puppeteer-extra-plugin-stealth/evasions/iframe.contentWindow');
    require('puppeteer-extra-plugin-stealth/evasions/media.codecs');
    require('puppeteer-extra-plugin-stealth/evasions/navigator.hardwareConcurrency');
    require('puppeteer-extra-plugin-stealth/evasions/navigator.languages');
    require('puppeteer-extra-plugin-stealth/evasions/navigator.permissions');
    require('puppeteer-extra-plugin-stealth/evasions/navigator.plugins');
    require('puppeteer-extra-plugin-stealth/evasions/navigator.vendor');
    require('puppeteer-extra-plugin-stealth/evasions/navigator.webdriver');
    require('puppeteer-extra-plugin-stealth/evasions/sourceurl');
    require('puppeteer-extra-plugin-stealth/evasions/user-agent-override');
    require('puppeteer-extra-plugin-stealth/evasions/webgl.vendor');
    require('puppeteer-extra-plugin-stealth/evasions/window.outerdimensions');
    require('puppeteer-extra-plugin-user-preferences');
    require('puppeteer-extra-plugin-user-data-dir');

    // 禁止加载图片和视频
    puppeteer.use(require('puppeteer-extra-plugin-block-resources')({blockedTypes: new Set(['image', 'media'])}))
    // puppeteer.use(require('puppeteer-extra-plugin-font-size')({defaultFontSize: 18}))
    // 匿名UA
    puppeteer.use(require('puppeteer-extra-plugin-anonymize-ua')())
    // 方式检测
    puppeteer.use(require('puppeteer-extra-plugin-stealth')());

    let browser;
    if (proxyUri) {
        if (proxyUrlHandler.username || proxyUrlHandler.password) {
            // only proxies with authentication need to be anonymized
            if (proxyUrlHandler.protocol === 'http:') {
                options.args.push(`--proxy-server=${await proxyChain.anonymizeProxy(proxyUri)}`);
            } else {
                logger.warn('SOCKS/HTTPS proxy with authentication is not supported by puppeteer, continue without proxy');
            }
        } else {
            // Chromium cannot recognize socks5h and socks4a, so we need to trim their postfixes
            options.args.push(`--proxy-server=${proxyUri.replace('socks5h://', 'socks5://').replace('socks4a://', 'socks4://')}`);
        }
    }
    if (config.puppeteerWSEndpoint) {
        browser = await puppeteer.connect({
            browserWSEndpoint: config.puppeteerWSEndpoint,
        });
    } else {
        browser = await puppeteer.launch(
            config.chromiumExecutablePath
                ? {
                    executablePath: config.chromiumExecutablePath,
                    ...options,
                }
                : options
        );
    }
    // setTimeout(() => {
    //     browser.close();
    // }, 300000);


    // process.on('exit', async () => {
    //     if (browser) await browser.close();
    // });
    //
    // process.on('uncaughtException', async () => {
    //     if (browser) await browser.close();
    //     process.exit(1);  // Exit with an error code
    // });

    return browser;
};
