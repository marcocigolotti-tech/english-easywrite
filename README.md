# English EasyWrite 3.0 — Harper

**Ideato dal Prof. Marco Cigolotti**

Versione sperimentale con autentico motore **Harper** (harper.js 2.4.0), WebAssembly nel browser. Pubblica `index.html` e `app.js` nella root di GitHub Pages. Apri il sito con connessione internet: il browser scarica il motore dal CDN unpkg.com. **Il testo scritto non viene inviato al CDN o a un servizio di correzione**: Harper lavora localmente una volta caricato.

Il sito è gratuito, non richiede account né API key. I file Harper e il CDN non sono inclusi nello ZIP: l'accesso a unpkg.com è necessario per il caricamento. Per un'installazione completamente autonoma/offline occorre includere gli asset Harper in una build successiva.

## Avvertenze

Harper non garantisce che ogni testo errato sia corretto. Errori fonetici o ambigui possono sfuggire. Non utilizzarlo come unica base per valutazioni o strumenti compensativi ufficiali senza collaudo con studenti e verifica accessibilità/privacy. Se compare «Harper non è stato caricato» il correttore **non** funziona: il sito non finge di correggere.

## Crediti e licenze

Progetto e impostazione didattica: **Prof. Marco Cigolotti**. Motore linguistico **Harper**, Automattic e contributori, [Apache-2.0](https://github.com/Automattic/harper/blob/master/LICENSE). La presente integrazione usa i moduli ospitati su unpkg secondo la [documentazione ufficiale](https://writewithharper.com/docs/harperjs/CDN).
