/* prebid-universal-creative v0.1.0
Updated : 2018-02-05 */
var pbjs={};function getEmptyIframe(e,t){var r=document.createElement("iframe");return r.setAttribute("FRAMEBORDER",0),r.setAttribute("SCROLLING","no"),r.setAttribute("MARGINHEIGHT",0),r.setAttribute("MARGINWIDTH",0),r.setAttribute("TOPMARGIN",0),r.setAttribute("LEFTMARGIN",0),r.setAttribute("ALLOWTRANSPARENCY","true"),r.setAttribute("width",t),r.setAttribute("height",e),r}function renderLegacy(e,t){var r=window;for(i=0;i<10;i++)if((r=r.parent).pbjs)try{r.pbjs.renderAd(document,t);break}catch(e){continue}}function renderCrossDomain(e,t){var r=document.createElement("a");r.href=t;var n,o=r.protocol+"//"+r.host,i=r.protocol+"//tpc.googlesyndication.com";function d(t){var r=t.message?"message":"data",n={};try{n=JSON.parse(t[r])}catch(e){return}var i=t.origin||t.originalEvent.origin;if(n.message&&"Prebid Response"===n.message&&o===i&&n.adId===e&&(n.ad||n.adUrl)){var d=window.document.body,s=n.ad,a=n.adUrl,c=n.width,u=n.height;if("video"===n.mediaType)console.log("Error trying to write ad.");else if(s){var A=document.createElement("iframe");A.setAttribute("FRAMEBORDER",0),A.setAttribute("SCROLLING","no"),A.setAttribute("MARGINHEIGHT",0),A.setAttribute("MARGINWIDTH",0),A.setAttribute("TOPMARGIN",0),A.setAttribute("LEFTMARGIN",0),A.setAttribute("ALLOWTRANSPARENCY","true"),A.setAttribute("width",c),A.setAttribute("height",u),d.appendChild(A),A.contentDocument.open(),A.contentDocument.write(s),A.contentDocument.close()}else a?d.insertAdjacentHTML("beforeend",'<IFRAME SRC="'+a+'" FRAMEBORDER="0" SCROLLING="no" MARGINHEIGHT="0" MARGINWIDTH="0" TOPMARGIN="0" LEFTMARGIN="0" ALLOWTRANSPARENCY="true" WIDTH="'+c+'" HEIGHT="'+u+'"></IFRAME>'):console.log("Error trying to write ad. No ad for bid response id: "+id)}}window.addEventListener("message",d,!1),n=JSON.stringify({message:"Prebid Request",adId:e,adServerDomain:i}),window.parent.postMessage(n,o)}function renderAmpAd(e,t){""===e&&(e="prebid.adnxs.com");sendRequest("https://"+e+"/pbc/v1/cache?uuid="+t,function(e){var t=JSON.parse(e);t.ad?writeAdHtml(t.ad):t.adUrl&&writeAdUrl(t.adUrl,t.height,t.width)})}function writeAdUrl(e,t,r){var n=getEmptyIframe(t,r);n.src=e,document.body.appendChild(n)}function writeAdHtml(e){for(var t=parseHtml(e),r=t.querySelectorAll("script"),n=0;n<r.length;n++)domEval(r[n].innerHTML),r[n].parentNode.removeChild(r[n]);for(var o=t.body.childNodes,i=0;i<o.length;i++)document.body.appendChild(o[i])}function isAMP(e){return"string"==typeof e.uuid&&isCrossDomain()}function isCrossDomain(){var e=!0;try{window.top.document,e=!1}catch(e){}return e}function domEval(e,t){var r=(t=t||document).createElement("script");r.text=e,t.head.appendChild(r)}function parseHtml(e){return(new DOMParser).parseFromString(e,"text/html")}function sendRequest(e,t){var r=new XMLHttpRequest;r.addEventListener("load",function(){t(r.responseText)}),r.open("GET",e),r.send()}pbjs.renderAd=function(e,t,r){isAMP(r)?(console.log("render AMP path"),renderAmpAd(r.host,r.uuid)):"object"!=typeof r||""===r.mediaType?isCrossDomain()?(console.log("cross domain render"),renderCrossDomain(t,r.pubUrl)):(console.log("legacy banner render"),renderLegacy(e,t)):renderLegacy(e,t)};