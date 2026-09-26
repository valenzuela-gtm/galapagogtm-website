(function(){
  'use strict';
  var cv=document.getElementById('field');
  if(!cv||!cv.getContext)return;
  var ctx;try{ctx=cv.getContext('2d',{alpha:true})}catch(e){return}
  if(!ctx)return;
  var RM=matchMedia('(prefers-reduced-motion: reduce)'),FINE=matchMedia('(pointer: fine)');
  var TAU=Math.PI*2,GA=Math.PI*(3-Math.sqrt(5)),D2R=Math.PI/180;
  var W=1,H=1,S=1,DPR=1,N=0,dens=1,P=[],cfg=[],T=0,last=0,raf=0,small=false,hidden=false,dark=true,fade=1;
  var mx=-1e4,my=-1e4,tmx=-1e4,tmy=-1e4;
  var spr=[null,null],sprD=6,rgb1='150,176,255',rgb2='110,212,255',au1='rgba(56,92,255,.24)',au2='rgba(0,160,255,.1)';
  function clamp(v,a,b){return v<a?a:v>b?b:v}
  function mix(a,b,t){return a+(b-a)*t}
  function sm(a,b,v){var t=clamp((v-a)/(b-a),0,1);return t*t*(3-2*t)}
  function hash(i,k){var x=Math.sin(i*12.9898+k*78.233)*43758.5453;return x-Math.floor(x)}
  function clear(c){return c.replace(/,\s*[\d.]+\s*\)\s*$/,',0)')}
  var NA=[[-168,66],[-156,71],[-130,70],[-95,73],[-80,70],[-62,60],[-55,50],[-66,44],[-76,35],[-81,25],[-83,29],[-90,30],[-97,26],[-97,21],[-90,21],[-87,16],[-83,10],[-78,8],[-80,7],[-86,11],[-92,14],[-105,20],[-110,23],[-117,32],[-124,40],[-125,49],[-135,58],[-150,60],[-165,60]];
  var SA=[[-80,10],[-72,12],[-62,10],[-52,5],[-50,0],[-35,-5],[-38,-13],[-40,-22],[-48,-28],[-53,-34],[-58,-38],[-65,-42],[-66,-47],[-68,-53],[-72,-54],[-75,-50],[-73,-40],[-72,-30],[-70,-18],[-76,-14],[-81,-5],[-80,0],[-78,2]];
  function inPoly(x,y,p){var c=false;for(var i=0,j=p.length-1;i<p.length;j=i++){var xi=p[i][0],yi=p[i][1],xj=p[j][0],yj=p[j][1];if(((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi))c=!c}return c}
  var USMX=[[-123,49],[-95.2,49],[-94.8,49.3],[-94.6,48.7],[-93,48.6],[-90.8,48.2],[-89.6,48],[-92.1,46.7],[-90.4,46.6],[-88.4,46.9],[-87.6,46.5],[-86.1,46.7],[-84.9,46.5],[-84.2,46.5],
    [-84.4,45.9],[-84.7,45.8],[-84.1,45.4],[-83.4,45.1],[-83.3,44.3],[-83.9,43.9],[-83.4,43.9],[-82.6,43.9],[-82.4,43],[-82.9,42.3],[-83.1,42],[-82.5,41.7],
    [-81.7,41.5],[-80.5,41.9],[-79.8,42.3],[-78.9,42.9],[-79.1,43.3],[-77.5,43.3],[-76.4,43.5],[-76.2,44.2],[-75,45],[-71.5,45],[-70.8,45.4],[-70,46.7],[-69.2,47.4],[-68.2,47.3],[-67.8,47.1],[-67.8,45.9],[-67,44.8],
    [-68.8,44.4],[-70.2,43.7],[-70.7,42.9],[-70.9,42.3],[-70,41.8],[-70.6,41.5],[-71.4,41.4],[-72.9,41.2],[-74,40.6],[-74.1,39.8],[-74.9,38.9],[-75.1,38.6],[-75.5,37.6],[-76,37.1],[-75.8,35.9],[-75.5,35.2],[-76.6,34.7],[-77.9,33.9],[-79.2,33.2],[-80.4,32.5],[-81.1,31.8],[-81.4,30.7],[-81.3,29.8],[-80.6,28.4],[-80.1,26.9],[-80.1,25.8],[-80.4,25.2],[-81.1,25.1],[-81.7,25.9],[-82.2,26.7],[-82.7,27.7],[-82.8,28.9],[-83.7,29.9],[-84.4,29.9],[-85.3,29.7],[-86.3,30.4],[-87.5,30.3],[-88.4,30.4],[-89.4,30.2],[-89.6,29.2],[-90.2,29.1],[-91.3,29.3],[-92.3,29.6],[-93.8,29.7],[-94.7,29.4],[-95.3,28.9],[-96.6,28.1],[-97.2,27.6],[-97.4,26.4],[-97.2,25.9],
    [-97.6,24.3],[-97.8,22.6],[-97.3,21],[-96.5,19.5],[-95.9,18.8],[-94.8,18.5],[-94.1,18.2],[-92.9,18.5],[-91.5,18.5],[-90.9,19.2],[-90.4,20],[-90.3,21],[-89.6,21.3],[-88.2,21.6],[-87,21.5],[-86.8,20.9],[-87.4,20.2],[-87.6,19.4],[-87.9,18.3],[-88.3,18.5],
    [-88.9,17.9],[-89.1,17.8],[-90.9,17.8],[-91.4,17.3],[-90.4,16.4],[-91.7,16.1],[-92.2,15.3],[-92.2,14.5],
    [-93.4,15.6],[-94.7,16.2],[-95.9,15.8],[-97.3,15.9],[-98.6,16.4],[-99.9,16.8],[-101.2,17.6],[-102.3,17.9],[-103.5,18.3],[-104.4,19.1],[-105.3,20.1],[-105.6,20.8],[-105.2,21.5],[-105.7,22.5],[-106.4,23.2],[-107.4,24.4],[-108.2,25.2],[-109.3,26.1],[-109.9,26.8],[-110.6,27.9],[-111.4,28.6],[-112.2,29.4],[-112.8,30.3],[-113.1,31.2],[-114.2,31.5],[-114.8,31.8],
    [-114.7,30.9],[-114.3,29.9],[-113.4,28.9],[-112.8,27.7],[-112.2,26.8],[-111.5,25.9],[-110.7,24.8],[-110.3,24.2],[-109.5,23.2],[-110.1,22.9],[-110.9,23.8],[-111.9,24.6],[-112.3,25.6],[-112.9,26.6],[-114,27.6],[-114.4,28.1],[-114.2,28.7],[-115.2,29.6],[-115.9,30.4],[-116.4,31.2],[-117.1,32.5],
    [-117.3,33.1],[-118.3,33.8],[-119.2,34.1],[-120.6,34.6],[-120.9,35.4],[-121.9,36.6],[-122.4,37.2],[-122.5,37.8],[-123,38.3],[-123.7,39.2],[-123.8,40.1],[-124.3,40.5],[-124.1,41.8],[-124.5,42.8],[-124.1,44],[-123.9,45.5],[-124,46.3],[-124.2,47.2],[-124.7,48.4],[-123.1,48.2],[-122.8,49]];
  var LMI=[[-87.9,41.6],[-87.6,42.4],[-87.9,43.4],[-87.6,44.1],[-87.1,45],[-86.4,45.8],[-85.4,45.9],[-85,45.6],[-85.5,44.9],[-86.2,44.2],[-86.5,43.4],[-86.2,42.5],[-86.6,41.8]];
  var RIDGES=[[[[-114,48.5],[-110,44.5],[-106.5,40],[-106,36],[-105.5,33]],1.6],[[[-121.5,48.5],[-121.8,44],[-121.5,40.5],[-119,37],[-117,34.5]],1.2],
    [[[-85.5,34],[-82,36.5],[-79,39],[-76.5,41.5],[-73.5,43.5],[-71,44.5]],1.3],[[[-110,30.5],[-106.5,26],[-104.5,22.5],[-103.5,20.5]],1.4],
    [[[-101,27],[-99.5,23],[-97.5,19.5]],1.1],[[[-104.5,19.5],[-101,19.5],[-98,19.2],[-96.5,18.9]],.9],[[[-102,18.3],[-99,17.3],[-96,16.6]],.9]];
  var KX=.839;
  function segD(px,py,ax,ay,bx,by){var dx=bx-ax,dy=by-ay,l=dx*dx+dy*dy,t=l?clamp(((px-ax)*dx+(py-ay)*dy)/l,0,1):0,x=ax+t*dx-px,y=ay+t*dy-py;return Math.sqrt(x*x+y*y)}
  function elev(lon,lat){var e=0;RIDGES.forEach(function(r){var q=r[0],d=1e9;for(var k=0;k<q.length-1;k++)d=Math.min(d,segD(lon*KX,lat,q[k][0]*KX,q[k][1],q[k+1][0]*KX,q[k+1][1]));e=Math.max(e,Math.exp(-d*d/(r[1]*r[1])))});return e}
  var gridCache={};
  function landGrid(n){
    if(gridCache[n])return gridCache[n];
    function pts(s){var out=[],row=0;for(var lat=49.2;lat>14.4;lat-=s*.866,row++){for(var lon=-125+(row%2?s/2/KX:0);lon<-66;lon+=s/KX){if(inPoly(lon,lat,USMX)&&!inPoly(lon,lat,LMI))out.push([lon,lat])}}return out}
    function coast(lon,lat){var d=1e9,k,j;[USMX,LMI].forEach(function(q){for(k=0,j=q.length-1;k<q.length;j=k++)d=Math.min(d,segD(lon*KX,lat,q[j][0]*KX,q[j][1],q[k][0]*KX,q[k][1]))});return Math.exp(-d*d/.8)}
    var lo=.4,hi=3,best=[];
    for(var it=0;it<16;it++){var mid=(lo+hi)/2,r=pts(mid);best=r;if(Math.abs(r.length-n)<n*.02)break;if(r.length>n)lo=mid;else hi=mid}
    return (gridCache[n]=best.map(function(q){return [q[0],q[1],elev(q[0],q[1]),coast(q[0],q[1])]}));
  }
  var CH=[],MP=[],sceneReady=false;
  function scenes(){
    var g=landGrid(N),i;
    var mw=small?W*1.12:Math.min(W*.8,H*1.34),mh=mw/(59*KX/34.8),mcx=(small?.52:.5)*W,mcy=(small?.3:.54)*H,ux=mw/(59*KX),x0=mcx-mw/2,y0=mcy-mh/2;
    function dim(x){return small?.65:1}
    var map=g.map(function(q){var x=x0+(q[0]+125)*KX*ux,y=y0+(49.2-q[1])*(mh/34.8);return {x:x,y:y,a:Math.min(.95,.44+.3*q[3]+.34*q[2])*dim(x),s:1+.35*q[3]+.65*q[2],t:q[2]>.55?1:0,fx:(x-x0)/mw}});
    map.sort(function(a,b){return a.x-b.x||a.y-b.y});
    var nb=small?8:12,cx0=W*(small?.08:.07),cx1=W*(small?.94:.97),yb=H*(small?.9:.87),hm=H*(small?.46:.62),pitch=(cx1-cx0)/nb,bw=pitch*.56,tops=[];
    for(var b=0;b<nb;b++)tops.push(hm*(.12+.88*Math.pow((b+1)/nb,1.9)));
    function bars(sp){var out=[];for(var b=0;b<nb;b++){var cols=Math.max(2,Math.floor(bw/sp)),rows=Math.max(1,Math.floor(tops[b]/sp)),bx=cx0+b*pitch+(pitch-bw)/2;
      for(var c=0;c<cols;c++)for(var r=0;r<rows;r++){var x=bx+c*(bw/(cols-1));out.push({x:x,y:yb-r*sp,yb:yb,t0:.25+(b/nb)*1.1+(r/rows)*.35,a:.5*dim(x),s:.95,t:0})}}return out}
    var want=Math.round(N*.86),lo=4,hi=60,ch=[];
    for(var it=0;it<22;it++){var mid=(lo+hi)/2,r=bars(mid);ch=r;if(Math.abs(r.length-want)<want*.03)break;if(r.length>want)lo=mid;else hi=mid}
    var nl=Math.max(0,N-ch.length);
    for(var k=0;k<nl;k++){var u=k/Math.max(1,nl-1),fb=u*(nb-1),b0=Math.floor(fb),b1=Math.min(nb-1,b0+1),f=fb-b0,h=tops[b0]+(tops[b1]-tops[b0])*(f*f*(3-2*f)),x=cx0+pitch/2+u*(nb-1)*pitch,y=yb-h-H*.045;
      ch.push({x:x,y:y,yb:y,t0:1.55+u*.8,a:.8*dim(x),s:1.1,t:1})}
    ch.sort(function(a,b){return a.x-b.x||b.y-a.y});
    CH=new Array(N);MP=new Array(N);
    for(i=0;i<N;i++){
      CH[i]=ch[i]||{x:cx0+hash(i,8)*(cx1-cx0),y:yb,yb:yb,t0:0,a:0,s:.6,t:0};
      if(map.length&&i<map.length)MP[i]=map[i];
      else{var mq=map.length?map[(i*7)%map.length]:{x:mcx,y:mcy,fx:.5};MP[i]={x:mq.x,y:mq.y,a:0,s:.6,t:0,fx:mq.fx}}
    }
    if(!sceneReady){for(i=0;i<N;i++){P[i].x=CH[i].x;P[i].y=CH[i].yb;P[i].a=0}sceneReady=true}
  }
  function sprite(rgb){
    var c=document.createElement('canvas');c.width=c.height=48;
    var g=c.getContext('2d'),r=g.createRadialGradient(24,24,0,24,24,24);
    if(dark){r.addColorStop(0,'rgba('+rgb+',1)');r.addColorStop(.16,'rgba('+rgb+',.9)');r.addColorStop(.38,'rgba('+rgb+',.24)');r.addColorStop(1,'rgba('+rgb+',0)')}
    else{r.addColorStop(0,'rgba('+rgb+',1)');r.addColorStop(.4,'rgba('+rgb+',.92)');r.addColorStop(.6,'rgba('+rgb+',.22)');r.addColorStop(1,'rgba('+rgb+',0)')}
    g.fillStyle=r;g.fillRect(0,0,48,48);return c;
  }
  function colors(){
    var cs=getComputedStyle(document.documentElement);
    function v(n,d){var x=(cs.getPropertyValue(n)||'').trim();return x||d}
    rgb1=v('--dot',rgb1);rgb2=v('--dot-2',rgb2);au1=v('--aurora-1',au1);au2=v('--aurora-2',au2);
    dark=(cs.getPropertyValue('color-scheme')||'').indexOf('dark')>-1;
    spr=[sprite(rgb1),sprite(rgb2)];sprD=dark?7.4:4;fade=dark?1:.8;
  }
  function build(){
    N=W>=1100?1500:W>=700?900:420;dens=Math.min(1,Math.sqrt(620/N)*1.2);
    P=new Array(N);
    for(var i=0;i<N;i++){
      var y=1-2*(i+.5)/N,r=Math.sqrt(1-y*y),th=i*GA,x=Math.cos(th)*r,z=Math.sin(th)*r;
      var land=inPoly(Math.atan2(z,x)/D2R,Math.asin(y)/D2R,NA)||inPoly(Math.atan2(z,x)/D2R,Math.asin(y)/D2R,SA);
      P[i]={sx:x,sy:y,sz:z,land:land,tone:land?1:(hash(i,7)<.1?1:0),r1:hash(i,1),r2:hash(i,2),r3:hash(i,3),sp:.7+.6*hash(i,4),
        x:W*.5+(hash(i,5)-.5)*60,y:H*.5+(hash(i,6)-.5)*60,a:0,s:1};
    }
  }
  var DEF={growmap:[.5,.52,0],globe:[.775,.47,.47],beacon:[.5,.56,.46],field:[.5,.5,0],lens:[.5,.5,.4],strands:[.5,.55,0],trio:[.5,.56,.13],orbit:[.69,.52,.32],path:[.5,.5,0],steps:[.5,.52,0],calm:[.5,.5,0]};
  var SML={growmap:[.55,.27,0],globe:[.8,.2,.46],beacon:[.5,.5,.52],lens:[.5,.5,.46],orbit:[.5,.42,.4],trio:[.5,.5,.14]};
  function measure(){
    var y=window.scrollY||window.pageYOffset||0;
    cfg=[].slice.call(document.querySelectorAll('[data-dots]')).map(function(el){
      var r=el.getBoundingClientRect(),t=el.getAttribute('data-dots'),d=(small&&SML[t])||DEF[t]||DEF.calm;
      return {t:t,ax:d[0],ay:d[1],r:d[2],c:r.top+y+r.height/2};
    }).sort(function(a,b){return a.c-b.c});
  }
  var o1={x:0,y:0,a:0,s:1},o2={x:0,y:0,a:0,s:1};
  function shape(c,p,i,o){
    var cx=c.ax*W,cy=c.ay*H,k,a,b,rad,u,x,y;o.t=-1;
    switch(c.t){
      case 'growmap':{
        var q=CH[i],w=MP[i];if(!q||!w){o.x=cx;o.y=cy;o.a=0;o.s=1;return}
        if(RM.matches||T>=3.4+w.fx*.9){o.x=w.x;o.y=w.y;o.a=w.a*(RM.matches?1:.86+.14*Math.sin(T*1.2+p.r1*40));o.s=w.s;o.t=w.t;return}
        if(T<q.t0){o.x=q.x;o.y=q.yb;o.a=0;o.s=.6;o.t=q.t;return}
        o.x=q.x;o.y=q.y;o.a=q.a;o.s=q.s;o.t=q.t;return;}
      case 'globe':case 'beacon':{
        var R=c.r*S*(1+.018*Math.sin(p.sy*5+T*.5)),yaw=-2.88+T*(c.t==='beacon'?.06:.075),tl=.14;
        var sx=p.sx*Math.cos(yaw)+p.sz*Math.sin(yaw),sz=-p.sx*Math.sin(yaw)+p.sz*Math.cos(yaw);
        var yy=p.sy*Math.cos(tl)-sz*Math.sin(tl),zz=p.sy*Math.sin(tl)+sz*Math.cos(tl),pf=1+zz*.12,f=(zz+1)/2,l=p.land&&zz>-.1;
        o.x=cx+sx*R*pf;o.y=cy-yy*R*pf;
        o.a=(.22+.78*f)*(l?1.35:1)*(c.t==='beacon'?.8:1)*(small&&c.t==='globe'?.65:1);o.s=(.7+.9*f)*(l?1.3:1);return;}
      case 'field':{
        k=i%15;var col=k%5,row=(k/5)|0;
        cx=(.1+.8*(col+.5)/5)*W+Math.sin(T*.13+k*1.3)*18;cy=(.2+.62*(row+.5)/3)*H+Math.cos(T*.11+k*.7)*14;
        a=p.r1*TAU+T*(.07+.1*p.r3);rad=Math.sqrt(p.r2)*S*(small?.09:.075);
        o.x=cx+Math.cos(a)*rad;o.y=cy+Math.sin(a)*rad*.9;o.a=.15+.32*p.r3;o.s=.8+.35*p.r2;return;}
      case 'lens':{
        k=i%5;rad=c.r*S*(.9+k*.16)*(1+.025*Math.sin(T*.7+k*1.3));
        a=((((i/5)|0)/(N/5))+(k%2?1:-1)*T*.018)*TAU;
        o.x=cx+Math.cos(a)*rad*(small?.62:1.35);o.y=cy+Math.sin(a)*rad*(small?1.1:.62);o.a=.5-k*.07;o.s=1.05-k*.06;return;}
      case 'strands':{
        var L=small?4:6,lane=i%L;u=((i/L)|0)/Math.ceil(N/L);
        x=(-.06+u*1.12)*W;var ph=lane*1.3;
        y=(c.ay+(lane-(L-1)/2)*(small?.06:.055))*H+Math.sin(u*TAU*1.1+T*.32+ph)*H*.07+Math.sin(u*TAU*2.6-T*.21+ph)*H*.014;
        o.x=x;o.y=y;o.a=.16+.42*Math.sin(u*Math.PI);o.s=.85+.25*p.r2;return;}
      case 'trio':{
        k=i%3;var xs=small?[.5,.5,.5]:[.2,.5,.8],ys=small?[.25,.5,.75]:[c.ay,c.ay,c.ay],R3=(small?.16:c.r)*S;
        a=T*.3+k*2.1;var s3=p.sx*Math.cos(a)+p.sz*Math.sin(a),z3=-p.sx*Math.sin(a)+p.sz*Math.cos(a),f3=(z3+1)/2;
        o.x=xs[k]*W+s3*R3;o.y=ys[k]*H-p.sy*R3;o.a=.12+.56*f3;o.s=.65+.65*f3;return;}
      case 'orbit':{
        var R8=c.r*S;
        if(i%10<8){k=i%10;a=-Math.PI/2+k*TAU/8+T*.025;b=p.r1*TAU+T*(.25+.2*p.r3);rad=(9+15*p.r2)*(.6+S/1600);
          o.x=cx+Math.cos(a)*R8+Math.cos(b)*rad;o.y=cy+Math.sin(a)*R8+Math.sin(b)*rad;o.a=.36+.4*p.r3;o.s=.95+.4*p.r2}
        else{a=p.r1*TAU+T*.02;rad=R8*(1+(p.r2-.5)*.08);o.x=cx+Math.cos(a)*rad;o.y=cy+Math.sin(a)*rad;o.a=.22;o.s=.75}
        return;}
      case 'path':{
        u=((i+.5)/N+T*.012)%1;var q=1-u;
        var X0=.06*W,Y0=.84*H,X1=.4*W,Y1=.96*H,X2=.52*W,Y2=.1*H,X3=.96*W,Y3=.16*H;
        x=q*q*q*X0+3*q*q*u*X1+3*q*u*u*X2+u*u*u*X3;y=q*q*q*Y0+3*q*q*u*Y1+3*q*u*u*Y2+u*u*u*Y3;
        var dx=3*q*q*(X1-X0)+6*q*u*(X2-X1)+3*u*u*(X3-X2),dy=3*q*q*(Y1-Y0)+6*q*u*(Y2-Y1)+3*u*u*(Y3-Y2),dl=Math.sqrt(dx*dx+dy*dy)||1;
        var off=(p.r2-.5)*2;off=off*Math.abs(off)*46*(.45+Math.sin(u*Math.PI));
        var pulse=((T*.09)%1.3)-.15,glow=Math.exp(-Math.pow((u-pulse)*7,2));
        o.x=x-dy/dl*off;o.y=y+dx/dl*off;o.a=.1+.45*glow+.08*(1-Math.abs(off)/46);o.s=.85+.5*glow;return;}
      case 'steps':{
        var xs2=small?[.5,.5,.5]:[.2,.5,.8],ys2=small?[.25,.5,.75]:[c.ay,c.ay,c.ay];
        if(i%4<3){k=i%4;a=p.r1*TAU+T*.2;rad=Math.sqrt(p.r2)*S*.07;
          o.x=xs2[k]*W+Math.cos(a)*rad;o.y=ys2[k]*H+Math.sin(a)*rad;o.a=.22+.4*(1-Math.sqrt(p.r2));o.s=.85+.45*p.r3}
        else{u=(p.r1+T*.05)%1;var seg=u*2,k0=Math.min(Math.floor(seg),1),fr=seg-k0;
          o.x=mix(xs2[k0],xs2[k0+1],fr)*W+(p.r2-.5)*12;o.y=mix(ys2[k0],ys2[k0+1],fr)*H-Math.sin(fr*Math.PI)*S*.035+(p.r3-.5)*12;
          o.a=.05+.34*Math.sin(fr*Math.PI);o.s=.7}
        return;}
      default:{
        o.x=(p.r1*1.1-.05)*W+Math.sin(T*.07+p.r2*TAU)*16;o.y=(p.r2*1.1-.05)*H+Math.cos(T*.06+p.r3*TAU)*16;
        o.a=.08+.2*p.r3;o.s=.7+.3*p.r1;}
    }
  }
  function aurora(A,B,m){
    var ax=mix(A.ax,B.ax,m)*W,ay=mix(A.ay,B.ay,m)*H,R=Math.max(W,H)*.62;
    var g=ctx.createRadialGradient(ax,ay,0,ax,ay,R);g.addColorStop(0,au1);g.addColorStop(1,clear(au1));
    ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    var bx=W-ax*.85,by=H*(1-ay*.55),R2=Math.max(W,H)*.5;
    var g2=ctx.createRadialGradient(bx,by,0,bx,by,R2);g2.addColorStop(0,au2);g2.addColorStop(1,clear(au2));
    ctx.fillStyle=g2;ctx.fillRect(0,0,W,H);
  }
  function frame(now){
    raf=0;if(hidden||!cfg.length)return;
    if(small&&last&&now-last<30&&!RM.matches){raf=requestAnimationFrame(frame);return}
    var dt=last?Math.min((now-last)/1000,.05):1/60;last=now;
    if(!RM.matches)T+=dt;
    var v=(window.scrollY||window.pageYOffset||0)+H*.5,n=cfg.length,i=0;
    while(i<n-1&&v>cfg[i+1].c)i++;
    var A=cfg[i],B=cfg[Math.min(i+1,n-1)],m=0;
    if(i<n-1&&v>A.c)m=sm(.2,.8,(v-A.c)/(B.c-A.c));
    ctx.clearRect(0,0,W,H);
    aurora(A,B,m);
    mx+=(tmx-mx)*.14;my+=(tmy-my)*.14;
    var push=FINE.matches&&tmx>-1e3;
    for(var j=0;j<N;j++){
      var p=P[j],tx,ty,ta,ts;
      shape(A,p,j,o1);
      if(m>0){shape(B,p,j,o2);tx=mix(o1.x,o2.x,m);ty=mix(o1.y,o2.y,m);ta=mix(o1.a,o2.a,m);ts=mix(o1.s,o2.s,m)}
      else{tx=o1.x;ty=o1.y;ta=o1.a;ts=o1.s}
      var k=RM.matches?1:1-Math.exp(-dt*4*p.sp);
      p.x+=(tx-p.x)*k;p.y+=(ty-p.y)*k;p.a+=(ta-p.a)*k;p.s+=(ts-p.s)*k;
      var x=p.x,y=p.y;
      if(push){var ddx=x-mx,ddy=y-my,d2=ddx*ddx+ddy*ddy;if(d2<14400&&d2>1){var d=Math.sqrt(d2),f=(1-d/120)*22;x+=ddx/d*f;y+=ddy/d*f}}
      if(x<-20||x>W+20||y<-20||y>H+20)continue;
      var al=clamp(p.a,0,1)*fade*((m>.5?B:A).t==='growmap'?1:dens);if(al<.012)continue;
      var tn=m>.5?o2.t:o1.t;if(tn<0)tn=p.tone;
      var sz=sprD*p.s;ctx.globalAlpha=al;ctx.drawImage(spr[tn],x-sz/2,y-sz/2,sz,sz);
    }
    ctx.globalAlpha=1;
    if(!RM.matches)raf=requestAnimationFrame(frame);
  }
  function kick(){if(!raf&&!hidden)raf=requestAnimationFrame(frame)}
  var lastW=0,lastH=0;
  function resize(force){
    var w=window.innerWidth,h=window.innerHeight;
    if(!force&&w===lastW&&Math.abs(h-lastH)<120)return;
    lastW=w;lastH=h;W=w;H=h;S=Math.min(W,H);small=W<760;
    DPR=Math.min(window.devicePixelRatio||1,small?1.5:2);
    cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);ctx.setTransform(DPR,0,0,DPR,0,0);
    var want=W>=1100?1500:W>=700?900:420;if(want!==N)build();
    scenes();measure();kick();
  }
  var mt=0;function remeasure(){clearTimeout(mt);mt=setTimeout(function(){measure();kick()},180)}
  addEventListener('resize',function(){resize(false)});
  addEventListener('load',remeasure);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(remeasure);
  if('ResizeObserver' in window)new ResizeObserver(remeasure).observe(document.body);
  document.addEventListener('toggle',remeasure,true);
  addEventListener('scroll',function(){if(RM.matches)kick()},{passive:true});
  addEventListener('pointermove',function(e){tmx=e.clientX;tmy=e.clientY},{passive:true});
  document.addEventListener('pointerleave',function(){tmx=tmy=-1e4});
  document.addEventListener('visibilitychange',function(){hidden=document.hidden;if(!hidden){last=0;kick()}});
  addEventListener('bv-theme',function(){colors();kick()});
  try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',function(){colors();kick()})}catch(e){}
  try{RM.addEventListener('change',function(){last=0;kick()})}catch(e){}
  colors();resize(true);
})();
