'use client';

import * as React from 'react';
import {ArrowRight} from 'lucide-react';

type FlowButtonProps=React.ButtonHTMLAttributes<HTMLButtonElement>&{text?:string};

function FlowButtonContent({text}:{text:string}){
 return <>
  <ArrowRight className="flow-arrow flow-arrow-left" aria-hidden="true"/>
  <span className="flow-label">{text}</span>
  <span className="flow-circle" aria-hidden="true"/>
  <ArrowRight className="flow-arrow flow-arrow-right" aria-hidden="true"/>
 </>;
}

export function FlowButton({text='Modern Button',className='',type='button',...props}:FlowButtonProps){
 return <button type={type} className={`flow-button ${className}`} {...props}><FlowButtonContent text={text}/></button>;
}

export function FlowLink({text,href,download=false}:{text:string;href:string;download?:boolean}){
 return <a className="flow-button" href={href} download={download||undefined}><FlowButtonContent text={text}/></a>;
}
