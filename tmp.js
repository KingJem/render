const puppeteer = require('puppeteer');

(async () => {
    const chromiumPath = puppeteer.executablePath();
    console.log(chromiumPath);
})();


require('dotenv').config();
let envs = process.env;


// console.log(envs)

const headless = function test() {
    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod') {
        return true
    } else if (process.env.NODE_ENV === 'develop'|| process.env.NODE_ENV === 'dev') {
        return false
    } else if (process.env.NODE_ENV === 'new') {
        return 'new'
    }
}()

const url = 'https://chinatimes.com'
const flag = url.indexOf('chinatimes.com') === -1

console.log(flag)
