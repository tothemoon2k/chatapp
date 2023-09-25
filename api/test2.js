import puppeteer from 'puppeteer-extra';
import delay from 'delay';
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha';
import express from 'express';
let app = express();
//import SmartProxyPlugin from 'zyte-smartproxy-plugin';

//puppeteer.use(SmartProxyPlugin({
 // spm_apikey: 'f49b002e803b4fa78261293b537be925',
//}));

puppeteer.use(
  RecaptchaPlugin({
    provider: {
      id: '2captcha',
      token: 'da621fac37b3615cae4b5cec2b187f6c' // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
    },
    visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
  })
)

const user = {
    username: 'justingarnerphotography',
    password: 'Sunglasses19',
};

/* puppeteer.launch(
    {
    headless: false,
    args: [
    '--disable-features=IsolateOrigins,site-per-process,SitePerProcess',
    '--flag-switches-begin --disable-site-isolation-trials --flag-switches-end'
  ]
}).then(async browser => {
    sendMessage(browser, user, {}, 'yo mama', 'justinfilms_');
});*/

let getRecentMessages = async (browser, user, opts) => {
    const page = await browser.newPage(); //{ignoreHTTPSErrors: true}
    await page.goto('https://www.instagram.com/', {timeout: 180000});

    await page.waitForSelector('input[name=username]', { visible: true });
    await delay(100);
    await page.type('input[name=username]', user.email || user.username, { delay: 50 });

    await delay(100);
    await page.type('input[name=password]', user.password, { delay: 50 });

    await delay(100);
    const [ signin ] = await page.$x('//button[contains(.,"Log in")]');
    await signin.click({ delay: 30 });

    await page.waitForTimeout(5000);

    await delay(5000);
    console.log('about to look for captcha');

    //If any catchas, will solve them
    for (const frame of page.mainFrame().childFrames()) {
        const { solved, error } = await frame.solveRecaptchas();
        if(solved){
            delay(1000);
            await page.waitForSelector('.x1i10hfl');  // Wait for the button to be visible
            await page.click('.x1i10hfl', { delay: 30 });
        }
    }

    await page.waitForTimeout(5000);

    await page.goto('https://www.instagram.com/direct/inbox/');

    await page.waitForTimeout(5000);

    const popupExists = await page.$('div._a9-v');
    if (popupExists) {
        await page.click('button._a9--._a9_1');
        await page.waitForTimeout(5000);  // Click the button
    }

    const chats = await page.$$('img.x5yr21d');
    console.log(chats, 'chats');

    await chats[1].click({ delay: 30 });

    await page.waitForTimeout(5000);

    await page.evaluate(() => {
        const chatWindow = document.querySelector('.x6prxxf');
        chatWindow.scrollTop -= 800;  // Adjust the value as needed for the desired scroll amount
      });

      const messages = await page.$$eval('div.x1tlxs6b div.xzsf02u, div.x1tlxs6b div.x14ctfv', (elements) => {
        return elements.map((element) => {
          const sender = element.classList.contains('x14ctfv') ? 'you' : 'other person';
          const messageText = element.textContent;
          return `${sender}: ${messageText}`;
        });
      });
      
      console.log(messages);

};


let sendMessage = async (browser, user, opts, message, recipient) => {
  const page = await browser.newPage(); //{ignoreHTTPSErrors: true}
  await page.goto('https://www.instagram.com/', {timeout: 180000});

  await page.waitForSelector('input[name=username]', { visible: true });
  await delay(100);
  await page.type('input[name=username]', user.email || user.username, { delay: 50 });

  await delay(100);
  await page.type('input[name=password]', user.password, { delay: 50 });

  await delay(100);
  const [ signin ] = await page.$x('//button[contains(.,"Log in")]');
  await signin.click({ delay: 30 });

  await page.waitForTimeout(5000);

  await page.goto(`https://www.instagram.com/${recipient}/`);

  await page.waitForTimeout(5000);

  const btns = await page.$$('[role=button]');
  for(let btn of btns){
    const text = await btn.evaluate(el => el.textContent);
    if(text === 'Message'){
      await btn.click({ delay: 30 });
      break;
    }
  }


  await page.waitForTimeout(5000);

  const popupExists = await page.$('div._a9-v');
  if (popupExists) {
      await page.click('button._a9--._a9_1');
      await page.waitForTimeout(5000);  // Click the button
  }

  await page.waitForTimeout(5000);

  const input = await page.$('.x1qjc9v5 .xzsf02u');

  await input.type(message, { delay: 100 });

  await page.click('div.x1i10hfl.xjqpnuy.xa49m3k.xqeqjp1.x2hbi6w.xdl72j9.x2lah0s.xe8uvvx.xdj266r.xat24cr.x1mh8g0r.x2lwn1j.xeuugli.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1q0g3np.x1lku1pv.x1a2a7pz.x6s0dn4.xjyslct.x1ejq31n.xd10rxx.x1sy0etr.x17r0tee.x9f619.x1ypdohk.x1i0vuye.x1f6kntn.xwhw2v2.xl56j7k.x17ydfre.x2b8uid.xlyipyv.x87ps6o.x14atkfc.xcdnw81.xjbqb8w.xm3z3ea.x1x8b98j.x131883w.x16mih1h.x972fbf.xcfux6l.x1qhh985.xm0m39n.xt0psk2.xt7dq6l.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.x1n5bzlp.x173jzuc.x1yc6y37.xfs2ol5');
};


/* await delay(5000);
  console.log('about to look for captcha');
  // Loop over all potential frames on that page
  for (const frame of page.mainFrame().childFrames()) {
      // Attempt to solve any potential captchas in those frames
      const { solved, error } = await frame.solveRecaptchas();
      if(solved){
          delay(1000);
          await page.waitForSelector('.x1i10hfl');  // Wait for the button to be visible
          await page.click('.x1i10hfl', { delay: 30 });
      }
  }
*/

let chat = async (browser, user, opts, message, recipient) => {
  const page = await browser.newPage(); //{ignoreHTTPSErrors: true}
  await page.goto('https://www.instagram.com/', {timeout: 180000});

  await page.waitForSelector('input[name=username]', { visible: true });
  await delay(100);
  await page.type('input[name=username]', user.email || user.username, { delay: 50 });

  await delay(100);
  await page.type('input[name=password]', user.password, { delay: 50 });

  await delay(100);
  const [ signin ] = await page.$x('//button[contains(.,"Log in")]');
  await signin.click({ delay: 30 });

  await page.waitForTimeout(5000);

  await page.goto(`https://www.instagram.com/${recipient}/`);

  await page.waitForTimeout(5000);

  const btns = await page.$$('[role=button]');
  for(let btn of btns){
    const text = await btn.evaluate(el => el.textContent);
    if(text === 'Message'){
      await btn.click({ delay: 30 });
      break;
    }
  }


  await page.waitForTimeout(5000);

  const popupExists = await page.$('div._a9-v');
  if (popupExists) {
      await page.click('button._a9--._a9_1');
      await page.waitForTimeout(5000);  // Click the button
  }

  await page.waitForTimeout(5000);

  //get the 6 most recent messages
  await page.evaluate(() => {
    const chatWindow = document.querySelector('.x6prxxf');
    chatWindow.scrollTop -= 800;  // Adjust the value as needed for the desired scroll amount
  });

  const messages = await page.$$eval('div.x1tlxs6b div.xzsf02u, div.x1tlxs6b div.x14ctfv', (elements) => {
    return elements.map((element) => {
      const sender = element.classList.contains('x14ctfv') ? 'you' : 'other person';
      const messageText = element.textContent;
      return `${sender}: ${messageText}`;
    });
  });
  
  console.log(messages);

  //emit the 6 messages

  //every few seconds check to see if any new messages from other person and if so emit the message

  //on message from user put it into the input and send it


  //this is the input const input = await page.$('.x1qjc9v5 .xzsf02u');
  //type into the input - await input.type(message, { delay: 100 });
  //send button await page.click('div.x1i10hfl.xjqpnuy.xa49m3k.xqeqjp1.x2hbi6w.xdl72j9.x2lah0s.xe8uvvx.xdj266r.xat24cr.x1mh8g0r.x2lwn1j.xeuugli.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1q0g3np.x1lku1pv.x1a2a7pz.x6s0dn4.xjyslct.x1ejq31n.xd10rxx.x1sy0etr.x17r0tee.x9f619.x1ypdohk.x1i0vuye.x1f6kntn.xwhw2v2.xl56j7k.x17ydfre.x2b8uid.xlyipyv.x87ps6o.x14atkfc.xcdnw81.xjbqb8w.xm3z3ea.x1x8b98j.x131883w.x16mih1h.x972fbf.xcfux6l.x1qhh985.xm0m39n.xt0psk2.xt7dq6l.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.x1n5bzlp.x173jzuc.x1yc6y37.xfs2ol5');
};

app.get("/getmessages", (req, res) => {
  res.send('helooooo')
});

const port = process.env.PORT || 6000;
// Initialize server
app.listen(port, () => {
  console.log("Running on port 6000.");
});

export default app;