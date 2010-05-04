new function () {
  // TODO: #updatemuffler-menuitem command handler for updating blacklist

  var getBlacklist = function () {
    var prefService = Components.classes["@mozilla.org/preferences-service;1"].
        getService(Components.interfaces.nsIPrefService);
    var prefBranch = prefService.
        getBranch("extensions.updatemuffler.blacklist.");
    var keys = prefBranch.getChildList("", {});
    return keys.map(function (key) {
      return new RegExp(prefBranch.getCharPref(key));
    });
  };

  var isBlacklisted = function (url) {
    return getBlacklist().some(function (regex) { return url.match(regex); });
  };

  var closeTabIfBlacklisted = function (tab) {
    var browser = gBrowser.getBrowserForTab(tab);
    browser.addEventListener(
      "pageshow",
      function (event) {
        var url = event.originalTarget.defaultView.location.href;
        if (url === "about:blank") {
          return;
        }
        if (isBlacklisted(url)) {
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
          closeTabIfBlacklisted(event.target);
        },
        false
      );
    },
    false
  );
}
