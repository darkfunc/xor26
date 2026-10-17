(() => {
'use strict';
const root=document.documentElement;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
root.dataset.theme='dark';
let stopped=root.dataset.motion==='paused'||reduced.matches;
const animationSet=new Set();
function animate(el,frames,options){
 if(stopped||!el.animate)return;
 const a=el.animate(frames,options);animationSet.add(a);
 a.onfinish=()=>animationSet.delete(a);a.oncancel=()=>animationSet.delete(a);
}
const revealFrames=[{opacity:0,transform:'translateY(28px)',filter:'blur(8px)'},{opacity:1,transform:'translateY(0)',filter:'blur(0)'}];
const timing={duration:900,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'};
// Content stays visible without JS or observers. Only off-screen items are armed.
const reveals=[...document.querySelectorAll('.section-heading h2,.section-heading>p,.intro h2,.intro p,.intro-facts>div,.event-card,.guide-intro>*,.guide-body>*,.closing>h2,.closing>.button')];
const pending=new Set();
let revealObserver;
if('IntersectionObserver' in window){
 revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting)return;
  const el=entry.target;
  el.style.opacity='';
  const delay=el.classList.contains('event-card')?(el.getBoundingClientRect().left/Math.max(innerWidth,1))*180:0;
  animate(el,revealFrames,{...timing,delay});
  pending.delete(el);revealObserver.unobserve(el);
 }),{rootMargin:'0px 0px -8% 0px',threshold:0});
 if(!stopped)reveals.forEach(el=>{if(el.getBoundingClientRect().top>innerHeight){el.style.opacity='0';pending.add(el);revealObserver.observe(el);}});
}
document.querySelectorAll('.hero-copy>*').forEach((el,i)=>animate(el,revealFrames,{...timing,delay:70*i}));
if('IntersectionObserver' in window){
 const framesObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting)return;
  const section=entry.target,band=section.querySelector('.section-band');
  if(band){const line=document.createElement('span');line.className='draw-rule';line.setAttribute('aria-hidden','true');band.append(line);animate(line,[{transform:'scaleX(0)'},{transform:'scaleX(1)'}],{duration:700,easing:'cubic-bezier(.22,1,.36,1)'});}
  framesObserver.unobserve(section);
 }),{rootMargin:'0px 0px -8% 0px'});
 document.querySelectorAll('main>section').forEach(s=>framesObserver.observe(s));
}
// Small pointer-driven lighting effects; native scrolling remains untouched.
document.querySelectorAll('.event-card').forEach(card=>{
 card.addEventListener('pointermove',e=>{
  if(stopped||e.pointerType==='touch')return;
  const r=card.getBoundingClientRect();
  card.style.setProperty('--light-x',((e.clientX-r.left)/r.width*100)+'%');
  card.style.setProperty('--light-y',((e.clientY-r.top)/r.height*100)+'%');
  card.classList.add('pointer-lit');
 });
 card.addEventListener('pointerleave',()=>card.classList.remove('pointer-lit'));
});
function stopEffects(paused){
 stopped=paused;if(paused)document.querySelectorAll('.pointer-lit').forEach(c=>c.classList.remove('pointer-lit'));
 if(paused){animationSet.forEach(a=>a.finish());pending.forEach(el=>{el.style.opacity='';revealObserver?.unobserve(el);});pending.clear();}
}
document.addEventListener('xor-motion',e=>stopEffects(e.detail.paused));
document.addEventListener('focusin',e=>{pending.forEach(el=>{if(el.contains(e.target)){el.style.opacity='';pending.delete(el);revealObserver?.unobserve(el);}});});
const sections=[...document.querySelectorAll('main>section')];
const names={'top':'XOR ’26','intro':'THE INVITATION','competitions':'COMPETITIONS','guidelines':'GUIDELINES','beyond':'GO BEYOND'};
const links=[...document.querySelectorAll('[data-section]')];
let tick=0;
function updateRuler(){
 tick=0;
 const max=Math.max(1,root.scrollHeight-innerHeight),progress=Math.min(1,Math.max(0,scrollY/max));
 document.querySelector('#reading-bar').style.transform='scaleX('+progress+')';
 document.querySelector('#ruler-marker').style.top=(progress*100)+'%';
 document.querySelector('#ruler-percent').textContent=String(Math.round(progress*100)).padStart(2,'0');
 let active=sections[0];
 for(const section of sections){if(section.getBoundingClientRect().top<innerHeight*.38)active=section;}
 links.forEach(a=>a.setAttribute('aria-current',String(a.dataset.section===active.id)));
 document.querySelector('#ruler-label').textContent=names[active.id]||'XOR ’26';
}
function schedule(){if(!tick)tick=requestAnimationFrame(updateRuler);}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);updateRuler();
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{pending.forEach(el=>{if(el.classList.contains('event-card')){el.style.opacity='';revealObserver?.unobserve(el);pending.delete(el);}});schedule();}));

})();
