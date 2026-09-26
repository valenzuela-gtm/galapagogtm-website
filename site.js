(function(){
  'use strict';
  var root=document.documentElement, reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s,c){return (c||document).querySelector(s)}
  function $$(s,c){return [].slice.call((c||document).querySelectorAll(s))}
  function clamp(v,a,b){return v<a?a:v>b?b:v}
  function pad(n){return (n<10?'0':'')+n}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  var jump=reduce?'auto':'smooth';
  var TKEY='bv-theme';
  function syncTheme(){
    var cur=root.getAttribute('data-theme')||'system';
    $$('[data-theme-set]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.themeSet===cur))});
    window.dispatchEvent(new Event('bv-theme'));
  }
  $$('[data-theme-set]').forEach(function(b){b.addEventListener('click',function(){
    var v=b.dataset.themeSet;
    if(v==='light'||v==='dark')root.setAttribute('data-theme',v);else root.removeAttribute('data-theme');
    try{if(v==='light'||v==='dark')localStorage.setItem(TKEY,v);else localStorage.removeItem(TKEY)}catch(e){}
    syncTheme();
  })});
  try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',syncTheme)}catch(e){}
  try{new MutationObserver(syncTheme).observe(root,{attributes:true,attributeFilter:['data-theme']})}catch(e){}
  syncTheme();
  var nav=$('#nav'),menu=$('.menu-btn');
  function closeMenu(){if(!nav)return;nav.classList.remove('open');if(menu){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open menu')}}
  if(menu)menu.addEventListener('click',function(e){e.stopPropagation();var o=!nav.classList.contains('open');nav.classList.toggle('open',o);menu.setAttribute('aria-expanded',String(o));menu.setAttribute('aria-label',o?'Close menu':'Open menu')});
  $$('#navLinks a').forEach(function(a){a.addEventListener('click',closeMenu)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu()});
  document.addEventListener('click',function(e){if(nav&&nav.classList.contains('open')&&!nav.contains(e.target))closeMenu()});
  if('IntersectionObserver' in window){
    var links=$$('#navLinks a[href^="#"]');
    var spy=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var id='#'+e.target.id;links.forEach(function(a){a.setAttribute('aria-current',String(a.getAttribute('href')===id))})})},{rootMargin:'-45% 0px -50% 0px'});
    links.forEach(function(a){var t=document.getElementById(a.getAttribute('href').slice(1));if(t)spy.observe(t)});
  }
  if(!reduce&&'IntersectionObserver' in window){
    var R=$$('.sec-head,.pf-body,.q-feature,.osq,.offer,.os-copy,.ring,.about-photo,.about-copy,.names,.phase,.faq-side,.faq,.rep,.form-card,.start-links,.center-cta,.board,.three,.stat,.vc-card,.when,.cta-block,.valleys,.split>div,.flow');
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var el=e.target;io.unobserve(el);el.classList.add('in');
      setTimeout(function(){el.classList.remove('rv','in');el.style.transitionDelay=''},1400)})},{rootMargin:'0px 0px -7% 0px'});
    R.forEach(function(el){if(el.getBoundingClientRect().top<innerHeight*.94)return;var sib=el.parentNode?[].indexOf.call(el.parentNode.children,el):0;
      el.style.transitionDelay=Math.min(Math.max(sib,0),4)*90+'ms';el.classList.add('rv');io.observe(el)});
  }
  var block=$('#f-block');
  if(block)block.addEventListener('input',function(){block.dataset.auto='0'});
  function prefill(text){if(!block)return;if(block.value.trim()&&block.dataset.auto!=='1')return;block.value=text;block.dataset.auto='1'}
  var PICK=[
    ["I'd turn what your best sellers do into plays the whole team can run.",3,'project'],
    ["I'd get Sales, Marketing and Customer Success working from one plan and one set of numbers.",6,'workshop'],
    ["I'd rebuild the forecast deal by deal, from what buyers actually decided.",3,'pillar'],
    ["I'd sharpen who you sell to and why you win, so the price holds.",2,'pillar'],
    ["I'd define the result each customer should see, and track it long before renewal.",4,'pillar'],
    ["I'd rank where growth really comes from and help you drop what doesn't feed it.",1,'planning'],
    ["I'd get the leadership team in one room and out with one plan everyone owns.",7,'workshop'],
    ["I'd find why accounts leave and fix what happens after the sale.",4,'project'],
    ["I'd study the deals you lose, then change who you target and what you say.",0,'consulting'],
    ["I'd get you in front of buyers earlier, with a point of view and outreach that open the door.",2,'project'],
    ["I'd give the team a weekly rhythm, clear targets and plays to run.",7,'fractional'],
    ["I'd pick the bigger accounts worth chasing and build the motion to win them.",0,'project'],
    ["I'd shape the story analysts repeat and plan who to brief first.",2,'consulting'],
    ["I'd build a point of view only you can own, and put it in every pitch.",2,'workshop'],
    ["I'd map what the platform sells, to whom, and what changes in pricing and the team.",5,'advisory']
  ];
  var BOOK='https://calendar.app.google/8w8zWqUnUmuJ1XWT9';
  var PILLARS=['Total Relevant Market','Market Investment Map','Brand & Demand','Pipeline Velocity','Customer Time-to-Value','Customer Expansion','Revenue Operations','Leadership & Management'];
  var OFFER={build:'Build',fix:'Fix',scale:'Scale'}, ORDER=['build','fix','scale'];
  var START={planning:'GTM Planning Session',pillar:'GTM OS Pillar Work',workshop:'Workshop',consulting:'Consulting',advisory:'Strategy & Advisory',fractional:'Fractional GTM Operator'};
  function groupOf(k){return k<3?'build':k<5?'fix':'scale'}
  function startFor(list){
    if(list.length===1){var s=PICK[list[0]];return s[2]==='project'?OFFER[groupOf(s[1])]+' Project':START[s[2]]}
    var keys=list.map(function(i){return PICK[i][2]}),groups=[];
    list.forEach(function(i){var g=groupOf(PICK[i][1]);if(groups.indexOf(g)<0)groups.push(g)});
    if(keys.every(function(k){return k===keys[0]})&&keys[0]!=='project')return START[keys[0]];
    if(groups.length===1)return OFFER[groups[0]]+' Project';
    return START.planning;
  }
  var grid=$('#pfGrid');
  if(grid){
    var cards=$$('.pf-card',grid),picks=[],filter='all',expanded=false,limitT=0;
    var out=$('#pfOut'),count=$('#pfCount'),more=$('#pfMore'),panel=$('#pfPanel'),bar=$('#pfBar'),barN=$('#pfBarN');
    var EMPTY=out.innerHTML,phone=matchMedia('(max-width: 640px)'),panelSeen=true,lastStart='';
    function paint(){
      cards.forEach(function(c){var n=picks.indexOf(+c.dataset.i);c.setAttribute('aria-pressed',String(n>-1));c.querySelector('.pick').textContent=n>-1?String(n+1):''});
      grid.classList.toggle('full',picks.length===3);
      count.textContent=picks.length+' of 3';
      if(barN)barN.textContent=picks.length+' of 3';
      if(!picks.length){out.innerHTML=EMPTY;lastStart='';showBar();return}
      var groups=[],pills=[];
      picks.forEach(function(i){var k=PICK[i][1],g=groupOf(k);if(groups.indexOf(g)<0)groups.push(g);if(pills.indexOf(k)<0)pills.push(k)});
      groups.sort(function(a,b){return ORDER.indexOf(a)-ORDER.indexOf(b)});pills.sort(function(a,b){return a-b});
      lastStart=startFor(picks);
      var h='<ol class="pf-list">'+picks.map(function(i,n){return '<li><b>'+(n+1)+'</b><span>'+esc(PICK[i][0])+'</span></li>'}).join('')+'</ol>';
      h+='<div class="pf-tags">'+groups.map(function(g){return '<span class="tag o '+g+'">'+OFFER[g]+'</span>'}).join('')+pills.map(function(k){return '<span class="tag">'+pad(k+1)+' '+esc(PILLARS[k])+'</span>'}).join('')+'</div>';
      h+='<p class="pf-start">We\'ll likely start with:<strong>'+esc(lastStart)+'</strong></p>';
      h+='<p class="pf-note">Book a free diagnosis call and we\'ll scope it there.</p>';
      h+='<p class="pf-limit" id="pfLimit" hidden>Three is the most. Take one out to add another.</p>';
      h+='<div class="pf-actions"><a class="btn btn-primary" href="'+BOOK+'" target="_blank" rel="noopener noreferrer">Book my free diagnosis call <span class="arr">↗</span></a>'
        +'<div class="pf-more-row"><a class="pf-link" href="#start" id="pfGo">Or send it in writing</a><button type="button" class="pf-clear" id="pfClear">Clear</button></div></div>';
      out.innerHTML=h;
      $('#pfGo').addEventListener('click',function(){
        prefill('From your site: '+picks.map(function(i){return cards[i].querySelector('span').textContent}).join('; ')+'. Likely start: '+lastStart+'.');
      });
      $('#pfClear').addEventListener('click',function(){picks=[];paint()});
      showBar();
    }
    cards.forEach(function(c){c.addEventListener('click',function(){
      var i=+c.dataset.i,n=picks.indexOf(i);
      if(n>-1)picks.splice(n,1);
      else if(picks.length>=3){c.classList.remove('nope');void c.offsetWidth;c.classList.add('nope');var l=$('#pfLimit');if(l){l.hidden=false;clearTimeout(limitT);limitT=setTimeout(function(){l.hidden=true},2600)}return}
      else picks.push(i);
      paint();
    })});
    function applyFilter(){
      var lim=phone.matches&&filter==='all'&&!expanded?6:99;
      cards.forEach(function(c,idx){c.hidden=!(filter==='all'||c.dataset.g===filter)||(filter==='all'&&idx>=lim)});
      more.hidden=!(phone.matches&&filter==='all');
      more.textContent=expanded?'Show fewer':'See all 15';
    }
    $$('.pf-filters .chip').forEach(function(ch){ch.addEventListener('click',function(){
      filter=ch.dataset.f;$$('.pf-filters .chip').forEach(function(x){x.setAttribute('aria-pressed',String(x===ch))});applyFilter();
    })});
    more.addEventListener('click',function(){expanded=!expanded;applyFilter()});
    try{phone.addEventListener('change',applyFilter)}catch(e){}
    applyFilter();
    function showBar(){if(bar)bar.classList.toggle('on',picks.length>0&&!panelSeen)}
    if(bar&&'IntersectionObserver' in window){
      new IntersectionObserver(function(es){panelSeen=es[0].isIntersecting;showBar()},{threshold:.25}).observe(panel);
      $('#pfBarGo').addEventListener('click',function(){panel.scrollIntoView({behavior:jump,block:'center'})});
    }
  }
  var bt=$('#bridgeText'),words=[];
  if(bt&&!reduce){
    (function split(el){[].slice.call(el.childNodes).forEach(function(n){
      if(n.nodeType===3){var f=document.createDocumentFragment();n.textContent.split(/(\s+)/).forEach(function(t){if(!t)return;if(/^\s+$/.test(t))f.appendChild(document.createTextNode(t));else{var s=document.createElement('span');s.className='w';s.textContent=t;f.appendChild(s)}});el.replaceChild(f,n)}
      else if(n.nodeType===1)split(n);
    })})(bt);
    words=$$('.w',bt);
  }
  function lightWords(){
    if(!words.length)return;
    var r=bt.getBoundingClientRect(),p=clamp((innerHeight*.92-r.top)/(r.height+innerHeight*.42),0,1),n=Math.round(p*words.length*1.2);
    words.forEach(function(w,i){w.classList.toggle('on',i<n)});
  }
  var qf=$('#qFeature');
  if(qf){
    var items=$$('.q-item',qf),tabs=$$('.q-tab',qf),cur=0,timer=0,seen=false,hold=false,DUR=9000;
    function arm(){clearTimeout(timer);var t=tabs[cur];t.classList.remove('run');void t.offsetWidth;if(reduce||!seen||hold)return;t.classList.add('run');timer=setTimeout(function(){show(cur+1)},DUR)}
    function show(i){cur=(i+items.length)%items.length;
      items.forEach(function(q,k){var on=k===cur;q.classList.toggle('on',on);q.setAttribute('aria-hidden',String(!on))});
      tabs.forEach(function(t,k){var on=k===cur;t.setAttribute('aria-selected',String(on));t.tabIndex=on?0:-1;t.classList.remove('run')});
      arm()}
    tabs.forEach(function(t,k){t.addEventListener('click',function(){show(k)});
      t.addEventListener('keydown',function(e){var d=e.key==='ArrowRight'||e.key==='ArrowDown'?1:e.key==='ArrowLeft'||e.key==='ArrowUp'?-1:0;if(!d)return;e.preventDefault();show(cur+d);tabs[cur].focus()})});
    qf.addEventListener('mouseenter',function(){hold=true;qf.classList.add('hold');clearTimeout(timer)});
    qf.addEventListener('mouseleave',function(){hold=false;qf.classList.remove('hold');arm()});
    qf.addEventListener('focusin',function(){hold=true;clearTimeout(timer)});
    qf.addEventListener('focusout',function(){hold=false;arm()});
    if('IntersectionObserver' in window)new IntersectionObserver(function(es){seen=es[0].isIntersecting;arm()},{threshold:.35}).observe(qf);
  }
  $$('.marquee-track').forEach(function(t){
    var orig=[].slice.call(t.children),box=(t.parentNode.getBoundingClientRect().width||innerWidth)*1.1,g=0;
    function copy(k){var c=k.cloneNode(true);c.setAttribute('aria-hidden','true');t.appendChild(c)}
    while(t.scrollWidth<box&&g++<10)orig.forEach(copy);
    [].slice.call(t.children).forEach(copy);
  });
  var OS=[
    ['Are we chasing customers who are actually right for us?','Look at who buys, stays and gets value. Focus the team there.','Who to pursue, and who to stop chasing.'],
    ['Where should the next dollar go?','A new market, a different product, another hire. We look at the customers and the numbers before choosing where to spend.','Which opportunities deserve time and money.'],
    ['Why would a buyer choose you?','We look at what customers care about, what they hear from you, and whether your message gives them a reason to take the next step.','What to say, to whom, and how to reach them.'],
    ['Why do the same deals keep slipping?','We follow the actual deals from first conversation to decision and find where buyers stop moving.','What needs to change in the way your team sells.'],
    ['Do customers get what they came for?','A signed contract is only the start. We look at what happens after the sale and how quickly customers get the result they expected.','What needs to happen between the sale and a happy customer.'],
    ['Would your customers buy from you again?','We look at why customers stay, why they leave, and where you could help them solve another problem.','How to keep customers and earn more of their business.'],
    ['Can you trust the sales numbers?','We check whether the CRM and reports reflect the actual deals, and whether the team is working from the same information.','Which numbers to use and what to fix in the tools behind them.'],
    ['Does everyone know what they own?','We look at how leaders set priorities, how teams work together, and who is responsible when something falls between them.','Who does what, what comes first, and how we check progress.']
  ];
  var SPLIT=[['Total Relevant','Market'],['Market Investment','Map'],['Brand &','Demand'],['Pipeline','Velocity'],['Customer','Time-to-Value'],['Customer','Expansion'],['Revenue','Operations'],['Leadership &','Management']];
  var ring=$('#ring');
  if(ring){
    var nodes=$$('.r-node',ring),chips=$$('.pchip'),det=$('#osDetail');
    function set(id,v){var e=document.getElementById(id);if(e)e.textContent=v}
    function selectPillar(k,go){
      nodes.forEach(function(n){n.setAttribute('aria-pressed',String(+n.dataset.k===k))});
      chips.forEach(function(c){c.setAttribute('aria-pressed',String(+c.dataset.k===k))});
      var g=groupOf(k),a=(-90+45*k)*Math.PI/180,sp=$('#osSpoke');
      set('osNum',pad(k+1));set('osN1',SPLIT[k][0]);set('osN2',SPLIT[k][1]);
      set('osLabel',pad(k+1)+' · '+PILLARS[k]);set('osQ',OS[k][0]);set('osD',OS[k][1]);set('osX',OS[k][2]);
      var tag=$('#osOffer');if(tag){tag.className='tag o '+g;tag.textContent=OFFER[g]}
      if(sp){sp.setAttribute('x1',(300+118*Math.cos(a)).toFixed(1));sp.setAttribute('y1',(300+118*Math.sin(a)).toFixed(1));sp.setAttribute('x2',(300+164*Math.cos(a)).toFixed(1));sp.setAttribute('y2',(300+164*Math.sin(a)).toFixed(1))}
      if(det&&!reduce){det.classList.remove('swap');void det.offsetWidth;det.classList.add('swap')}
      if(go){var r=ring.getBoundingClientRect();if(r.top<60||r.bottom>innerHeight)ring.scrollIntoView({behavior:jump,block:'center'})}
    }
    nodes.forEach(function(n){
      n.addEventListener('click',function(){selectPillar(+n.dataset.k)});
      n.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();selectPillar(+n.dataset.k)}});
      n.addEventListener('mouseenter',function(){ring.dataset.hi=n.dataset.g});
      n.addEventListener('mouseleave',function(){delete ring.dataset.hi});
    });
    chips.forEach(function(c){
      c.addEventListener('click',function(){selectPillar(+c.dataset.k,true)});
    });
    $$('.offer').forEach(function(o){
      o.addEventListener('mouseenter',function(){ring.dataset.hi=o.dataset.offer});
      o.addEventListener('mouseleave',function(){delete ring.dataset.hi});
    });
  }
  $$('.offer-cta').forEach(function(a){a.addEventListener('click',function(){prefill(a.dataset.need)})});
  var rep=$('.rep');
  if(rep){if('IntersectionObserver' in window&&!reduce){var so=new IntersectionObserver(function(es){if(es[0].isIntersecting){rep.classList.add('stamped');so.disconnect()}},{threshold:.45});so.observe(rep)}else rep.classList.add('stamped')}
  function trackLead(){if(typeof window.oaiq==='function')window.oaiq('measure','lead_created',{type:'customer_action'})}
  document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('a[href*="wa.me"],a[href^="mailto:"],a[href*="calendar.app.google"]'))trackLead()});
  var form=$('#diagForm');
  if(form){
    var val=function(n){var el=form.querySelector('[name="'+n+'"]');return el?el.value.trim():''};
    var ph=function(v,p){return v||'['+p+']'};
    var consent=$('#f-consent'),ferr=$('#formErr');
    if(consent)consent.addEventListener('change',function(){if(consent.checked){ferr.hidden=true;consent.closest('.consent').classList.remove('err')}});
    form.addEventListener('submit',function(e){e.preventDefault();
      if(consent&&!consent.checked){ferr.textContent='Please accept the Privacy Notice and Terms of Use to continue.';ferr.hidden=false;consent.closest('.consent').classList.add('err');consent.focus();return}
      var ct=form.querySelector('[name="contact"]');if(ct&&!ct.value.trim()){ferr.textContent='Add your WhatsApp or email so I can reach you.';ferr.hidden=false;ct.focus();return}
      ferr.hidden=true;trackLead();
      var lines=['Hi Bernardo, I want a free diagnosis.','','• Stage: '+ph(val('stage'),'stage'),'• Name: '+ph(val('name'),'name'),'• Company: '+ph(val('company'),'company'),'• What’s blocking growth: '+ph(val('block'),'one sentence'),'• Reach me at: '+ph(val('contact'),'WhatsApp or email'),'• Consent: I accept the Privacy Notice and Terms of Use and agree to be contacted about this request','','Sent from your website'];
      var url='https://wa.me/13128606629?text='+encodeURIComponent(lines.join('\n'));var w=window.open(url,'_blank');if(w){try{w.opener=null}catch(_){}}else{location.href=url}});
  }
  var ticking=false;
  function onScroll(){if(ticking)return;ticking=true;requestAnimationFrame(function(){ticking=false;lightWords();if(nav)nav.classList.toggle('scrolled',scrollY>8)})}
  addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);onScroll();
})();
