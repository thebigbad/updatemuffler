new function () {
  // TODO: nice UI for adding patterns
  var nagRegexes = [
    /^http:\/\/noscript.net\/\?ver=.*&prev=.*/,
  ];

  var isNag = function (url) {
    return nagRegexes.some(function (reg) { return url.match(reg); });
  };

  var closeTabIfNag = function (tab) {
    var browser = gBrowser.getBrowserForTab(tab);
    browser.addEventListener(
      "pageshow",
      function (event) {
        var url = event.originalTarget.defaultView.location.href;
        if (url === "about:blank") {
          return;
        }
        if (isNag(url)) {
          gBrowser.removeTab(tab);
        }
        browser.removeEventListener("pageshow", arguments.callee, false);
      },
      false
    );
  };

  window.addEventListener(
    "load",
    function () {
      gBrowser.tabContainer.addEventListener(
        "TabOpen",
        function (event) {
          closeTabIfNag(event.target);
        },
        false
      );
    },
    false
  );
}
