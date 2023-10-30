const logger = require("./utils/logger");
const app = require('./utils/server');
const file = require('fs');
// const insert_visibility_info_script = file.readFileSync('@/sc/render_scripts', 'utf8');
const insert_visibility_info_script = require('./scripts/render_scripts');


(async () => {
    global.browser = await require('./utils/puppeteer')({stealth: true});
})()

async function render(url, bypassPaywall) {
    const page = await browser.newPage();
    await page.goto(url)
    if (bypassPaywall) {
        await page.evaluate(insert_visibility_info_script)
    }
    const content = await page.content()
    await page.close()
    return content

}

app.get('/health', async (req, res) => {
    res.send(
        {'status': 200}
    )
})


app.post('/render', async (req, res) => {
    let url = req.body.url;
    try {
        const html = await render(url)
        res.send(html)
        console.log(url + "," + ' render succeed')

    } catch (e) {
        logger.error(e.stack)
        res.send(void 0)
    }
})


app.post('/bypass', async (req, res) => {
    let url = req.body.url;
    try {
        console.log("current url is :" + url)
        const html = await render(url, true)
        res.send(html)
        console.log(url + "," + ' bypass succeed')

    } catch (e) {
        logger.error(e.stack)
        res.send(void 0)
    }
})


