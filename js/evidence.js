/* Epistemic engine — classification, evidence graph, dependency analysis. */
(function(g){
'use strict';
const CLASSES=['COMPUTED','SOURCE_REPORTED','RULE_DERIVED','INTERPRETIVE','SYNTHESIZED','CREATIVE','UNAVAILABLE'];
function classifyClaim(claim){
 if(!claim||claim.value===null||claim.value===undefined||claim.value==='unknown'||claim.value==='unavailable')return 'UNAVAILABLE';
 if(claim.classification&&CLASSES.includes(claim.classification))return claim.classification;
 if(claim.evidenceId||claim.path)return 'COMPUTED';
 if(claim.creative)return 'CREATIVE';
 return 'SOURCE_REPORTED';
}
function buildGraph(report){
 const nodes=[],edges=[]; const add=(id,label,kind)=>{if(!nodes.find(n=>n.id===id))nodes.push({id,label,kind});};
 add('source','SOURCE: '+(report.identity||'report'),'source');
 for(const ev of (report.evidenceLedger||[])){add(ev.evidenceId,ev.evidenceId,'evidence');add('val:'+ev.system+':'+ev.value,String(ev.value),'value');edges.push({from:'source',to:'val:'+ev.system+':'+ev.value});edges.push({from:'val:'+ev.system+':'+ev.value,to:ev.evidenceId});}
 for(const t of (report.themes||[])){add('theme:'+t.name,t.name,'theme');}
 return {nodes,edges,chain:'SOURCE → VALUE → EVIDENCE → INTERPRETATION → THEME → ARTIFACT'};
}
function analyzeDependencies(report){
 const ledger=report.evidenceLedger||[]; const groups=[];
 // Group A: name-number systems returning same value from shared name input
 const byValue={}; for(const ev of ledger){(byValue[ev.value]=byValue[ev.value]||[]).push(ev);}
 for(const [value,evs] of Object.entries(byValue)){const systems=[...new Set(evs.map(e=>e.system))]; if(systems.length>=3)groups.push({value,systems,evidenceIds:evs.map(e=>e.evidenceId),dependent:true,reason:'Shared name input — repeated value across name-number systems is mathematically dependent, not independent corroboration.'});}
 // Explicit known families
 const fours=ledger.filter(e=>['chaldean','gematria','isopsephy'].includes(e.system)&&String(e.value)==='4');
 if(fours.length>=2&&!groups.find(x=>x.systems.includes('chaldean')))groups.push({value:'4',systems:fours.map(e=>e.system),evidenceIds:fours.map(e=>e.evidenceId),dependent:true,reason:'Chaldean/Gematria/Isopsephy 4s share the name input.'});
 const ones=ledger.filter(e=>['ordinal','pythagorean','sacred_geometry'].includes(e.system)&&String(e.value)==='1');
 if(ones.length>=2)groups.push({value:'1',systems:[...new Set(ones.map(e=>e.system))],evidenceIds:ones.map(e=>e.evidenceId),dependent:true,reason:'Ordinal/Pythagorean/Sacred-Geometry 1s derive from the same name string.'});
 const totals=ledger.filter(e=>String(e.value)==='172'); if(totals.length>=2)groups.push({value:'172',systems:totals.map(e=>e.system),evidenceIds:totals.map(e=>e.evidenceId),dependent:true,reason:'172 totals are transforms of the same name total (Abjad/Mandaean/Sumerian/Ordinal family).'});
 return {groups,independentCorroborationWarning:'Dependent outputs must never be counted as independent confirmation.'};
}
function verifyEvidenceIntegrity(report){
 const ledgerIds=new Set((report.evidenceLedger||[]).map(e=>e.evidenceId)); const referenced=new Set(report.evidenceIds||[]);
 const refsInTextOnly=[...referenced].filter(id=>!ledgerIds.has(id));
 // Note: narrative references legitimately cite ledger IDs; any referenced ID not in ledger is flagged, never invented.
 return {ledgerCount:ledgerIds.size,referencedCount:referenced.size,missingFromLedger:refsInTextOnly,ok:refsInTextOnly.length===0};
}
function missingHonesty(report){
 const out=[]; const m=report.missing||{};
 if(m['birth time']==='unknown'||report.astronomy&&report.astronomy.withheld)out.push({field:'Moon / rising / houses / aspects',status:'UNAVAILABLE',reason:'Birth time unknown — withheld, never invented. Provide an exact birth time to unlock.'});
 if(report.humanDesignUnavailable)out.push({field:'Human Design',status:'UNAVAILABLE',reason:'Requires known birth time with precise accuracy.'});
 if(m['psychology']==='absent')out.push({field:'Psychology',status:'UNAVAILABLE',reason:'No psychology fields supplied; none inferred from the name.'});
 return out;
}
const api={CLASSES,classifyClaim,buildGraph,analyzeDependencies,verifyEvidenceIntegrity,missingHonesty};
if(typeof module!=='undefined'&&module.exports)module.exports=api; g.HMEvidence=api;
})(typeof window!=='undefined'?window:globalThis);
