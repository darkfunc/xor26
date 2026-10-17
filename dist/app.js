(() => {
'use strict';
const events=window.XOR_EVENTS;
const icon=window.xorIcon;
const dialog=document.querySelector('#event-dialog');
const dialogContent=document.querySelector('#dialog-content');
const closeDialog=document.querySelector('#close-dialog');
let lastTrigger;
function openEvent(id,trigger){const e=events.find(x=>x.id===id);if(!e||!dialog||!dialogContent)return;lastTrigger=trigger;dialogContent.innerHTML=`<h2 id="dialog-title">${e.name}</h2><p id="dialog-theme" class="dialog-theme">${e.theme}</p><div class="event-meta"><span>GRADES 6–13</span><span>${e.team.toUpperCase()}</span><span>${e.format.toUpperCase()}</span></div><div class="full-rules">${e.rules}</div>`;dialog.showModal();document.body.style.overflow='hidden';dialog.scrollTop=0;closeDialog?.focus();}
document.addEventListener('xor-open-event',e=>openEvent(e.detail.id,e.detail.trigger));
closeDialog?.addEventListener('click',()=>dialog?.close());
dialog?.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog?.addEventListener('close',()=>{document.body.style.overflow='';lastTrigger?.focus();});
dialog?.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const focusable=[...dialog.querySelectorAll('button,a[href],summary,[tabindex]:not([tabindex="-1"])')].filter(el=>!el.hasAttribute('disabled'));if(!focusable.length)return;const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
const toggle=document.querySelector('#motion-toggle'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
let paused=reduced.matches;
function syncMotion(){
 document.documentElement.dataset.motion=paused?'paused':'running';
 if(toggle){
  toggle.innerHTML=(paused?'Resume motion ':'Pause motion ')+icon(paused?'play':'pause');
  toggle.setAttribute('aria-pressed',String(paused));
 }
 document.dispatchEvent(new CustomEvent('xor-motion',{detail:{paused}}));
}
toggle?.addEventListener('click',()=>{paused=!paused;syncMotion();});
reduced.addEventListener('change',e=>{paused=e.matches;syncMotion();});
syncMotion();
})();
