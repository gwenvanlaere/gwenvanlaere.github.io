/** @format */

'use strict';
/**
 * h>    implementation:
 * h>    carousel = {
 * h>         title: <STRING>,
 * h>         progress: <NUMBER> (0*: none, 1: numbers, 2: name),
 * h>         elem: <HTMLElement>
 * h>         height: <NUMBER>,
 * h>         width: <NUMBER>,
 * h>         gap: <NUMBER>,
 * h>         padding: <NUMBER>,
 * h>         unit: <STRING> (px, vh, %...),
 * h>         direction: <STRING> (horizontal*, vertical, diagonal),
 * h>         effect3d: <BOOL (F*)>,
 * h>    }
 */

class Carousel {
    static count = 1;

    transition = 'all 1s ease-in';
    transform = 'translate3d(0, 0, 0)';
    slides = [];
    progressBar = [];

    constructor({ ...props }) {
        /* content */
        this.className = props.className || 'carousel';
        this.id = props.id || this.className;
        this.title = props.title || '';
        this.progress = props.progress || 0;
        this.position = props.position || 'beforeend';
        /* box-model */
        this.elem = props.elem || document.body;
        this.height = props.height || '';
        this.width = props.width || '';
        this.gap = props.gap || 0;
        this.padding = props.padding || 0;
        this.unit = props.unit || '';
        /* carousel specs */
        this.direction = props.direction || 'horizontal';
        this.effect3d = props.effect3d || false;

        /* initialize & statistics */
        this.carousel = this.constructor.getCount();
        this.createFrame(this.position);
        //this.constructor.increaseCount();
    }
    static increaseCount() {
        this.count += 1;
    }
    static getCount() {
        return this.count;
    }
    static resetCount() {
        this.count = 1;
    }
    createFrame(position = 'beforeend') {
        const frame = document.createElement('div');
        frame.id = `${this.id}`;
        frame.className = `${this.className}`;

        frame.style.width = this.width + this.unit;
        frame.style.height = this.height + this.unit;

        this.elem.insertAdjacentElement(position, frame);
        this.frame = document.getElementById(frame.id);
    }
    addSlides(slides, position = 'beforeend') {
        let counter = 1;
        for (const elem of slides) {
            if (this.direction === 'horizontal') {
                elem['height'] = `${this.height - this.padding * 2}`;
                elem['width'] = `${this.width - this.padding * 2 - this.gap / 2}`;
            } else if (this.direction === 'vertical') {
                elem['height'] = `${this.height - this.padding * 2 - this.gap / 2}`;
                elem['width'] = `${this.width - this.padding * 2}`;
            } else {
                elem['height'] = `${this.height - this.padding * 2 - this.gap / 2}`;
                elem['width'] = `${this.width - this.padding * 2 - this.gap / 2}`;
            }
            elem['unit'] = this.unit;
            elem['id'] = this.frame.id;
            elem['className'] = this.frame.id;

            const slide = new Slide(elem);
            const slideElem = slide.createHTML();

            /* for making a continuous loop of images */
            slide['position'] = false;
            let positions;
            if (slides.length < 5) {
                positions = {
                    1: 'current',
                    2: 'next',
                    [slides.length]: 'previous',
                };
            } else {
                positions = {
                    1: 'current',
                    2: 'next',
                    3: 'next-next',
                    [slides.length]: 'previous',
                    [slides.length - 1]: 'prev-prev',
                };
            }
            if (counter in positions) {
                slide['position'] = positions[counter];
                slideElem.dataset.position = positions[counter];
            }

            this.slides.push(slide);
            this.frame.insertAdjacentElement(position, slideElem);
            counter++;
        }
        Slide.resetCount();
    }

    addButtons(prev = 'prev', next = 'next', outside = false) {
        const prevBtn = document.createElement('button');
        prevBtn.id = `${this.frame.id}-prev`;
        prevBtn.className = `${this.className} button prev-button`;
        prevBtn.innerHTML = prev;
        prevBtn.addEventListener('click', () => this.carouselSlide('back'));

        const nextBtn = document.createElement('button');
        nextBtn.id = `${this.frame.id}-next`;
        nextBtn.className = `${this.className} button next-button`;
        nextBtn.innerHTML = next;
        nextBtn.addEventListener('click', () => this.carouselSlide('forward'));

        if (outside === true) {
            this.frame.insertAdjacentElement('beforebegin', prevBtn);
            this.frame.insertAdjacentElement('afterend', nextBtn);
        } else {
            this.frame.insertAdjacentElement('afterbegin', prevBtn);
            this.frame.insertAdjacentElement('beforeend', nextBtn);
        }
    }
    addProgressBar(type = 'numbers', position = 'beforeend', className = '') {
        const progressBar = document.createElement('div');
        progressBar.className =
            `${className} ${this.frame.id}-progress-${this.progressBar.length + 1}` ||
            `${this.frame.id}-progress-${this.progressBar.length + 1}`;

        this.progressBar.push(progressBar);

        let htmlString = '';

        if (type === 'empty') {
            htmlString = this.slides
                .map((slide) => {
                    return `<span class="indicator" data-slide="${slide.slide}" data-position="${slide.position}"></span>`;
                })
                .join('');
        }
        if (type === 'numbers') {
            htmlString = this.slides
                .map((slide) => {
                    return `<span class="indicator" data-total="${this.slides.length}" data-slide="${slide.slide}" data-position="${slide.position}">
                ${slide.slide}</span>`;
                })
                .join('');
        }
        if (type === 'zeronumbers') {
            htmlString = this.slides
                .map((slide) => {
                    return `<span class="indicator" 
                    data-total="${this.slides.length < 10 ? `0${this.slides.length}` : this.slides.length}" 
                    data-slide="${slide.slide}" data-position="${slide.position}">
                ${slide.slide < 10 ? `0${slide.slide}` : slide.slide}</span>`;
                })
                .join('');
        }
        if (type === 'heading') {
            htmlString = this.slides
                .map((slide) => {
                    if (!slide.heading) {
                        return alert(`No heading found for slide`);
                    }
                    return `<span class="indicator" data-slide="${slide.slide}" data-position="${slide.position}">
                    ${slide.heading}</span>`;
                })
                .join('');
        }
        if (Array.isArray(type)) {
            if (type.length !== this.slides.length) {
                return alert(`There are ${type.length} words and ${this.slides.length} slides`);
            }
            htmlString = type
                .map((tag, i) => {
                    return `<span class="indicator" data-slide="${this.slides[i].slide}" data-position="${this.slides[i].position}">
                    ${tag}</span>`;
                })
                .join('');
        }
        progressBar.insertAdjacentHTML('afterbegin', htmlString);
        progressBar.firstElementChild.classList.add('current');

        progressBar.addEventListener('click', (e) => {
            if (e.target.tagName === 'SPAN') {
                Array.from(e.currentTarget.children).forEach((span) => span.classList.remove('current'));
                const targetSlide = this.slides.find((slide) => slide.slide === Number(e.target.dataset.slide));
                const current = this.getPositionSlide('current');
                targetSlide.slide >= current.slide
                    ? this.slideToCurrentPos(targetSlide, 'forward')
                    : this.slideToCurrentPos(targetSlide, 'back');
                e.target.classList.add('current');
            }
        });
        this.frame.insertAdjacentElement(position, progressBar);
    }
    carouselSlide(direction) {
        let newArray = [];
        let tempArray = direction === 'forward' ? [...this.slides].reverse() : [...this.slides];

        tempArray.forEach((slide, i, arr) => {
            let newSlide = { ...slide };
            newSlide.position = !arr[i + 1] ? arr[0].position : arr[i + 1].position;
            newSlide.currentPos = !arr[i + 1] ? arr[0].currentPos : arr[i + 1].currentPos;
            newArray.push(newSlide);
        });

        this.slides = direction === 'forward' ? newArray.reverse() : newArray;
        this.slides.forEach((slide) => {
            this.getSlideElem(slide).dataset.position = slide.position;
            this.getSlideElem(slide).style.setProperty('--i', slide.currentPos);
        });

        if (this.progressBar) {
            const current = this.getPositionSlide('current');
            this.progressBar.forEach((bar) => {
                Array.from(bar.children).forEach((span) => {
                    if (Number(span.dataset.slide) === current.slide) {
                        span.classList.add('current');
                    } else {
                        span.classList.remove('current');
                    }
                });
            });
        }
    }
    slideToCurrentPos(elem, direction) {
        let gepositioneerd = false;
        while (!gepositioneerd) {
            const current = this.slides.find((slide) => slide.position === 'current');
            if (current.id === elem.id) {
                return gepositioneerd === true;
            }
            this.carouselSlide(direction);
        }
    }
    getPositionSlide(position) {
        return this.slides.find((slide) => slide.position === position);
    }
    getAllSlides() {
        return this.slides;
    }
    getSlideElem(slide) {
        return document.getElementById(slide.id);
    }
    setAllSlideStyle(property, value) {
        this.slides.forEach((slide) => this.getSlideElem(slide).style.setProperty(property, value));
    }
    setSlideStyle(slide, property, value) {
        slide.style.setProperty(property, value);
    }
}

class Slide {
    static count = 1;
    constructor({ ...props }) {
        /* content */
        this.heading = props.heading || '';
        this.text = props.text || '';
        this.list = props.list || '';
        this.image = props.image || '';
        if (this.image) {
            this.image.src = props.image.src || alert(`${this.heading || 'picture'} is missing src`);
            this.image.alt = props.image.alt || alert(`${this.heading || 'picture'} is missing alt`);
            this.image.srcset = props.image.srcset || '';
            this.image.sizes = props.image.sizes || '';
        }
        this.html = props.html || '';
        this.background = props.background || '';
        /* box-model */
        this.height = props.height;
        this.width = props.width;
        this.unit = props.unit;
        /* carousel specs */
        this.effect3d = props.effect3d || false;
        /* statistics */
        this.slide = this.constructor.getCount();
        this.currentPos = this.slide;
        this.id = `${props.id}-slide-${this.slide}` || '';
        this.className = props.className || '';
        this.constructor.increaseCount();
    }
    static increaseCount() {
        this.count += 1;
    }
    static getCount() {
        return this.count;
    }
    static resetCount() {
        this.count = 1;
    }
    createHTML() {
        const slide = document.createElement('div');
        slide.className = `${this.className} slide slide-${this.slide}`;
        slide.id = this.id;
        slide.setAttribute('data-slide', this.slide);
        slide.style.setProperty('--i', this.slide);

        let htmlString = '';
        if (this.heading) {
            htmlString += `<h3 class="slide-heading">${this.heading}</h3>`;
        }
        if (this.text) {
            htmlString += this.text
                .map((paragraph, index) => {
                    return `<p class="slide-text text-${index + 1}">${paragraph}</p>`;
                })
                .join('');
        }
        if (this.image) {
            htmlString += `<img 
            src="${this.image.src}" 
            alt="${this.image.alt}" 
            srcset="${this.image.srcset}" 
            sizes="${this.image.sizes}">
            `;
        }
        if (this.list) {
            htmlString += '<ul class="slide-list">';
            htmlString += this.list.map((item) => `<li>${item}</li>`).join('');
            htmlString += '</ul>';
        }
        if (this.background) {
            slide.style.backgroundImage = this.background;
        }

        slide.insertAdjacentHTML('afterbegin', htmlString);
        if (this.unit && this.height && this.unit) {
            slide.style.height = this.height + this.unit;
            slide.style.width = this.width + this.unit;
        }
        if (this.html) {
            typeof this.html === 'string'
                ? slide.insertAdjacentHTML('beforeend', this.html)
                : slide.insertAdjacentElement('beforeend', this.html);
        }

        return slide;
    }
}
