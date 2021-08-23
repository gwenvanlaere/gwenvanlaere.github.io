/** @format */

'use strict';
/* hard-code viewport dimensions: mainly because of input keyboards for mobile */
addEventListener('load', function () {
    const viewport = document.querySelector('meta[name=viewport]');
    viewport.setAttribute('content', viewport.content + ', height=' + window.innerHeight);
});

/** carousels **/
const broodjesListIndex = document.querySelector('.broodjesCarouselIndex');
const broodjesListAanbod = document.querySelector('.broodjesCarouselAanbod');

/** carousel voor index pagina **/
if (broodjesListIndex !== null) {
    const broodjes = Array.from(broodjesListIndex.children).map((item) => {
        return {
            heading: item.firstElementChild.textContent,
            background: `url('${item.lastElementChild.src}')`,
        };
    });

    const carouselDivIndex = document.createElement('div');
    carouselDivIndex.className = 'carouselDiv carouselDivIndex';
    carouselDivIndex.id = 'carouselDivIndex';
    broodjesListIndex.insertAdjacentElement('beforebegin', carouselDivIndex);
    broodjesListIndex.remove();

    const bCarousel = new Carousel({
        title: '',
        progress: 0,
        className: 'slider broodjesSlider',
        id: 'broodjesSliderIndex',
        elem: carouselDivIndex,
        direction: 'horizontal',
    });
    bCarousel.addSlides(broodjes);

    bCarousel.addButtons('&#60;', '&#62;', false);
    bCarousel.addProgressBar('empty', 'afterend', 'highlight-lines');
}

/** carousel voor aanbod pagina **/
if (broodjesListAanbod !== null) {
    const broodjes = Array.from(broodjesListAanbod.children).map((item) => {
        return {
            heading: item.firstElementChild.textContent,
            text: [item.firstElementChild.nextElementSibling.textContent],
            html: `${item.lastElementChild.previousElementSibling.outerHTML}${item.lastElementChild.outerHTML}`,
            background: `url('${item.firstElementChild.nextElementSibling.nextElementSibling.src}')`,
        };
    });

    const carouselDivAanbod = document.createElement('div');
    carouselDivAanbod.className = 'carouselDiv carouselDivAanbod';
    carouselDivAanbod.id = 'carouselDivAanbod';
    broodjesListAanbod.insertAdjacentElement('beforebegin', carouselDivAanbod);
    broodjesListAanbod.remove();

    const bCarousel = new Carousel({
        title: '',
        progress: 0,
        className: 'slider broodjesSlider',
        id: 'broodjesSliderAanbod',
        elem: carouselDivAanbod,
        direction: 'horizontal',
    });
    bCarousel.addSlides(broodjes);
    bCarousel.addButtons('&#60;', '&#62;', true);
}

/* login register form */
const eindeLoginPage = document.querySelector('#btnRegistreer');
const signinBtn = document.querySelector('.signinBtn');
const signupBtn = document.querySelector('.signupBtn');
const formBx = document.querySelector('.formBx');
const formError = document.querySelector('.formError');

if (eindeLoginPage !== null) {
    document.querySelector('#txtWachtwoordLog').focus();
    document.querySelector('#txtEmailLog').focus();
    signupBtn.addEventListener('click', () => formBx.classList.add('active'));
    signinBtn.addEventListener('click', () => formBx.classList.remove('active'));
}

if (formError && formError.classList.contains('registreer')) {
    signupBtn.click();
}
