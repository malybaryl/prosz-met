document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    try {
        AOS.init({ duration: 1000, once: true, offset: 100 });
    } catch (error) {}

    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    const form = document.getElementById('contact-form');
    if (form) {
        const fileUpload = document.getElementById('file-upload');
        const fileUploadWrapper = document.querySelector('.file-upload-wrapper');
        const originalFileText = "Dodaj plik (PDF, DWG, DXF, PNG, JPG)...";

        if (fileUpload && fileUploadWrapper) {
            fileUpload.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    fileUploadWrapper.setAttribute('data-text', e.target.files[0].name);
                } else {
                    fileUploadWrapper.setAttribute('data-text', originalFileText);
                }
            });
        }

        form.addEventListener('submit', function() {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.innerText = "Wysyłanie...";
        });
    }

    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i=0;i < ca.length;i++) {
            let c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    const languageSwitcher = document.querySelector('.language-switcher');
    if (languageSwitcher) {
        let translations = {};

        async function setLanguage(lang) {
            if (!lang) return;

            if (!translations[lang]) {
                try {
                    const response = await fetch(`/locales/${lang}.json`);
                    if (!response.ok) {
                        console.error(`Status ${response.status}: Failed to load /locales/${lang}.json`);
                        return;
                    }
                    translations[lang] = await response.json();
                } catch (error) {
                    console.error("JSON fetch/parse error:", error);
                    return;
                }
            }
            
            const currentTranslations = translations[lang];

            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (currentTranslations[key]) {
                    element.innerHTML = currentTranslations[key];
                }
            });

            document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
                const key = element.getAttribute('data-i18n-placeholder');
                if (currentTranslations[key]) {
                    element.placeholder = currentTranslations[key];
                }
            });

            setCookie('language', lang, 365);
        }

        languageSwitcher.addEventListener('click', (e) => {
            const langFlag = e.target.closest('.lang-flag');
            if (langFlag) {
                e.preventDefault();
                const lang = langFlag.getAttribute('data-lang');
                setLanguage(lang);
            }
        });

        const initialLang = getCookie('language') || 'pl';
        setLanguage(initialLang);
    }

    const cookieConsentBanner = document.getElementById('cookie-consent-banner');
    const cookieConsentAccept = document.getElementById('cookie-consent-accept');

    if (cookieConsentBanner && cookieConsentAccept) {
        if (!getCookie('cookie_consent')) {
            cookieConsentBanner.classList.add('show');
        }

        cookieConsentAccept.addEventListener('click', () => {
            cookieConsentBanner.classList.remove('show');
            setCookie('cookie_consent', 'true', 365);
        });
    }
});