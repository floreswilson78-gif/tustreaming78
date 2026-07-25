document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.add('has-motion');

    const revealSections = document.querySelectorAll('main > section:not(.hero)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reducedMotion && 'IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                entry.target.classList.toggle('section-revealed', entry.isIntersecting);
            });
        }, { threshold: .14, rootMargin: '0px 0px -8% 0px' });
        revealSections.forEach((section) => {
            section.classList.add('reveal-section');
            revealObserver.observe(section);
        });
    } else {
        revealSections.forEach((section) => section.classList.add('section-revealed'));
    }

    const header = document.querySelector('header');
    const menuButton = document.querySelector('.menu-toggle');
    const navigation = document.querySelector('.nav-links');

    const setMenu = (open) => {
        if (!menuButton || !navigation) return;
        menuButton.setAttribute('aria-expanded', String(open));
        menuButton.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
        navigation.classList.toggle('is-open', open);
    };

    menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
    navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

    const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 12);
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();

    const scenes = document.querySelectorAll('.scroll-scene');
    let animationFrame;
    const updateScenes = () => {
        const viewportCenter = window.innerHeight / 2;
        scenes.forEach((scene) => {
            const bounds = scene.parentElement.getBoundingClientRect();
            const sceneCenter = bounds.top + (bounds.height / 2);
            const offset = Math.max(-220, Math.min(220, (viewportCenter - sceneCenter) * .36));
            scene.style.setProperty('--scroll-shift', `${offset}px`);
        });
        animationFrame = undefined;
    };
    const requestSceneUpdate = () => {
        if (!animationFrame) animationFrame = requestAnimationFrame(updateScenes);
    };
    window.addEventListener('scroll', requestSceneUpdate, { passive: true });
    window.addEventListener('resize', requestSceneUpdate);
    updateScenes();

    const pricingTabs = document.querySelectorAll('.pricing-tab');
    const pricePeriods = { monthly: '/mes', quarterly: '/3 meses', semiannual: '/6 meses' };
    const priceIndicator = document.querySelector('.pricing-tab-indicator');
    const updateIndicator = (tab) => {
        if (!priceIndicator || !tab) return;
        priceIndicator.style.width = `${tab.offsetWidth}px`;
        priceIndicator.style.left = `${tab.offsetLeft}px`;
    };
    const selectPeriod = (tab) => {
        const period = tab.dataset.period;
        pricingTabs.forEach((item) => item.classList.toggle('active', item === tab));
        document.querySelectorAll('.price[data-monthly]').forEach((price) => {
            price.textContent = price.dataset[period] || price.textContent;
            price.closest('.price-container')?.querySelector('.period')?.replaceChildren(pricePeriods[period]);
        });
        updateIndicator(tab);
    };
    pricingTabs.forEach((tab) => tab.addEventListener('click', () => selectPeriod(tab)));
    window.addEventListener('resize', () => updateIndicator(document.querySelector('.pricing-tab.active')));
    updateIndicator(document.querySelector('.pricing-tab.active'));

    const filters = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('#services-grid .card');
    filters.forEach((filter) => filter.addEventListener('click', () => {
        filters.forEach((item) => item.classList.toggle('active', item === filter));
        cards.forEach((card) => {
            const visible = filter.dataset.filter === 'all' || card.dataset.category === filter.dataset.filter;
            card.hidden = !visible;
        });
    }));

    document.querySelectorAll('.faq-question').forEach((button, index) => {
        const item = button.closest('.faq-item');
        const answer = item?.querySelector('.faq-answer');
        if (!item || !answer) return;
        const id = `faq-answer-${index + 1}`;
        answer.id = id;
        button.setAttribute('aria-controls', id);
        button.setAttribute('aria-expanded', 'false');
        button.addEventListener('click', () => {
            const open = !item.classList.contains('active');
            document.querySelectorAll('.faq-item.active').forEach((active) => {
                active.classList.remove('active');
                active.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
            });
            item.classList.toggle('active', open);
            button.setAttribute('aria-expanded', String(open));
        });
    });

    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => backToTop?.classList.toggle('show', window.scrollY > 500), { passive: true });
    backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    const lightbox = document.getElementById('lightbox-modal');
    const lightboxImage = document.getElementById('lightbox-img');
    const closeLightbox = () => {
        lightbox?.classList.remove('show');
        document.body.classList.remove('modal-open');
    };
    document.querySelectorAll('.gallery-item').forEach((item) => item.addEventListener('click', () => {
        const image = item.querySelector('.gallery-img');
        if (!image || !lightbox || !lightboxImage) return;
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
        lightbox.classList.add('show');
        document.body.classList.add('modal-open');
    }));
    document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
    lightbox?.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeLightbox();
            setMenu(false);
        }
    });

    const firebaseConfig = {
        apiKey: 'AIzaSyCRbtQv9OmQt55zO-HoRem5PxOmXUQY4y4',
        authDomain: 'tustreaming78-34e40.firebaseapp.com',
        projectId: 'tustreaming78-34e40',
        storageBucket: 'tustreaming78-34e40.firebasestorage.app',
        messagingSenderId: '382959281864',
        appId: '1:382959281864:web:17bd3aaf83b775012a27fd'
    };
    let db;
    if (window.firebase) {
        try {
            if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
        } catch (error) {
            console.error('No se pudo inicializar el servicio de testimonios.', error);
        }
    }

    const reviewForm = document.getElementById('review-form');
    const ratingInput = document.getElementById('review-rating');
    const ratingStars = document.querySelectorAll('#star-rating [data-value]');
    const setRating = (rating) => {
        ratingStars.forEach((star) => star.classList.toggle('active', Number(star.dataset.value) <= rating));
        if (ratingInput) ratingInput.value = rating;
    };
    ratingStars.forEach((star) => {
        star.setAttribute('role', 'button');
        star.setAttribute('tabindex', '0');
        const select = () => setRating(Number(star.dataset.value));
        star.addEventListener('click', select);
        star.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(); }
        });
    });

    const showReview = ({ name, text, rating }) => {
        const track = document.getElementById('testimonios-track');
        if (!track) return;
        const card = document.createElement('article');
        card.className = 'testimonial-card glass-panel';
        const user = document.createElement('div');
        user.className = 'user-info';
        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.textContent = name.trim().charAt(0).toUpperCase();
        const details = document.createElement('div');
        details.className = 'user-details';
        const title = document.createElement('h4');
        title.textContent = name;
        const stars = document.createElement('span');
        stars.className = 'stars';
        stars.textContent = '★'.repeat(rating) + '☆'.repeat(5 - rating);
        const quote = document.createElement('p');
        quote.className = 'review-text';
        quote.textContent = `“${text}”`;
        details.append(title, stars);
        user.append(avatar, details);
        card.append(user, quote);
        track.prepend(card);
    };

    reviewForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = document.getElementById('review-name')?.value.trim();
        const text = document.getElementById('review-text')?.value.trim();
        const rating = Number(ratingInput?.value || 5);
        if (!name || !text) return;
        const submit = reviewForm.querySelector('button[type="submit"]');
        submit.disabled = true;
        try {
            if (db) await db.collection('testimonios').add({ name, text, rating, timestamp: firebase.firestore.FieldValue.serverTimestamp() });
            showReview({ name, text, rating });
            reviewForm.reset();
            setRating(5);
            const message = document.getElementById('review-success-msg');
            if (message) message.style.display = 'block';
        } catch (error) {
            console.error('No se pudo guardar el testimonio.', error);
        } finally {
            submit.disabled = false;
        }
    });
});
