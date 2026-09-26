(function(){
  var me=document.currentScript,wantsPixel=me&&me.hasAttribute('data-pixel'),KEY='bv-consent';
  var state={region:'other',choice:null,pixel:false};window.bvConsent=state;
  var tz='';try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||''}catch(e){}
  var EXTRA=['Atlantic/Canary','Atlantic/Madeira','Atlantic/Azores','Atlantic/Reykjavik','Atlantic/Faroe','Arctic/Longyearbyen'];
  var eu=/^Europe\//.test(tz)||EXTRA.indexOf(tz)>-1||/[?&]cc=eu\b/.test(location.search);
  state.region=eu?'eu':'other';
  function read(){try{return localStorage.getItem(KEY)}catch(e){return null}}
  function save(v){try{localStorage.setItem(KEY,v)}catch(e){}}
  state.choice=read();
  var LIVE=['galapago.io','www.galapago.io'],live=LIVE.indexOf(location.hostname)>-1;
  function loadPixel(){
    if(!wantsPixel||!live||state.pixel||navigator.globalPrivacyControl)return;state.pixel=true;
    !function(w,d,s,u){if(w.oaiq)return;var q=function(){q.q.push(arguments)};q.q=[];w.oaiq=q;var j=d.createElement(s);j.async=1;j.src=u;var f=d.getElementsByTagName(s)[0];f.parentNode.insertBefore(j,f)}(window,document,"script","https://bzrcdn.openai.com/sdk/oaiq.min.js");oaiq("init",{pixelId:"CDkTxyLtUjWGNPydeTCRzG",debug:false});
  }
  var bar=null;
  function close(){if(bar){bar.remove();bar=null}document.documentElement.classList.remove('cc-open')}
  function choose(v){state.choice=v;save(v);close();if(v==='granted')loadPixel();else if(state.pixel)location.reload()}
  function open(){
    if(bar||!document.body)return;
    var base=me&&me.getAttribute('src').indexOf('../')===0?'../':'';
    bar=document.createElement('div');bar.className='cc';bar.setAttribute('role','dialog');bar.setAttribute('aria-label','Cookie consent');
    bar.innerHTML='<p><b>Cookies.</b> This site uses one advertising pixel (OpenAI Ads) to see whether our ads lead to inquiries. '+(eu?'It stays off unless you accept.':'It is on unless you reject it.')+' <a href="'+base+'privacy/#cookies">Privacy Notice</a></p>'+
      '<div class="cc-btns"><button type="button" data-v="denied">Reject</button><button type="button" data-v="granted">Accept</button></div>';
    bar.addEventListener('click',function(e){var b=e.target.closest('button[data-v]');if(b)choose(b.dataset.v)});
    document.body.appendChild(bar);document.documentElement.classList.add('cc-open');
  }
  window.bvCookieSettings=open;
  if(eu?state.choice==='granted':state.choice!=='denied')loadPixel();
  function ready(){
    if(eu&&!state.choice&&!navigator.globalPrivacyControl)open();
    document.querySelectorAll('.cc-link').forEach(function(l){l.addEventListener('click',function(e){e.preventDefault();open()})});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready);else ready();
})();
