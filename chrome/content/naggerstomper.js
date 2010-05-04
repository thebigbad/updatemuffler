new function () {
  // TODO: nice UI for adding patterns

  var getNaggers = function () {
    // Get the "extensions.myext." branch
    var prefService = Components.classes["@mozilla.org/preferences-service;1"].
        getService(Components.interfaces.nsIPrefService);
    var prefBranch = prefService.getBranch("extensions.naggerstomper.naggers.");
    var keys = prefBranch.getChildList("", {});
    return keys.map(function (key) {
      return new RegExp(prefBranch.getCharPref(key));
    });
  };

  var isNag = function (url) {
    return getNaggers().some(function (regex) { return url.match(regex); });
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
