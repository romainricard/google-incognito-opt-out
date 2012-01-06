async function handleWindowCreated() {

  let windowInfo = await browser.windows.getCurrent();
  if (!windowInfo.incognito) {
    return
  }

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

// runtime.onStartup would have been ideal, but it is not fired on private browsing windows, see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onStartup
browser.windows.onCreated.addListener(handleWindowCreated)