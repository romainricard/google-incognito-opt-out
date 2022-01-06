async function doSetupCookies() {
  let gCookie = await browser.cookies.get({
    name: 'CONSENT',
    url: 'https://google.com',
    storeId: 'firefox-private'
  });

  if (!gCookie || gCookie?.value.startsWith('PENDING')) {
    browser.cookies.set({
      name: 'CONSENT',
      url: 'https://www.google.com/',
      domain: '.google.com',
      secure: true,
      value: 'YES+111',
      storeId: 'firefox-private'
    });
    browser.cookies.set({
      name: 'ANID',
      url: 'https://www.google.com/',
      domain: '.google.com',
      secure: true,
      httpOnly: true,
      value: 'OPT_OUT',
      storeId: 'firefox-private'
    });
  }
}


async function handleTabCreatedAndroid() {
  await doSetupCookies();
}

async function handleWindowCreatedDesktop() {
  let windowInfo = await browser.windows.getCurrent();
  if (!windowInfo.incognito) {
    return
  }
  await doSetupCookies();
}


async function setup() {
  let platform = await browser.runtime.getPlatformInfo()

  if (platform.os === "android") {
    browser.tabs.onCreated.addListener(handleTabCreatedAndroid)
  } else {
    // runtime.onStartup would have been ideal, but it is not fired on private browsing windows, see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onStartup
    browser.windows.onCreated.addListener(handleWindowCreatedDesktop)
  }
}

setup();
