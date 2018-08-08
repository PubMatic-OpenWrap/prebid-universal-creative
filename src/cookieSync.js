const ENDPOINT = 'https://ow.pubmatic.com/cookie_sync';

function doBidderSync(type, url, bidder) {
  if (!url) {
    console.log(`No sync url for bidder "${bidder}": ${url}`);
  } else if (type === 'image' || type === 'redirect') {
    console.log(`Invoking image pixel user sync for bidder: "${bidder}"`);
    triggerPixel(url);
  } else if (type == 'iframe') {
    // TODO test iframe solution
    console.log(`Invoking Iframe pixel for bidder" + "${bidder}"`);
    insertUserSyncIframe(url);
  } else {
    console.log(`User sync type "${type}" not supported for bidder: "${bidder}"`);
  }
}

function triggerPixel(url) {
  const img = new Image();
  img.src = url;
}

function insertUserSyncIframe(url) {
  let iframe = document.createElement('iframe');
  iframe.src = url;
  insertElement(iframe);
};

function insertElement(elm, doc, target) {
  doc = doc || document;
  let elToAppend;
  if (target) {
    elToAppend = doc.getElementsByTagName(target);
  } else {
    elToAppend = doc.getElementsByTagName('head');
  }
  try {
    elToAppend = elToAppend.length ? elToAppend : doc.getElementsByTagName('body');
    if (elToAppend.length) {
      elToAppend = elToAppend[0];
      elToAppend.insertBefore(elm, elToAppend.firstChild);
    }
  } catch (e) {}
};


function process(response) {
  let result = JSON.parse(response);
  if (result.status.toLowerCase() === 'ok' || result.status.toLowerCase() === 'no_cookie') {
    if (result.bidder_status) {
      result.bidder_status.forEach(bidder => {
        if (bidder.no_cookie) {
          doBidderSync(bidder.usersync.type, bidder.usersync.url, bidder.bidder);
        }
      });
    }
  }
}

function ajax(url, callback, data, options = {}) {
  try {
    let timeout = 3000;
    let x;
    let method = options.method || (data ? 'POST' : 'GET');

    let callbacks = typeof callback === 'object' ? callback : {
      success: function () {
        console.log('xhr success');
      },
      error: function (e) {
        console.log('xhr error', null, e);
      }
    };

    if (typeof callback === 'function') {
      callbacks.success = callback;
    }

    x = new window.XMLHttpRequest();
    x.onreadystatechange = function () {
      if (x.readyState === 4) {
        let status = x.status;
        if ((status >= 200 && status < 300) || status === 304) {
          callbacks.success(x.responseText, x);
        } else {
          callbacks.error(x.statusText, x);
        }
      }
    };
    x.ontimeout = function () {
      console.log('xhr timeout after ', x.timeout, 'ms');
    };

    if (method === 'GET' && data) {
      let urlInfo = parseURL(url, options);
      Object.assign(urlInfo.search, data);
      url = formatURL(urlInfo);
    }

    x.open(method, url);
    // IE needs timoeut to be set after open - see #1410
    x.timeout = timeout;

    if (options.withCredentials) {
      x.withCredentials = true;
    }
    if (options.preflight) {
      x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    }
    x.setRequestHeader('Content-Type', options.contentType || 'text/plain');

    if (method === 'POST' && data) {
      x.send(data);
    } else {
      x.send();
    }
  } catch (error) {
    console.log('xhr construction', error);
  }
}

function getUrlParam(paramName) {
  if (paramName && paramName.length > 0) {
    var sPageURL = window.location.search.substring(1);
    if (sPageURL) {
      var sURLVariables = sPageURL.split('&');
      for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName && sParameterName.length == 2 && sParameterName[0] == paramName) {
          return sParameterName[1];
        }
      }
    }
  }
}

function getBidders() {
  var bidders = getUrlParam("bidders");
  if (bidders && bidders.length > 0) {
    var bidderArray = bidders.split(",");
    if (bidderArray && bidderArray.length > 0) {
      return bidderArray;
    } else {
      return [
        "appnexus",
        "audienceNetwork",
        "pubmatic",
        "rubicon",
        "pulsepoint",
        "indexExchange",
        "lifestreet"
      ];
    }
  }
}


var data = JSON.stringify({
  "uuid": "pubmatic" + (Math.random() * 10000).toFixed(4),
  "pubid": getUrlParam("pubid") || 0,
  "profid": getUrlParam("profid") || 0,
  "bidders": getBidders()
});

var ajaxConfig = {
  withCredentials: true
};

ajax(ENDPOINT, process, data, ajaxConfig);