// Add Express
import express from "express";
import puppeteer from 'puppeteer-core'
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha';



  let username = 'justingarnerphotography'
  let password = 'Sunglasses19'




const SBR_WS_ENDPOINT = 'wss://brd-customer-hl_284a07c8-zone-scraping_browser:m06tk9i11kxw@brd.superproxy.io:9222';

async function main() {
    console.log('Connecting to Scraping Browser...');
    const browser = await puppeteer.connect({
        browserWSEndpoint: SBR_WS_ENDPOINT,
        headless: false,
    });

    console.log('Connected! Navigating to www.instagram.com...');
        const page = await browser.newPage();
        await page.goto('http://www.instagram.com');
        console.log('Navigated! Scraping page content...');
        await page.waitForTimeout(5000);
        await page.screenshot({ path: 'screenshot1.png' });
    } 

        //const searchResultSelector = 'body > div.x1n2onr6.xzkaem6 > div.x9f619.x1n2onr6.x1ja2u2z > div > div.x1uvtmcs.x4k7w5x.x1h91t0o.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1n2onr6.x1qrby5j.x1jfb8zj > div > div > div > div > div.x7r02ix.xf1ldfh.x131esax.xdajt7p.xxfnqb6.xb88tzc.xw2csxc.x1odjw0f.x5fp0pe.x5yr21d.x19onx9a > div > button._a9--._a9_0';
        //await page.waitForSelector(searchResultSelector);
        //await page.click(searchResultSelector);


main().catch(err => {
    console.error(err.stack || err);
    process.exit(1);
});



  //const searchResultSelector = 'body > div.x1n2onr6.xzkaem6 > div.x9f619.x1n2onr6.x1ja2u2z > div > div.x1uvtmcs.x4k7w5x.x1h91t0o.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1n2onr6.x1qrby5j.x1jfb8zj > div > div > div > div > div.x7r02ix.xf1ldfh.x131esax.xdajt7p.xxfnqb6.xb88tzc.xw2csxc.x1odjw0f.x5fp0pe.x5yr21d.x19onx9a > div > button._a9--._a9_0';
        //await page.waitForSelector(searchResultSelector);
        //await page.click(searchResultSelector);

    /*    await page.type('#loginForm > div > div:nth-child(1) > div > label > input', username, {delay: 50})
         
        await page.type('#loginForm > div > div:nth-child(2) > div > label > input', password, {delay: 50})

        setTimeout(async () => {
            console.log(`Logging in`)
            await page.click('#loginForm > div > div:nth-child(3) > button')
            await page.waitForTimeout(5000)
                console.log(`Solving Captcha`)
                const { solved, error } = await page.solveRecaptchas();
                if(solved) {
                    page.goto(`https://www.instagram.com/`)
                }
            
        }, 5000);


    
*/

        

        
  



