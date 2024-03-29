/** @format */

'use strict';

// ========================================IMAGE FOLDER===============================================
/* werkt voor images van 960 x 720
            :root {
                --prevImage: url(../media/images/image_folder/img9.jpg);
                --currentImage: url(../media/images/image_folder/img10.jpg);
                --nextImage: url(../media/images/image_folder/img11.jpg);
                --thumbback0: url(../media/images/image_folder/img0.jpg);
                --thumbback1: url(../media/images/image_folder/img1.jpg);
                --thumbback2: url(../media/images/image_folder/img2.jpg);
                --thumbback3: url(../media/images/image_folder/img3.jpg);
                --thumbback4: url(../media/images/image_folder/img4.jpg);
                --transition: transform 1.2s ease-out;
                --border: none;
                --radius: 15px;
            } */

// select css --variables on root element
const rootVar = document.documentElement;

// backface visibility bug in Firefox is vdK!!
// 3d transform is not accurate, so correction translateX of the right-side cards of imageBox
// translateX too tricky with all rotating transformations, so => right: 1px

//navigator.userAgent.includes('Firefox') && rootVar.style.setProperty('--ffoxright', 'translateX(1px)');

const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

// zien in welke modus website : mobiel of desktop => translate X of Y

//________VARS___________
//                       ||
/////////////////////////||
/////////////////////////||
var translate; //////////||
var fullscreen = false; //||
/////////////////////////||
/////////////////////////||
//_______________________||

window.innerWidth < 655 || fullscreen === true ? (translate = 'X') : (translate = 'Y');
const transition = 'transform 1.2s ease-out';

//________________________
//                      ||
////////////////////////||
////////////////////////||
const NUMBER_IMAGES = 94; ////||
////////////////////////||
////////////////////////||
//______________________||
//======================================IMAGE BOX=============================================
const imageBox = document.querySelector('.image-box');
const left = document.querySelector('.left.front');
const right = document.querySelector('.right.front');
const container = document.querySelector('.container');
const infoSlider = document.querySelector('#info');
const description = document.querySelector('#description');
description.textContent = image_data[10].title;
const randomImages = populateImages();

// Start from 1 by passing map function to Array from(), with an object with a length property
function populateImages(arr) {
    arr = [...Array(NUMBER_IMAGES).keys()];
    return arr;
}

function randomDelete(array) {
    let arrLen = array.length;
    arrLen === 1 && populateImages(array);
    let random = Math.floor(Math.random() * arrLen);
    let removed = array.splice(random, 1);
    return removed[0];
}

function changeImage(direction) {
    let rndm = randomDelete(randomImages);
    // zet currentImage gelijk aan de veranderde image (prev - next)
    if (direction === 'next') {
        rootVar.style.setProperty(`--nextImage`, `url(../media/images/image_folder/${image_data[rndm].filename})`);
        updateInfo(rndm);
        document.querySelector('.right.front').addEventListener('transitionend', function () {
            rootVar.style.setProperty(
                '--currentImage',
                `url(../media/images/image_folder/${image_data[rndm].filename})`
            );
            description.textContent = image_data[rndm].title;
        });
    } else {
        rootVar.style.setProperty(`--prevImage`, `url(../media/images/image_folder/${image_data[rndm].filename})`);
        updateInfo(rndm);
        document.querySelector('.left.front').addEventListener('transitionend', function () {
            rootVar.style.setProperty(
                '--currentImage',
                `url(../media/images/image_folder/${image_data[rndm].filename})`
            );
            description.textContent = image_data[rndm].title;
        });
    }
}

right.addEventListener('click', () => rotate('next'));
left.addEventListener('click', () => rotate('prev'));

async function rotate(direction) {
    // disable buttons to not create more than necessary spans
    document.querySelector('.left.front').style.pointerEvents = 'none';
    document.querySelector('.right.front').style.pointerEvents = 'none';
    infoSlider.classList.contains('active') ? (infoSlider.classList.toggle('active'), await wait(600)) : null;

    if (direction === 'next') {
        changeImage(direction);
        makeSpans(direction);
        await wait(20);
        let left = document.querySelector('.left.front');
        let right = document.querySelector('.right.front');
        let lb = document.querySelector('.left.back');
        let rb = document.querySelector('.right.back');
        right.style.transform = 'rotateY(-180deg)';
        //correctie voor gap veroorzaakt door perspective -- TO DO!!!
        rb.style.transform = 'rotateY(0deg)';

        right.addEventListener('transitionend', async () => {
            replaceSpans('next');
            left.remove();
            right.remove();
            await wait(50);
            lb.remove();
            rb.remove();
            document.querySelector('.next.right.front').addEventListener('click', function () {
                rotate('next');
            });
            document.querySelector('.next.left.front').addEventListener('click', function () {
                rotate('');
            });
        });
    } else {
        changeImage('');
        makeSpans('');
        await wait(20);
        let left = document.querySelector('.left.front');
        let right = document.querySelector('.right.front');
        let lb = document.querySelector('.left.back');
        let rb = document.querySelector('.right.back');

        lb.style.transform = 'rotateY(0deg)';
        left.style.transform = 'rotateY(180deg)';
        left.addEventListener('transitionend', async () => {
            replaceSpans();
            left.remove();
            right.remove();
            await wait(50);
            lb.remove();
            rb.remove();
            document.querySelector('.previous.right.front').addEventListener('click', () => rotate('next'));
            document.querySelector('.previous.left.front').addEventListener('click', () => rotate(''));
        });
    }
}

function makeSpans(direction) {
    if (direction === 'next') {
        let html = `
                    <span class="left back" style="transition: ${transition};"></span>
                    <span class="right back" style="transition: ${transition};"></span>
                    `;
        imageBox.insertAdjacentHTML('beforeend', html);
    } else {
        let html = `
                    <span class="previous right back" style="transition: ${transition};"></span>
                    <span class="previous left back" style="transition: ${transition};"></span>
                    `;
        imageBox.insertAdjacentHTML('beforeend', html);
    }
}
function replaceSpans(direction) {
    if (direction === 'next') {
        let html = `
                    <span class="next left front" style="transition: ${transition};" tabindex="0"></span>
                    <span class="next right front" style="transition: ${transition};" tabindex="0"></span>
                    `;
        imageBox.insertAdjacentHTML('beforeend', html);
    } else {
        let html = `
                    <span class="previous left front" style="transition: ${transition};" tabindex="0"></span>
                    <span class="previous right front" style="transition: ${transition};" tabindex="0"></span>
                    `;
        imageBox.insertAdjacentHTML('beforeend', html);
    }
}
rotate('next');

// ======================================THUMBNAILS SLIDER=============================================
const thumbs = document.querySelectorAll('.thumbs');
const thumbDisplay = document.querySelector('.thumb-display');
const thumbBox = document.querySelector('.thumb-box');
const currentImage = thumbDisplay.querySelector('.current');
const leftImage = thumbDisplay.querySelector('.left');
const rightImage = thumbDisplay.querySelector('.right');
const leftOutImage = thumbDisplay.querySelector('.leftout');
const rightOutImage = thumbDisplay.querySelector('.rightout');
const prevButton = document.querySelector('#prev');
const nextButton = document.querySelector('#next');

function shuffle(numbers) {
    //create ordered array : 0,1,2,3..numbers
    let tempArr = [...Array(numbers).keys()];
    for (var array = [numbers], i = 0; i < numbers; i++) {
        //remove random element form the tempArr and push it into final array
        array[i] = tempArr.splice(Math.floor(Math.random() * (numbers - i)), 1)[0];
    }
    return array;
}

const randomThumbs = shuffle(NUMBER_IMAGES);

// startwaarden voor thumbnails background 0 -> 4
// 5 als controle index om laatste background aan te duiden

let currentBackground = [{ 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, firstValue: 0, lastValue: 4 }];

// links backgrounds of each thumbback (0 - 4)
function linkBackground(object, index) {
    rootVar.style.setProperty(
        `--thumbback${index}`,
        `url(../media/images/image_folder/${image_data[object[index]].filename})`
    );
}

var inTransit = false;

async function setBackground(array, direction = '', translate) {
    if (inTransit) {
        return;
    }
    document.activeElement.blur();
    let currentImage = thumbDisplay.querySelector('.current');
    let rightOutImage = thumbDisplay.querySelector('.rightout');
    let leftImage = thumbDisplay.querySelector('.left');
    let rightImage = thumbDisplay.querySelector('.right');
    let leftOutImage = thumbDisplay.querySelector('.leftout');
    let firstValue = currentBackground[0].firstValue;
    let lastValue = currentBackground[0].lastValue;
    let arrLen = array.length;
    if (direction === 'next') {
        if (firstValue === -1) {
            currentBackground[0].firstValue = arrLen - 1;
            return setBackground(randomThumbs, 'next', translate);
        }
        if (lastValue === -1) {
            currentBackground[0].lastValue = arrLen - 1;
            return setBackground(randomThumbs, 'next', translate);
        } else {
            inTransit = true;
            let dataAttr = parseInt(leftOutImage.getAttribute('data-background'));
            // checken ofdat firstValue - 1 niet negatief is. Geen img-1.jpg!!
            firstValue === 0
                ? (currentBackground[0][dataAttr] = arrLen - 1)
                : (currentBackground[0][dataAttr] = firstValue - 1);
            currentBackground[0].firstValue = firstValue - 1;
            currentBackground[0].lastValue = lastValue - 1;
            rightOutImage.setAttribute('data-image', firstValue);
            linkBackground(currentBackground[0], dataAttr);
            moveThumbs('next', translate);
        }
    } else {
        if (lastValue === arrLen) {
            currentBackground[0].lastValue = 0;
            return setBackground(randomThumbs, '', translate);
        }
        if (firstValue === arrLen) {
            currentBackground[0].firstValue = 0;
            return setBackground(randomThumbs, '', translate);
        } else {
            inTransit = true;
            let dataAttr = parseInt(rightOutImage.getAttribute('data-background'));
            //let imgNummer =
            // checken ofdat lastValue niet groter is dan aantal foto's!!
            lastValue === arrLen - 1
                ? (currentBackground[0][dataAttr] = 0)
                : (currentBackground[0][dataAttr] = lastValue + 1);
            currentBackground[0].lastValue = lastValue + 1;
            currentBackground[0].firstValue = firstValue + 1;
            leftOutImage.setAttribute('data-image', lastValue);
            linkBackground(currentBackground[0], dataAttr);
            moveThumbs('', translate);
        }
    }
    // add event listener to the new currentImage
    // wait for transition of thumbs to end, prevent breaking the getTranslate calculation
    currentImage.addEventListener('transitionend', setTransit);
}

const setTransit = () => (inTransit = false);

function moveThumbs(direction, translate) {
    let thumbs = document.querySelectorAll('.thumbs');
    let currentImage = thumbDisplay.querySelector('.current');
    let leftImage = thumbDisplay.querySelector('.left');
    let rightImage = thumbDisplay.querySelector('.right');
    let leftOutImage = thumbDisplay.querySelector('.leftout');
    let rightOutImage = thumbDisplay.querySelector('.rightout');
    currentImage.removeEventListener('click', thumbProjection);

    if (direction === 'next') {
        leftImage.removeEventListener('transitionend', setTransit);
        // make element rightout
        makeThumb('rightout', translate);
        // find translate x values for each thumbnail
        thumbs.forEach(
            (thumb) => (thumb.style.transform = `translate${translate}(${getTranslate(thumb, 'next', translate)}px)`)
        );
        // reorganize the positions and classes accordingly
        rightImage.classList.replace('right', 'current');
        rightImage.addEventListener('click', thumbProjection);
        currentImage.classList.replace('current', 'left');
        leftImage.classList.replace('left', 'leftout');
        rightOutImage.classList.replace('rightout', 'right');
        // remove outer left thumbnail
        leftOutImage.remove();
    } else {
        rightImage.removeEventListener('transitionend', setTransit);
        // make element leftout
        makeThumb('leftout', translate);
        // find translate x values for each thumbnail
        thumbs.forEach(
            (thumb) => (thumb.style.transform = `translate${translate}(${getTranslate(thumb, '', translate)}px)`)
        );
        // reorganize the positions and classes accordingly
        leftImage.classList.replace('left', 'current');
        leftImage.addEventListener('click', thumbProjection);
        currentImage.classList.replace('current', 'right');
        rightImage.classList.replace('right', 'rightout');
        leftOutImage.classList.replace('leftout', 'left');
        // remove outer right thumbnail
        rightOutImage.remove();
    }
}

function getTranslate(elem, direction, translate) {
    const { x, y, width, height } = thumbBox.getBoundingClientRect();
    const elemWidth = elem.getBoundingClientRect().width;
    const elemHeight = elem.getBoundingClientRect().height;
    const elemX = elem.getBoundingClientRect().x;
    const elemY = elem.getBoundingClientRect().y;
    const margin = (width - elemWidth * 3) / 2;
    let translateX1 = elemX - x;
    let translateX2 = elemX + elemWidth - x - width;

    let translateY1 = elemY - y;
    let translateY2 = elemY + elemHeight - y - height;

    if (direction === 'next') {
        return translate === 'X' ? translateX2 : translateY2;
    } else {
        return translate === 'X' ? translateX1 : translateY1;
    }
}

function makeThumb(side, translate) {
    // copy background attribute from item that will be removed
    let leftout = document.querySelector('.thumbs.leftout');
    let rightout = document.querySelector('.thumbs.rightout');

    if (side === 'rightout') {
        let bgDataL = leftout.getAttribute('data-background');
        const rightThumb = document.createElement('span');
        rightThumb.classList = 'thumbs rightout';
        rightThumb.setAttribute('data-background', bgDataL);
        rightThumb.setAttribute('data-origin', 'new');
        rightThumb.style.transform = `translate${translate}(${positionThumbs('right', translate)}px)`;
        rightThumb.style.transition = 'transform 0.5s cubic-bezier(.3,0,.23,1.27)';
        thumbDisplay.append(rightThumb);
    } else {
        let bgDataR = rightout.getAttribute('data-background');
        const leftThumb = document.createElement('span');
        leftThumb.classList = 'thumbs leftout';
        leftThumb.setAttribute('data-background', bgDataR);
        leftThumb.setAttribute('data-origin', 'new');
        leftThumb.style.transform = `translate${translate}(${positionThumbs('left', translate)}px)`;
        leftThumb.style.transition = 'transform 0.5s cubic-bezier(.3,0,.23,1.27)';
        thumbDisplay.prepend(leftThumb);
    }
}

function positionThumbs(side, translate) {
    let currentImage = thumbDisplay.querySelector('.current');
    let leftImage = thumbDisplay.querySelector('.left');
    let rightImage = thumbDisplay.querySelector('.right');
    let leftOutImage = thumbDisplay.querySelector('.leftout');
    let rightOutImage = thumbDisplay.querySelector('.rightout');
    const { x, y, width, height } = thumbBox.getBoundingClientRect();
    const thumbWidth = currentImage.getBoundingClientRect().width;
    const thumbX = currentImage.getBoundingClientRect().x;
    const marginX = (width - thumbWidth * 3) / 2;
    const thumbHeight = currentImage.getBoundingClientRect().height;
    const thumbY = currentImage.getBoundingClientRect().y;
    const marginY = (height - thumbHeight * 3) / 2;

    if (translate === 'X') {
        const leX = x - thumbX; // leftImage
        const reX = thumbWidth + marginX; // rightImage
        const louX = leX - marginX - thumbWidth; // leftOutImage
        const rouX = reX + thumbWidth + marginX; // rightOutImage

        currentImage.style.transform = `translate${translate}(0px)`;
        leftImage.style.transform = `translate${translate}(${leX}px)`;
        rightImage.style.transform = `translate${translate}(${reX}px)`;
        leftOutImage.style.transform = `translate${translate}(${louX}px)`;
        rightOutImage.style.transform = `translate${translate}(${rouX}px)`;

        return side === 'left' ? louX : rouX;
    } else {
        const leY = y - thumbY; // leftImage
        const reY = thumbHeight + marginY; // rightImage
        const louY = leY - marginY - thumbHeight; // leftOutImage
        const rouY = reY + thumbHeight + marginY; // rightOutImage

        currentImage.style.transform = `translate${translate}(0px)`;
        leftImage.style.transform = `translate${translate}(${leY}px)`;
        rightImage.style.transform = `translate${translate}(${reY}px)`;
        leftOutImage.style.transform = `translate${translate}(${louY}px)`;
        rightOutImage.style.transform = `translate${translate}(${rouY}px)`;

        return side === 'left' ? louY : rouY;
    }
}

function debounce(func, wait, immediate) {
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

function thumbProjection(event) {
    const bgNumber = event.currentTarget.getAttribute('data-image');
    rootVar.style.setProperty('--currentImage', `url(../media/images/image_folder/${image_data[bgNumber].filename})`);
    description.textContent = image_data[bgNumber].title;
    updateInfo(bgNumber);

    let currentLeft = document.querySelector('.left.front');
    let currentRight = document.querySelector('.right.front');

    currentLeft.style.background = 'var(--currentImage)';
    currentLeft.style.backgroundSize = 'cover';

    currentRight.style.background = 'var(--currentImage)';
    currentRight.style.backgroundSize = 'cover';
    currentRight.style.backgroundPosition = 'top right';
}
positionThumbs('', translate);

function updateInfo(index) {
    const { description, location, county, municipality } = image_data[index];
    let html = `
            <h3>${description}</h3>
            <p>${location} (${municipality})</p>
            <p>County of ${county} </p>`;

    infoSlider.innerHTML = html;
}

// =======================================EVENT LISTENERS==============================================

currentImage.addEventListener('click', thumbProjection);
description.addEventListener('click', () => infoSlider.classList.toggle('active'));
infoSlider.addEventListener('click', () => infoSlider.classList.toggle('active'));

nextButton.addEventListener('click', () => setBackground(randomThumbs, 'next', translate));
prevButton.addEventListener('click', () => setBackground(randomThumbs, '', translate));

window.addEventListener('keydown', async function (event) {
    if (translate === 'X') {
        event.key === 'ArrowRight' && setBackground(randomThumbs, 'next', translate) && nextButton.focus();
        event.key === 'ArrowLeft' && setBackground(randomThumbs, '', translate) && prevButton.focus();
    } else {
        event.key === 'ArrowUp' && setBackground(randomThumbs, 'next', translate) && nextButton.focus();
        event.key === 'ArrowDown' && setBackground(randomThumbs, '', translate) && prevButton.focus();
    }
    await wait(100);
    document.activeElement.blur();
});
window.addEventListener('resize', async () => {
    window.innerWidth < 655 || fullscreen === true ? (translate = 'X') : (translate = 'Y');
    await wait(500);
    positionThumbs('', translate);
});

// =======================================FULL SCREEN==============================================

const fullscreenBtn = document.querySelector('#fullscreen');
const fullscreenClose = document.querySelector('#fullscreen-close');
fullscreenBtn.addEventListener('click', () => fullscreenMode());
fullscreenClose.addEventListener('click', () => fullscreenMode());

async function fullscreenMode() {
    // change global scoped var (see on top)
    fullscreen = !fullscreen;
    fullscreen ? (translate = 'X') : (translate = 'Y');

    container.classList.toggle('fullscreen');
    thumbDisplay.classList.toggle('fullscreen');
    thumbBox.classList.toggle('fullscreen');
    imageBox.classList.toggle('fullscreen');
    description.classList.toggle('fullscreen');

    await wait(1000);
    positionThumbs('', translate);
}

// ======================================RESPONSIVE SWIPE=============================================

const swiper = new Swipe(imageBox);
swiper.onLeft(() => rotate('next'));
swiper.onRight(() => rotate('prev'));
swiper.runEnd();
// ======================================RESPONSIVE IMAGE=============================================

//console.log(document.querySelector('.image-box'));
/*window.onresize = async () => {
    await wait(1000);
    handleImageDimensions(getDimensions());
};

// helper function to position main picture and write media queries
function getDimensions() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const ratio = width / height;
    let orientation = width > height ? 'landscape' : 'portrait';
    if (ratio > 0.8 && ratio <= 1.1) {
        orientation = 'mosselVis';
    }
    return { size: orientation, height: height, width: width };
}
function handleImageDimensions(args) {
    const { size, height, width } = args;
    //console.log(size);
    switch (size) {
        case 'landscape':
            console.log(size);
            // imageBox.style.height = `${height * 0.6}px`;
            // imageBox.style.width = `${height * 0.6 * 1.333}px`;
            break;
        case 'portrait':
            console.log(size);
            //imageBox.style.width = `${maxWidth * 0.9}px`;
            //imageBox.style.height = `${(maxWidth * 0.9) / 1.333}px`;
            break;
        case 'mosselVis':
            console.log(size);
            //imageBox.style.width = `${maxWidth * 0.7}px`;
            //imageBox.style.height = `${(maxWidth * 0.7) / 1.333}px`;
            break;
    }
}*/

// =======================================END OF THE SHOW==============================================
