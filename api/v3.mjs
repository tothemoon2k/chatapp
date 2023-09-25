import puppeteer from "puppeteer-extra";
import delay from "delay";
import RecaptchaPlugin from "puppeteer-extra-plugin-recaptcha";
import express from "express";
import http from "http";
import { Server } from "socket.io";
//import SmartProxyPlugin from 'zyte-smartproxy-plugin';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
  transports: ["websocket"],
});

const user = {
  username: "justingarnerphotography",
  password: "Sunglasses19",
};

io.on("connection", (socket) => {
  console.log("someone connected");
  socket.on("loadChats", () => {
    puppeteer
      .launch({
        headless: false,
      })
      .then(async (browser) => {
        const page = await browser.newPage({ ignoreHTTPSErrors: true });

        await page.setViewport({
          width: 1920,
          height: 1080,
          deviceScaleFactor: 1,
        });

        await page.goto("https://www.instagram.com", { timeout: 180000 });

        await page.waitForSelector("input[name=username]", { visible: true });
        await delay(100);
        await page.type("input[name=username]", user.email || user.username, {
          delay: 50,
        });

        await delay(100);
        await page.type("input[name=password]", user.password, { delay: 50 });

        await delay(100);
        const [signin] = await page.$x('//button[contains(.,"Log in")]');
        await signin.click({ delay: 30 });

        await page.waitForNavigation();

        await page.goto("https://www.instagram.com/direct/inbox/");

        await page.waitForSelector("button._a9--._a9_1");

        await page.click("button._a9--._a9_1");

        await page.waitForSelector("span.x1lliihq.x193iq5w.x6ikm8r.x10wlt62.xlyipyv.xuxw1ft");

        await delay(5000);

        // Wait for the <span> element to be visible
        await page.waitForSelector('span.x1lliihq.x193iq5w.x6ikm8r.x10wlt62.xlyipyv.xuxw1ft');

        // Get the text content of the <span> element
        const elements = await page.$$('.x1i10hfl');

        for (let element of elements) {
          if (element) {
            try {
              const profilePic = await element.$eval('img', img => img.getAttribute('src'));
              console.log('Profile Pic:', profilePic);
            } catch (error) {
              console.log('Profile Pic not found');
            }
          
            try {
              const name = await element.$eval('.x1lliihq', test => { return test.textContent.length;});
              console.log(name)
            } catch (error) {
              console.log('HNigger not found', error);
            }
          
            const activeTimeElement = await element.$('.x1lliihq');
            if (activeTimeElement) {
              try {
                const activeTime = await activeTimeElement.textContent;
                console.log('Active Time:', activeTime);
              } catch (error) {
                console.log('Error retrieving active time:', error);
              }
            } else {
              console.log('Active Time element not found');
            }
          } else {
            console.log('Element not found');
          }
        }

        //await page.waitForSelector("img.x5yr21d");
        //delay(1000);
        //const chatProfilePics = await page.$$('img.x5yr21d');

        browser.close();
      });

    socket.emit("sendChats", ["asdfsadf", "asdfasdf", "asdfasdf"]);
  })

  //when the actaul window opens, "load" is emmited, done this way so each time user loads page puppeteer is launched once instead of twice
  socket.on("load", (data) => {
    puppeteer
      .launch({
        headless: false,
      })
      .then(async (browser) => {
        const page = await browser.newPage({ ignoreHTTPSErrors: true });
        await page.goto("https://www.instagram.com/accounts/login/?hl=en"); // For First Connection With Proxy May need to Add -> {timeout: 180000}

        //for cookies
        //await page.waitForSelector('._a9_0')
        //await page.click('._a9_0');
        //await page.waitForTimeout(5000);

        //login functionality
        await page.waitForSelector("input[name=username]", { visible: true });
        await delay(100);
        await page.type("input[name=username]", user.email || user.username, {
          delay: 50,
        });
        await delay(100);
        await page.type("input[name=password]", user.password, { delay: 50 });
        await delay(100);
        const [signin] = await page.$x('//button[contains(.,"Log in")]');
        await signin.click({ delay: 30 });


        await page.waitForNavigation();

        /* //for captcha cracking however typically when captcha is requested, even if solved correctly, you won't be able to login
        console.log('about to look for captcha');
        //If any catchas, will solve them
        for (const frame of page.mainFrame().childFrames()) {
            const { solved, error } = await frame.solveRecaptchas();
            if(solved){
                delay(1000);
                await page.waitForSelector('.x1i10hfl');  // Wait for the button to be visible
                await page.click('.x1i10hfl', { delay: 30 });
                await delay(5000);
                await page.reload();
            }
        }
        await page.waitForTimeout(5000);
        */

        await page.goto(`https://www.instagram.com/justinfilms_/`);

        await page.waitForSelector("[role=button]");

        const btns = await page.$$("[role=button]");
        for (let btn of btns) {
          const text = await btn.evaluate((el) => el.textContent);
          if (text === "Message") {
            await btn.click({ delay: 30 });
            break;
          }
        }

        await page.waitForSelector("button._a9--._a9_1");
        await page.click("button._a9--._a9_1");

        await page.waitForSelector(
          "div.x1tlxs6b div.xzsf02u, div.x1tlxs6b div.x14ctfv",
          { visible: true }
        );

        //Gets the messages from the current chat and emits them to user
        let messages = await page.$$eval(
          "div.x1tlxs6b div.xzsf02u, div.x1tlxs6b div.x14ctfv",
          (elements) => {
            return elements.map((element) => {
              let sender;
              const messageText = element.textContent
              if (element.classList.contains("x14ctfv")) {
                return `You: ${messageText}`;
              }else{
                return `op87252: ${messageText}`;
              };
              ;
            });
          }
        );
        socket.emit("loadMessages", messages);

        //Finds the users chats
        /*
        await page.waitForTimeout(2000);
        await page.waitForSelector("img.x5yr21d.xl1xv1r.xh8yej3");
        const chats = await page.$$("img.x5yr21d.xl1xv1r.xh8yej3");

        //Clicks on the first chat
        await chats[1].click({ delay: 30 });
        */

        //Should handel multiple messages at a time, but needs to be fixed
        const messageQueue = [];
        const processMessage = async () => {
          if (messageQueue.length > 0) {
            const { message, otherUser } = messageQueue.shift();
            console.log("sending message", message);
            const input = await page.$(".x1qjc9v5 .xzsf02u");
            await input.type(message, { delay: 100 });
            await page.waitForSelector(
              ".x1i10hfl.xjqpnuy.xa49m3k.xqeqjp1.x2hbi6w.xdl72j9.x2lah0s.xe8uvvx.xdj266r.xat24cr.x1mh8g0r.x2lwn1j.xeuugli.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1q0g3np.x1lku1pv.x1a2a7pz.x6s0dn4.xjyslct.x1ejq31n.xd10rxx.x1sy0etr.x17r0tee.x9f619.x1ypdohk.x1i0vuye.x1f6kntn.xwhw2v2.xl56j7k.x17ydfre.x2b8uid.xlyipyv.x87ps6o.x14atkfc.xcdnw81.xjbqb8w.xm3z3ea.x1x8b98j.x131883w.x16mih1h.x972fbf.xcfux6l.x1qhh985.xm0m39n.xt0psk2.xt7dq6l.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.x1n5bzlp.x173jzuc.x1yc6y37.xfs2ol5"
            );
            await page.click(
              ".x1i10hfl.xjqpnuy.xa49m3k.xqeqjp1.x2hbi6w.xdl72j9.x2lah0s.xe8uvvx.xdj266r.xat24cr.x1mh8g0r.x2lwn1j.xeuugli.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1q0g3np.x1lku1pv.x1a2a7pz.x6s0dn4.xjyslct.x1ejq31n.xd10rxx.x1sy0etr.x17r0tee.x9f619.x1ypdohk.x1i0vuye.x1f6kntn.xwhw2v2.xl56j7k.x17ydfre.x2b8uid.xlyipyv.x87ps6o.x14atkfc.xcdnw81.xjbqb8w.xm3z3ea.x1x8b98j.x131883w.x16mih1h.x972fbf.xcfux6l.x1qhh985.xm0m39n.xt0psk2.xt7dq6l.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.x1n5bzlp.x173jzuc.x1yc6y37.xfs2ol5"
            );
            messages.push(`You: ${message}`);
            // Process the next message in the queue
            await processMessage();
          }
        };

        //When user emits a message, put it to the queue
        socket.on("sendMessage", (message, otherUser) => {
          messageQueue.push({ message, otherUser });
          if (messageQueue.length === 1) {
            processMessage();
          }
        });

        //Checks for new messages every 2 seconds
        async function checkForNewMessages() {
          let m = await page.$$eval(
            'div[style*="background-color: rgb(var(--ig-highlight-background))"]',
            (elements) => {
              return elements.map((element) => {
                return element.textContent;
              });
            }
          );

          for (let msg of m) {
            if (!messages.includes(msg)) {
              messages.push(msg);
              socket.emit("newMessage", msg);
            }
          }
        }
        setInterval(async () => {
          checkForNewMessages();
        }, 2000);
      });
  });

  socket.on("disconnect", () => {
    //should close puppeteer
    console.log("someone disconnected");
  });
});

//puppeteer.use(SmartProxyPlugin({
//spm_apikey: 'f49b002e803b4fa78261293b537be925',
//}));

puppeteer.use(
  RecaptchaPlugin({
    provider: {
      id: "2captcha",
      token: "0d44bcf2a4b9dc30d39fe983da29fb3a",
    },
  })
);

let getRecentMessages = async (browser, user, opts) => {
  const page = await browser.newPage({ ignoreHTTPSErrors: true });
  await page.goto("https://www.instagram.com", { timeout: 180000 });

  await page.waitForSelector("input[name=username]", { visible: true });
  await delay(100);
  await page.type("input[name=username]", user.email || user.username, {
    delay: 50,
  });

  await delay(100);
  await page.type("input[name=password]", user.password, { delay: 50 });

  await delay(100);
  const [signin] = await page.$x('//button[contains(.,"Log in")]');
  await signin.click({ delay: 30 });

  await page.waitForTimeout(5000);

  /*
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
    */

  await page.goto("https://www.instagram.com/direct/inbox/");

  await page.waitForTimeout(5000);

  const popupExists = await page.$("div._a9-v");
  if (popupExists) {
    await page.click("button._a9--._a9_1");
    await page.waitForTimeout(5000); // Click the button
  }

  await page.waitForTimeout(5000);

  const chats = await page.$$("img.x5yr21d");

  if (chats) {
    await chats[1].click({ delay: 30 });
  }

  await page.waitForTimeout(5000);

  const messages = await page.$$eval(
    "div.x1tlxs6b div.xzsf02u, div.x1tlxs6b div.x14ctfv",
    (elements) => {
      return elements.map((element) => {
        const sender = element.classList.contains("x14ctfv")
          ? "you"
          : "other person";
        const messageText = element.textContent;
        return `${sender}: ${messageText}`;
      });
    }
  );

  return messages;
};

let sendMessage = async (browser, user, opts, message, recipient) => {
  const page = await browser.newPage({ ignoreHTTPSErrors: true });
  await page.goto("https://www.instagram.com/", { timeout: 180000 });

  await page.waitForSelector("input[name=username]", { visible: true });
  await delay(100);
  await page.type("input[name=username]", user.email || user.username, {
    delay: 50,
  });

  await delay(100);
  await page.type("input[name=password]", user.password, { delay: 50 });

  await delay(100);
  const [signin] = await page.$x('//button[contains(.,"Log in")]');
  await signin.click({ delay: 30 });

  await page.waitForTimeout(5000);

  await page.goto(`https://www.instagram.com/${recipient}/`);

  await page.waitForTimeout(5000);

  const btns = await page.$$("[role=button]");
  for (let btn of btns) {
    const text = await btn.evaluate((el) => el.textContent);
    if (text === "Message") {
      await btn.click({ delay: 30 });
      break;
    }
  }

  await page.waitForTimeout(5000);

  const popupExists = await page.$("div._a9-v");
  if (popupExists) {
    await page.click("button._a9--._a9_1");
    await page.waitForTimeout(5000); // Click the button
  }

  await page.waitForTimeout(5000);

  const input = await page.$(".x1qjc9v5 .xzsf02u");

  await input.type(message, { delay: 100 });

  await page.click(
    "div.x1i10hfl.xjqpnuy.xa49m3k.xqeqjp1.x2hbi6w.xdl72j9.x2lah0s.xe8uvvx.xdj266r.xat24cr.x1mh8g0r.x2lwn1j.xeuugli.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1q0g3np.x1lku1pv.x1a2a7pz.x6s0dn4.xjyslct.x1ejq31n.xd10rxx.x1sy0etr.x17r0tee.x9f619.x1ypdohk.x1i0vuye.x1f6kntn.xwhw2v2.xl56j7k.x17ydfre.x2b8uid.xlyipyv.x87ps6o.x14atkfc.xcdnw81.xjbqb8w.xm3z3ea.x1x8b98j.x131883w.x16mih1h.x972fbf.xcfux6l.x1qhh985.xm0m39n.xt0psk2.xt7dq6l.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.x1n5bzlp.x173jzuc.x1yc6y37.xfs2ol5"
  );
};

app.get("/", (req, res) => {
  res.send("hello");
});

app.get("/getmessages", (req, res) => {
  res.send("Getting the messages");
  puppeteer
    .launch({
      headless: false,
    })
    .then(async (browser) => {
      getRecentMessages(browser, user);
    });
});

app.get("/sendmessage", (req, res) => {
  res.send("Sending the messages");
  puppeteer
    .launch({
      headless: false,
      args: [
        "--disable-features=IsolateOrigins,site-per-process,SitePerProcess",
        "--flag-switches-begin --disable-site-isolation-trials --flag-switches-end",
      ],
    })
    .then(async (browser) => {
      sendMessage(browser, user, {}, "yo mama", "justinfilms_");
    });
});

const port = process.env.PORT || 80;
server.listen(port, () => {
  console.log("Launched");
});
