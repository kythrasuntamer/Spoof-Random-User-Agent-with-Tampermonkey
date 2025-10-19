// ==UserScript==
// @name         Random User Agent Spoofer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Randomly switch between different browsers' ESR versions for anonymity
// @author       Paul Michael Tidwell
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // List of user agent strings for different browsers
    const userAgents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0", // Firefox ESR 140
        "Mozilla/5.0 (Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36", // Chrome LTS (138)
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 OPR/122.0.0.0", // Opera 122
        "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Vivaldi/7.6.3797.56" // 7.6
    ];

    // Function to randomly pick a user agent
    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

    // Set the user agent header to the randomly chosen one
    Object.defineProperty(navigator, 'userAgent', {
        value: randomUserAgent,
        writable: false
    });

    // Optional: Log the chosen user agent to the console for verification
    console.log('Using User Agent: ', randomUserAgent);

})();
