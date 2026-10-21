/* Provider interfaces — every external service behind an interface. Local = real client-side work. Stub = honest "not configured". */
(function(g){
'use strict';
function stubStatus(name){return {name,configured:false,status:'not-connected',message:name+' provider is not connected — demo/stub only. No external call was made.'};}
class LanguageModelProvider{async generate(){throw new Error('not implemented');} status(){return stubStatus('LanguageModel');}}
class LocalTemplateLanguageProvider extends LanguageModelProvider{
 status(){return {name:'LocalTemplateLanguage',configured:true,status:'local',message:'Deterministic local templates only. No LLM call.'};}
 async generate(prompt){return {text:'[Local template] '+String(prompt||'').slice(0,2000),provider:'LocalTemplateLanguage',external:false};}
}
class StubGeminiProvider extends LanguageModelProvider{status(){return stubStatus('Gemini');} async generate(){return {error:'not-configured',...stubStatus('Gemini')};}}
class ImageGenerationProvider{status(){return stubStatus('ImageGeneration');}}
class LocalCanvasImageProvider extends ImageGenerationProvider{status(){return {name:'LocalCanvas',configured:true,status:'local',message:'Generative SVG/canvas art rendered locally in-browser. No external image model.'};}}
class SpeechGenerationProvider{status(){return stubStatus('SpeechGeneration');}}
class LocalSpeechProvider extends SpeechGenerationProvider{status(){return {name:'BrowserSpeechSynthesis',configured:typeof speechSynthesis!=='undefined',status:'local',message:'Uses browser SpeechSynthesis if available. No audio file is produced; script + local narration only.'};}}
class VideoGenerationProvider{status(){return stubStatus('VideoGeneration');} async generate(){return {error:'not-configured',fallback:'storyboard',...stubStatus('VideoGeneration')} };}
class PaymentProvider{status(){return stubStatus('Payment (Stripe)');} async checkout(){return {error:'not-configured',...stubStatus('Payment (Stripe)')} };}
class StorageProvider{}
class LocalStorageProvider extends StorageProvider{
 constructor(ns){super();this.ns=ns||'hm-studio-v1:';}
 status(){return {name:'LocalStorage',configured:true,status:'local',message:'Data stays in this browser (localStorage). Export from Account to move it.'};}
 get(k,f){try{const v=localStorage.getItem(this.ns+k);return v?JSON.parse(v):f;}catch(e){return f;}}
 set(k,v){try{localStorage.setItem(this.ns+k,JSON.stringify(v));return true;}catch(e){return false;}}
 remove(k){try{localStorage.removeItem(this.ns+k);}catch(e){}}
 keys(){const out=[];try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith(this.ns))out.push(k.slice(this.ns.length));}}catch(e){}return out;}
}
class AuthProvider{status(){return {name:'LocalAuth',configured:true,status:'local',message:'Single local user, no password, no server. This is device-local identity only.'};}}
const Providers={LanguageModelProvider,LocalTemplateLanguageProvider,StubGeminiProvider,ImageGenerationProvider,LocalCanvasImageProvider,SpeechGenerationProvider,LocalSpeechProvider,VideoGenerationProvider,PaymentProvider,StorageProvider,LocalStorageProvider,AuthProvider,
 registry(){return [new LocalTemplateLanguageProvider(),new StubGeminiProvider(),new LocalCanvasImageProvider(),new LocalSpeechProvider(),new VideoGenerationProvider(),new PaymentProvider(),new LocalStorageProvider(),new AuthProvider()].map(p=>{try{return p.status();}catch(e){return {name:'?',configured:false,status:'error'};}});}};
if(typeof module!=='undefined'&&module.exports)module.exports=Providers; g.HMProviders=Providers;
})(typeof window!=='undefined'?window:globalThis);
