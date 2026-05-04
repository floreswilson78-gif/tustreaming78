// Script sencillo para interactividad

// Evitar que el navegador intente recordar la posición de scroll al recargar
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Ocultar preloader cuando la página carga completamente
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Un pequeño retraso extra para que se aprecie la animación y la página termine de "pintarse"
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            // Forzamos el scroll al tope una vez oculta la pantalla de carga
            window.scrollTo(0, 0);
        }, 600);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    
    // Forzar siempre a que la página inicie arriba al inicio
    window.scrollTo(0, 0);

    // Efecto visual en el Header al hacer scroll
    const header = document.querySelector('header');
    
    const updateHeader = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', updateHeader);
    updateHeader(); // Ejecutar una vez al cargar

    // Pequeño script para mover la ilustración con el cursor (efecto Parallax suave)
    const heroImage = document.querySelector('.hero-image');
    const heroIllustration = document.querySelector('.hero-illustration');

    if(heroImage && heroIllustration) {
        heroImage.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth - 0.5) * 20;
            const y = (clientY / window.innerHeight - 0.5) * 20;
            
            heroIllustration.style.transform = `scale(1.05) translate(${x}px, ${y}px)`;
        });

        heroImage.addEventListener('mouseleave', () => {
            heroIllustration.style.transform = `scale(1) translate(0px, 0px)`;
        });
    }

    // (Efecto scroll-reveal eliminado para mantener el contenido estático al cargar)

    // --- NUEVAS FUNCIONALIDADES INTERACTIVAS ---

    // 1. Efecto Typing (Escritura)
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const words = ['Tus Manos', 'Tu Smart TV', 'Tu Celular', 'Tu PC'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function type() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typingText.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingText.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typeSpeed = 100;
            if (isDeleting) typeSpeed /= 2;
            
            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500;
            }
            
            setTimeout(type, typeSpeed);
        }
        
        setTimeout(type, 1000);
    }

    // 2. Toggle de Precios
    const tabs = document.querySelectorAll('.pricing-tab');
    const indicator = document.querySelector('.pricing-tab-indicator');
    const prices = document.querySelectorAll('.price');

    if (tabs.length > 0 && indicator) {
        // Inicializar indicador
        const initIndicator = () => {
            const activeTab = document.querySelector('.pricing-tab.active');
            if (activeTab) {
                indicator.style.width = `${activeTab.offsetWidth}px`;
                indicator.style.left = `${activeTab.offsetLeft}px`;
            }
        };
        
        // Esperar a que la vista se renderice
        setTimeout(initIndicator, 200);
        window.addEventListener('resize', initIndicator);

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Mover indicador
                indicator.style.width = `${tab.offsetWidth}px`;
                indicator.style.left = `${tab.offsetLeft}px`;
                
                const period = tab.getAttribute('data-period');
                
                prices.forEach(price => {
                    if (price.hasAttribute(`data-${period}`)) {
                        price.style.opacity = 0;
                        setTimeout(() => {
                            price.textContent = price.getAttribute(`data-${period}`);
                            price.style.opacity = 1;
                        }, 200);
                    }
                });
            });
        });

        // Añadir transición CSS a los precios para el efecto
        prices.forEach(price => {
            price.style.transition = 'opacity 0.2s ease';
        });
    }

    // 3. FAQ Acordeón
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentNode;
            
            // Cerrar otros abiertos (opcional, si queremos que solo uno esté abierto)
            const activeItem = document.querySelector('.faq-item.active');
            if (activeItem && activeItem !== item) {
                activeItem.classList.remove('active');
            }
            
            // Alternar estado actual
            item.classList.toggle('active');
        });
    });

    // 4. Filtros de Plataformas
    const filterBtns = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('#services-grid .card');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remover active de todos
                filterBtns.forEach(b => b.classList.remove('active'));
                // Añadir active al clickeado
                btn.classList.add('active');
                
                const filterValue = btn.getAttribute('data-filter');
                
                serviceCards.forEach(card => {
                    // Animación de salida
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    
                    setTimeout(() => {
                        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                            card.style.display = 'flex';
                            // Animación de entrada
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'scale(1) translateY(0)';
                            }, 50);
                        } else {
                            card.style.display = 'none';
                        }
                    }, 300); // Esperar a que termine la transición CSS
                });
            });
        });
    }

    // 5. Botón Volver Arriba
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 6. Lightbox para Blog de Entregas
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (galleryItems.length > 0 && lightbox) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('.gallery-img');
                if (img) {
                    lightboxImg.src = img.src;
                    lightbox.classList.add('show');
                    document.body.classList.add('modal-open'); // Prevenir scroll
                }
            });
        });

        // Cerrar modal
        const closeLightbox = () => {
            lightbox.classList.remove('show');
            document.body.classList.remove('modal-open');
            // Esperar animación para limpiar src
            setTimeout(() => {
                if(!lightbox.classList.contains('show')) lightboxImg.src = '';
            }, 400);
        };

        lightboxClose.addEventListener('click', closeLightbox);
        
        // Cerrar si se hace clic fuera de la imagen
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Cerrar con tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('show')) {
                closeLightbox();
            }
        });
    }

    // 7. Cursor Personalizado
    const cursor = document.querySelector('.custom-cursor');
    const cursorRing = document.querySelector('.custom-cursor-ring');
    
    // Solo activar si no es un dispositivo táctil
    if (cursor && cursorRing && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
            
            // Animación suave para el anillo
            requestAnimationFrame(() => {
                cursorRing.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
            });
        });

        // Efecto hover en elementos clickeables
        const clickables = document.querySelectorAll('a, button, .pricing-tab, .faq-question, .gallery-item, .filter-btn');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorRing.classList.add('hovered');
            });
            el.addEventListener('mouseleave', () => {
                cursorRing.classList.remove('hovered');
            });
        });
        
        // Efecto click
        document.addEventListener('mousedown', () => {
            cursorRing.style.transform += ' scale(0.8)';
        });
        document.addEventListener('mouseup', () => {
            cursorRing.style.transform = cursorRing.style.transform.replace(' scale(0.8)', '');
        });
    } else if (cursor && cursorRing) {
        // Ocultar si es táctil
        cursor.style.display = 'none';
        cursorRing.style.display = 'none';
    }

    // 8. Generador de Partículas de Fondo
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        const createParticle = () => {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Tamaño aleatorio entre 2px y 6px
            const size = Math.random() * 4 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Posición X aleatoria
            particle.style.left = `${Math.random() * 100}vw`;
            
            // Duración aleatoria entre 10s y 20s
            const duration = Math.random() * 10 + 10;
            particle.style.animationDuration = `${duration}s`;
            
            // Retraso aleatorio
            particle.style.animationDelay = `${Math.random() * 5}s`;
            
            particlesContainer.appendChild(particle);
            
            // Eliminar partícula cuando termine la animación
            setTimeout(() => {
                particle.remove();
            }, (duration + 5) * 1000);
        };
        
        // Crear 30 partículas iniciales
        for(let i=0; i<30; i++) {
            setTimeout(createParticle, Math.random() * 3000);
        }
        
        // Seguir creando partículas continuamente
        setInterval(createParticle, 1000);
    }

    // =========================================================
    // 9. CARRUSELES — Auto-scroll infinito sin espacios vacíos
    //    PC y móvil: RAF continuo + touch/drag + flechas
    // =========================================================
    function initInfiniteCarousel(containerId, trackId, prevBtnId, nextBtnId, speed) {
        const container = document.getElementById(containerId);
        const track     = document.getElementById(trackId);
        const prevBtn   = document.getElementById(prevBtnId);
        const nextBtn   = document.getElementById(nextBtnId);
        if (!container || !track) return;

        // ── PASO 1: limpiar duplicados del HTML, quedarnos solo con originales ──
        const allHtmlItems = Array.from(track.children);
        const origCount    = Math.ceil(allHtmlItems.length / 2); // El HTML trae 2x cada item
        const originals    = allHtmlItems.slice(0, origCount);
        track.innerHTML    = '';
        originals.forEach(el => track.appendChild(el));

        // ── PASO 2: clonar hasta que el track sea ≥ 4× el ancho del container ──
        function fillClones() {
            const needed = container.offsetWidth * 4;
            while (track.scrollWidth < needed) {
                originals.forEach(el => {
                    const clone = el.cloneNode(true);
                    clone.setAttribute('aria-hidden', 'true');
                    track.appendChild(clone);
                });
            }
        }
        fillClones();

        // ── PASO 3: calcular el ancho de UN ciclo (= los originales) ──────────
        // Se recalcula en cada tick para soportar resize
        function getGap() {
            return parseFloat(window.getComputedStyle(track).gap) || 32;
        }
        function getCycleWidth() {
            if (!track.children[0]) return 1;
            const itemW = track.children[0].getBoundingClientRect().width;
            return (itemW + getGap()) * origCount;
        }

        // ── PASO 4: motor de animación ─────────────────────────────────────────
        let posX      = 0;       // posición actual (negativo = movido a la izquierda)
        let paused    = false;
        let dragging  = false;
        let dragX0    = 0;
        let posX0     = 0;
        let lastTs    = null;
        const vel     = speed || 55; // px/s

        function applyPos(x) {
            // Mantener posX dentro de un rango que evita acumular negativos enormes
            const cw = getCycleWidth();
            // Normalizar: siempre dentro de [ -cw, 0 ]
            posX = ((x % cw) - cw) % cw; // resultado siempre en (-cw, 0]
            track.style.transform = `translateX(${posX}px)`;
        }

        function tick(ts) {
            if (!lastTs) lastTs = ts;
            const dt = (ts - lastTs) / 1000;
            lastTs = ts;

            if (!paused && !dragging) {
                posX -= vel * dt;
                applyPos(posX);
            }
            requestAnimationFrame(tick);
        }

        // ── PASO 5: hover pause ────────────────────────────────────────────────
        container.addEventListener('mouseenter', () => { paused = true; });
        container.addEventListener('mouseleave', () => { paused = false; });

        // ── PASO 6: drag (mouse + touch) ───────────────────────────────────────
        function startDrag(clientX) {
            dragging = true;
            dragX0   = clientX;
            posX0    = posX;
        }
        function moveDrag(clientX) {
            if (!dragging) return;
            const delta = clientX - dragX0;
            posX = posX0 + delta;
            track.style.transform = `translateX(${posX}px)`;
        }
        function endDrag() {
            if (!dragging) return;
            dragging = false;
            lastTs   = null; // evitar salto brusco de delta
            // Normalizar posición después del drag
            applyPos(posX);
        }

        // Mouse
        container.addEventListener('mousedown', e => { startDrag(e.clientX); e.preventDefault(); });
        window.addEventListener('mousemove', e => moveDrag(e.clientX));
        window.addEventListener('mouseup', () => endDrag());

        // Touch
        container.addEventListener('touchstart', e => startDrag(e.touches[0].clientX), { passive: true });
        container.addEventListener('touchmove',  e => moveDrag(e.touches[0].clientX),  { passive: true });
        container.addEventListener('touchend', () => endDrag());

        // ── PASO 7: botones flecha ─────────────────────────────────────────────
        function getStep() {
            if (!track.children[0]) return 320;
            return track.children[0].getBoundingClientRect().width + getGap();
        }
        if (prevBtn) prevBtn.addEventListener('click', () => { posX += getStep(); lastTs = null; });
        if (nextBtn) nextBtn.addEventListener('click', () => { posX -= getStep(); lastTs = null; });

        // ── INICIO ─────────────────────────────────────────────────────────────
        requestAnimationFrame(tick);
    }

    // Inicializar los 3 carruseles
    initInfiniteCarousel('testimonios-container', 'testimonios-track', 'testimonios-prev', 'testimonios-next', 50);
    initInfiniteCarousel('galeria-container',     'galeria-track',     'galeria-prev',     'galeria-next',     40);
    initInfiniteCarousel('combos-container',      'combos-track',      'combos-prev',      'combos-next',      55);

});


