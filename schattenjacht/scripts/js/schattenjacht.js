/** @format */

'use strict';
/*
    Spel Schattenjacht
    Bij onload verschijnt een modal met opties om het spel te starten
    opties: moelijkheid - grootte speelveld - ...

    daarna worden meldingen, speelveld en controls dynamisch ingeladen
    de grootte van het speelveld wordt berekend adhv schermgrootte
    er kan niet worden gescrollt

    controls
    je kan de speler bewegen met pijltoetsen of de bijhorende knoppen op het scherm

    nieuw spel
    het spel speelveld is een grid met blokjes (gras(var) - muren(var) - schatten(var) - 1 vijand - 1 jager (speler))
    op het gras kan vijand en speler vrij bewegen
    door een muur kan vijand of speler niet
    ieder nieuw spel krijgt de speler een aantal levens

    verlies
    iedere keer speler tegen vijand botst gaat er een leven af
    speler verliest indien levens op zijn 

    winst
    speler wint wanneer hij alle schatten kan pakken
*/

/********************************  global variables  ********************************/
const speelVeld = document.querySelector('#speelveld');
const controls = document.querySelector('#controls');
const modal = document.querySelector('#modal');
const form = document.querySelector('#modal > form');
const meldingVak = document.querySelector('#meldingen');
const buttons = ['links', 'boven', 'onder', 'rechts'];
const meldingen = {
    nl: ['levens', 'schatten', 'melding', 'speler', 'score'],
    en: ['lives', 'treasures', 'message', 'player', 'score'],
};
let nieuwSpel;
let taal;

/********************************* helper functions  ********************************/
const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));
const vindVeldInArray = (array, key, value) => array.find(({ key }) => key === value);
const random = (min, max) => Math.floor(Math.random() * (max - min) + min);
const vindCoordinaten = (array, rijNummer, kolomNummer) =>
    array.find(({ rij, kolom }) => {
        return rij === rijNummer && kolom === kolomNummer;
    });
const shuffleArray = (array) => {
    /* Fisher-Yates Shuffle */
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};
async function toggleClassEventjes(element, naam, ms = 100) {
    element.classList.toggle(naam);
    await wait(ms);
    element.classList.toggle(naam);
}
function whichLanguage() {
    let language = Array.from(document.querySelectorAll('input[name="language"]')).find((input) => input.checked);
    return language.id.split('lang-')[1];
}
/****************************  functions on load  *******************************/
modal.classList.toggle('hidden');
Array.from(document.querySelectorAll('input[name="language"]')).forEach((input) => {
    input.addEventListener('change', (e) => {
        document.getElementById(`naam-${whichLanguage()}`).focus();
    });
});

const swiper = new Swipe(speelVeld);
swiper.onLeft(() => nieuwSpel.beweegSpeler('links'));
swiper.onRight(() => nieuwSpel.beweegSpeler('rechts'));
swiper.onUp(() => nieuwSpel.beweegSpeler('boven'));
swiper.onDown(() => nieuwSpel.beweegSpeler('onder'));
swiper.run();
/*******************************  inject html  *******************************/

/* meldingen */
const insertMeldingen = (array) =>
    array
        .map((melding, i) => {
            /* data-melding voor en-nl (referentie voor showMessage()) */
            return `<span>${['melding', 'message'].includes(melding) ? '' : melding + ':'}  
                    <span data-melding="${meldingen.nl[i]}" id="${melding}"></span>
                    </span>`;
        })
        .join('');

/* speelveld */
function maakGrid({ ...args }) {
    document.documentElement.style.setProperty('--breedte', args.breedte);
    document.documentElement.style.setProperty('--hoogte', args.hoogte);
    document.documentElement.style.setProperty('--blokHoogte', `${args.blokHoogte}px`);
    document.documentElement.style.setProperty('--spelBreedte', `${args.spelBreedte}px`);
    document.documentElement.style.setProperty('--spelHoogte', `${args.spelHoogte}px`);
}

function maakGras(velden, state) {
    speelVeld.innerHTML = '';
    const htmlString = velden
        .map(
            (veld) =>
                `<span 
                    data-soort="${veld.soort}" 
                    style="--i: ${veld.rij};" 
                    data-index="${veld.index}" 
                    class="blok centreer ${state}">
                </span>`
        )
        .join('');
    speelVeld.insertAdjacentHTML('afterbegin', htmlString);
}

/* controls */
function insertControls(array) {
    return array
        .map((button) => {
            return `
        <label for="${button}" class="control ${button} centreer">
            <input type="button" value="${button}" id="${button}" />
        </label>
        `;
        })
        .join('');
}

/*********************************  main functions  *********************************/
function startSpel({ dimensies, naam, level, language }) {
    controls.innerHTML = insertControls(buttons);
    language = whichLanguage();
    meldingVak.innerHTML = insertMeldingen(meldingen[language]);
    const id = language === 'nl' ? 'speler' : 'player';
    document.getElementById(`${id}`).textContent = naam;
    nieuwSpel = new Schattenjacht(dimensies, dimensies, level, language);
    console.log(nieuwSpel);
    nieuwSpel.start();
}

/********************************* event listeners  *********************************/
/* handle form */
document.querySelector('form').onsubmit = (e) => {
    e.preventDefault();
    const formInputs = e.target.querySelectorAll('input:not([type="submit"]), select');
    const startWaarden = {};
    formInputs.forEach((input) => {
        if (['ntr', whichLanguage()].includes(input.lang)) {
            startWaarden[input.name] = input.value;
        }
    });
    startSpel(startWaarden);
    modal.classList.toggle('hidden');
};

/* controls */
controls.addEventListener('click', function (e) {
    if (e.target.getAttribute('type') === 'button' && !nieuwSpel.paused) {
        nieuwSpel.beweegSpeler(e.target.value);
    }
});

window.addEventListener('keyup', (e) => {
    if (nieuwSpel && !nieuwSpel.paused) {
        switch (e.code) {
            case 'ArrowUp':
                nieuwSpel.beweegSpeler('boven');
                break;
            case 'ArrowDown':
                nieuwSpel.beweegSpeler('onder');
                break;
            case 'ArrowLeft':
                nieuwSpel.beweegSpeler('links');
                break;
            case 'ArrowRight':
                nieuwSpel.beweegSpeler('rechts');
                break;
            default:
                break;
        }
    }
});

/********************************* class Schattenjacht  *********************************/
class Schattenjacht {
    paused = false;
    gewonnen = false;
    verloren = false;
    constructor(hoogte, breedte, level, language) {
        this.hoogte = hoogte || 20;
        this.breedte = breedte || 20;
        this.level = level || 'normaal';
        this.schatten = Math.round(Number(this.hoogte) * 0.8);
        this.muren = Math.round(Number(this.hoogte) * 0.8);
        if (this.level === 'gevorderd') {
            this.schatten = Math.round(Number(this.hoogte) * 1);
            this.muren = Math.round(Number(this.hoogte) * 0.5);
        }
        this.levens = 5;
        this.punten = 0;
        this.language = language;

        this.meldingen = {
            levens: this.levens,
            score: this.punten,
            melding: this.language === 'nl' ? 'Schattenjacht' : 'Treasure Hunt',
            schatten: this.schatten,
        };
    }
    start() {
        this.maakVeldArray();
        maakGrid(this.getAfmetingen());
        maakGras(this.velden, 'onload');
        this.showMessage();
    }
    maakVeldArray() {
        const aantalVelden = this.hoogte * this.breedte;
        const aantalGras = aantalVelden - this.schatten - this.muren - 2;
        const gras = Array(aantalGras).fill('gras');
        const schatten = Array(this.schatten).fill('schat');
        const muren = Array(this.muren).fill('muur');
        const startArray = shuffleArray([...muren, ...schatten, ...gras, 'jager', 'vijand']);

        let kolom = 1;
        let rij = 1;
        this.velden = startArray.map((veld, index) => {
            let [boven, onder, links, rechts] = Array(4).fill(true);
            if (kolom > this.breedte) {
                kolom = 1;
                rij++;
            }
            if (kolom === this.breedte) {
                rechts = false;
            }
            if (kolom === 1) {
                links = false;
            }
            if (rij === 1) {
                boven = false;
            }
            if (rij === this.hoogte) {
                onder = false;
            }
            const veldObject = { soort: veld, rij, kolom, boven, onder, links, rechts, index };
            kolom++;
            return veldObject;
        });
    }
    getAfmetingen() {
        const schermHoogte = window.innerHeight;
        const schermBreedte = window.innerWidth;
        this.blokHoogte =
            schermHoogte >= schermBreedte
                ? ((schermBreedte * 0.9) / this.hoogte).toFixed(0)
                : ((schermHoogte * 0.8) / this.breedte).toFixed(0);

        this.afmetingen = {
            hoogte: this.hoogte,
            breedte: this.breedte,
            blokHoogte: this.blokHoogte,
            spelBreedte: this.breedte * this.blokHoogte,
            spelHoogte: this.hoogte * this.blokHoogte,
        };
        return this.afmetingen;
    }

    beweegSpeler(richting) {
        const jagerObject = this.velden.find((veld) => veld.soort === 'jager');
        const nieuwePositie = this.vindNieuwePositie(jagerObject, richting);
        nieuwePositie && this.updatePositieSpeler(nieuwePositie, jagerObject);
    }

    vindNieuwePositie(individu, richting) {
        if (individu[richting] === false) {
            return false;
        }
        switch (richting) {
            case 'boven':
                return vindCoordinaten(this.velden, individu.rij - 1, individu.kolom);
            case 'onder':
                return vindCoordinaten(this.velden, individu.rij + 1, individu.kolom);
            case 'links':
                return vindCoordinaten(this.velden, individu.rij, individu.kolom - 1);
            case 'rechts':
                return vindCoordinaten(this.velden, individu.rij, individu.kolom + 1);
            default:
                break;
        }
    }
    async updatePositieSpeler(positie, individu) {
        if (!this.gewonnen && !this.verloren) {
            const nieuwePositie = document.querySelector(`[data-index="${positie.index}"]`);
            await toggleClassEventjes(nieuwePositie, 'active', 20);
            if (positie.soort === 'muur') {
                return;
            } else if (individu.soort === 'jager' && positie.soort === 'vijand') {
                this.setLevens();
                if (!this.gewonnen && !this.verloren) {
                    this.respawn();
                }
                return;
            } else if (individu.soort === 'jager' && positie.soort === 'schat') {
                this.setSchatten();
            }
            this.velden[positie.index].soort = individu.soort;
            this.velden[individu.index].soort = 'gras';

            this.beweegVijand();
            maakGras(this.velden, '');
        }
    }

    async beweegVijand() {
        const vijandObject = this.velden.find((veld) => veld.soort === 'vijand');
        const jagerObject = this.velden.find((veld) => veld.soort === 'jager');
        const rijVerschil = jagerObject.rij - vijandObject.rij;
        const kolomVerschil = jagerObject.kolom - vijandObject.kolom;

        let richtingen = ['links', 'rechts', 'onder', 'boven'];
        let optie1, optie2, opties;
        let nieuwePositie;
        /* level: beginner */
        if (this.level === 'beginner') {
            let richting = richtingen[random(0, 4)];
            nieuwePositie = this.vindNieuwePositie(vijandObject, richting);
            let counter = 100;
            while (!nieuwePositie || nieuwePositie.soort === 'muur') {
                richting = richtingen[random(0, 4)];
                nieuwePositie = this.vindNieuwePositie(vijandObject, richting);
                // indien vijand muurvast zit : herstart spel
                counter === 0 && this.start();
                counter--;
            }
        }
        /* level: gevorderd */
        if (this.level === 'gevorderd') {
            // opties: dichtste richting om bij jager te komen: optie1 beter dan optie2
            if (rijVerschil >= 0) {
                optie1 = 'onder';
                optie2 = kolomVerschil >= 0 ? 'rechts' : 'links';
                if (rijVerschil === 0 || Math.abs(rijVerschil) <= Math.abs(kolomVerschil)) {
                    [optie1, optie2] = [optie2, optie1];
                }
            } else {
                optie1 = 'boven';
                optie2 = kolomVerschil >= 0 ? 'rechts' : 'links';
                if (rijVerschil === 0 || Math.abs(rijVerschil) <= Math.abs(kolomVerschil)) {
                    [optie1, optie2] = [optie2, optie1];
                }
            }
            // twee opties, aanvullen met de andere twee
            opties = new Set([optie1, optie2, ...richtingen]);
            for (const optie of opties) {
                nieuwePositie = this.vindNieuwePositie(vijandObject, optie);
                if (nieuwePositie && ['gras', 'jager'].includes(nieuwePositie.soort)) {
                    break;
                }
            }
            !nieuwePositie && this.start();
        }

        /* level: normaal */
        if (this.level === 'normaal') {
            let randomCounter;
            if (rijVerschil >= 0 && randomCounter % 5 !== 0) {
                optie1 = 'onder';
                optie2 = kolomVerschil >= 0 && randomCounter % 10 !== 0 ? 'rechts' : 'links';
            } else {
                optie1 = 'boven';
                optie2 = kolomVerschil >= 0 && randomCounter % 10 !== 0 ? 'rechts' : 'links';
            }
            opties = new Set([optie1, ...richtingen]);
            for (const optie of opties) {
                nieuwePositie = this.vindNieuwePositie(vijandObject, optie);
                if (nieuwePositie && !['muur', 'schat'].includes(nieuwePositie.soort)) {
                    break;
                }
            }
            randomCounter++;
            !nieuwePositie && this.start();
        }
        this.paused = true;
        await wait(200);
        /* posities aanpassen */
        if (this.velden[nieuwePositie.index].soort === 'jager') {
            this.setLevens();
            if (!this.gewonnen && !this.verloren) {
                this.respawn();
            }
            return;
        } else if (this.velden[nieuwePositie.index].soort === 'schat') {
            //return;
        } else {
            this.velden[nieuwePositie.index].soort = 'vijand';
            this.velden[vijandObject.index].soort = 'gras';
        }
        maakGras(this.velden, '');
        this.paused = false;
    }
    async setSchatten() {
        this.schatten--;
        this.meldingen.schatten = this.schatten;
        this.setPunten();
        this.meldingen.melding = this.language === 'nl' ? 'Schat gevonden!' : 'Treasure found!';

        this.showMessage();
        await toggleClassEventjes(speelveld, 'schatGevonden', 100);
        !this.schatten && this.youWin();
    }
    setPunten() {
        this.punten += 20;
        this.meldingen.score = this.punten;
        this.showMessage();
    }
    async setLevens() {
        this.levens--;
        if (this.levens === 0) {
            this.gameOver();
        }
        this.meldingen.levens = this.levens;
        this.meldingen.melding = this.language === 'nl' ? 'Leventje minder...' : 'There goes a life...';
        this.showMessage();
        await toggleClassEventjes(speelveld, 'levenMinder', 100);
    }
    async respawn() {
        const jagerObject = this.velden.find((veld) => veld.soort === 'jager');
        this.paused = true;
        const gras = this.velden.filter((vakje) => vakje.soort === 'gras');
        const grasOmtrek = gras.filter(
            (grasVak) =>
                [1, Number(this.hoogte)].includes(grasVak.rij) || [1, Number(this.breedte)].includes(grasVak.kolom)
        );
        let respawnPositie;
        if (grasOmtrek.length) {
            respawnPositie = grasOmtrek[random(0, grasOmtrek.length)];
        } else {
            respawnPositie = grasOmtrek[random(0, gras.length)];
        }

        const nieuwePositie = document.querySelector(`[data-index="${respawnPositie.index}"]`);
        await toggleClassEventjes(nieuwePositie, 'respawn', 1000);
        this.velden[respawnPositie.index].soort = 'jager';
        this.velden[jagerObject.index].soort = 'gras';
        maakGras(this.velden, '');
        this.paused = false;
    }
    async gameOver() {
        this.meldingen.melding =
            this.language === 'nl' ? `Verloren met ${this.punten} punten` : `You lost with ${this.punten} points`;

        this.showMessage();
        this.verloren = true;
        this.paused = true;

        await wait(500);
        document.querySelector('form > h2').textContent = 'Game Over!';
        modal.classList.toggle('hidden');
    }
    async youWin() {
        this.meldingen.melding =
            this.language === 'nl' ? `Gewonnen met ${this.punten} punten` : `You won with ${this.punten} points`;

        this.showMessage();
        this.gewonnen = true;
        this.paused = true;

        await wait(500);
        document.querySelector('form > h2').textContent = 'Winnaar!';
        modal.classList.toggle('hidden');
    }
    showMessage() {
        if (this.language === 'nl') {
            for (const [key, value] of Object.entries(this.meldingen)) {
                document.querySelector(`[data-melding="${key}"]`).innerHTML = value;
            }
        } else {
            for (const [key, value] of Object.entries(this.meldingen)) {
                document.querySelector(`[data-melding="${key}"]`).innerHTML = value;
            }
        }
    }
}
