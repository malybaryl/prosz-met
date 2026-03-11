/* =========================================================
   PROSZ-MET – main.js  (kompatybilny z style.css)
   AOS class: aos-animate (zgodnie z CSS)
   ========================================================= */

window.projectData = {
    oslona: {
        titleKey: 'project1_title', descKey: 'project1_desc',
        images: ['static/img/oslona/oslona1.jpg','static/img/oslona/oslona2.jpg','static/img/oslona/oslona3.jpg']
    },
    cegly: {
        titleKey: 'project2_title', descKey: 'project2_desc',
        images: ['static/img/cegly/cegly1.jpg','static/img/cegly/cegly2.jpg','static/img/cegly/cegly3.jpg']
    },
    sito: {
        titleKey: 'project3_title', descKey: 'project3_desc',
        images: ['static/img/sito/sito1.jpg','static/img/sito/sito2.jpg']
    },
    plyty: {
        titleKey: 'project4_title', descKey: 'project4_desc',
        images: ['static/img/plyty/plyty1.jpg','static/img/plyty/plyty2.jpg','static/img/plyty/plyty3.jpg']
    },
    pojemnik: {
        titleKey: 'project5_title', descKey: 'project5_desc',
        images: ['static/img/pojemnik/pojemnik1.jpg','static/img/pojemnik/pojemnik2.jpg']
    },
    radiofarmaceutyka: {
        titleKey: 'project6_title', descKey: 'project6_desc',
        images: ['static/img/radiofarmaceutyka/radiofarmaceutyka1.jpg','static/img/radiofarmaceutyka/radiofarmaceutyka2.jpg','static/img/radiofarmaceutyka/radiofarmaceutyka3.jpg']
    },
    mobilki: {
        titleKey: 'project7_title', descKey: 'project7_desc',
        images: ['static/img/mobilki/mobilki1.jpg','static/img/mobilki/mobilki2.jpg']
    },
    kosze: {
        titleKey: 'project8_title', descKey: 'project8_desc',
        images: ['static/img/kosze/kosze1.jpg','static/img/kosze/kosze2.jpg']
    },
    statek: {
        titleKey: 'project9_title', descKey: 'project9_desc',
        images: ['static/img/statek/statek1.jpg','static/img/statek/statek2.jpg','static/img/statek/statek3.jpg']
    }
};

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- helpers ---------- */
    function setCookie(name, value, days) {
        const d = new Date();
        d.setTime(d.getTime() + days * 86400000);
        document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
    }
    function getCookie(name) {
        const m = document.cookie.split('; ').find(r => r.startsWith(name + '='));
        return m ? m.split('=')[1] : null;
    }

    /* ---------- year ---------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- header scroll ---------- */
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (!header) return;
        const scrolled = window.scrollY > 60;
        header.classList.toggle('scrolled', scrolled);
        header.classList.toggle('transparent', !scrolled);
        const scrollTopBtn = document.getElementById('scroll-top');
        if (scrollTopBtn) scrollTopBtn.classList.toggle('show', window.scrollY > 400);
    }, { passive: true });
    if (header && window.scrollY === 0) header.classList.add('transparent');

    /* ---------- hamburger ---------- */
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('nav-links');
    const langSwitcher = document.getElementById('lang-switcher');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            navLinks.classList.toggle('open');
            if (langSwitcher) langSwitcher.classList.toggle('open');
            document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
        });
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger) hamburger.classList.remove('open');
            if (navLinks) navLinks.classList.remove('open');
            if (langSwitcher) langSwitcher.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    /* ---------- smooth scroll ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const id = anchor.getAttribute('href');
            if (!id || id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const offset = (header ? header.offsetHeight : 0) + 16;
            window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
        });
    });

    /* ---------- scroll to top ---------- */
    const scrollTopBtn = document.getElementById('scroll-top');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    /* ---------- active nav highlight ---------- */
    const navObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                document.querySelectorAll('.nav-links a').forEach(a => {
                    a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    document.querySelectorAll('section[id], .hero[id]').forEach(s => navObserver.observe(s));

    /* ==========================================================
       INTERNATIONALISATION
       ========================================================== */
    const SUPPORTED_LANGS = ['pl','en','de','sk','cs','fr','es'];
    let translations = {};

    function detectBrowserLang() {
        const langs = navigator.languages || [navigator.language || 'pl'];
        for (const l of langs) {
            const base = l.split('-')[0];
            if (SUPPORTED_LANGS.includes(base)) return base;
        }
        return 'pl';
    }

    async function setLanguage(lang) {
        if (!SUPPORTED_LANGS.includes(lang)) lang = 'pl';
        if (!translations[lang]) {
            try {
                const res = await fetch(`locales/${lang}.json`);
                if (!res.ok) throw new Error('fetch failed');
                translations[lang] = await res.json();
            } catch (e) {
                if (lang !== 'pl') return setLanguage('pl');
                return;
            }
        }

        const t = translations[lang];

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key] !== undefined) el.innerHTML = t[key];
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (t[key] !== undefined) el.placeholder = t[key];
        });

        document.querySelectorAll('.lang-flag').forEach(f => {
            f.classList.toggle('active-lang', f.getAttribute('data-lang') === lang);
        });

        document.documentElement.lang = lang;
        setCookie('language', lang, 365);

        const fileLabel = document.getElementById('file-label-text');
        if (fileLabel && t['contact_form_file']) fileLabel.textContent = t['contact_form_file'];
    }

    if (langSwitcher) {
        langSwitcher.addEventListener('click', e => {
            const flag = e.target.closest('.lang-flag');
            if (flag) { e.preventDefault(); setLanguage(flag.getAttribute('data-lang')); }
        });
    }

    const savedLang = getCookie('language');
    const initialLang = savedLang && SUPPORTED_LANGS.includes(savedLang) ? savedLang : detectBrowserLang();
    setLanguage(initialLang);

    /* ==========================================================
       AOS – IntersectionObserver (klasa: aos-animate zgodnie z CSS)
       ========================================================== */
    const aosObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.aosDelay || 0);
                setTimeout(() => entry.target.classList.add('aos-animate'), delay);
                aosObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('[data-aos]').forEach(el => aosObserver.observe(el));

    /* ==========================================================
       MODAL
       ========================================================== */
    const modalOverlay = document.getElementById('project-modal');
    const modalClose   = document.getElementById('modal-close');
    const modalPrev    = document.getElementById('modal-prev');
    const modalNext    = document.getElementById('modal-next');
    let currentImages  = [];
    let currentIndex   = 0;

    function openModal(projectKey) {
        const data = window.projectData[projectKey];
        if (!data || !modalOverlay) return;

        currentImages = data.images;
        currentIndex  = 0;

        const galleryEl = document.getElementById('modal-gallery-imgs');
        const dotsEl    = document.getElementById('modal-dots');
        const titleEl   = document.getElementById('modal-title');
        const descEl    = document.getElementById('modal-desc');

        galleryEl.innerHTML = '';
        dotsEl.innerHTML    = '';

        currentImages.forEach((src, i) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = '';
            if (i === 0) img.classList.add('active');
            galleryEl.appendChild(img);

            const dot = document.createElement('button');
            dot.className = 'modal-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => goToSlide(i));
            dotsEl.appendChild(dot);
        });

        const lang = getCookie('language') || 'pl';
        const t = translations[lang] || {};
        titleEl.textContent = t[data.titleKey] || data.titleKey;
        descEl.textContent  = t[data.descKey]  || data.descKey;

        if (modalPrev) modalPrev.style.display = currentImages.length > 1 ? '' : 'none';
        if (modalNext) modalNext.style.display = currentImages.length > 1 ? '' : 'none';

        modalOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modalOverlay) return;
        modalOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    function goToSlide(index) {
        const imgs = document.querySelectorAll('#modal-gallery-imgs img');
        const dots = document.querySelectorAll('.modal-dot');
        imgs.forEach(img => img.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        currentIndex = (index + currentImages.length) % currentImages.length;
        if (imgs[currentIndex]) imgs[currentIndex].classList.add('active');
        if (dots[currentIndex]) dots[currentIndex].classList.add('active');
    }

    if (modalClose)   modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
    if (modalPrev)    modalPrev.addEventListener('click', () => goToSlide(currentIndex - 1));
    if (modalNext)    modalNext.addEventListener('click', () => goToSlide(currentIndex + 1));

    document.addEventListener('keydown', e => {
        if (!modalOverlay || !modalOverlay.classList.contains('open')) return;
        if (e.key === 'Escape')     closeModal();
        if (e.key === 'ArrowLeft')  goToSlide(currentIndex - 1);
        if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
    });

    document.querySelectorAll('[data-project]').forEach(el => {
        el.addEventListener('click', () => openModal(el.getAttribute('data-project')));
    });

    document.querySelectorAll('.project-expand-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            openModal(btn.getAttribute('data-project'));
        });
    });

    /* ---------- file upload label ---------- */
    const fileInput    = document.getElementById('file-upload');
    const fileLabelTxt = document.getElementById('file-label-text');
    if (fileInput && fileLabelTxt) {
        fileInput.addEventListener('change', () => {
            const lang = getCookie('language') || 'pl';
            fileLabelTxt.textContent = fileInput.files.length > 0
                ? fileInput.files[0].name
                : (translations[lang]?.contact_form_file || 'Dodaj plik...');
        });
    }

    /* ---------- cookie banner ---------- */
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && !getCookie('cookie_consent')) {
        setTimeout(() => cookieBanner.classList.add('show'), 1200);
    }
    if (cookieAccept) {
        cookieAccept.addEventListener('click', () => {
            if (cookieBanner) cookieBanner.classList.remove('show');
            setCookie('cookie_consent', 'true', 365);
        });
    }

}); 