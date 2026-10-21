/* Commerce — transparent credit ledger, subscriptions, honest entitlements. No fake charges, no fake enforcement. */
(function(g){
'use strict';
const COSTS={atlas:20,evidencePack:5,podcastScript:15,presentation:15,artwork:10,storyboard:10,report:20,workbook:8};
const TIERS=[{id:'free',name:'Free Foundation',price:0,credits:10},{id:'explorer',name:'Explorer',price:9,credits:100},{id:'creator',name:'Creator',price:24,credits:300},{id:'collector',name:'Collector',price:49,credits:700},{id:'studio-pro',name:'Studio Pro',price:99,credits:1600}];
class Ledger{
 constructor(balance){this.balance=balance??50;this.txns=[];this._n=0;}
 estimate(kind){return COSTS[kind]??10;}
 _txn(type,kind,amount,status){const t={id:'txn_'+(++this._n)+'_'+Date.now().toString(36),type,kind,amount,balanceAfter:this.balance,status,at:new Date().toISOString()};this.txns.push(t);return t;}
 reserve(kind){const c=this.estimate(kind);if(this.balance<c)return {ok:false,error:'insufficient-credits',needed:c,balance:this.balance};this.balance-=c;return {ok:true,txn:this._txn('reserve',kind,-c,'reserved'),cost:c};}
 reconcile(kind,txnId){const t=this.txns.find(x=>x.id===txnId);if(t&&t.status==='reserved')t.status='settled';return {ok:!!t,txn:t||null};}
 refund(kind,txnId,reason){const t=this.txns.find(x=>x.id===txnId);if(!t||t.status==='refunded')return {ok:false,error:'not-refundable'};this.balance+=-t.amount;t.status='refunded';const r=this._txn('refund',kind,-t.amount,'refunded');r.reason=reason||'generation failed';return {ok:true,txn:r,balance:this.balance};}
}
function entitlement(state,kind){
 // Honest: premium artifacts generate with a PREVIEW watermark when payment provider is not connected.
 // We never claim a charge happened, and never hard-block the free foundation.
 return {allowed:true,previewWatermark:!state||!state.paid,reason:(!state||!state.paid)?'Payment provider not connected — artifact is a labeled preview. Connect Stripe to sell unwatermarked exports.':'Paid tier active (local state only; no server verification in this build).'};
}
const api={COSTS,TIERS,Ledger,entitlement};
if(typeof module!=='undefined'&&module.exports)module.exports=api; g.HMCommerce=api;
})(typeof window!=='undefined'?window:globalThis);
