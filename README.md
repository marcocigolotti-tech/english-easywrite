# English EasyWrite — versione 1.2 (A1–A2)

**Ideato dal Prof. Marco Cigolotti.** Il credito è visibile nell’intestazione e nel piè di pagina del sito. Applicazione gratuita e statica, senza API, senza account e senza tracking applicativo.

## Pubblicazione su GitHub Pages
1. Crea un repository pubblico chiamato `english-easywrite` nell'account GitHub gestito dalla scuola (se il progetto è ufficiale).
2. Carica **insieme nella radice** `index.html` e `english-words.txt`.
3. In **Settings → Pages → Build and deployment**, scegli **Deploy from a branch**, `main` e `/ (root)`; salva.
4. Apri l'indirizzo Pages mostrato da GitHub.

**Per provare localmente:** un doppio clic su index.html potrebbe impedire il caricamento del dizionario per le restrizioni dei browser su file://. Pubblicare su GitHub Pages o usare un server locale, per esempio `python -m http.server 8000` dalla cartella.

## Limiti dichiarati
- Il dizionario contiene oltre 76.000 lemmi/forme ricavati da una fonte Hunspell en_US; **non è un motore Hunspell completo** e non espande sistematicamente ogni forma flessa. Le parole non riconosciute vengono segnalate anche quando non esiste una proposta sicura. Possono esserci falsi positivi sui nomi propri e sulle forme flesse: non accettare automaticamente una sostituzione generica. Il controllo ortografico nativo del browser può integrare i suggerimenti.
- Il correttore grammaticale è **a regole limitate**, non è un'IA e non corregge tutte le frasi. Alcune regole potrebbero segnalare false correzioni: le modifiche sono sempre accettate volontariamente.
- L'audio dipende dalle voci installate su Windows/browser; non sono scaricate voci esterne.
- Nessun testo scritto viene inviato dall'app a server o memorizzato in banche dati. GitHub Pages tratta comunque dati tecnici dei visitatori; l'uso istituzionale richiede le verifiche privacy del titolare.

## Licenze e riferimenti
- Dizionario inglese di sistema Hunspell en_US (licenza e attribuzioni riportate nel file `LICENZA-DIZIONARIO-SCOWL.txt`; mantenere questo avviso quando si pubblica il sito).
- Codice dell'applicazione: originale, offerto con licenza MIT (vedi LICENSE).

## Verifica rapida
`I has a beautifull house. She go to school every day. There is two cats.`

Attese: `I have`, `beautiful`, `She goes`, `There are`.

## Test aggiuntivo versione 1.2
`were are iou from?` → segnalazione di `were` nella domanda (`Where`) e `iou` (`you`). La forma finale attesa è `Where are you from?`.

## Correzione 1.2
- Riconosce `Ai have a beautiful house` → `I have a beautiful house` quando "Ai" è usato come soggetto davanti a un verbo. Non sostituisce automaticamente la sigla `AI` (intelligenza artificiale).
- Le frasi sono valutate con regole locali; non è un correttore grammaticale universale.
