const express = require('express');
const logger = require("./utils/logger");
const config = require('./utils/config').value;
const file = require('fs');
const insert_visibility_info_script = file.readFileSync('./scripts/render_scripts.js', 'utf8')

app = express()

app.use(express.urlencoded({extended: true, limit: "10mb"}));
app.use(express.json({extended: true, limit: "10mb"}));


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


app.post('/', async (req, res) => {
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


app.listen(config.connect.port, () => {
    console.log(`Example app listening on port ${config.connect.port}`)
})
