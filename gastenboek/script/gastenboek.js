/** @format */

'use strict';
/* hard-code viewport dimensions: mainly because of input keyboards for mobile */
addEventListener('load', function () {
    const viewport = document.querySelector('meta[name=viewport]');
    viewport.setAttribute('content', viewport.content + ', height=' + window.innerHeight);
});

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
