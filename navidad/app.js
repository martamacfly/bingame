{
const CAT={dice:'#b3202a',comida:'#b45309',mesa:'#7e22ce',tele:'#0369a1',familia:'#15803d',lio:'#c2410c',sofa:'#475569',tradicion:'#a16207',mio:'#be185d'};
const BASE={
// Lo que dice algún familiar
dice:['«¿Y tú para cuándo novio/a?»','«¡Cómo has crecido!»','«Estás más delgado/a»','«Come, que no has comido nada»','«En mis tiempos…»','«¿Y los estudios qué tal?»',
 '«Este año no compramos tanto»','«Yo turrón no quiero» (y come)','«Esto antes no pasaba»','«¿Quién quiere más?»','«Llévate un táper»','«Apaga la tele, que estamos comiendo»',
 '«Qué rico está todo»','«Hay comida para un regimiento»','«El año que viene lo hacemos en tu casa»','«Ya no hay Navidades como las de antes»','«¿Y el trabajo, bien?»','«Tu primo ya se ha comprado un piso»'],
// Lo que pasa con la comida
comida:['Sobran langostinos','Alguien se quema con la sopa','El asado tarda más de lo previsto','Pelea por el último trozo','Alguien pela gambas con cuchillo y tenedor',
 'Mancha en el mantel bueno','Alguien no prueba nada «porque está a dieta»','Turrón duro que no hay quien parta','Sale el mismo postre de todos los años','Alguien repite tres veces','Se acaba el pan'],
// La mesa y los brindis
mesa:['Brindis que nadie escucha','Alguien da golpecitos a la copa','Se rompe una copa o un plato','Alguien pide silencio y no lo consigue','Faltan sillas',
 'Mesa supletoria para los primos','Alguien se sienta en el sitio de otro','Se brinda dos veces'],
// Tele y móviles
tele:['Videollamada con quien no ha venido','Foto de grupo que hay que repetir','Alguien con el móvil en la mesa','Audio de WhatsApp a todo volumen',
 'Llega una felicitación en cadena','El abuelo no sabe colgar la videollamada','Alguien pone la tele «solo un momento»','Alguien sube una historia de la cena'],
// Cosas de la familia
familia:['Alguien llega tarde','Anécdota de siempre contada otra vez','Se habla de un familiar que no está','Alguien llora de emoción','Comparan a dos primos',
 'Niño debajo de la mesa','El perro pidiendo comida','Alguien se ofrece a fregar y no le dejan','Jersey navideño','Gorro de Papá Noel','Alguien saca fotos viejas','Alguien sale a tomar el aire'],
// Discusiones
lio:['Sale la política','Alguien dice «no vamos a hablar de política»','Discusión por fútbol','Se habla del precio de la vivienda','Alguien defiende una teoría rara',
 'Alguien que lo sabe todo de todo','Debate sobre a qué hora se cenaba antes','Alguien se ofende por una broma'],
// La sobremesa
sofa:['Alguien se duerme en el sofá','Alguien se desabrocha el pantalón','Alguien dice «no puedo más» y sigue','Sacan la baraja o el parchís','Alguien bosteza sin disimulo','Se habla del cansancio del día'],
// Tradiciones
tradicion:['Se cantan villancicos','Sale la pandereta o la zambomba','Alguien canta desafinando con ganas','Se comenta el árbol o el belén','Se pone el discurso en la tele','Alguien habla de la lotería']
};
const ALPH='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const $=id=>document.getElementById(id)||document.createElement('textarea');
const grid=$('grid');
let S={size:4,mode:'serie',code:'',name:'',marks:[],cells:[],custom:'',start:0,lines:0,lineSung:false,bingo:false,end:0};

const load=()=>{try{const v=JSON.parse(localStorage.getItem('bingoNavidad')||'null');if(v&&v.cells)S=Object.assign(S,v)}catch(e){}};
const save=()=>{try{localStorage.setItem('bingoNavidad',JSON.stringify(S))}catch(e){}};

function hash(str){let h=2166136261;for(const c of str){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function rng(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function customList(){return[...new Set(S.custom.split('\n').map(x=>x.trim()).filter(Boolean))]}
function slots(size){return size*size-(size===5?1:0)}
function shuffle(p,r){for(let i=p.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[p[i],p[j]]=[p[j],p[i]]}return p}
const norm=s=>s.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
// Misma mesa + mismo nombre = mismo cartón. Cada primo, con su nombre, recibe uno distinto.
function build(code,size,name){
 const r=rng(hash(code+'|'+size+'|'+norm(name)));
 const base=[];for(const k in BASE)for(const t of BASE[k])base.push({t,c:k});
 shuffle(base,r);
 const n=slots(size);
 let cells;
 if(S.mode==='mine'){
  // Las frases de la familia van primero; si no llenan el cartón, se completa con las clásicas.
  const mine=shuffle(customList().map(t=>({t,c:'mio'})),r).slice(0,n);
  cells=shuffle(mine.concat(base.slice(0,n-mine.length)),r);
 }else cells=base.slice(0,n);
 if(size===5)cells.splice(12,0,{t:'¡Feliz Navidad!',c:'free'});
 return cells;
}
function newCode(){let s='';for(let i=0;i<4;i++)s+=ALPH[Math.floor(Math.random()*ALPH.length)];return s}
function startGame(code,size){
 S.size=size;S.code=code;S.cells=build(code,size,S.name);
 S.marks=S.cells.map(c=>c.c==='free');S.start=Date.now();S.lines=0;S.lineSung=false;S.bingo=false;S.end=0;
 save();render();
}
function linesDone(){
 const n=S.size,m=S.marks,L=[];
 for(let i=0;i<n;i++){L.push([...Array(n)].map((_,j)=>i*n+j));L.push([...Array(n)].map((_,j)=>j*n+i))}
 L.push([...Array(n)].map((_,j)=>j*n+j));L.push([...Array(n)].map((_,j)=>j*n+(n-1-j)));
 return L.filter(l=>l.every(k=>m[k]));
}
function render(){
 const n=S.size;
 grid.className='grid g'+n;grid.style.gridTemplateColumns=`repeat(${n},minmax(0,1fr))`;
 const done=linesDone(),win=new Set(done.flat());
 grid.innerHTML=S.cells.map((c,i)=>c.c==='free'
  ?`<div class="cell free on" aria-label="Casilla libre"><svg aria-hidden="true"><use href="#i-star"/></svg><span class="t">${esc(c.t)}</span></div>`
  :`<button class="cell${S.marks[i]?' on':''}${win.has(i)?' win':''}" data-i="${i}" aria-pressed="${S.marks[i]}" style="--c:${CAT[c.c]||CAT.mio}"><svg class="ic" aria-hidden="true"><use href="#i-${c.c}"/></svg><span class="t">${esc(c.t)}</span><i class="seal"></i></button>`).join('');
 document.querySelectorAll('[data-size]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.size===n));
 document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===S.mode));
 $('who').textContent=S.name?'Cartón de '+S.name:'Tu cartón';
 const full=S.code+'-'+n;$('code').textContent=full;$('codeTop').textContent=full;
 customInfo();
 const tot=S.marks.length,mk=S.marks.filter(Boolean).length;
 $('sMarks').textContent=mk+'/'+tot;$('sLines').textContent=done.length;$('sLeft').textContent=tot-mk;
 $('meter').style.width=(mk/tot*100)+'%';
 tick();
}
function esc(s){return s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function fmt(ms){const s=Math.floor(ms/1000),h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return(h?h+':'+String(m).padStart(2,'0'):m)+':'+String(x).padStart(2,'0')}
function tick(){$('clock').textContent=fmt((S.end||Date.now())-S.start)}
setInterval(tick,1000);

let toastT;
function toast(t){const el=$('toast');el.textContent=t;el.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>el.classList.remove('show'),1800)}

grid.addEventListener('click',e=>{
 const b=e.target.closest('button.cell');if(!b)return;
 const i=+b.dataset.i;S.marks[i]=!S.marks[i];
 const before=S.lines,now=linesDone().length;S.lines=now;
 if(navigator.vibrate)try{navigator.vibrate(S.marks[i]?25:10)}catch(_){}
 const all=S.marks.every(Boolean);
 if(all&&!S.bingo){S.bingo=true;S.end=Date.now();save();render();showWin();return}
 if(!all&&S.bingo){S.bingo=false;S.end=0}
 // La línea se canta una sola vez por cartón: la primera. Después, solo queda el bingo.
 if(now>before&&!S.lineSung){S.lineSung=true;toast('¡Línea!')}
 save();render();
});
function showWin(){
 $('winP').textContent=(S.name?S.name+', cartón':'Cartón')+' completo en '+fmt(S.end-S.start)+'. Hoy te libras de fregar: que friegue el resto de la mesa.';
 $('winOv').classList.add('show');snow();
}
$('close').onclick=()=>$('winOv').classList.remove('show');
$('again').onclick=()=>{$('winOv').classList.remove('show');startGame(newCode(),S.size)};
$('nuevo').onclick=()=>{startGame(newCode(),S.size);$('msg').textContent='Mesa nueva: comparte el enlace otra vez con los primos.'};
document.querySelectorAll('[data-size]').forEach(b=>b.onclick=()=>startGame(S.code||newCode(),+b.dataset.size));
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));

function setMode(mode){
 if(mode==='mine'&&!customList().length){
  $('customMsg').textContent='Escribid primero vuestras frases aquí, una por línea.';
  $('customPanel').scrollIntoView({behavior:'smooth',block:'center'});$('custom').focus({preventScroll:true});
  return;
 }
 S.mode=mode;$('customMsg').textContent='';$('msg').textContent='';
 startGame(newCode(),S.size);
}
function customInfo(){
 const k=customList().length,n=slots(S.size),sz=S.size+'×'+S.size;
 let t;
 if(!k)t='Todavía no hay ninguna frase.';
 else if(k<n)t=`${k} frase${k>1?'s':''} vuestra${k>1?'s':''}. Un cartón ${sz} tiene ${n} casillas: el resto son clásicas.`;
 else if(k===n)t=`${k} frases: llenan un cartón ${sz} entero.`;
 else t=`${k} frases: a cada primo le tocan ${n} al azar.`;
 $('customInfo').textContent=t;
}
$('makeCustom').onclick=()=>{
 if(!customList().length){$('customMsg').textContent='Escribid al menos una frase.';$('custom').focus();return}
 setMode('mine');$('customMsg').textContent='¡Listo! Comparte el enlace para que los primos las tengan.';
 document.querySelector('.card').scrollIntoView({behavior:'smooth',block:'start'});
};

// Nombre: cambia el cartón pero no la mesa
function setName(){
 const v=$('name').value.trim().slice(0,24);
 if(!v){$('msg').textContent='Escribe tu nombre para tener tu propio cartón.';$('name').focus();return}
 if(v===S.name){$('msg').textContent='Ese ya es tu cartón, '+v+'.';return}
 S.name=v;startGame(S.code||newCode(),S.size);
 $('msg').textContent='¡Hola, '+v+'! Este es tu cartón para la mesa '+S.code+'-'+S.size+'.';
 document.querySelector('.card').scrollIntoView({behavior:'smooth',block:'start'});
}
$('nameBtn').onclick=setName;
$('name').addEventListener('keydown',e=>{if(e.key==='Enter')setName()});

// Compartir: el enlace lleva la mesa y, si hay frases propias, también las frases (nunca el nombre)
const b64e=s=>btoa(String.fromCharCode(...new TextEncoder().encode(s))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const b64d=s=>new TextDecoder().decode(Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0)));
function shareUrl(){
 const p=new URLSearchParams({j:S.code+'-'+S.size});
 if(S.mode==='mine')p.set('c',b64e(customList().join('\n')));
 return location.origin+location.pathname+'#'+p;
}
$('link').onclick=async()=>{
 const url=shareUrl();
 if(navigator.share){try{await navigator.share({title:'Bingo de la cena',text:'¡Únete a mi mesa del bingo de Navidad! Pon tu nombre y tendrás tu cartón.',url});return}catch(e){if(e.name==='AbortError')return}}
 try{await navigator.clipboard.writeText(url);$('msg').textContent='Enlace copiado. Pásalo al grupo de los primos.'}
 catch(e){$('msg').textContent='Copia este enlace: '+url}
};
function fromLink(){
 if(!location.hash)return false;
 const p=new URLSearchParams(location.hash.slice(1));
 const j=(p.get('j')||'').toUpperCase().match(/^([A-Z0-9]{4})-([345])$/);
 if(!j)return false;
 const c=p.get('c');
 if(c){try{S.custom=b64d(c);S.mode='mine'}catch(e){return false}}else S.mode='serie';
 history.replaceState(null,'',location.pathname+location.search);
 startGame(j[1],+j[2]);
 askName('¡Estás en la mesa '+j[1]+'-'+j[2]+'!');
 return true;
}
function askName(hello){
 if(S.name){$('msg').textContent=hello+' Este es tu cartón, '+S.name+'.';return}
 $('msg').textContent=hello+' Escribe tu nombre para recibir tu cartón.';
 $('playPanel').scrollIntoView({behavior:'smooth',block:'center'});$('name').focus({preventScroll:true});
}

$('copy').onclick=async()=>{
 const t=S.code+'-'+S.size;
 const extra=S.mode==='mine'?' (con vuestras frases, mejor el enlace)':'';
 try{await navigator.clipboard.writeText(t);$('msg').textContent='Código copiado: '+t+extra}
 catch(e){$('msg').textContent='Díselo a los primos: '+t+extra}
};
$('joinBtn').onclick=()=>{
 const v=$('join').value.toUpperCase().replace(/\s/g,'');
 const m=v.match(/^([A-Z0-9]{4})-?([345])?$/);
 if(!m){$('msg').textContent='Ese código no vale. Tiene que ser como KQ7M-4.';return}
 if(S.mode==='mine'){S.mode='serie'}
 startGame(m[1],m[2]?+m[2]:S.size);$('join').value='';
 askName('¡Dentro de la mesa '+S.code+'-'+S.size+'!');
};
$('custom').addEventListener('input',e=>{
 S.custom=e.target.value;save();customInfo();
 $('customMsg').textContent=S.mode==='mine'?'Pulsa «Usar nuestras frases» para aplicar los cambios.':'';
});
addEventListener('hashchange',()=>{if(fromLink())$('custom').value=S.custom});

// Al cantar bingo: nieve y estrellas doradas
const cv=$('fx'),cx=cv.getContext('2d');
function snow(){
 if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const W=cv.width=innerWidth,H=cv.height=innerHeight,cols=['#ffffff','#ffffff','#d9ac4f','#e5484d','#46b17b'];
 const P=[...Array(170)].map(()=>({x:Math.random()*W,y:-Math.random()*H*.8,vx:(Math.random()-.5)*1.4,vy:Math.random()*2.5+1.5,s:Math.random()*4+2,w:Math.random()*6,c:cols[Math.floor(Math.random()*cols.length)]}));
 let f=0;
 const step=()=>{cx.clearRect(0,0,W,H);for(const p of P){p.w+=.05;p.x+=p.vx+Math.sin(p.w)*.6;p.y+=p.vy;cx.fillStyle=p.c;cx.beginPath();cx.arc(p.x,p.y,p.s,0,7);cx.fill()}
  if(++f<260)requestAnimationFrame(step);else cx.clearRect(0,0,W,H)};
 step();
}

load();
if(S.mode!=='mine')S.mode='serie';
const broken=!Array.isArray(S.cells)||!S.cells.length||!Array.isArray(S.marks)||S.marks.length!==S.cells.length;
if(!fromLink()){
 if(broken){S.mode='serie';startGame(newCode(),[3,4,5].includes(S.size)?S.size:4)}
 else{try{render()}catch(e){S.mode='serie';startGame(newCode(),4)}}
}
$('custom').value=S.custom;
$('name').value=S.name;
}

// App instalable y offline (PWA)
if('serviceWorker' in navigator && location.protocol!=='file:'){
 addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
}
