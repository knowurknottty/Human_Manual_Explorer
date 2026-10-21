/* Canonical versioned data model — Human Manual Studio v1 */
(function(g){
'use strict';
const SCHEMA_VERSION='studio-model-v1';
const ENTITY_TYPES=['User','Profile','SourceDocument','ReportVersion','SymbolicSystem','Calculation','Evidence','Interpretation','Theme','Tension','ReflectionPrompt','ReferenceComparison','Visualization','GenerationJob','GeneratedArtifact','Collection','CollectionItem','Subscription','Purchase','CreditTransaction','SharingPermission','AuditEvent'];
let _seq=0;
function uid(prefix){_seq++;return (prefix||'id')+'_'+Date.now().toString(36)+'_'+_seq+'_'+Math.random().toString(36).slice(2,7);}
function base(type,fields){return Object.assign({id:uid(type.toLowerCase()),type,schemaVersion:SCHEMA_VERSION,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()},fields||{});}
function createUser(f){return base('User',Object.assign({displayName:'',email:''},f));}
function createProfile(f){return base('Profile',Object.assign({userId:null,name:'',archived:false},f));}
function createSourceDocument(f){return base('SourceDocument',Object.assign({profileId:null,fileName:'',fileType:'',fileSize:0,originalText:null,originalBytesNote:'preserved-in-browser-storage',preserved:true,parseStatus:'pending',diagnostics:null},f));}
function createReport(f){return base('ReportVersion',Object.assign({profileId:null,sourceDocumentId:null,reportSchema:null,engine:null,conventions:null,identity:null,calculations:{},evidenceLedger:[],themes:[],tensions:[],missing:{},references:[],prompts:[],sections:[],coverage:{}},f));}
function createEvidence(f){return base('Evidence',Object.assign({evidenceId:null,system:'',path:'',value:null,note:'',classification:'COMPUTED'},f));}
function createJob(f){return base('GenerationJob',Object.assign({profileId:null,artifactType:'atlas',preset:'archive',status:'DRAFT',progress:0,idempotencyKey:uid('idem'),estimatedCredits:0,error:null,artifactId:null},f));}
const JOB_TRANSITIONS={DRAFT:['AWAITING_CONFIRMATION','CANCELLED'],AWAITING_CONFIRMATION:['QUEUED','CANCELLED'],QUEUED:['PROCESSING','CANCELLED','FAILED'],PROCESSING:['RENDERING','FAILED','CANCELLED'],RENDERING:['COMPLETED','FAILED'],COMPLETED:[],FAILED:['DRAFT'],CANCELLED:['DRAFT']};
function canTransition(from,to){return (JOB_TRANSITIONS[from]||[]).includes(to);}
function transitionJob(job,to){if(!canTransition(job.status,to)) throw new Error('Invalid job transition '+job.status+' -> '+to);job.status=to;job.updatedAt=new Date().toISOString();return job;}
function createArtifact(f){return base('GeneratedArtifact',Object.assign({jobId:null,profileId:null,kind:'',title:'',mime:'',claimClass:'SYNTHESIZED'},f));}
function createCollection(f){return base('Collection',Object.assign({key:'',title:'',description:'',edition:'Studio Edition v1',items:[],versionHistory:[{v:1,at:new Date().toISOString(),note:'Created'}],sourceRefs:[]},f));}
const COLLECTION_DEFS=[
 {key:'personal-atlas',title:'The Personal Atlas',description:'A beautifully designed exploration of the imported report — every value with its evidence.'},
 {key:'living-pattern',title:'The Living Pattern',description:'Narrative, visualizations, and audio script combined into one multimedia collection.'},
 {key:'pattern-codex',title:'The Pattern Codex',description:'An evidence-aware illustrated reference book of systems, values, and limits.'},
 {key:'book-of-counterpoints',title:'The Book of Counterpoints',description:'A reflective exploration of source-supported tensions and counterweights.'},
 {key:'symbolic-portrait',title:'The Symbolic Portrait Collection',description:'A curated series of artistic interpretations — labeled as art, never as evidence.'},
 {key:'collectors-edition',title:"The Human Manual Collector's Edition",description:'A coordinated premium publishing package: atlas + codex + counterpoints.'}];
const api={SCHEMA_VERSION,ENTITY_TYPES,uid,base,createUser,createProfile,createSourceDocument,createReport,createEvidence,createJob,createArtifact,createCollection,COLLECTION_DEFS,JOB_TRANSITIONS,canTransition,transitionJob};
if(typeof module!=='undefined'&&module.exports)module.exports=api; g.HMModel=api;
})(typeof window!=='undefined'?window:globalThis);
