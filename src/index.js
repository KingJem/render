const logger = require("./utils/logger");
const app = require('./utils/server');
const config = require('./utils/config').value;

// const insert_visibility_info_script = file.readFileSync('@/sc/render_scripts', 'utf8');
const insert_visibility_info_script = require('./scripts/render_scripts');
const fs = require('node:fs');


let browser;

logger.info('PUPPETEER_WS_ENDPOINT is ' + config.puppeteerWSEndpoint)
logger.info('chromiumExecutablePath is ' + config.chromiumExecutablePath)


async function render(url, flag) {

    if (!browser) {
        browser = await require('./utils/puppeteer')()
    }

    const page = await browser.newPage()
    await page.setDefaultNavigationTimeout(30000);

    try {
        await page.goto(url);
        if (flag === 'meta_render') {
            await page.evaluate(insert_visibility_info_script);
        }
        const content = await page.content();
        await page.close();
        return content;
    } catch (e) {
        await page.close();
        return String(e.stack)
    }

}


app.get('/health', async (req, res) => {
    res.send({'status': "OK", 'code': 200})
})


app.post('/', async (req, res) => {
    let url = req.body.url;
    logger.info('current url is ' + url);

    try {
        const html = await render(url, 'render')
        res.send(html)

    } catch (e) {
        logger.error(e.stack)
        res.send({'status': "OK", 'code': 500})
        res.status(500)
    }
})




