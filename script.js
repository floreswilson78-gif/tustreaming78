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

    // Efecto de aparición suave al hacer scroll (Reveal)
    const cards = document.querySelectorAll('.card');
    
    const revealCards = () => {
        const triggerBottom = window.innerHeight / 5 * 4;
        
        cards.forEach((card, index) => {
            const cardTop = card.getBoundingClientRect().top;
            
            if(cardTop < triggerBottom) {
                // Añadimos un pequeño retraso para efecto cascada
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    };

    // Configuración inicial de las tarjetas para la animación
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
    });

    // Ejecutar en scroll y en carga inicial
    window.addEventListener('scroll', revealCards);
    revealCards();
});
