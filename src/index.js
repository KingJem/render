const logger = require("./utils/logger");
const app = require('./utils/server');
const config = require('./utils/config').value;

const file = require('fs');
// const insert_visibility_info_script = file.readFileSync('@/sc/render_scripts', 'utf8');
const insert_visibility_info_script = require('./scripts/render_scripts');


let browser;

logger.info('PUPPETEER_WS_ENDPOINT is ',config.puppeteerWSEndpoint)
logger.info('chromiumExecutablePath is ',config.chromiumExecutablePath)



async function render(url, bypassPaywall) {

    if (!browser) {
        browser = await require('./utils/puppeteer')()
    }
    const page = await browser.newPage()
    await page.setDefaultNavigationTimeout(30000);

    try {
        logger.info('current url is ', url);
        await page.goto(url);
        const content = await page.content();
        if (bypassPaywall) {
            await page.evaluate(insert_visibility_info_script);
        }
        await page.close();
        return content;
    } catch (e) {
        await page.close();
        logger.error(e.stack);
    }


}

app.get('/health', async (req, res) => {
    res.send(
        {'status': 200}
    )
})


app.post('/', async (req, res) => {
    let url = req.body.url;
    logger.info("current url is : " + url)

    try {
        const html = await render(url)
        res.send(html)
        console.log(url + "," + ' render succeed')

    } catch (e) {
        logger.error(e.stack)
        res.send({'status': 'error'})
    }
})


app.post('/bypass', async (req, res) => {
    let url = req.body.url;
    try {
        logger.info("current url is :" + url)
        const html = await render(url, true)
        res.send(html)
        logger.info(url + "," + ' bypass succeed')

    } catch (e) {
        logger.error(e.stack)
        res.send(void 0)
    }
})


