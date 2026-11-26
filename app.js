{
const CAT={animal:'#c2410c',gente:'#2546d8',ropa:'#a21caf',vehiculo:'#0f766e',calle:'#57534e',cielo:'#0284c7',comida:'#d97706',raro:'#be123c',mio:'#4d7c0f'};
const BASE={
animal:['Perro con ropa','Perro en un bolso o carrito','Dos perros iguales','Perro salchicha','Gato en una ventana','Paloma comiendo algo raro','Perro con lacito','Perro tirando de su dueño'],
gente:['Niño con globo','Pareja vestida a juego','Alguien hablando solo con cascos','Abuelo con boina','Alguien corriendo tras el bus','Despedida de soltero/a','Turista con mapa','Alguien bailando en la calle','Señora con carro de la compra','Bebé llorando','Alguien haciéndose un selfie','Músico callejero','Alguien en zapatillas de casa','Alguien con un ramo de flores','Persona disfrazada','Alguien cargando un mueble','Grupo con guía y banderita','Abuelos de la mano'],
ropa:['Calcetines con sandalias','Sombrero llamativo','Camiseta de fútbol','Alguien vestido de un solo color','Gafas de sol en la cabeza','Abrigo de pelo','Chándal completo','Riñonera','Camiseta con frase en inglés','Pijama en la calle','Botas de agua'],
vehiculo:['Coche con la L','Moto de reparto','Coche tuneado','Bici con cesta','Furgoneta de mudanza','Coche mal aparcado','Camión de la basura','Descapotable','Taxi libre','Grúa llevándose un coche','Patinete eléctrico','Coche con pegatinas','Autobús turístico'],
calle:['Obra con vallas','Alguien leyendo en un banco','Grafiti de un animal','Cartel con faltas','Zapato abandonado','Buzón amarillo','Cola en una tienda','Ropa tendida en un balcón','Bandera en un balcón','Carrito de súper abandonado','Charco enorme','Cartel de se vende','Terraza llena','Fuente','Peluche perdido','Bicicleta sin rueda'],
cielo:['Avión en el cielo','Nube con forma de algo','Árbol en flor','Macetas en una ventana','Luna de día','Pájaro en un cable','Hoja gigante'],
comida:['Alguien con helado','Churrería','Alguien con barra de pan','Puesto de castañas','Café para llevar','Alguien comiendo andando','Bolsa de la panadería','Alguien con pipas'],
raro:['Estatua humana','Alguien empujando un coche','Animal exótico de paseo','Alguien con loro o hurón','Coche lleno de globos','Algo de otra época']
};
const ALPH='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
// Si falta algún elemento (p. ej. el navegador aún tiene un index.html de otra versión),
// usamos uno de mentira en vez de romper el juego entero.
const $=id=>document.getElementById(id)||document.createElement('textarea');
const grid=$('grid');
let S={size:4,mode:'serie',code:'',marks:[],cells:[],custom:'',start:0,lines:0,bingo:false,end:0};

const load=()=>{try{const v=JSON.parse(localStorage.getItem('bingoCalle')||'null');if(v&&v.cells)S=Object.assign(S,v)}catch(e){}};
const save=()=>{try{localStorage.setItem('bingoCalle',JSON.stringify(S))}catch(e){}};

function hash(str){let h=2166136261;for(const c of str){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function rng(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function customList(){return[...new Set(S.custom.split('\n').map(x=>x.trim()).filter(Boolean))]}
function slots(size){return size*size-(size===5?1:0)}
function shuffle(p,r){for(let i=p.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[p[i],p[j]]=[p[j],p[i]]}return p}
function build(code,size){
 const r=rng(hash(code+'|'+size));
 const base=[];for(const k in BASE)for(const t of BASE[k])base.push({t,c:k});
 shuffle(base,r);
 let cells;
 if(S.mode==='mine'){
  // Cartón personalizado: salen todas tus casillas (o una selección si hay más de las que caben)
  // y los huecos que queden se rellenan con casillas de serie.
  const n=slots(size),mine=shuffle(customList().map(t=>({t,c:'mio'})),r).slice(0,n);
  cells=shuffle(mine.concat(base.slice(0,n-mine.length)),r);
  if(size===5)cells.splice(12,0,{t:'LIBRE',c:'free'});
 }else{
  cells=base.slice(0,size*size);
  if(size===5)cells[12]={t:'LIBRE',c:'free'};
 }
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
function render(){
 const n=S.size;
 grid.className='grid g'+n;grid.style.gridTemplateColumns=`repeat(${n},minmax(0,1fr))`;
 const done=linesDone(),win=new Set(done.flat());
 grid.innerHTML=S.cells.map((c,i)=>c.c==='free'
  ?`<div class="cell free on" aria-label="Casilla libre"><span class="t">LIBRE</span></div>`
  :`<button class="cell${S.marks[i]?' on':''}${win.has(i)?' win':''}" data-i="${i}" aria-pressed="${S.marks[i]}" style="--c:${CAT[c.c]}"><svg class="ic" aria-hidden="true"><use href="#i-${c.c}"/></svg><span class="t">${esc(c.t)}</span><i class="stamp"></i></button>`).join('');
 document.querySelectorAll('[data-size]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.size===n));
 document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===S.mode));
 $('cardLabel').textContent=S.mode==='mine'?'Mi cartón':'Cartón';
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
 $('winP').textContent='Cartón completo en '+fmt(S.end-S.start)+'. ¡Te toca elegir dónde merendáis!';
 $('winOv').classList.add('show');confetti();
}
$('close').onclick=()=>$('winOv').classList.remove('show');
$('again').onclick=()=>{$('winOv').classList.remove('show');startGame(newCode(),S.size)};
$('nuevo').onclick=()=>startGame(newCode(),S.size);
document.querySelectorAll('[data-size]').forEach(b=>b.onclick=()=>startGame(S.code||newCode(),+b.dataset.size));
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));

function setMode(mode){
 if(mode==='mine'&&!customList().length){
  $('customMsg').textContent='Escribe primero tus casillas aquí, una por línea.';
  $('customPanel').scrollIntoView({behavior:'smooth',block:'center'});$('custom').focus({preventScroll:true});
  return;
 }
 S.mode=mode;$('customMsg').textContent='';$('msg').textContent='';
 startGame(newCode(),S.size);
}
function customInfo(){
 const k=customList().length,n=slots(S.size),sz=S.size+'×'+S.size;
 let t;
 if(!k)t='Aún no has escrito ninguna casilla.';
 else if(k<n)t=`${k} casilla${k>1?'s':''} tuya${k>1?'s':''}. Un cartón ${sz} tiene ${n}: se completa con ${n-k} de serie.`;
 else if(k===n)t=`${k} casillas: llenas un cartón ${sz} entero.`;
 else t=`${k} casillas: en cada cartón ${sz} salen ${n} al azar.`;
 $('customInfo').textContent=t;
}
$('makeCustom').onclick=()=>{
 if(!customList().length){$('customMsg').textContent='Escribe al menos una casilla.';$('custom').focus();return}
 setMode('mine');$('customMsg').textContent='¡Cartón creado con tus casillas!';
 document.querySelector('.ticket').scrollIntoView({behavior:'smooth',block:'start'});
};

// Compartir: el enlace lleva el código y, si es personalizado, también las casillas
const b64e=s=>btoa(String.fromCharCode(...new TextEncoder().encode(s))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const b64d=s=>new TextDecoder().decode(Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0)));
function shareUrl(){
 const p=new URLSearchParams({j:S.code+'-'+S.size});
 if(S.mode==='mine')p.set('c',b64e(customList().join('\n')));
 return location.origin+location.pathname+'#'+p;
}
$('link').onclick=async()=>{
 const url=shareUrl();
 if(navigator.share){try{await navigator.share({title:'Bingo callejero',text:'¡Juega conmigo con este cartón!',url});return}catch(e){if(e.name==='AbortError')return}}
 try{await navigator.clipboard.writeText(url);$('msg').textContent='Enlace copiado. Mándaselo a tu pareja.'}
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
 $('msg').textContent='¡Cartón cargado desde el enlace! A buscar.';
 return true;
}

$('copy').onclick=async()=>{
 const t=S.code+'-'+S.size;
 const extra=S.mode==='mine'?' (con un cartón personalizado, mejor el enlace)':'';
 try{await navigator.clipboard.writeText(t);$('msg').textContent='Código copiado: '+t+extra}
 catch(e){$('msg').textContent='Díselo a tu pareja: '+t+extra}
};
$('joinBtn').onclick=()=>{
 const v=$('join').value.toUpperCase().replace(/\s/g,'');
 const m=v.match(/^([A-Z0-9]{4})-?([345])?$/);
 if(!m){$('msg').textContent='Ese código no vale. Tiene que ser como KQ7M-4.';return}
 startGame(m[1],m[2]?+m[2]:S.size);$('join').value='';
 $('msg').textContent='¡Listo! Tenéis el mismo cartón. ¡A buscar!';
};
$('custom').addEventListener('input',e=>{
 S.custom=e.target.value;save();customInfo();
 $('customMsg').textContent=S.mode==='mine'?'Pulsa «Crear mi cartón» para usar los cambios.':'';
});
addEventListener('hashchange',()=>{if(fromLink())$('custom').value=S.custom});

const cv=$('fx'),cx=cv.getContext('2d');
function confetti(){
 if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const W=cv.width=innerWidth,H=cv.height=innerHeight,cols=['#ffd23f','#2546d8','#ffffff','#e8432e','#0f766e'];
 const P=[...Array(160)].map(()=>({x:W/2,y:H/2,vx:(Math.random()-.5)*14,vy:-Math.random()*16-4,s:Math.random()*7+4,r:Math.random()*6,c:cols[Math.floor(Math.random()*cols.length)]}));
 let f=0;
 const step=()=>{cx.clearRect(0,0,W,H);for(const p of P){p.vy+=.45;p.x+=p.vx;p.y+=p.vy;p.r+=.2;cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.fillStyle=p.c;cx.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);cx.restore()}
  if(++f<170)requestAnimationFrame(step);else cx.clearRect(0,0,W,H)};
 step();
}

load();
delete S.useCustom; // versión anterior: casillas mezcladas con un check
if(S.mode!=='mine')S.mode='serie';
if(S.lineSung===undefined)S.lineSung=S.lines>0; // partidas guardadas con la versión anterior
const broken=!Array.isArray(S.cells)||!S.cells.length||!Array.isArray(S.marks)||S.marks.length!==S.cells.length;
if(!fromLink()){
 if(broken){S.mode='serie';startGame(newCode(),[3,4,5].includes(S.size)?S.size:4)}
 else{try{render()}catch(e){S.mode='serie';startGame(newCode(),4)}}
}
$('custom').value=S.custom;
}

// App instalable y offline (PWA)
if('serviceWorker' in navigator && location.protocol!=='file:'){
 addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
}
