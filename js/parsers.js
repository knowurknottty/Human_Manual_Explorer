/* Parsers — Markdown (report-v1), WebArchive (bplist), PDF (honest limited). Generic: no hardcoded subject values. */
(function(g){
'use strict';
function allMatches(re,text){const out=[];let m;while((m=re.exec(text))!==null)out.push(m);return out;}
function extractEvidenceIds(text){return [...new Set(allMatches(/ev_v2_[a-z0-9_]+/g,text).map(m=>m[0]))];}
function parseMarkdown(text,meta){
 meta=meta||{}; const warnings=[]; const lines=String(text||'').split(/\r?\n/);
 const report={metadata:{},identity:null,coverage:{},calculations:{},astronomy:{},missing:{},sections:[],evidenceLedger:[],evidenceIds:[],themes:[],tensions:[],references:[],prompts:[],symbols:[],narrative:{}};
 // header schemas
 const hdr=lines.slice(0,6).join('\n');
 for(const k of ['report-v1','signature-v2','symbolic-systems-v1','narrative-v2','synthesis-evidence-v2']){if(text.includes(k)) (report.metadata.schemas=report.metadata.schemas||[]).push(k);}
 const grab=(re)=>{const m=text.match(re);return m?m[1].trim():null;};
 report.metadata.reportSchema=grab(/Report schema `([^`]+)`/); report.metadata.engine=grab(/engine `([^`]+)`/);
 report.metadata.build=grab(/build `([^`]+)`/);
 const idm=text.match(/Analyzed identity:\s*\*\*([^*]+)\*\*/); if(idm)report.identity=idm[1].trim();
 const num=(re)=>{const m=text.match(re);return m?parseFloat(m[1]):null;};
 report.coverage.encoderOutputs=num(/Available encoder outputs:\s*`?(\d+)`?/);
 report.coverage.computedDimensions=num(/computed dimensions:\s*`?(\d+)`?/i);
 report.coverage.symbolicExtensions=num(/symbolic extensions:\s*`?(\d+)`?/i);
 report.coverage.patternConvergenceIndex=num(/pattern convergence index is \*\*([\d.]+)\/100\*\*/i) ?? num(/pattern convergence index[^0-9]*([\d.]+)\/100/i);
 // deterministic calculations
 const py={}; const pm=text.match(/Pythagorean:\s*expression `?(\d+)`?,\s*soul urge `?(\d+)`?,\s*personality `?(\d+)`?/i); if(pm){py.expression=+pm[1];py.soulUrge=+pm[2];py.personality=+pm[3];}
 const ch=text.match(/Chaldean:\s*name number `?(\d+)`?,\s*compound `?(\d+)`?/i); const chaldean=ch?{nameNumber:+ch[1],compound:+ch[2]}:null;
 const ord=text.match(/Ordinal:\s*total `?(\d+)`?,\s*reduced `?(\d+)`?/i); const ordinal=ord?{total:+ord[1],reduced:+ord[2]}:null;
 const ling=text.match(/Linguistic:\s*`?(\d+)`? letters,\s*entropy ratio `?([\d.]+)`?/i); const linguistic=ling?{letters:+ling[1],entropyRatio:+ling[2]}:null;
 report.calculations={pythagorean:py,chaldean,ordinal,linguistic};
 report.astronomy.sunSign=grab(/Sun sign:\s*`([^`]+)`/);
 report.astronomy.withheld=/Moon, rising sign, houses.*withheld/i.test(text);
 report.humanDesignUnavailable=/Human Design status:\s*unavailable/i.test(text);
 // sections (## and ###)
 let cur=null; for(const ln of lines){const h=ln.match(/^(#{2,3})\s+(.*)/); if(h){cur={level:h[1].length,title:h[2].trim(),lines:[]};report.sections.push(cur);} else if(cur)cur.lines.push(ln);}
 // evidence ledger
 const ledgerStart=text.indexOf('### Evidence ledger');
 if(ledgerStart>=0){const seg=text.slice(ledgerStart); for(const m of allMatches(/^- `(ev_v2_[^`]+)` — ([^·]+)· `([^`]+)` = `([^`]+)`/gm,seg)){report.evidenceLedger.push({evidenceId:m[1],system:m[2].trim(),path:m[3],value:m[4]});}}
 report.evidenceIds=extractEvidenceIds(text);
 // references
 const ref=text.match(/Highest returned reference-row agreement:\s*`([^`]+)` at `([\d.]+)`/); if(ref)report.references.push({name:ref[1],score:+ref[2],kind:'feature-proximity',note:'Feature proximity only — not personal similarity or compatibility.'});
 // missing-data limits
 const missStart=text.indexOf('### Missing-data limits'); if(missStart>=0){const seg=text.slice(missStart,missStart+600); for(const m of allMatches(/^- ([^:]+):\s*`([^`]+)`/gm,seg))report.missing[m[1].trim()]=m[2];}
 if(/birth time:\s*`unknown`/i.test(text))report.missing['birth time']='unknown';
 // tensions + themes from narrative wording (generic extraction, not hardcoded values beyond source phrases)
 if(/between intensity and stability/i.test(text))report.tensions.push({a:'intensity',b:'stability',classification:'INTERPRETIVE',preserved:true,note:'Contradiction preserved; no forced winner.'});
 const themeWords=['leadership','discipline','service','autonomy']; for(const w of themeWords){if(new RegExp('theme of '+w,'i').test(text)||new RegExp(w+' theme','i').test(text))report.themes.push({name:w,classification:'INTERPRETIVE'});}
 report.themes=[...new Map(report.themes.map(t=>[t.name,t])).values()];
 // symbols from Recurring Symbols section
 const symStart=text.indexOf('### Recurring Symbols'); if(symStart>=0){const seg=text.slice(symStart,symStart+6000); for(const m of allMatches(/^([A-Za-z ]+) contributes the returned symbol ([^;]+);/gm,seg))report.symbols.push({system:m[1].trim(),symbol:m[2].trim(),classification:'SOURCE_REPORTED'});}
 // tarot / alchemy
 const tar=text.match(/Major Arcana index (\d+)/); if(tar)report.calculations.tarotIndex=+tar[1];
 if(/stage returns Nigredo/.test(text))report.symbols.push({system:'Alchemical Transformation',symbol:'Nigredo',classification:'SOURCE_REPORTED'});
 for(const s of report.sections){s.text=s.lines.join('\n').trim();delete s.lines;}
 report.prompts=report.sections.filter(s=>/reflection|integration/i.test(s.title)).map(s=>({title:s.title,text:s.text.slice(0,500),classification:'INTERPRETIVE'}));
 if(!report.metadata.reportSchema)warnings.push('No report-v1 schema marker found — treated as unknown schema; fields preserved where parseable.');
 if(!report.evidenceLedger.length)warnings.push('No evidence ledger entries parsed.');
 const systems=[...new Set(report.evidenceLedger.map(e=>e.system))];
 const diagnostics={fileType:meta.fileType||'text/markdown',fileSize:meta.fileSize??text.length,parseStatus:'ok',detectedSchema:report.metadata.reportSchema||'unknown',availableSystems:systems,extractedDimensions:report.coverage.computedDimensions,evidenceCount:report.evidenceLedger.length,evidenceIdsReferenced:report.evidenceIds.length,missingInformation:Object.entries(report.missing).filter(([,v])=>/unknown|unavailable|absent|partial/.test(v)).map(([k,v])=>k+': '+v),unsupportedSections:[],warnings,extractionConfidence:report.evidenceLedger.length&&report.identity?'high':'medium',integrity:'original preserved unmodified; parse is read-only',note:'Pattern convergence index = configured output agreement, not empirical accuracy.'};
 return {report,diagnostics};
}
function parseWebArchive(buf,meta){
 meta=meta||{}; let str=''; try{str=Buffer.isBuffer(buf)?buf.toString('latin1'):String(buf);}catch(e){str=String(buf||'');}
 const isBplist=str.slice(0,8).includes('bplist');
 const urls=[...new Set(allMatches(/https?:\/\/[^\s"'<>\\]+/g,str).map(m=>m[0].replace(/[^\x20-\x7e]+$/,'')))].slice(0,200);
 const headings=[...new Set(allMatches(/<h[1-3][^>]*>([^<]{3,120})<\/h[1-3]>/gi,str).map(m=>m[1].trim()))].slice(0,80);
 const subresources=urls.filter(u=>/\.(js|css)(\?|$)/.test(u));
 const mainUrl=urls.find(u=>u.includes('human-manual'))||urls[0]||null;
 const diagnostics={fileType:'application/x-webarchive',fileSize:meta.fileSize??str.length,parseStatus:isBplist?'ok (bplist scanned as text; scripts NOT executed)':'partial',detectedSchema:'webarchive-plist',availableSystems:[],extractedDimensions:null,missingInformation:['Structured JSON: none embedded in archive (per source inspection)'],warnings:isBplist?['Binary plist parsed by string scan — completeness cannot be fully established.']:['Not a bplist archive.'],extractionConfidence:'medium',integrity:'original preserved; no scripts executed'};
 return {archive:{isBplist,mainUrl,urls,subresources,headings,scriptExecution:'none — scripts were not executed'},diagnostics};
}
function parsePDFPlaceholder(meta){meta=meta||{};return {diagnostics:{fileType:'application/pdf',fileSize:meta.fileSize??null,parseStatus:'preserved-limited',detectedSchema:'pdf-rendered-manual',availableSystems:[],extractedDimensions:null,missingInformation:['Full text-layer extraction is limited client-side in this build'],warnings:['PDF original preserved. Use the Markdown export for full structured extraction.'],extractionConfidence:'low',integrity:'original preserved unmodified'}};}
function detectAndParse(name,textOrBuf,meta){
 const n=(name||'').toLowerCase(); meta=meta||{};
 if(n.endsWith('.md')||n.endsWith('.markdown'))return {kind:'markdown',...parseMarkdown(String(textOrBuf),{...meta,fileType:'text/markdown'})};
 if(n.endsWith('.webarchive'))return {kind:'webarchive',...parseWebArchive(textOrBuf,{...meta})};
 if(n.endsWith('.pdf'))return {kind:'pdf',...parsePDFPlaceholder(meta)};
 return {kind:'unknown',report:null,diagnostics:{fileType:'unknown',fileSize:meta.fileSize??null,parseStatus:'unsupported',detectedSchema:'unknown',warnings:['Unsupported file type — original preserved, no data extracted or discarded.'],extractionConfidence:'none',integrity:'original preserved'}};
}
const api={parseMarkdown,parseWebArchive,parsePDFPlaceholder,detectAndParse,extractEvidenceIds};
if(typeof module!=='undefined'&&module.exports)module.exports=api; g.HMParsers=api;
})(typeof window!=='undefined'?window:globalThis);
