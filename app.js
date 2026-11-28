{
const ALPH='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const MIO=['mio','#4d7c0f'];
// Si falta algún elemento (p. ej. el navegador aún tiene un index.html de otra versión),
// usamos uno de mentira en vez de romper el juego entero.
const $=id=>document.getElementById(id)||document.createElement('textarea');
const grid=$('grid');

// P: preferencias y una partida por juego, para poder cambiar de juego sin perder la otra.
let P={mode:'',name:'',games:{}};
let M=null,S=null; // juego actual y su partida
const fresh=()=>({size:4,type:'serie',code:'',marks:[],cells:[],custom:'',start:0,lines:0,lineSung:false,bingo:false,end:0});

function load(){
 try{const v=JSON.parse(localStorage.getItem('bingo')||'null');if(v&&v.games){P=Object.assign(P,v);return}}catch(e){}
 // Primera vez con esta versión: traemos las partidas de las dos webs de antes
 try{const c=JSON.parse(localStorage.getItem('bingoCalle')||'null');if(c&&c.cells){P.games.calle=Object.assign(fresh(),c,{type:c.mode==='mine'?'mine':'serie'});delete P.games.calle.mode;delete P.games.calle.useCustom}}catch(e){}
 try{const n=JSON.parse(localStorage.getItem('bingoNavidad')||'null');if(n&&n.cells){P.name=n.name||'';P.games.navidad=Object.assign(fresh(),n,{type:n.mode==='mine'?'mine':'serie'});delete P.games.navidad.mode;delete P.games.navidad.name}}catch(e){}
 for(const k in P.games)if(P.games[k].lineSung===undefined)P.games[k].lineSung=P.games[k].lines>0;
}
const save=()=>{try{localStorage.setItem('bingo',JSON.stringify(P))}catch(e){}};

function hash(str){let h=2166136261;for(const c of str){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function rng(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const norm=s=>s.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
function customList(){return[...new Set(S.custom.split('\n').map(x=>x.trim()).filter(Boolean))]}
function slots(size){return size*size-(size===5?1:0)}
function shuffle(p,r){for(let i=p.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[p[i],p[j]]=[p[j],p[i]]}return p}
// Mismo juego + misma partida + mismo nombre = mismo cartón. Sin nombre, todos tienen el mismo.
function build(code,size){
 const r=rng(hash(P.mode+'|'+code+'|'+size+'|'+norm(P.name)));
 const base=[];for(const k in M.items)for(const t of M.items[k])base.push({t,c:k});
 shuffle(base,r);
 const n=slots(size);
 let cells;
 if(S.type==='mine'){
  // Las casillas propias van primero; si no llenan el cartón, se completa con las de serie.
  const mine=shuffle(customList().map(t=>({t,c:'mio'})),r).slice(0,n);
  cells=shuffle(mine.concat(base.slice(0,n-mine.length)),r);
 }else cells=base.slice(0,n);
 if(size===5)cells.splice(12,0,{t:M.free,c:'free'});
 return cells;
}
function newCode(){let s='';for(let i=0;i<4;i++)s+=ALPH[Math.floor(Math.random()*ALPH.length)];return s}
function startGame(code,size){
 S.size=size;S.code=code;S.cells=build(code,size);
 S.marks=S.cells.map(c=>c.c==='free');S.start=Date.now();S.lines=0;S.lineSung=false;S.bingo=false;S.end=0;
 save();render();
}
function linesDone(){
 const n=S.size,m=S.marks,L=[];
 for(let i=0;i<n;i++){L.push([...Array(n)].map((_,j)=>i*n+j));L.push([...Array(n)].map((_,j)=>j*n+i))}
 L.push([...Array(n)].map((_,j)=>j*n+j));L.push([...Array(n)].map((_,j)=>j*n+(n-1-j)));
 return L.filter(l=>l.every(k=>m[k]));
}
const cat=k=>k==='mio'?MIO:(M.cats[k]||MIO);
function render(){
 const n=S.size;
 grid.className='grid g'+n;grid.style.gridTemplateColumns=`repeat(${n},minmax(0,1fr))`;
 const done=linesDone(),win=new Set(done.flat());
 grid.innerHTML=S.cells.map((c,i)=>{
  if(c.c==='free')return`<div class="cell free on" aria-label="Casilla libre"><svg aria-hidden="true"><use href="#i-star"/></svg><span class="t">${esc(c.t)}</span></div>`;
  const[ic,col]=cat(c.c);
  return`<button class="cell${S.marks[i]?' on':''}${win.has(i)?' win':''}" data-i="${i}" aria-pressed="${S.marks[i]}" style="--c:${col}"><svg class="ic" aria-hidden="true"><use href="#i-${ic}"/></svg><span class="t">${esc(c.t)}</span><i class="stamp"></i></button>`;
 }).join('');
 document.querySelectorAll('[data-size]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.size===n));
 document.querySelectorAll('[data-type]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.type===S.type));
 $('who').textContent=P.name?'Cartón de '+P.name:(S.type==='mine'?'Mi cartón':'Tu cartón');
 const full=S.code+'-'+n;$('code').textContent=full;$('codeTop').textContent=full;
 customInfo();
 const tot=S.marks.length,mk=S.marks.filter(Boolean).length;
 $('sMarks').textContent=mk+'/'+tot;$('sLines').textContent=done.length;$('sLeft').textContent=tot-mk;
 $('meter').style.width=(mk/tot*100)+'%';
 tick();
}
function esc(s){return s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function fmt(ms){const s=Math.floor(ms/1000),h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return(h?h+':'+String(m).padStart(2,'0'):m)+':'+String(x).padStart(2,'0')}
function tick(){if(S)$('clock').textContent=fmt((S.end||Date.now())-S.start)}
setInterval(tick,1000);

// ---------- Elegir juego ----------
function inProgress(k){const g=P.games[k];return g&&g.marks&&g.marks.some((x,i)=>x&&g.cells[i]&&g.cells[i].c!=='free')&&!g.bingo}
function renderPicker(){
 $('tiles').innerHTML=Object.entries(MODES).map(([k,m])=>{
  return`<button class="tile t-${k}" data-pick="${k}"><svg aria-hidden="true"><use href="#i-${m.icon}"/></svg><div><b>${esc(m.short)}</b><span>${esc(m.blurb)}</span></div>${inProgress(k)?'<i class="cont">En juego</i>':''}</button>`;
 }).join('');
}
$('tiles').addEventListener('click',e=>{const b=e.target.closest('[data-pick]');if(b)enter(b.dataset.pick,true)});
function setTheme(c){document.querySelector('meta[name=theme-color]').setAttribute('content',c)}
function showPicker(){
 P.mode='';M=null;S=null;save();
 document.body.dataset.mode='';$('game').hidden=true;$('picker').hidden=false;
 document.title='Bingo';setTheme('#1f1a17');renderPicker();scrollTo(0,0);
}
function enter(mode,push){
 if(!MODES[mode])return showPicker();
 P.mode=mode;M=MODES[mode];
 S=P.games[mode]=Object.assign(fresh(),P.games[mode]||{});
 document.body.dataset.mode=mode;$('picker').hidden=true;$('game').hidden=false;
 document.title=M.name;setTheme(M.theme);
 // Textos del juego (vienen de modes.js, no del usuario)
 $('kicker').textContent=M.kicker;$('title').innerHTML=M.title;$('sub').innerHTML=M.sub;
 $('playT').textContent=M.play;$('playP').innerHTML=M.playText;
 $('customT').textContent=M.customTitle;$('customP').textContent=M.customText;$('custom').placeholder=M.customPh;
 $('rules').innerHTML=M.rules.map(r=>`<li>${esc(r)}</li>`).join('');
 $('custom').value=S.custom;$('name').value=P.name;$('msg').textContent='';$('customMsg').textContent='';
 if(push)history.pushState({g:mode},'',location.pathname+location.search);
 const broken=!Array.isArray(S.cells)||!S.cells.length||!Array.isArray(S.marks)||S.marks.length!==S.cells.length||!S.code;
 if(broken){S.type='serie';startGame(newCode(),[3,4,5].includes(S.size)?S.size:4)}
 else{try{render()}catch(e){S.type='serie';startGame(newCode(),4)}}
 save();scrollTo(0,0);
}
const goBack=()=>{if(history.state&&history.state.g)history.back();else showPicker()};
$('back').onclick=goBack;$('back2').onclick=goBack;
addEventListener('popstate',e=>{if(e.state&&e.state.g)enter(e.state.g,false);else showPicker()});

let toastT;
function toast(t){const el=$('toast');el.textContent=t;el.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>el.classList.remove('show'),1800)}

grid.addEventListener('click',e=>{
 const b=e.target.closest('button.cell');if(!b)return;
 const i=+b.dataset.i;S.marks[i]=!S.marks[i];
 const before=S.lines,now=linesDone().length;S.lines=now;
 if(navigator.vibrate&&navigator.userActivation&&navigator.userActivation.isActive)try{navigator.vibrate(S.marks[i]?25:10)}catch(_){}
 const all=S.marks.every(Boolean);
 if(all&&!S.bingo){S.bingo=true;S.end=Date.now();save();render();showWin();return}
 if(!all&&S.bingo){S.bingo=false;S.end=0}
 // La línea se canta una sola vez por cartón: la primera. Después, solo queda el bingo.
 if(now>before&&!S.lineSung){S.lineSung=true;toast('¡Línea!')}
 save();render();
});
function showWin(){
 $('winP').textContent=(P.name?P.name+', cartón':'Cartón')+' completo en '+fmt(S.end-S.start)+'. '+M.win;
 $('winOv').classList.add('show');fx();
}
$('close').onclick=()=>$('winOv').classList.remove('show');
$('again').onclick=()=>{$('winOv').classList.remove('show');startGame(newCode(),S.size)};
$('nuevo').onclick=()=>{startGame(newCode(),S.size);$('msg').textContent='Partida nueva: si jugáis juntos, comparte el enlace otra vez.'};
document.querySelectorAll('[data-size]').forEach(b=>b.onclick=()=>startGame(S.code||newCode(),+b.dataset.size));
document.querySelectorAll('[data-type]').forEach(b=>b.onclick=()=>setType(b.dataset.type));

function setType(type){
 if(type==='mine'&&!customList().length){
  $('customMsg').textContent='Escribe primero tus casillas aquí, una por línea.';
  $('customPanel').scrollIntoView({behavior:'smooth',block:'center'});$('custom').focus({preventScroll:true});
  return;
 }
 S.type=type;$('customMsg').textContent='';$('msg').textContent='';
 startGame(newCode(),S.size);
}
function customInfo(){
 const k=customList().length,n=slots(S.size),sz=S.size+'×'+S.size;
 let t;
 if(!k)t='Aún no has escrito ninguna casilla.';
 else if(k<n)t=`${k} casilla${k>1?'s':''} tuya${k>1?'s':''}. Un cartón ${sz} tiene ${n}: se completa con ${n-k} de serie.`;
 else if(k===n)t=`${k} casillas: llenan un cartón ${sz} entero.`;
 else t=`${k} casillas: en cada cartón ${sz} salen ${n} al azar.`;
 $('customInfo').textContent=t;
}
$('makeCustom').onclick=()=>{
 if(!customList().length){$('customMsg').textContent='Escribe al menos una casilla.';$('custom').focus();return}
 setType('mine');$('customMsg').textContent='¡Cartón creado! Si jugáis juntos, comparte el enlace para que los demás tengan tus casillas.';
 document.querySelector('.card').scrollIntoView({behavior:'smooth',block:'start'});
};

// Nombre: cambia el cartón, pero no la partida
function setName(){
 const v=$('name').value.trim().slice(0,24);
 if(v===P.name){$('msg').textContent=v?'Ese ya es tu cartón, '+v+'.':'Escribe tu nombre para tener tu propio cartón.';if(!v)$('name').focus();return}
 P.name=v;startGame(S.code||newCode(),S.size);
 $('msg').textContent=v?'¡Hola, '+v+'! Este es tu cartón para la partida '+S.code+'-'+S.size+'.':'Sin nombre: quien juegue sin nombre en esta partida tendrá tu mismo cartón.';
 document.querySelector('.card').scrollIntoView({behavior:'smooth',block:'start'});
}
$('nameBtn').onclick=setName;
$('name').addEventListener('keydown',e=>{if(e.key==='Enter')setName()});

// Compartir: el enlace lleva el juego, la partida y, si es personalizado, las casillas (nunca el nombre)
const b64e=s=>btoa(String.fromCharCode(...new TextEncoder().encode(s))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const b64d=s=>new TextDecoder().decode(Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0)));
function shareUrl(){
 const p=new URLSearchParams({m:P.mode,j:S.code+'-'+S.size});
 if(S.type==='mine')p.set('c',b64e(customList().join('\n')));
 return location.origin+location.pathname+'#'+p;
}
$('link').onclick=async()=>{
 const url=shareUrl();
 if(navigator.share){try{await navigator.share({title:M.name,text:'¡Juega conmigo! Abre el enlace y tendrás tu cartón.',url});return}catch(e){if(e.name==='AbortError')return}}
 try{await navigator.clipboard.writeText(url);$('msg').textContent='Enlace copiado. Mándaselo a quien juegue contigo.'}
 catch(e){$('msg').textContent='Copia este enlace: '+url}
};
function fromLink(){
 if(!location.hash)return false;
 const p=new URLSearchParams(location.hash.slice(1));
 const mode=MODES[p.get('m')]?p.get('m'):'calle'; // los enlaces antiguos no llevan juego: eran del callejero
 const j=(p.get('j')||'').toUpperCase().match(/^([A-Z0-9]{4})-([345])$/);
 history.replaceState(null,'',location.pathname+location.search);
 if(!j){if(p.get('m')&&MODES[p.get('m')]){enter(mode,true);return true}return false}
 enter(mode,true);
 const c=p.get('c');
 if(c){try{S.custom=b64d(c);S.type='mine'}catch(e){S.type='serie'}}else S.type='serie';
 $('custom').value=S.custom;
 startGame(j[1],+j[2]);
 $('msg').textContent='¡Estás en la partida '+j[1]+'-'+j[2]+'! '+(P.name?'Este es tu cartón, '+P.name+'.':'Si cada uno pone su nombre, tendréis cartones distintos.');
 return true;
}

$('copy').onclick=async()=>{
 const t=S.code+'-'+S.size;
 const extra=S.type==='mine'?' (con casillas personalizadas, mejor el enlace)':'';
 try{await navigator.clipboard.writeText(t);$('msg').textContent='Código copiado: '+t+extra}
 catch(e){$('msg').textContent='Díselo a los demás: '+t+extra}
};
$('joinBtn').onclick=()=>{
 const v=$('join').value.toUpperCase().replace(/\s/g,'');
 const m=v.match(/^([A-Z0-9]{4})-?([345])?$/);
 if(!m){$('msg').textContent='Ese código no vale. Tiene que ser como KQ7M-4.';return}
 S.type='serie';startGame(m[1],m[2]?+m[2]:S.size);$('join').value='';
 $('msg').textContent='¡Dentro de la partida '+S.code+'-'+S.size+'!';
};
$('custom').addEventListener('input',e=>{
 S.custom=e.target.value;save();customInfo();
 $('customMsg').textContent=S.type==='mine'?'Pulsa «Crear mi cartón» para usar los cambios.':'';
});
addEventListener('hashchange',()=>fromLink());

// Al cantar bingo: confeti o nieve, según el juego
const cv=$('fx'),cx=cv.getContext('2d');
function fx(){
 if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const W=cv.width=innerWidth,H=cv.height=innerHeight,cols=M.fxColors,snow=M.fx==='snow',pick=()=>cols[Math.floor(Math.random()*cols.length)];
 const P2=snow
  ?[...Array(170)].map(()=>({x:Math.random()*W,y:-Math.random()*H*.8,vx:(Math.random()-.5)*1.4,vy:Math.random()*2.5+1.5,s:Math.random()*4+2,w:Math.random()*6,c:pick()}))
  :[...Array(160)].map(()=>({x:W/2,y:H/2,vx:(Math.random()-.5)*14,vy:-Math.random()*16-4,s:Math.random()*7+4,r:Math.random()*6,c:pick()}));
 let f=0;
 const step=()=>{cx.clearRect(0,0,W,H);
  for(const p of P2){cx.fillStyle=p.c;
   if(snow){p.w+=.05;p.x+=p.vx+Math.sin(p.w)*.6;p.y+=p.vy;cx.beginPath();cx.arc(p.x,p.y,p.s,0,7);cx.fill()}
   else{p.vy+=.45;p.x+=p.vx;p.y+=p.vy;p.r+=.2;cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);cx.restore()}}
  if(++f<(snow?260:170))requestAnimationFrame(step);else cx.clearRect(0,0,W,H)};
 step();
}

load();
// Al abrir, siempre se elige juego (salvo que vengas de un enlace compartido)
if(!fromLink())showPicker();
}

// App instalable y offline (PWA)
if('serviceWorker' in navigator && location.protocol!=='file:'){
 addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
}
