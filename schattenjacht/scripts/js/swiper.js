/** @format */

/* special thanks to @givanse and Marwelln on stackoverflow
https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android?fbclid=IwAR0KEEfZMJ-aK7FqLlBquwEKb-eoxdB4AtnEScE9rRFDYtx5YvcSq08EeAY
*/

class Swipe {
    constructor(element) {
        this.xDown = null;
        this.yDown = null;
        this.element = typeof element === 'string' ? document.querySelector(element) : element;

        this.element.addEventListener(
            'touchstart',
            function (evt) {
                this.xDown = evt.touches[0].clientX;
                this.yDown = evt.touches[0].clientY;
            }.bind(this),
            false
        );
    }

    onLeft(callback) {
        if (callback) {
            this.onLeft = callback;
            return this;
        }
    }

    onRight(callback) {
        if (callback) {
            this.onRight = callback;
            return this;
        }
    }

    onUp(callback) {
        if (callback) {
            this.onUp = callback || false;
            return this;
        }
    }

    onDown(callback) {
        if (callback) {
            this.onDown = callback;
            return this;
        }
    }

    handleTouchMove(evt) {
        if (!this.xDown || !this.yDown) {
            return;
        }

        const xUp = evt.touches[0].clientX;
        const yUp = evt.touches[0].clientY;

        this.xDiff = this.xDown - xUp;
        this.yDiff = this.yDown - yUp;

        if (!this.xDiff && !this.yDiff) {
            /* no movement */
            return;
        }

        if (Math.abs(this.xDiff) > Math.abs(this.yDiff)) {
            // Most significant.
            if (this.xDiff > 0) {
                this.onLeft();
            } else {
                this.onRight();
            }
        } else {
            if (this.yDiff > 0) {
                this.onUp();
            } else {
                this.onDown();
            }
        }

        // Reset values.
        this.xDown = null;
        this.yDown = null;
    }

    handleTouchEnd(evt) {
        if (!this.xDown || !this.yDown) {
            return;
        }

        const xUp = evt.changedTouches[0].clientX;
        const yUp = evt.changedTouches[0].clientY;

        this.xDiff = this.xDown - xUp;
        this.yDiff = this.yDown - yUp;

        if (!this.xDiff && !this.yDiff) {
            /* no movement */
            return;
        }

        if (Math.abs(this.xDiff) > Math.abs(this.yDiff)) {
            if (this.xDiff > 0) {
                this.onLeft();
            } else {
                this.onRight();
            }
        } else {
            if (this.yDiff > 0) {
                this.onUp();
            } else {
                this.onDown();
            }
        }

        this.xDown = null;
        this.yDown = null;
    }

    run() {
        this.element.addEventListener('touchmove', (evt) => this.handleTouchMove(evt), false);
    }
    runEnd() {
        this.element.addEventListener(
            'touchend',
            function (evt) {
                this.handleTouchEnd(evt);
            }.bind(this),
            false
        );
    }
}
