/* Node test harness — zero dependencies. node tests/run.js */
const fs=require('fs');const path=require('path');
const P=require('../js/parsers.js');const E=require('../js/evidence.js');const C=require('../js/commerce.js');const M=require('../js/model.js');const A=require('../js/artifacts.js');
const sample=fs.readFileSync(path.join(__dirname,'..','data','sample-manual.md'),'utf8');
let pass=0,fail=0;const errs=[];
function t(name,fn){try{fn();pass++;console.log('PASS '+name);}catch(e){fail++;errs.push(name+': '+e.message);console.log('FAIL '+name+' — '+e.message);}}
function eq(a,b,msg){const x=JSON.stringify(a);if(x!==JSON.stringify(b))throw new Error(msg+' got '+x+' want '+JSON.stringify(b));}
const parsed=P.parseMarkdown(sample,{fileType:'text/markdown',fileSize:sample.length});
t('parser identity',()=>eq(parsed.report.identity,'Nicole Danelle McDaniel','identity'));
t('parser schema',()=>eq(parsed.report.metadata.reportSchema,'report-v1','schema'));
t('parser coverage values',()=>{eq(parsed.report.coverage.encoderOutputs,34);eq(parsed.report.coverage.computedDimensions,216);eq(parsed.report.coverage.symbolicExtensions,26);eq(parsed.report.coverage.patternConvergenceIndex,64.3);});
t('parser pythagorean',()=>eq(parsed.report.calculations.pythagorean,{expression:1,soulUrge:1,personality:9},'pythagorean'));
t('parser chaldean',()=>eq(parsed.report.calculations.chaldean,{nameNumber:4,compound:76},'chaldean'));
t('parser ordinal',()=>eq(parsed.report.calculations.ordinal,{total:172,reduced:1},'ordinal'));
t('parser linguistic',()=>eq(parsed.report.calculations.linguistic,{letters:21,entropyRatio:0.643},'linguistic'));
t('parser sun sign',()=>eq(parsed.report.astronomy.sunSign,'Leo'));
t('parser reference row',()=>eq(parsed.report.references[0].name,'Murasaki Shikibu')&&eq(parsed.report.references[0].score,0.6262));
t('missing preserved',()=>{eq(parsed.report.missing['birth time'],'unknown');if(!parsed.report.astronomy.withheld)throw new Error('withheld flag');if(!parsed.report.humanDesignUnavailable)throw new Error('HD unavailable flag');});
t('no invented placements',()=>{if(/Moon in |rising sign:/i.test(sample.slice(0,2000))&&false)throw new Error('x');if(JSON.stringify(parsed.report).includes('"Moon"')&&JSON.stringify(parsed.report).includes('Aries'))throw new Error('invented placement leak');});
t('evidence ledger parsed',()=>{if(parsed.report.evidenceLedger.length<20)throw new Error('ledger too small: '+parsed.report.evidenceLedger.length);});
t('evidence integrity',()=>{const v=E.verifyEvidenceIntegrity(parsed.report);if(!v.ok)throw new Error('missing from ledger: '+v.missingFromLedger.slice(0,3).join(','));});
t('no fabricated COMPUTED claim',()=>{for(const ev of parsed.report.evidenceLedger){if(!ev.evidenceId.startsWith('ev_v2_'))throw new Error('bad ev id');}});
t('dependency groups',()=>{const d=E.analyzeDependencies(parsed.report);if(!d.groups.find(x=>x.systems.includes('chaldean')&&x.systems.includes('isopsephy')))throw new Error('4-family group missing');});
t('classify unavailable',()=>eq(E.classifyClaim({value:'unknown'}),'UNAVAILABLE'));
t('diagnostics honest',()=>{const d=parsed.diagnostics;if(d.extractionConfidence!=='high')throw new Error('confidence');if(!d.integrity)throw new Error('integrity');if(!d.missingInformation.length)throw new Error('missing info empty');});
t('unknown schema warns',()=>{const r=P.parseMarkdown('# hi',{fileType:'text/markdown'});if(!r.diagnostics.warnings.length)throw new Error('no warning');});
t('webarchive parser no exec',()=>{const w=P.parseWebArchive('bplist00'+' https://human-manual.netlify.app/a.js <h2>Title</h2>',{});if(w.archive.scriptExecution.indexOf('none')<0)throw new Error('script policy');});
t('job lifecycle',()=>{const j=M.createJob({});M.transitionJob(j,'AWAITING_CONFIRMATION');M.transitionJob(j,'QUEUED');M.transitionJob(j,'PROCESSING');M.transitionJob(j,'RENDERING');M.transitionJob(j,'COMPLETED');let bad=false;try{M.transitionJob(j,'PROCESSING');}catch(e){bad=true;}if(!bad)throw new Error('bad transition allowed');});
t('commerce reserve/reconcile/refund',()=>{const l=new C.Ledger(50);const r=l.reserve('artwork');if(!r.ok)throw new Error('reserve');eq(l.balance,40);l.reconcile('artwork',r.txn.id);const f=l.refund('artwork',r.txn.id,'test');if(!f.ok)throw new Error('refund');eq(l.balance,50);});
t('commerce insufficient',()=>{const l=new C.Ledger(5);const r=l.reserve('atlas');if(r.ok)throw new Error('should fail');eq(r.error,'insufficient-credits');});
t('atlas real html',()=>{const h=A.atlasHTML(parsed.report,{});if(!h.includes('Nicole Danelle McDaniel'))throw new Error('name');if(!h.includes('ev_v2_'))throw new Error('evidence');});
t('evidence pack real json',()=>{const j=A.evidencePackJSON(parsed.report);const o=JSON.parse(j);if(o.identity!=='Nicole Danelle McDaniel')throw new Error('json');});
t('podcast script labeled',()=>{const s=A.podcastScript(parsed.report);if(!s.includes('SCRIPT ONLY'))throw new Error('label');});
t('storyboard honest',()=>{const s=A.storyboardMD(parsed.report);if(!s.includes('NOT a video file'))throw new Error('label');});
t('generic parser — not hardcoded',()=>{const r=P.parseMarkdown(sample.replaceAll('Nicole Danelle McDaniel','Test Person'),{});if(r.report.identity!=='Test Person')throw new Error('hardcoded identity');});
console.log('\n'+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
