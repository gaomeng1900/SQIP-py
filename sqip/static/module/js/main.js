var getScrollHeight, getScrollTop, getWindowHeight;

getScrollTop = function() {
  var bodyScrollTop, documentScrollTop, scrollTop;
  scrollTop = 0;
  bodyScrollTop = 0;
  documentScrollTop = 0;
  if (document.body) {
    bodyScrollTop = document.body.scrollTop;
  }
  if (document.documentElement) {
    documentScrollTop = document.documentElement.scrollTop;
  }
  if (bodyScrollTop - documentScrollTop > 0) {
    return bodyScrollTop;
  } else {
    return documentScrollTop;
  }
};

getScrollHeight = function() {
  var bodyScrollHeight, documentScrollHeight, scrollHeight;
  scrollHeight = 0;
  bodyScrollHeight = 0;
  documentScrollHeight = 0;
  if (document.body) {
    bodyScrollHeight = document.body.scrollHeight;
  }
  if (document.documentElement) {
    documentScrollHeight = document.documentElement.scrollHeight;
  }
  if (bodyScrollHeight - documentScrollHeight > 0) {
    return bodyScrollHeight;
  } else {
    return documentScrollHeight;
  }
};

getWindowHeight = function() {
  var windowHeight;
  windowHeight = 0;
  if (document.compatMode === "CSS1Compat") {
    windowHeight = document.documentElement.clientHeight;
  } else {
    windowHeight = document.body.clientHeight;
  }
  return windowHeight;
};
