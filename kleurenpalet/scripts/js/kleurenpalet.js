/** @format */

'use strict';

/**
 * een woordje uitleg:
 * class Bord
 *
 * Creëert een basic frame voor het kleurpalet, dat kan worden aangevuld met CSS layout.
 * Bevat venster waarin kleurpalet komt en twee balken voor controls (knoppen).
 * Keuze tussen horizontale of verticale oriëntering. Verticaal is met de balken
 * boven en onder het venster. Hoogte / breedte zijn aanpasbaar. Dit kan in eender welke
 * eenheid (px, viewport units, %...) doorgegeven worden. *
 *
 * props: {hoogte, breedte, horizontaal(BOOL)}
 * methods: createRaam().createVenster()..createTaakbalk().createStatusbalk();
 * method .assembleer() geeft de samengestelde HTML elementen. => append
 *
 * class Controls
 *
 * Maakt HTML input elementen. Aanpasbaar met de attributen (minimaal zijn id en value vereist).
 * Label (BOOL) en / of event listener zijn optioneel.
 * Keuze tussen maken van afzonderlijke input of meerdere attributen binnen een parentelement (div)
 * Er moet wel steeds een div worden doorgegeven, maar met de method .returnAlgemeneInput() kan je
 * een input (HTML) opvragen.
 *
 * props: {label(BOOL), text, title, name, value, min, max, type, callback:functie(e)}
 * .voegAlgemeneInputToe() kan label(BOOL), text, title, name, value, min, max, type(default: 'text)...
 * andere methods zijn voor input button en radiobutton
 *
 * class Kleurpalet
 *
 * Creëert het palet adhv een resem vakjes. Bevat alle logica voor het verzamelen van data.
 * Neemt hoogte en breedte, en pixelwaarden aan. Daarna wordt het aantal vakjes berekend.
 * Pixelhoogte(resolutie): x en y waarden. Hoe hoog / breed moeten de vakjes zijn? Enkel getest met x = y
 * Vakjes worden aangemaakt en bijgehouden in array. Bevat informatie over positie (rij / kolom), id,
 * kleur...
 *
 * De controls worden hier toegevoegd aan het bord en de event listeners / handlers gelinkt
 * Er wordt enkel getekend bij mousedown event.
 * Houdt tevens alle getekende lijnen bij alsook x en y coordinaten van het mouseevent. Naargelang
 * de visualisatie zijn verschillende gegevens ter beschikking.
 *
 * Opslaan van een tekening is mogelijk naast het uploaden en afbeelden van een tekening (JSON).
 * Vooralsnog kunnen enkel tekeningen gemaakt met dit Kleurpalet worden weergegeven.
 *
 * Functies: kleuren kiezen (R/G/B, wit, color picker), undo, redo, bord leegmaken
 * Bij mouseup event worden de coordinaten en kleur weergegeven van een vakje.
 *
 * class KleurenTabel
 *
 * Visualiseert Kleurpalet in een tabel. Rijen en kolommen worden aangemaakt obv de gegevens van de
 * parent class.
 * Met de mouse coordinaten worden de vakjes opgespoord dmv elementFromPoint(x, y)
 * Het tekenen zelf maakt gebruik van animation frame, maar slaat veel coordinaten over.
 * Daarom is er een property (flag) joinDots, die de punten verbindt obv een bepaalde logica.
 *
 * class KleurenCanvas
 *
 * Is op zich beter geschikt voor deze toepassing. Er is een bijkomende functie om de lijndikte te
 * veranderen. (Input type='number', max = 20px)
 *
 * 
 * 
 ********* Voorbeeld **********

 ** const nieuwBord = new Bord({
        height: '90vh',
        width: '90vw',
        horizontaal: false,
    });

    nieuwBord.createRaam();
    nieuwBord.createVenster();
    nieuwBord.createTaakbalk();
    nieuwBord.createStatusbalk();

**  const kleurpalet1 = new KleurenCanvas({
        height: '100%',
        width: '100%',
        pixels: { x: 5, y: 5 },
        background: 'white',
    });

**  document.body.appendChild(nieuwBord.assembleer());
**  nieuwBord.venster.appendChild(kleurpalet1.createPalet());
**  kleurpalet1.init();
*
*
*/

//********************************** helpers **********************************
const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

//********************************** classes **********************************
//todo: maak switch knop om te wisselen tussen canvas en tabel
//todo: styles css only
/* Bord maakt een venster met een taakbalk */
class Bord {
    bord;
    venster;
    taakbalk;
    statusbalk;

    constructor({ ...props }) {
        this.height = props.height || '100vh';
        this.width = props.width || '100vw';
        this.bordHorizontaal = props.horizontaal || false;
        this.richtingBalk = this.bordHorizontaal ? 'verticaal' : 'horizontaal';
        // verder gebruikt voor Controls: className (css)
    }
    createRaam() {
        /* bord */
        this.bord = document.createElement('div');
        this.bord.id = 'bord';
        this.bord.className = 'bord';
        this.bord.style.width = this.width;
        this.bord.style.height = this.height;
        this.bord.style.boxSizing = 'border-box';
        this.bord.style.display = 'grid';
    }
    createVenster() {
        this.venster = document.createElement('div');
        this.venster.id = 'venster';
        this.venster.className = 'venster';
        this.venster.style.background = 'whitesmoke';
    }
    createBalk(id) {
        const balk = document.createElement('div');
        balk.id = id;
        balk.className = id;
        balk.style.display = 'flex';
        balk.style.justifyContent = 'space-between';
        balk.style.alignItems = 'center';
        return balk;
    }
    createTaakbalk() {
        this.taakbalk = this.createBalk('taakbalk');
    }
    getTaakbalk() {
        return this.taakbalk;
    }
    createStatusbalk() {
        this.statusbalk = this.createBalk('statusbalk');
        this.statusbalk.style.position = 'absolute';
        this.statusbalk.style.justifyContent = 'space-evenly';
        this.statusbalk.style.opacity = 0.5;

        if (!this.bordHorizontaal) {
            /* statusbalk horizontaal */
            this.statusbalk.style.bottom = 0;
            this.statusbalk.style.bottom = `calc(100vh - ${this.height} - 5%)`;
            this.statusbalk.style.height = '100px';
            this.statusbalk.style.maxHeight = '5%';
            this.statusbalk.style.width = this.width;
        } else {
            this.statusbalk.style.right = 0;
            this.statusbalk.style.right = `calc(100vw - ${this.width} - 4.5%)`;
            this.statusbalk.style.width = '100px';
            this.statusbalk.style.maxWidth = '6%';
            this.statusbalk.style.height = this.height;
            this.statusbalk.style.flexDirection = 'column';
        }

        this.statusbalk.addEventListener('mousemove', () => {
            this.statusbalk.style.opacity = 1;
        });
        this.statusbalk.addEventListener('mouseleave', () => {
            this.statusbalk.style.opacity = 0.5;
        });
    }
    getStatusbalk() {
        return this.statusbalk;
    }
    assembleer() {
        if (!this.bordHorizontaal) {
            this.taakbalk.style.flexDirection = 'row';
            this.statusbalk.style.flexDirection = 'row';
            this.bord.style.gridTemplateRows = '10% 90%';
        } else {
            this.taakbalk.style.maxHeight = this.height;
            this.taakbalk.style.flexDirection = 'column';
            this.statusbalk.style.flexDirection = 'column';
            this.bord.style.gridTemplateColumns = '10% 90%';
        }
        this.bord.appendChild(this.taakbalk);
        this.bord.appendChild(this.venster);
        this.bord.appendChild(this.statusbalk);

        return this.bord;
    }
}

/* Controls maakt een div en voegt knoppen toe */
class Controls {
    controls = [];
    constructor({ className, id, parentElement }) {
        this.controlDiv = document.createElement('div');
        this.controlDiv.className = className;
        this.id = id;
        this.parentElement = parentElement;
    }
    voegAlgemeneInputToe({ ...props }) {
        let knop = `
            <input 
            type="${props.type || 'text'}" 
            id="${props.id}" 
            placeholder="${props.placeholder || ''}"
            min="${props.min || ''}" max="${props.max || ''}" 
            name="${props.name || props.id}" value="${props.value || ''}">            
        `;
        if (props.label !== false) {
            knop += `<label 
            for="${props.id}" 
            title="${props.title || props.name || props.id}">
            ${props.text || ''}</label>`;
        }
        this.controlDiv.insertAdjacentHTML('beforeend', knop);
        if (props.functie) {
            this.controlDiv.querySelector(`#${props.id}`).addEventListener(`${props.event}`, (e) => props.functie(e));
        }
        this.voegControlsToe();
    }
    voegInputRadioToe({ ...props }) {
        const knop = `
            <input type="radio" 
                id="${props.id || props.name + props.value[0].toUpperCase() + props.value.slice(1)}" 
                name="${props.name}" 
                value="${props.value}" 
                checked="${!!props.checked || 'false'}">
            <label 
                for="${props.id || props.name + props.value[0].toUpperCase() + props.value.slice(1)}" 
                ${props.style ? 'style="' + props.style + '"' : ''} 
                title="${props.title || props.value}">
                ${props.text || ''} 
                </label>
        `;
        this.controlDiv.insertAdjacentHTML('beforeend', knop);
        this.voegControlsToe();
    }
    voegInputButtonToe({ ...props }) {
        const id = `${props.id.toLowerCase() || props.value.toLowerCase() + 'Button'}`;
        let knop = `<input type="button" 
        id="${id}" 
        value="${props.value}"
        title="${props.title || props.value}">`;
        if (props.label !== false) {
            knop += `<label for="${id}" title="${props.title || props.value}">${props.text || ''}</label>`;
        }

        this.controlDiv.insertAdjacentHTML('beforeend', knop);
        this.controlDiv.querySelector(`#${id}`).addEventListener('click', () => props.functie());
        this.voegControlsToe();
    }
    returnAlgemeneInput({ ...props }) {
        const input = document.createElement('input');
        input.id = props.id;
        input.type = props.type;
        input.name = props.name || props.id;
        input.value = props.value || '';
        if (props.functie && props.event) {
            input.addEventListener(`${props.event}`, (e) => props.functie(e));
        }
        if (props.label !== false) {
            const label = document.createElement('label');
            label.setAttribute('for', props.id);
            label.title = props.title || props.name || props.id;
            label.innerHTML = props.text || '';
            return [input, label];
        }
        return input;
    }
    voegControlsToe() {
        this.parentElement.appendChild(this.controlDiv);
    }
    getParentElement() {
        return this.parentElement;
    }
}

//************************************* kleurpalet *************************************
/* Kleurpalet houdt data bij van wat werd getekend en regelt event handling */
class Kleurpalet {
    //* algemeen
    kleurpalet;
    controls = {};
    dimensies = { paletHoogte: 0, paletBreedte: 0, offsetX: 0, offsetY: 0, rows: 0, cols: 0 };
    //* vakjes info
    vakjesArray = [];
    gekleurd = new Set(); /* id's van vakjes (uniek) */

    //* lijnen
    tekeningen = [];
    lijnen = [];
    huidigeLijn = {};
    deletedLijnen = [];
    //* layout
    huidigKleur = 'red';
    //* mousetracking
    mousedown = false;
    mouse = { x: 0, y: 0 };
    coordinatenArray = [];

    constructor({ ...props }) {
        this.props = props;
        this.height = props.height || '100%';
        this.width = props.width || '100%';
        this.pixels = props.pixels;
        this.background = props.background;
    }
    //*********** creëer context ***********/
    createPalet() {
        this.kleurpalet = this.createVorm();
        this.kleurpalet.style.width = this.width;
        this.kleurpalet.style.height = this.height;
        this.kleurpalet.style.overflow = 'hidden';
        this.kleurpalet.style.background = this.background;

        this.voegControlsToe();
        this.addEventListeners();
        return this.kleurpalet;
    }
    updateBoundingRect() {
        const { width, height, x, y } = this.kleurpalet.getBoundingClientRect();
        this.dimensies.paletBreedte = Number(width.toFixed(2));
        this.dimensies.paletHoogte = Number(height.toFixed(2));
        this.dimensies.offsetX = Number(x.toFixed(2));
        this.dimensies.offsetY = Number(y.toFixed(2));
    }
    createVakjes() {
        this.updateBoundingRect();

        this.dimensies.rows = Math.floor(this.dimensies.paletHoogte / this.pixels.y);
        this.dimensies.cols = Math.floor(this.dimensies.paletBreedte / this.pixels.x);

        let id = 0;
        for (let i = 0; i < this.dimensies.rows; i++) {
            for (let j = 0; j < this.dimensies.cols; j++) {
                this.vakjesArray.push({
                    rij: i + 1,
                    kolom: j + 1,
                    wijzigingen: 0,
                    kleur: 'white',
                    y1: i * this.pixels.x,
                    y2: i * this.pixels.x + this.pixels.x,
                    x1: j * this.pixels.y,
                    x2: j * this.pixels.y + this.pixels.y,
                    id: id,
                    cel: `r${i + 1}k${j + 1}`,
                    spreek() {
                        if (this.kleur === 'white') {
                            console.log(`Ik ben veld ${this.rij}, ${this.kolom} en ik ben wit`);
                        } else {
                            const kleuren = {
                                red: 'rood',
                                blue: 'blauw',
                                green: 'groen',
                            };
                            console.log(
                                `Ik ben veld ${this.rij}, ${this.kolom} en ik werd zopas ${
                                    kleuren[this.kleur] || this.kleur
                                } gekleurd`
                            );
                        }
                    },
                });
                id++;
            }
        }
        return { rows: this.dimensies.rows, cols: this.dimensies.cols };
    }
    zoekVakje(x, y) {
        return this.vakjesArray.find((vakje) => vakje.x1 <= x && vakje.x2 >= x && vakje.y1 <= y && vakje.y2 >= y);
    }

    //*********** knoppen ***********/
    voegControlsToe() {
        //* kleurknoppen
        const kleurenKnoppen = new Controls({
            className: `controls kleuren ${nieuwBord.richtingBalk}`,
            id: 'kleurControls',
            parentElement: nieuwBord.getTaakbalk(),
        });
        kleurenKnoppen.voegInputRadioToe({ name: 'kleur', value: 'red', style: '--bg: red;', checked: true });
        kleurenKnoppen.voegInputRadioToe({ name: 'kleur', value: 'green', style: '--bg: green;' });
        kleurenKnoppen.voegInputRadioToe({ name: 'kleur', value: 'blue', style: '--bg: blue;' });
        kleurenKnoppen.voegInputRadioToe({ name: 'kleur', value: 'white', style: '--bg: white;' });
        kleurenKnoppen.voegAlgemeneInputToe({
            value: '#000000',
            id: 'colorPicker',
            type: 'color',
            title: 'Choose a color',
            label: true,
            text: '<span class="material-icons">color_lens</span>',
            functie: () => console.log(this.value),
        });
        //*  functieknoppen
        const functieKnoppen = new Controls({
            className: `controls functies ${nieuwBord.richtingBalk}`,
            id: 'functieControls',
            parentElement: nieuwBord.getTaakbalk(),
        });

        functieKnoppen.voegInputButtonToe({
            value: '<',
            id: 'undoKnop',
            title: 'Undo',
            text: '<span class="material-icons">undo</span>',
            functie: () => kleurpalet1.undo(),
        });
        functieKnoppen.voegInputButtonToe({
            value: '>',
            id: 'redoKnop',
            title: 'Redo',
            text: '<span class="material-icons">redo</span>',
            functie: () => kleurpalet1.redo(),
        });
        //* basisknoppen
        const basisKnoppen = new Controls({
            className: `controls basis ${nieuwBord.richtingBalk}`,
            id: 'basisControls',
            parentElement: nieuwBord.getTaakbalk(),
        });
        basisKnoppen.voegInputButtonToe({
            value: 'R',
            id: 'resetKnop',
            title: 'Reset',
            text: '<span class="material-icons">refresh</span>',
            functie: () => kleurpalet1.maakBladLeeg(),
        });
        basisKnoppen.voegInputButtonToe({
            value: 'O',
            id: 'opslaanKnop',
            title: 'Save image',
            label: true,
            text: '<span class="material-icons">save_alt</span>',
            functie: () => kleurpalet1.tekeningOpslaan(),
        });
        //* statusbalk
        const uploadKnop = new Controls({
            className: `controls file`,
            id: `uploadFile`,
            parentElement: nieuwBord.getStatusbalk(),
        });
        uploadKnop.voegAlgemeneInputToe({
            id: 'uploadJson',
            text: '<span class="material-icons">cloud_upload</span>',
            title: 'Upload image (json)',
            type: 'file',
            event: 'change',
            functie: (e) => kleurpalet1.uploadTekening(e),
        });

        [uploadKnop, basisKnoppen, functieKnoppen].forEach((obj) => {
            this.controls[obj.id] = obj;
        });
    }
    //*********** event listeners ***********/
    addEventListeners() {
        //* knoppen
        document.querySelectorAll('[name="kleur"]').forEach((kleur) => {
            kleur.onclick = (e) => {
                this.huidigKleur = e.target.value;
                document.documentElement.style.setProperty('--bgColor', e.target.value);
            };
        });
        document.querySelector('[type="color"]').addEventListener('change', (e) => {
            this.huidigKleur = e.target.value;
            e.target.nextElementSibling.style.background = e.target.value;
            document.documentElement.style.setProperty('--bgColor', e.target.value);
        });

        //* tekenen op bord
        this.kleurpalet.addEventListener('mousedown', (e) => {
            e.preventDefault();
            nieuwBord.statusbalk.style.pointerEvents = 'none';
            this.mousedown = true;
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.coordinatenArray.push([this.mouse.x, this.mouse.y]);
            this.teken();
        });
        this.kleurpalet.addEventListener('click', (e) => {
            this.mousedown = true;
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.teken();
            this.coordinatenArray.push([this.mouse.x, this.mouse.y]);
            this.gekleurd.clear();
            this.verwerkLijnen();
            this.mousedown = false;
        });
        window.addEventListener('mouseup', (e) => {
            /*
             * op window: bij buitengaan palet mousedown nog steeds true
             * bij click: mousedown = false lijnen werden reeds verwerkt
             */
            nieuwBord.statusbalk.style.pointerEvents = 'all';
            if (this.mousedown === false && e.target === this.kleurpalet) {
                this.verwerkLijnen();
                this.gekleurd.clear();
            }
            this.mousedown = false;
        });
        this.kleurpalet.addEventListener('mousemove', (e) => {
            if (this.mousedown && e.buttons === 1) {
                e.stopPropagation();
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
                this.coordinatenArray.push([this.mouse.x, this.mouse.y]);
            }
        });

        this.kleurpalet.addEventListener('mouseup', async (e) => {
            await wait(20); //* wachten op eventueel click-event om dataset(kleur) te updaten
            if (e.target.tagName === 'TD') {
                this.getVakjesInfo(e.target.dataset.id);
            } else {
                this.getVakjesInfo(e.clientX, e.clientY);
            }
        });
        /*window.addEventListener('resize', async () => {
            await wait(50);
            this.updateBoundingRect();
            this.kleurpalet.width = this.dimensies.paletBreedte;
            this.kleurpalet.height = this.dimensies.paletHoogte;
        });*/
    }

    //*********** lijnenbeheer ***********/
    verwerkLijnen() {
        // todo: vertaal naar index of rij/kolom in vakjesarray
        const obj = {
            kleur: this.huidigKleur,
            linewidth: this.linewidth,
            punten: [...this.coordinatenArray],
        };
        this.lijnen.push(obj);
        this.huidigeLijn = {};
        this.coordinatenArray.length = 0;
    }
    tekeningOpslaan() {
        const naam = prompt('Geef een naam op voor de tekening');
        if (naam) {
            this.tekeningen[naam] = [...this.lijnen];
            const json = JSON.stringify(this.tekeningen[naam]);
            console.log(`uw tekening ${naam}.json: ${json}`);
            const data = 'text/json;charset=utf-8,' + encodeURIComponent(json);

            const htmlString = `<a href="data:${data}" download="${naam}.json">${naam}.json</a>`;
            nieuwBord.statusbalk.insertAdjacentHTML('afterbegin', htmlString);
            this.lijnen.length = 0;
            this.deletedLijnen.length = 0;
        }
    }
    uploadTekening() {
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
            const str = event.target.result;
            const data = JSON.parse(str);
            this.maakTekening(data);
        };
        fileReader.readAsText(event.target.files[0]);
    }
    verwijderLaatsteLijn() {
        this.lijnen.length && this.deletedLijnen.push(this.lijnen.pop());
    }
    zetLaatstVerwijderdTerug() {
        this.deletedLijnen.length && this.lijnen.push(this.deletedLijnen.pop());
    }
    getLaatsteLijn() {
        return this.lijnen[this.lijnen.length - 1];
    }
    getLaatstVerwijderdeLijn() {
        return this.deletedLijnen[this.deletedLijnen.length - 1];
    }
}

/* Giet een Kleurpalet in tabelvorm en behandelt de logica van Kleurpalet */
class KleurenTabel extends Kleurpalet {
    joinDots = false;
    constructor({ ...props }) {
        super({ ...props });
    }
    createVorm() {
        const vorm = document.createElement('table');
        vorm.id = 'table';
        return vorm;
    }
    init() {
        const { rows, cols } = this.createVakjes();
        let id = 0;
        for (let i = 0; i < rows; i++) {
            const tr = document.createElement('tr');
            tr.style.height = this.pixels.x + 'px';
            tr.style.display = 'flex';

            for (let j = 0; j < cols; j++) {
                const td = document.createElement('td');
                td.style.background = 'white';
                td.style.height = this.pixels.y + 'px';
                td.style.width = this.pixels.x + 'px';
                td.setAttribute('data-rij', i + 1);
                td.setAttribute('data-kol', j + 1);
                td.setAttribute('data-id', id);
                td.setAttribute('data-cel', `r${i + 1}k${j + 1}`);

                tr.appendChild(td);
                id++;
            }
            this.kleurpalet.appendChild(tr);
        }
    }
    voegControlsToe() {
        Kleurpalet.prototype.voegControlsToe.call(this);

        this.controls.functieControls.voegAlgemeneInputToe({
            value: '>',
            id: 'joinDots',
            title: 'Join dots',
            type: 'checkbox',
            text: '<span class="material-icons">timeline</span>',
            event: 'change',
            functie: (e) => kleurpalet1.toggleLineJoin(e),
        });
    }

    teken = () => {
        if (this.mousedown) {
            const x = this.mouse.x;
            const y = this.mouse.y;
            const vakje = document.elementFromPoint(x, y);
            this.gekleurd.add(vakje.dataset.id);
            if (vakje.tagName === 'TD') {
                if (vakje.dataset.kleur !== this.huidigKleur) {
                    vakje.style.background = this.huidigKleur;
                    this.vakjesArray[vakje.dataset.id].kleur = this.huidigKleur;
                    this.vakjesArray[vakje.dataset.id].wijzigingen += 1;
                }
            }

            if (this.gekleurd.size > 1 && this.joinDots) {
                const lastTwo = Array.from(this.gekleurd).slice(-2);
                const idFirst = lastTwo[0];
                const idLast = lastTwo[1];

                let huidigVakje = this.vakjesArray[idFirst];
                const teZoekenVakje = this.vakjesArray[idLast];
                if (teZoekenVakje && huidigVakje) {
                    let gevonden = false;

                    let dx = huidigVakje.rij - teZoekenVakje.rij;
                    let dy = huidigVakje.kolom - teZoekenVakje.kolom;

                    while (!gevonden) {
                        let richting = new Array(2);
                        if (dx < 0) {
                            // onder
                            richting =
                                dy < 0
                                    ? [huidigVakje.rij + 1, huidigVakje.kolom + 1]
                                    : dy === 0
                                    ? [huidigVakje.rij + 1, huidigVakje.kolom]
                                    : [huidigVakje.rij + 1, huidigVakje.kolom - 1];
                        } else if (dx > 0) {
                            // boven
                            richting =
                                dy < 0
                                    ? [huidigVakje.rij - 1, huidigVakje.kolom + 1]
                                    : dy === 0
                                    ? [huidigVakje.rij - 1, huidigVakje.kolom]
                                    : [huidigVakje.rij - 1, huidigVakje.kolom - 1];
                        } else {
                            richting =
                                dy < 0
                                    ? [huidigVakje.rij, huidigVakje.kolom + 1]
                                    : dy === 0
                                    ? [huidigVakje.rij, huidigVakje.kolom]
                                    : [huidigVakje.rij, huidigVakje.kolom - 1];
                        }
                        const next = this.vakjesArray.find(
                            (vakje) => vakje['cel'] === `r${richting[0]}k${richting[1]}`
                        );

                        if (next.kleur === this.huidigKleur) {
                            gevonden = true;
                        } else {
                            next.kleur = this.huidigKleur;
                            next.wijzigingen += 1;
                            const nieuwGekleurd = document.querySelector(`[data-cel="r${richting[0]}k${richting[1]}"]`);
                            const { left, top } = nieuwGekleurd.getBoundingClientRect();
                            this.coordinatenArray.push([left, top]);
                            nieuwGekleurd.style.background = this.huidigKleur;

                            huidigVakje = this.vakjesArray[next.id];
                            dx = huidigVakje.rij - teZoekenVakje.rij;
                            dy = huidigVakje.kolom - teZoekenVakje.kolom;
                        }
                    }
                }
            }
            requestAnimationFrame(this.teken);
        }
    };
    getVakjesInfo(id) {
        this.vakjesArray[id].spreek();
    }

    toggleLineJoin(e) {
        this.joinDots = e.target.checked;
    }
    maakBladLeeg() {
        const vakjes = document.querySelectorAll('#table td');
        vakjes.forEach((vak) => (vak.style.background = this.background));
    }
    maakTekening(array) {
        this.maakBladLeeg();
        array.forEach((lijn) => {
            lijn.punten.forEach(([x, y]) => {
                const vakje = document.elementFromPoint(x, y);
                if (vakje.tagName === 'TD') {
                    vakje.style.background = lijn.kleur;
                    this.vakjesArray[vakje.dataset.id].kleur = lijn.kleur;
                    //this.vakjesArray[vakje.dataset.id].wijzigingen += 1;
                }
            });
        });
    }
    undo() {
        const laatsteLijn = this.getLaatsteLijn();
        if (laatsteLijn) {
            laatsteLijn.punten.forEach(([x, y]) => {
                const elem = document.elementFromPoint(x, y);
                elem.style.background = 'white';
            });
            this.verwijderLaatsteLijn();
        }
    }
    redo() {
        const laatstVerwijderd = this.getLaatstVerwijderdeLijn();
        if (laatstVerwijderd) {
            laatstVerwijderd.punten.forEach(([x, y]) => {
                const elem = document.elementFromPoint(x, y);
                elem.style.background = laatstVerwijderd.kleur;
            });
            this.zetLaatstVerwijderdTerug();
        }
    }
}
/* Giet een Kleurpalet in canvas en behandelt de logica van Kleurpalet */
class KleurenCanvas extends Kleurpalet {
    ctx;
    linewidth;
    constructor({ ...props }) {
        super({ ...props });
    }
    createVorm() {
        const vorm = document.createElement('canvas');
        vorm.id = 'canvas';
        return vorm;
    }
    init() {
        this.createVakjes();
        this.kleurpalet.width = this.dimensies.paletBreedte;
        this.kleurpalet.height = this.dimensies.paletHoogte;
        this.ctx = this.kleurpalet.getContext('2d');
        this.linewidth = this.pixels.x;
    }
    voegControlsToe() {
        Kleurpalet.prototype.voegControlsToe.call(this);

        this.controls.functieControls.voegAlgemeneInputToe({
            value: 'linewidth',
            id: 'lineWidth',
            title: 'Change linewidth',
            type: 'number',
            text: 'px',
            placeholder: 'px',
            min: 1,
            max: 20,
            label: false,
            event: 'change',
            functie: (e) => kleurpalet1.veranderLineWidth(e),
        });
    }
    teken = () => {
        if (this.mousedown) {
            const offX = this.dimensies.offsetX;
            const offY = this.dimensies.offsetY;
            const x = this.mouse.x - offX;
            const y = this.mouse.y - offY;

            this.ctx.beginPath();
            this.ctx.lineWidth = this.linewidth;
            this.ctx.strokeStyle = this.huidigKleur;
            this.ctx.moveTo(x, y);

            const loop = () => {
                if (this.mousedown) {
                    const x = this.mouse.x - offX;
                    const y = this.mouse.y - offY;
                    this.ctx.lineTo(x, y);
                    this.ctx.stroke();
                    const teKleurenVakje = this.zoekVakje(x, y);
                    if (teKleurenVakje) {
                        this.vakjesArray[teKleurenVakje.id].kleur = this.huidigKleur;
                        this.vakjesArray[teKleurenVakje.id].wijzigingen += 1;
                    }
                    requestAnimationFrame(loop);
                }
            };
            loop();
        }
    };
    maakTekening(array) {
        this.maakBladLeeg();
        const offX = this.dimensies.offsetX;
        const offY = this.dimensies.offsetY;
        array.forEach((lijn) => {
            this.ctx.beginPath();
            this.ctx.lineWidth = lijn.linewidth;
            this.ctx.strokeStyle = lijn.kleur;
            this.ctx.moveTo(lijn.punten[0][0] - offX, lijn.punten[0][1] - offY);
            lijn.punten.forEach(([x, y]) => {
                this.ctx.lineTo(x - offX, y - offY);
                this.ctx.stroke();
            });
        });
    }
    tekenpunt(x, y) {
        this.ctx.fillRect(x, y, this.linewidth, this.linewidth);
    }
    veranderLineWidth(e) {
        this.linewidth = Number(e.target.value);
    }
    getVakjesInfo = (x, y) => {
        const canvasX = x - this.dimensies.offsetX;
        const canvasY = y - this.dimensies.offsetY;
        const teZoekenVakje = this.zoekVakje(canvasX, canvasY);
        teZoekenVakje.spreek();
        //console.log(teZoekenVakje);
        //console.log(canvasX, canvasY);
        //this.tekenpunt(canvasX, canvasY);
    };
    maakBladLeeg() {
        this.ctx.clearRect(0, 0, this.dimensies.paletBreedte, this.dimensies.paletHoogte);
    }
    undo() {
        const laatsteLijn = this.getLaatsteLijn();
        if (laatsteLijn) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = this.background;
            const offX = this.dimensies.offsetX;
            const offY = this.dimensies.offsetY;
            console.log(laatsteLijn);
            laatsteLijn.punten.forEach(([x, y]) => {
                this.ctx.lineTo(x - offX, y - offY);
                this.ctx.stroke();
            });
            this.verwijderLaatsteLijn();
        }
    }
    redo() {
        const laatsteLijn = this.getLaatstVerwijderdeLijn();
        if (laatsteLijn) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = laatsteLijn.kleur;
            const offX = this.dimensies.offsetX;
            const offY = this.dimensies.offsetY;
            laatsteLijn.punten.forEach(([x, y]) => {
                this.ctx.lineTo(x - offX, y - offY);
                this.ctx.stroke();
            });
            this.zetLaatstVerwijderdTerug();
        }
    }
}

//******************************************** bord *******************************************
/* bord */
const nieuwBord = new Bord({
    height: '90vh',
    width: '90vw',
    horizontaal: false,
});
nieuwBord.createRaam();
nieuwBord.createVenster();
nieuwBord.createTaakbalk();
nieuwBord.createStatusbalk();
//***************************************** kleurpalet ****************************************

const kleurpalet1 = new KleurenCanvas({
    height: '100%',
    width: '100%',
    pixels: { x: 5, y: 5 },
    background: 'white',
});

//***************************************** HTML maken ****************************************
document.body.appendChild(nieuwBord.assembleer());
nieuwBord.venster.appendChild(kleurpalet1.createPalet());
kleurpalet1.init();
