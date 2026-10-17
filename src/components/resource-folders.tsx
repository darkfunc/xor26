import * as React from 'react';
import {createRoot} from 'react-dom/client';
import GlassFolder, {type ArtRecipe} from './ui/glass-folder-cards';
import {FlowLink} from './ui/flow-button';
import {GlassFold} from './ui/glass-fold';

declare global { interface Window { XOR_EVENTS: {id:string;name:string;type:string}[] } }
const emerald:ArtRecipe={style:'marble',colors:['#0D1117','#0A2F1D','#00E676','#A8F5D2','#0A2F1D'],scale:.7,warp:3.2,gloss:.35,veins:.3};
function ResourceFolders(){
 const ref=React.useRef<HTMLDivElement>(null);
 const [width,setWidth]=React.useState(300);
 React.useEffect(()=>{
  const el=ref.current;if(!el)return;
  const ro=new ResizeObserver(()=>setWidth(Math.min(300,(el.firstElementChild?.clientWidth||el.clientWidth)-32)));
  ro.observe(el);return ()=>ro.disconnect();
 },[]);
 const openBrief=(id:string)=>document.dispatchEvent(new CustomEvent('xor-open-event',{detail:{id,trigger:document.activeElement}}));
 return <div className="resource-folders" ref={ref}>
  {['team','individual'].map((type,i)=>{
   const events=window.XOR_EVENTS.filter(e=>e.type===type);
   return <div className="resource-folder-cell" key={type}>
    <GlassFolder label={type==='team'?'Team challenges':'Individual challenges'} meta={`${events.length} competition briefs`} tone="dark" art={emerald} seed={i?17:3} action="none" width={width} appear={false} files={events.map(e=>({name:e.name,meta:'RULES'}))} onFileSelect={(_,index)=>openBrief(events[index].id)}/>
   </div>;
  })}
  <div className="resource-folder-cell"><GlassFolder label="The rulebook" meta="Complete competition guidelines" tone="dark" art={{...emerald,style:'streak',warp:1.6}} seed={8} action="none" width={width} appear={false} files={[{name:'XOR 26 Guidelines',meta:'PDF',href:'assets/XOR-26-Competition-Guidelines.pdf'}]}/></div>
 </div>;
}
const host=document.getElementById('resource-folders');
const heroGlass=document.getElementById('hero-glass');
if(heroGlass)createRoot(heroGlass).render(<GlassFold color1="#0A2F1D" color2="#0D1117" color3="#00E676" speed={0.22} scale={0.85} noise={0.025}/>);
if(host)createRoot(host).render(<ResourceFolders/>);
document.querySelectorAll<HTMLElement>('[data-flow]').forEach(el=>{
 const link=el.querySelector('a');if(!link)return;
 const label=link.textContent?.trim()||'Explore competitions';
 const href=link.getAttribute('href')||'#competitions';
 const download=link.hasAttribute('download');
 createRoot(el).render(<FlowLink text={label} href={href} download={download}/>);
});
