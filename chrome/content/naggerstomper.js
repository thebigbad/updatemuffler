var noscriptnag = /^http:\/\/noscript.net\/\?ver=.*&prev=.*/;

window.addEventListener(
  "load",
  function () {
    gBrowser.tabContainer.addEventListener(
      "TabOpen",
      function (event) {
        var tab = event.target;
        var browser = gBrowser.getBrowserForTab(tab);
        browser.addEventListener(
          "pageshow",
          function (event) {
            var window = event.originalTarget.defaultView;
            if (window.location.href.match(noscriptnag)) {
              gBrowser.removeTab(tab);
            }
          },
          false
        );
      },
      false
    );
  },
  false
);
