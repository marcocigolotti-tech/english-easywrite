// Harper.js 2.4.0: official browser CDN example; text stays in browser.
const $ = id => document.getElementById(id);
let linter=null, currentLints=[], ignored = new Set(), busy=false, dialectEnum=null;
const helpRules=[
 {re:/\byou\s+is\b/gi, repl:"you are", why:"Con YOU si usa ARE, non IS.", quality:"alta"},
 {re:/\b(he|she|it)\s+are\b/gi, repl:m=>m.split(/\s+/)[0]+" is",why:"Con HE, SHE, IT si usa IS.",quality:"alta"},
 {re:/\b(I)\s+is\b/gi,repl:"I am",why:"Con I si usa AM.",quality:"alta"},
 {re:/\bhte\b/gi,repl:"the",why:"Le lettere di THE sono invertite.",quality:"alta"},
 {re:/\bteh\b/gi,repl:"the",why:"Le lettere di THE sono invertite.",quality:"alta"},
 {re:/\bbestia\b/gi,repl:"best",why:"Forse intendevi BEST (il migliore). BESTIA può anche essere una parola voluta: verifica il significato.",quality:"da verificare"},
 {re:/\b(you|we|they)\s+has\b/gi,repl:m=>m.replace(/has$/i,"have"),why:"Con YOU, WE e THEY si usa HAVE.",quality:"alta"}
];
function smartCase(source,replacement){if(source[0]===source[0].toUpperCase())return replacement[0].toUpperCase()+replacement.slice(1);return replacement;}
function proposed(text){let out=[];for(const rule of helpRules){rule.re.lastIndex=0;for(const m of text.matchAll(rule.re)){const raw=m[0],candidate=typeof rule.repl==="function"?rule.repl(raw):rule.repl;const corrected=smartCase(raw,candidate);if(raw===corrected)continue;out.push({start:m.index,end:m.index+raw.length,original:raw,replacement:corrected,why:rule.why,quality:rule.quality});}}return out.sort((a,b)=>a.start-b.start).filter((x,i,all)=>!all.slice(0,i).some(y=>x.start<y.end));}
function renderHelp(text){const host=$("pedagogical");host.replaceChildren();let proposals=proposed(text);if(!proposals.length){host.textContent="Nessuna proposta aggiuntiva dalle regole didattiche. Leggi anche i suggerimenti di Harper.";return;}for(const p of proposals){let card=document.createElement("div");card.className="item";let t=document.createElement("strong");t.textContent=p.original+" → "+p.replacement;card.append(t);let why=document.createElement("p");why.textContent=p.why;card.append(why);let conf=document.createElement("p");conf.className="confidence";conf.textContent=p.quality==="alta"?"Correzione di regola frequente":"Proposta incerta: controlla il significato";card.append(conf);card.append(button("✓ Applica questa modifica",async()=>{const current=$("input").value;if(current.slice(p.start,p.end)!==p.original){await check();return;}$("input").value=current.slice(0,p.start)+p.replacement+current.slice(p.end);ignored.clear();showResult();await check();}));host.append(card);}}
function explain(message){if(/grammatical number with the pronoun|verb must agree/i.test(message))return "Il verbo non concorda con il pronome. Ad esempio: YOU ARE, SHE IS.";if(/spelling|misspell/i.test(message))return "Possibile errore di ortografia. Controlla la parola e il suo significato.";if(/capitaliz/i.test(message))return "Controlla la lettera maiuscola.";return "Harper segnala: "+message+" (messaggio originale).";}
function status(text, loading=false, error=false){const el=$('status');el.textContent=text;el.setAttribute('aria-busy', String(loading));el.className=error?'state warn':'state';}
function showResult(){ $('result').textContent=$('input').value||'Il testo comparirà qui.'; }
function button(label,fn){let b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',fn);return b;}
function issueKey(lint){const span=lint.span();return span.start+':'+span.end+':'+lint.message();}
function render(lints,text){const host=$('suggestions');host.replaceChildren();currentLints=lints;
 const active=lints.filter(l=>!ignored.has(issueKey(l)));
 if(!active.length){let d=document.createElement('div');d.className='state';d.textContent='Harper non ha rilevato problemi nel testo. Questo NON garantisce che la frase sia corretta.';host.append(d);return;}
 const count=$('mode').value==='guided'?1:active.length;
 active.slice(0,count).forEach((lint,i)=>{const span=lint.span();const original=text.slice(span.start,span.end);const d=document.createElement('div');d.className='item';const title=document.createElement('strong');title.textContent='Possibile errore: «'+(original||'in questo punto')+'»';d.append(title);const p=document.createElement('p');p.textContent=explain(lint.message());d.append(p);
 const suggestions=lint.suggestions();if(suggestions.length){suggestions.slice(0,4).forEach(s=>{const replacement=s.get_replacement_text();d.append(button('✓ '+(replacement||'Elimina'),async()=>{try{const next=await linter.applySuggestion($('input').value,lint,s);$('input').value=next;ignored.clear();await check();}catch(e){status('Impossibile applicare la correzione: '+e.message,false,true);}}));});}else{let warn=document.createElement('p');warn.className='small';warn.textContent='Harper non conosce una sostituzione sicura. Puoi scrivere tu la forma corretta qui sotto.';d.append(warn);const edit=document.createElement('div');edit.className='manual';const field=document.createElement('input');field.type='text';field.setAttribute('aria-label','Scrivi la correzione proposta da te');field.placeholder='Scrivi la parola o frase corretta';field.value=original;edit.append(field);edit.append(button('✓ Applica la mia correzione',async()=>{const before=$('input').value;if(before.slice(span.start,span.end)!==original){await check();return;}const replacement=field.value;if(!replacement.trim()){status('Inserisci una correzione prima di applicarla.',false,true);return;}$('input').value=before.slice(0,span.start)+replacement+before.slice(span.end);ignored.clear();showResult();await check();}));d.append(edit);}
 d.append(button('↷ Ignora',()=>{ignored.add(issueKey(lint));render(currentLints,$('input').value);}));host.append(d);});
 if(active.length>count){let p=document.createElement('p');p.className='small';p.textContent='Altri suggerimenti disponibili: '+(active.length-count)+'. Accetta o ignora questo suggerimento per continuare.';host.append(p);}
}
async function check(){if(!linter||busy)return;busy=true;$('check').disabled=true;const input=$('input').value;showResult();status('Harper sta analizzando il testo…',true);try{const lints=await linter.lint(input);if(input!==$('input').value){status('Il testo è cambiato. Premi nuovamente Controlla.');return;}renderHelp(input);render(lints,input);status('Motore Harper attivo · '+lints.length+' possibile/i errore/i · analisi locale.');}catch(err){status('Errore del motore Harper: '+(err?.message||err),false,true);}finally{busy=false;$('check').disabled=false;}}
$('check').addEventListener('click',()=>{ignored.clear();check();});$('recheck').addEventListener('click',()=>{ignored.clear();check();});
$('input').addEventListener('input',()=>{ignored.clear();showResult();$('suggestions').textContent='Testo modificato: premi «Controlla il testo».';$('pedagogical').textContent='Premi «Controlla il testo».';});
$('sample').onclick=()=>{$('input').value='She go to school every day. This is an apple. I has two cats.';ignored.clear();showResult();check();};
$('clear').onclick=()=>{$('input').value='';ignored.clear();$('suggestions').textContent='Scrivi una frase per cominciare.';$('pedagogical').textContent='Scrivi una frase per cominciare.';showResult();};
$('mode').onchange=()=>{document.body.classList.toggle('mode-large',$('mode').value==='easy');render(currentLints,$('input').value);};
$('contrast').onclick=()=>document.body.classList.toggle('contrast');
$('dialect').onchange=async()=>{if(linter&&dialectEnum){const d=$('dialect').value==='british'?dialectEnum.British: dialectEnum.American;try{await linter.setDialect(d);ignored.clear();await check();}catch(e){status('Non riesco a impostare questa variante. '+e.message,false,true)}}};
$('listen').onclick=()=>{if(!('speechSynthesis' in window)){status('Il dispositivo non dispone della lettura vocale.',false,true);return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance($('input').value);u.lang=$('dialect').value==='british'?'en-GB':'en-US';u.rate=$('mode').value==='easy'?.75:.88;speechSynthesis.speak(u);};
$('stop').onclick=()=>{if('speechSynthesis' in window)speechSynthesis.cancel();};
$('copy').onclick=async()=>{try{await navigator.clipboard.writeText($('input').value);status('Testo copiato.');}catch{status('Impossibile copiare automaticamente: seleziona il testo.',false,true);}};
$('download').onclick=()=>{let url=URL.createObjectURL(new Blob([$('input').value],{type:'text/plain;charset=utf-8'}));let a=document.createElement('a');a.href=url;a.download='english-easywrite.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);};
try{
 const [{binaryInlined},mod]=await Promise.all([import('https://unpkg.com/harper.js@2.4.0/dist/binaryInlined.js'),import('https://unpkg.com/harper.js@2.4.0/dist/index.js')]);
 dialectEnum=mod.Dialect??null;
 linter=new mod.WorkerLinter({binary:binaryInlined});
 await linter.setup();
 if(dialectEnum?.British)await linter.setDialect(dialectEnum.British);
 $('check').disabled=false;status('Motore Harper pronto. Puoi controllare il testo.');$('suggestions').textContent='Scrivi una frase e premi «Controlla il testo».';
}catch(err){status('Harper non è stato caricato. Verifica la connessione internet o il blocco del CDN nel browser. Dettaglio: '+(err?.message||err),false,true);$('suggestions').textContent='Nessuna correzione disponibile: motore non caricato.';}
