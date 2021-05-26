/**
 * /* @format
 *
 * @format
 */

'use strict';
/********* Onload event *********/
window.onload = function () {
    spillCoffee();
    calcSkillGrid();
    if (window.innerWidth > 740) {
        const job = document.querySelector('#first-job');
        job.className += ' active';
        job.style.maxHeight = '100%';
    }
    // adjust height of workbox to timeline height
    if (window.innerWidth < 740) {
        hWorkbox(event);
    }
};

/********* script voor navigatie *********/

// (function() {
//     var call = Function.prototype.call;
//     Function.prototype.call = function() {
//         console.log(this, arguments);
//         return call.apply(this, arguments);
//     };
// }());
gsap.registerPlugin(MorphSVGPlugin);
const toggle = document.querySelector('.toggle');
const menu = document.querySelector('.menu');
const items = document.querySelectorAll('.item');
const navigation = document.querySelector('nav');

/********* Toggle mobile menu *********/
function toggleMenu() {
    if (menu.classList.contains('active')) {
        menu.classList.remove('active');
        navigation.classList.remove('fixed');
        morphBack();
    } else {
        menu.classList.add('active');
        navigation.classList.add('fixed');
        morph();
    }
}

/********* Activate Submenu *********/
function toggleItem() {
    if (this.classList.contains('submenu-active') && event.target.className !== 'submenu') {
        this.classList.remove('submenu-active');
    } else if (menu.querySelector('.submenu-active')) {
        menu.querySelector('.submenu-active').classList.remove('submenu-active');
        this.classList.add('submenu-active');
    } else {
        this.classList.add('submenu-active');
    }
}

// Close Submenu From Anywhere Outside Submenu
function closeSubmenu(e) {
    const isClickInside = e.target.parentElement.className.includes('sub') ? true : false;
    if (!isClickInside && menu.querySelector('.submenu-active')) {
        menu.querySelector('.submenu-active').classList.remove('submenu-active');
    }
}

/********* Event Listeners *********/
toggle.addEventListener('click', toggleMenu, false);
toggle.addEventListener('keypress', toggleMenu, false);
for (let item of items) {
    if (item.querySelector('.submenu')) {
        item.addEventListener('click', toggleItem, false);
    }
    item.addEventListener('keypress', toggleItem, false);
}

document.addEventListener('click', closeSubmenu, false);

// transformeer de lijnen in bolletjes
var tl = gsap.timeline();
function morph() {
    tl.to('#path10', 0.4, {
        morphSVG: '#npath10',
        ease: Back.easeInOut,
    })
        .to('#path20', 0.4, { morphSVG: '#npath20', ease: Back.easeInOut }, '-=0.4')
        .to('#path21', 0.4, { morphSVG: '#npath21', ease: Back.easeInOut }, '-=0.4')
        .to('#path30', 0.4, { morphSVG: '#npath30', ease: Back.easeInOut }, '-=0.4')
        // splits middelste lijn en zet bolletjes op hun plaats
        .to('#path20', 0.2, { x: -3.3 }, '-=0')
        .to('#path21', 0.2, { x: 3.3 }, '-=0.2')
        .to('#path10', 0.2, { x: -3.3 }, '+=0')
        .to('#path30', 0.2, { x: 3.3 }, '-=0.2')
        // transformeer bolletjes naar X
        .to('#path10', 0.5, { x: 0, morphSVG: '#ypath10', ease: Back.easeOut }, '-=0')
        .to('#path20', 0.5, { x: 0, morphSVG: '#ypath20', ease: Back.easeOut }, '-=0.5')
        .to('#path21', 0.5, { x: 0, morphSVG: '#ypath30', ease: Back.easeOut }, '-=0.5')
        .to('#path30', 0.5, { x: 0, morphSVG: '#ypath21', ease: Back.easeOut }, '-=0.5');
}
var tl2 = gsap.timeline();
function morphBack() {
    tl.to('#path10', { duration: 1, morphSVG: '#path10', ease: 'elastic.inOut(0.75, 0.4)' });
    tl.to('#path20', { duration: 1, morphSVG: '#path20', ease: 'elastic.inOut(0.75, 0.3)' }, '-=1');
    tl.to('#path21', { duration: 1, morphSVG: '#path21', ease: 'elastic.inOut(0.75, 0.4)' }, '-=1');
    tl.to('#path30', { duration: 1, morphSVG: '#path30', ease: 'elastic.inOut(0.75, 0.4)' }, '-=1');
}
/********* script voor animatie van coffee letters *********/
// animeer tekst (class active) wanneer volledig doorgescrolled
// start is spillcoffee, wanneer doorgescrolled top en left = 0
const letters = document.querySelectorAll('.letters');
const coffees = document.querySelectorAll('.coffees');
const nameBox = document.querySelector('.name-box');
const meetUp = document.querySelector('#meet-up');
// root null gekozen boven nameBox => geen support in webkit en edge
const ob = new IntersectionObserver(letsMeet, {
    root: null,
    threshold: 0.9,
});

function letsMeet(payload) {
    if (payload[0].isIntersecting) {
        coffees.forEach((coffee, i) => {
            setTimeout(() => {
                coffee.classList.add('active');
                coffee.style.left = '0';
                coffee.style.top = '0';
            }, 300 * i);
        });
    } else {
        coffees.forEach((coffee) => {
            coffee.classList.remove('active');
        });
        spillCoffee();
    }
}

ob.observe(meetUp);

// find matches and spillCoffee
function spillCoffee() {
    for (let i = 0; i < letters.length; i++) {
        const datLetter = letters[i].dataset.letter;
        for (let j = 0; j < coffees.length; j++) {
            const datCoffee = coffees[j].dataset.letter;
            if (datLetter === datCoffee) {
                // positiebepaling ten opzichte van nameBox ()
                let colRan = Math.floor(Math.random() * 100);
                const x1 = letters[i].offsetLeft;
                const y1 = letters[i].offsetTop;
                const x2 = coffees[j].offsetLeft;
                const y2 = coffees[j].offsetTop;

                const tlX = x2 - x1;
                const tlY = y2 - y1;

                coffees[j].style.left = `${-tlX}px`;
                coffees[j].style.top = `${-tlY}px`;
            }
        }
    }
}
// function for when window is resized => observer
function restart() {
    coffees.forEach((coffee) => {
        coffee.style.left = '0';
        coffee.style.top = '0';
    });
    spillCoffee();
}

const reOb = new ResizeObserver((entries) => {
    if (coffees[0].classList.contains('active')) {
        return;
    } else {
        restart();
    }
});

reOb.observe(nameBox);

/********* script voor images *********/

const images = document.querySelectorAll('.circle > img');
const oldtimer = document.querySelector('#oldtimer');
const busPic = document.querySelector('#bus');
const photoBox = document.querySelector('#photo');
const croatiaPic = document.querySelector('#croatia');
const hrvatska = document.querySelector('#hrvatska');
const profilePic = document.getElementById('profile-picture');
oldtimer.addEventListener('mouseenter', function () {
    showPic(busPic);
});
oldtimer.addEventListener('mouseleave', function () {
    hidePic();
});
hrvatska.addEventListener('mouseenter', function () {
    showPic(croatiaPic);
});
hrvatska.addEventListener('mouseleave', function () {
    hidePic();
});

function showPic(img) {
    images.forEach((image) => (image.style.opacity = 0));
    img.style.opacity = 1;
    photoBox.classList.add('active');
    //e.target.style.color = 'rgb(147, 142, 142)';
}
function hidePic() {
    images.forEach((image) => (image.style.opacity = 0));
    profilePic.style.opacity = 1;
    photoBox.classList.remove('active');
    //e.target.style.color = 'rgb(94, 91, 91)';
}

/********* script voor work section / transition timeline mobile *********/

//function for opening list-item when clicked upon
const jobTitles = document.querySelectorAll('.job-title');
const workBox = document.querySelector('#work-box');

jobTitles.forEach((jobTitle) => jobTitle.addEventListener('click', openJob));
jobTitles.forEach((jobTitle) =>
    jobTitle.addEventListener('keyup', function (event) {
        return event.keyCode === 13 ? openJob(event) : 'null';
    })
);
// open job tab by applying class active which changes initial max-height from 0 to...
function openJob(event) {
    let actives = workBox.querySelectorAll('.active');
    if (actives.length && actives[0] !== event.currentTarget) {
        actives[0].classList.remove('active');
    }
    event.currentTarget.classList.toggle('active');
}

function hideAll() {
    jobTitles.forEach((jobTitle) => {
        jobTitle.classList.remove('active', false);
        jobTitle.nextElementSibling.style.maxHeight = null;
    });
}
//collapse all items when clicked outside work section
const timeline = document.getElementById('timeline');
const eEvents = document.querySelectorAll('.event');

window.addEventListener('click', function (event) {
    if (!timeline.contains(event.target)) {
        // if clicked outside: hideAll tabs and remove all transitions
        timeline.classList.remove('transition--shown');
        eEvents.forEach((eEvent) => {
            eEvent.classList.remove('transition--shown');
        });
        hideAll();
    } else if (window.innerWidth < 740) {
        // if clicked inside and device is mobile or tablet: activate transition
        timeline.classList.add('transition--shown');
        eEvents.forEach((eEvent) => {
            eEvent.classList.add('transition--shown');
        });
    }
    return;
});

// workaround: get the appropriate mode for timeline transition when window
// gets resized, by clicking outside of target
window.addEventListener('resize', function (event) {
    if (window.innerWidth > 900) {
        document.getElementById('logo').click();
        document.getElementById('first-job').click();
        debounce(hWorkbox(event), 100);
    } else {
        document.getElementById('logo').click();
        debounce(hWorkbox(event));
    }
});
// adapt height of workbox to height of Timeline except for fullscreen

function hWorkbox(event) {
    const hTimeline = document.getElementById('timeline').clientHeight;
    document.getElementById('work-box').style.height = hTimeline * 1.1 + 'px';
}

/********* script voor tabbladen *********/

const tabs = document.querySelector('.skills-box');
const tabButtons = tabs.querySelectorAll('[role="tab"]');
const tabPanels = tabs.querySelectorAll('[role="tabpanel"]');

function handleTabClick(event) {
    // hide all tab panels & mark all tabs as unselected
    tabPanels.forEach((panel) => {
        panel.hidden = true;
    });
    tabButtons.forEach((button) => {
        button.classList.remove('active');
        button.setAttribute('aria-selected', false);
    });
    // mark the clicked tab as selected
    event.currentTarget.setAttribute('aria-selected', true);
    event.currentTarget.className += ' active';
    // find the associated tabPanel and show it
    const { id } = event.currentTarget;
    const tabPanel = tabs.querySelector(`[aria-labelledby="${id}"]`);
    tabPanel.hidden = false;
}
tabButtons.forEach((button) => button.addEventListener('click', handleTabClick));

const skillGrid = document.querySelector('#skills');
const softButton = document.querySelector('#soft-skills');

function calcSkillGrid() {
    const tabHeights = []; // array met hoogtes van tabs
    tabPanels.forEach((panel) => {
        panel.hidden = false; // walkaround om hoogte van hidden element te vinden
        let hTab = panel.clientHeight;
        panel.hidden = true;
        tabHeights.push(hTab);
    });
    const maxHeight = Math.max(...tabHeights);
    tabPanels.forEach((panel) => {
        panel.style.height = `${maxHeight}px`;
    });
    softButton.click();
}

/********* script voor mobile scroll *********/

//debounce function prevents from logging too much scroll events (=> every 20ms)
function debounce(func, wait = 20, immediate = true) {
    var timeout;
    return function () {
        var context = this,
            args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

const sections = document.querySelectorAll('section');

function checkSlide(e) {
    sections.forEach((section) => {
        // halfway through section
        const slideInAt = window.scrollY + window.innerHeight - section.offsetHeight / 2.5;
        // bottom of the section (aangepast: / 2)
        const sectionBottom = section.offsetTop + section.offsetHeight / 2;
        const isHalfShown = slideInAt > section.offsetTop;
        const isNotScrolledPast = window.scrollY < sectionBottom;
        if (isHalfShown && isNotScrolledPast) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });
}

// enkel voor window.innerwidth < 740px
if (window.innerWidth < 740) {
    window.addEventListener('scroll', debounce(checkSlide));
}
window.onresize = function () {
    if (window.innerWidth < 740) {
        window.addEventListener('scroll', debounce(checkSlide));
        //calcSkillGrid();
    }
};
