// ==UserScript==
// @name         Data Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  "Enhances" the data websites collect on you with noise, including randomized user-agents
// @author       Paul Michael Tidwell
// @match        *://*/*
// @grant        unsafeWindow
// ==/UserScript==

(function() {
    'use strict';

    // Helper function to generate random strings (UUID-like)
    function generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    // Helper function to generate a fake referrer (keep it in the same domain context)
    function generateRandomReferrer() {
        const referrers = [
            'https://example.com', 'https://fake.com', 'https://testsite.net', 'https://randomsite.co',
            'https://notarealurl.xyz', 'https://google.com', 'https://yahoo.com', 'https://duckduckgo.com'
        ];
        return referrers[Math.floor(Math.random() * referrers.length)];
    }


    // Apply randomized headers
    function applyRandomHeaders() {
        const headers = generateRandomHeaders();
        for (const [key, value] of Object.entries(headers)) {
            document.cookie = `${key}=${value}; path=/; SameSite=Strict`; // Apply random headers to cookies and keep SameSite Strict
        }
    }

    // ---- SPOOF PLUGIN DATA ----
    function generateFakePlugins() {
        const plugins = [];
        for (let i = 0; i < 50; i++) { // Increased fake plugins
            plugins.push({
                name: 'Fake Plugin ' + generateRandomString(10),
                description: generateRandomString(20),
                filename: generateRandomString(12) + '.dll',
                version: '1.0.' + Math.floor(Math.random() * 100)
            });
        }
        return plugins;
    }

    // ---- SPOOF MIME TYPES ----
    function generateFakeMimeTypes() {
        const mimeTypes = [];
        for (let i = 0; i < 100; i++) { // Increased fake MIME types
            mimeTypes.push({ type: 'application/fakeplugin', suffixes: 'fake,plugin' });
        }
        return mimeTypes;
    }

    // ---- SPOOF AUDIO FINGERPRINTING ----
    Object.defineProperty(navigator, 'webkitAudioContext', { get: () => undefined });

    // ---- SPOOF WEBGL FINGERPRINTING ----
    const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function(parameter) {
        if (parameter === WebGLRenderingContext.UNMASKED_VENDOR_WEBGL ||
            parameter === WebGLRenderingContext.UNMASKED_RENDERER_WEBGL) {
            return 'AMD Radeon'; // Spoofing as AMD Radeon
        }
        return originalGetParameter.apply(this, arguments);
    };

    // ---- SPOOFING TIMEZONE ----
    const timezones = [
        'Africa/Abidjan', 'Africa/Accra', 'Africa/Addis_Ababa', 'Africa/Algiers', 'Africa/Asmara', 'Africa/Bamako',
        'Africa/Bangui', 'Africa/Banjul', 'Africa/Bissau', 'Africa/Blantyre', 'Africa/Bujumbura', 'Africa/Cairo',
        'Africa/Casablanca', 'Africa/Conakry', 'Africa/Dakar', 'Africa/Dar_es_Salaam', 'Africa/Douala', 'Africa/El_Aaiun',
        'Africa/Freetown', 'Africa/Gaborone', 'Africa/Harare', 'Africa/Johannesburg', 'Africa/Kampala', 'Africa/Kinshasa',
        'Africa/Lagos', 'Africa/Libreville', 'Africa/Luanda', 'Africa/Lubumbashi', 'Africa/Lusaka', 'Africa/Malabo',
        'Africa/Maputo', 'Africa/Maseru', 'Africa/Monrovia', 'Africa/Nairobi', 'Africa/Ndjamena', 'Africa/Niamey',
        'Africa/Porto-Novo', 'Africa/Sao_Tome', 'Africa/Tunis', 'Africa/Windhoek', 'America/Adak', 'America/Anchorage',
        'America/Argentina/Buenos_Aires', 'America/Argentina/Catamarca', 'America/Argentina/Cordoba', 'America/Argentina/Jujuy',
        'America/Argentina/La_Rioja', 'America/Argentina/Mendoza', 'America/Argentina/Rio_Gallegos', 'America/Argentina/Salta',
        'America/Argentina/San_Juan', 'America/Argentina/San_Luis', 'America/Argentina/Tucuman', 'America/Argentina/Ushuaia',
        'America/Asuncion', 'America/Bahia', 'America/Barbados', 'America/Belem', 'America/Belize', 'America/Blanc-Sablon',
        'America/Bogota', 'America/Boa_Vista', 'America/Buenos_Aires', 'America/Campo_Grande', 'America/Caracas', 'America/Cayenne',
        'America/Chicago', 'America/Chihuahua', 'America/Colombia', 'America/Costa_Rica', 'America/Creston', 'America/Cuiaba',
        'America/Curacao', 'America/Danmarkshavn', 'America/Dawson', 'America/Dawson_Creek', 'America/Denver', 'America/Detroit',
        'America/Edmonton', 'America/Eirunepe', 'America/El_Salvador', 'America/Fortaleza', 'America/Glace_Bay', 'America/Goose_Bay',
        'America/Grand_Turk', 'America/Grenada', 'America/Guadeloupe', 'America/Guayaquil', 'America/Havana', 'America/Hermosillo',
        'America/Indiana/Indianapolis', 'America/Indiana/Knox', 'America/Indiana/Marengo', 'America/Indiana/Petersburg',
        'America/Indiana/Tell_City', 'America/Indiana/Vevay', 'America/Indiana/Vincennes', 'America/Indianapolis', 'America/Inuvik',
        'America/Iqaluit', 'America/Jamaica', 'America/Juneau', 'America/Kentucky/Louisville', 'America/Kentucky/Monticello',
        'America/Kralendijk', 'America/La_Paz', 'America/Lima', 'America/Los_Angeles', 'America/Louisville', 'America/Manaus',
        'America/Matamoros', 'America/Mexico_City', 'America/Miquelon', 'America/Moncton', 'America/Montevideo', 'America/New_York',
        'America/Nassau', 'America/Nuuk', 'America/Ojinaga', 'America/Panama', 'America/Phoenix', 'America/Porto_Acre'
    ];


    const randomTimezone = timezones[Math.floor(Math.random() * timezones.length)];
    Object.defineProperty(Intl.DateTimeFormat.prototype, 'resolvedOptions', {
        value: function() {
            return { timeZone: randomTimezone };
        }
    });

    // ---- SPOOF HARDWARE INFORMATION ----
    Object.defineProperty(navigator, 'hardwareConcurrency', { value: Math.floor(Math.random() * 8) + 1 }); // Random cores between 1 and 8
    Object.defineProperty(navigator, 'deviceMemory', { value: Math.floor(Math.random() * 16) + 4 }); // Random RAM between 4GB and 16GB

    // ---- HIDE REFERER ----
    Object.defineProperty(document, 'referrer', { value: generateRandomReferrer() });

      // ---- SPOOF USER AGENT ----

const userAgents = [
    // **Chrome**
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; Trident/7.0; AS; MSIE 10.0; Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.864.48 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; Trident/7.0; AS; MSIE 11.0; Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36',

    // **Firefox**
    'Mozilla/5.0 (Windows NT 6.1; rv:72.0) Gecko/20100101 Firefox/72.0',
    'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6; rv:78.0) Gecko/20100101 Firefox/78.0',
    'Mozilla/5.0 (Windows NT 6.1; rv:74.0) Gecko/20100101 Firefox/74.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:70.0) Gecko/20100101 Firefox/70.0',
    'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:69.0) Gecko/20100101 Firefox/69.0',
    'Mozilla/5.0 (Windows NT 6.1; rv:68.0) Gecko/20100101 Firefox/68.0',
    'Mozilla/5.0 (Windows NT 6.1; rv:67.0) Gecko/20100101 Firefox/67.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:66.0) Gecko/20100101 Firefox/66.0',
    'Mozilla/5.0 (Windows NT 6.1; rv:65.0) Gecko/20100101 Firefox/65.0',

    // **Safari**
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Version/13.1 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Version/12.1 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Version/11.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Version/10.1 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Version/9.1 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; Trident/7.0; AS; MSIE 10.0; Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Version/8.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Safari/537.36',

    // **Opera**
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36 OPR/76.0.4017.177',
    'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.864.48 Safari/537.36 OPR/74.0.3911.107',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36 OPR/80.0.4170.72',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Opera/72.0.3911.107 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Opera/68.0.3618.48 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Opera/67.0.3575.37 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Opera/66.0.3515.44 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Opera/65.0.3615.28 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Opera/64.0.3417.92 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Opera/63.0.3368.53 Safari/537.36',

     // **Edge (continued)**
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.864.48 Safari/537.36 Edge/91.0.864.48',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36 Edge/90.0.818.62',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36 Edge/89.0.774.77',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36 Edge/87.0.664.75',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36 Edge/84.0.522.52',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Vivaldi/3.6.2165.40 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Vivaldi/4.1.2369.21 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Vivaldi/4.0.2312.28 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Vivaldi/3.7.2218.58 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Vivaldi/3.5.2066.73 Safari/537.36',

    // **Safari (Mobile)**
    'Mozilla/5.0 (iPhone; CPU iPhone OS 13_3 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Version/13.0 Mobile/15E148 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 11_3_1 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_3 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Version/10.0 Mobile/15E148 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_5 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Version/9.0 Mobile/15E148 Safari/537.36',

    // **Mobile User Agents (Android)**
    'Mozilla/5.0 (Linux; Android 10; Pixel 4 XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 9; Galaxy S9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 8.0; OnePlus 6T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 7.0; Nexus 6P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.111 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 6.0; Nexus 5X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Mobile Safari/537.36',

    // **Older Browsers**
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:45.0) Gecko/20100101 Firefox/45.0',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:43.0) Gecko/20100101 Firefox/43.0',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:41.0) Gecko/20100101 Firefox/41.0',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:39.0) Gecko/20100101 Firefox/39.0',

    // **Edge (continued)**
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.864.48 Safari/537.36 Edge/91.0.864.48',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36 Edge/90.0.818.62',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36 Edge/89.0.774.77',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36 Edge/87.0.664.75',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36 Edge/84.0.522.52',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Vivaldi/3.6.2165.40 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Vivaldi/4.1.2369.21 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Vivaldi/4.0.2312.28 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Vivaldi/3.7.2218.58 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Vivaldi/3.5.2066.73 Safari/537.36',
];

 function randomizeUserAgent() {
        return userAgents[Math.floor(Math.random() * userAgents.length)];
    }

    // Apply the random User-Agent
    Object.defineProperty(navigator, 'userAgent', {
        get: function() { return randomizeUserAgent(); },
        configurable: true
    });

    // Function to set cookies with proper domain and security attributes
    function setSyncCookie(name, value) {
        let domain = window.location.hostname; // Get the current domain
        document.cookie = `${name}=${value};path=/;domain=${domain};Secure;SameSite=Strict`; // SameSite cookie policy
    }

    // Set fake cookies
    for (let i = 0; i < 50; i++) { // Increased fake cookies
        setSyncCookie(`randomCookie${i}`, generateRandomString(50));
    }

        // ---- SPOOF HTTP HEADERS ----
    function generateRandomHeaders() {
        const acceptLanguages = ['en-US', 'en-GB', 'fr-FR', 'de-DE', 'es-ES', 'it-IT'];
        const referers = [
            'https://example.com', 'https://google.com', 'https://bing.com', 'https://yahoo.com', 'https://duckduckgo.com'
        ];

        // Randomize Accept-Language and Referer
        const acceptLanguage = acceptLanguages[Math.floor(Math.random() * acceptLanguages.length)];
        const referer = referers[Math.floor(Math.random() * referers.length)];

        return {
            'Accept-Language': acceptLanguage,
           'Referer': referer, // Stay within the same domain or common URLs
            'User-Agent': navigator.userAgent, // Use the random User-Agent defined earlier

        };
    }

const randomWidth = 1920 + Math.floor(Math.random() * 300); // Random screen width (between 1920 and 2220)
const randomHeight = 800 + Math.floor(Math.random() * 500); // Random screen height (between 800 and 1300)


// Apply the randomized values
Object.defineProperty(screen, 'width', { get: () => randomWidth });
Object.defineProperty(screen, 'height', { get: () => randomHeight });
Object.defineProperty(window, 'innerWidth', { get: () => randomWidth });
Object.defineProperty(window, 'innerHeight', { get: () => randomHeight });
// ---- LOGGING FOR VERIFICATION (optional) ----
try {
    console.log('Fingerprinting protections enabled:');
    console.log('Randomized Screen Resolution: ', randomWidth, 'x', randomHeight);
    console.log('Randomized Timezone: ', randomTimezone);
    console.log('Spoofed User-Agent: ', randomizeUserAgent()); // Use the function to get the randomized User-Agent
} catch (error) {
    console.error("Logging error: ", error);
}

})();
