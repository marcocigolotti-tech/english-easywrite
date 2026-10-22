# English EasyWrite 3.1 — Harper + aiuti di scrittura inclusivi

Ideato dal Prof. Marco Cigolotti.

## Funzioni
- Harper 2.4.0 è il motore grammaticale principale (WebAssembly nel browser).
- Aiuti didattici locali per alcune strutture A1–A2, mostrati separatamente dai risultati Harper.
- Le proposte non certe sono chiaramente contrassegnate.
- Se Harper identifica un problema senza sostituzione, ora lo studente può proporre e applicare una correzione manuale.
- Messaggi essenziali in italiano, lettura vocale, contrasto elevato e caratteri grandi.

## Installazione GitHub Pages
Caricare `index.html`, `app.js`, `README.md` nella cartella pubblicata. La prima esecuzione richiede il download della libreria Harper dal CDN; nessun testo viene trasmesso al CDN per la correzione.

## Limiti
Questa è una versione sperimentale. La funzione di supporto didattico non comprende il significato e NON corregge ogni errore. Esempio: «bestia» può essere inteso come «best», ma la scelta richiede conferma. Non utilizzare per valutazioni automatiche.
