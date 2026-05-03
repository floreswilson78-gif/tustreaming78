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

    // Efecto de aparición suave al hacer scroll (Reveal avanzado)
    const revealElements = document.querySelectorAll('.card, .section-title, .section-subtitle, .faq-item, .filter-container');
    
    const revealElementsOnScroll = () => {
        const triggerBottom = window.innerHeight / 5 * 4.5;
        
        revealElements.forEach((el, index) => {
            const elTop = el.getBoundingClientRect().top;
            
            if(elTop < triggerBottom) {
                const delay = el.classList.contains('card') ? (index % 6) * 100 : 0;
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, delay);
            }
        });
    };

    // Configuración inicial de las tarjetas para la animación
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
    });

    // Ejecutar en scroll y en carga inicial
    window.addEventListener('scroll', revealElementsOnScroll);
    revealElementsOnScroll();

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
                typeSpeed = 2000; // Pausa al terminar de escribir
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500; // Pausa antes de empezar a escribir
            }
            
            setTimeout(type, typeSpeed);
        }
        
        // Iniciar efecto
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

});
