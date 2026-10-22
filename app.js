// Harper.js 2.4.0: official browser CDN example; text stays in browser.
const $ = id => document.getElementById(id);
let linter=null, currentLints=[], ignored = new Set(), busy=false, dialectEnum=null;
function status(text, loading=false, error=false){const el=$('status');el.textContent=text;el.setAttribute('aria-busy', String(loading));el.className=error?'state warn':'state';}
function showResult(){ $('result').textContent=$('input').value||'Il testo comparirà qui.'; }
function button(label,fn){let b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',fn);return b;}
function issueKey(lint){const span=lint.span();return span.start+':'+span.end+':'+lint.message();}
function render(lints,text){const host=$('suggestions');host.replaceChildren();currentLints=lints;
 const active=lints.filter(l=>!ignored.has(issueKey(l)));
 if(!active.length){let d=document.createElement('div');d.className='state';d.textContent='Harper non ha rilevato problemi nel testo. Questo NON garantisce che la frase sia corretta.';host.append(d);return;}
 const count=$('mode').value==='guided'?1:active.length;
 active.slice(0,count).forEach((lint,i)=>{const span=lint.span();const original=text.slice(span.start,span.end);const d=document.createElement('div');d.className='item';const title=document.createElement('strong');title.textContent='Possibile errore: «'+(original||'in questo punto')+'»';d.append(title);const p=document.createElement('p');p.textContent=lint.message();d.append(p);
 const suggestions=lint.suggestions();if(suggestions.length){suggestions.slice(0,4).forEach(s=>{const replacement=s.get_replacement_text();d.append(button('✓ '+(replacement||'Elimina'),async()=>{try{const next=await linter.applySuggestion($('input').value,lint,s);$('input').value=next;ignored.clear();await check();}catch(e){status('Impossibile applicare la correzione: '+e.message,false,true);}}));});}else{let warn=document.createElement('p');warn.className='small';warn.textContent='Harper non propone una sostituzione automatica: chiedi supporto al docente.';d.append(warn);}
 d.append(button('↷ Ignora',()=>{ignored.add(issueKey(lint));render(currentLints,$('input').value);}));host.append(d);});
 if(active.length>count){let p=document.createElement('p');p.className='small';p.textContent='Altri suggerimenti disponibili: '+(active.length-count)+'. Accetta o ignora questo suggerimento per continuare.';host.append(p);}
}
async function check(){if(!linter||busy)return;busy=true;$('check').disabled=true;const input=$('input').value;showResult();status('Harper sta analizzando il testo…',true);try{const lints=await linter.lint(input);if(input!==$('input').value){status('Il testo è cambiato. Premi nuovamente Controlla.');return;}render(lints,input);status('Motore Harper attivo · '+lints.length+' possibile/i errore/i · analisi locale.');}catch(err){status('Errore del motore Harper: '+(err?.message||err),false,true);}finally{busy=false;$('check').disabled=false;}}
$('check').addEventListener('click',()=>{ignored.clear();check();});$('recheck').addEventListener('click',()=>{ignored.clear();check();});
$('input').addEventListener('input',()=>{ignored.clear();showResult();$('suggestions').textContent='Testo modificato: premi «Controlla il testo».';});
$('sample').onclick=()=>{$('input').value='She go to school every day. This is an apple. I has two cats.';ignored.clear();showResult();check();};
$('clear').onclick=()=>{$('input').value='';ignored.clear();$('suggestions').textContent='Scrivi una frase per cominciare.';showResult();};
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
