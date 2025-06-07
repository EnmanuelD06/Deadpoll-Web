// Utilidades de rendimiento
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Inicializar AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    offset: 100,
    once: true,
    disable: 'mobile'
});

// Menú móvil
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// Botón de volver arriba
const backToTop = document.querySelector('.back-to-top');

const handleScroll = throttle(() => {
    if (window.pageYOffset > 300) {
        backToTop.classList.add('active');
    } else {
        backToTop.classList.remove('active');
    }
}, 100);

window.addEventListener('scroll', handleScroll, { passive: true });

backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Filtrado del menú
const categoryButtons = document.querySelectorAll('.category-btn');
const menuItems = document.querySelectorAll('.menu-item');

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const category = button.dataset.category;
        const items = Array.from(menuItems);

        requestAnimationFrame(() => {
            items.forEach(item => {
                if (category === 'todos' || item.dataset.category === category) {
                    item.style.display = 'block';
                    requestAnimationFrame(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    });
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
});

// Formulario de contacto
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const message = document.getElementById('message').value;
    const whatsappNumber = '584128246904';
    const whatsappMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    window.open(whatsappURL, '_blank');
    contactForm.reset();
});

// Carrusel de testimonios
const testimonials = [
    {
        name: "Juan Pérez",
        text: "¡Los mejores hot dogs que he probado! La calidad de los ingredientes es excepcional.",
        rating: 5
    },
    {
        name: "María García",
        text: "Servicio rápido y comida deliciosa. Definitivamente volveré.",
        rating: 5
    },
    {
        name: "Carlos Rodríguez",
        text: "La atención es excelente y los precios son muy razonables.",
        rating: 4
    }
];

const testimonialsSlider = document.querySelector('.testimonials-slider');
let currentTestimonial = 0;

function createTestimonialCard(testimonial) {
    const starsHtml = Array(5).fill(0).map((_, i) => 
        `<i class="${i < testimonial.rating ? 'fas' : 'far'} fa-star"></i>`
    ).join('');
    
    return `
        <div class="testimonial-card" data-aos="fade-up">
            <div class="testimonial-rating">${starsHtml}</div>
            <p class="testimonial-text">"${testimonial.text}"</p>
            <p class="testimonial-author">- ${testimonial.name}</p>
        </div>
    `;
}

function updateTestimonials() {
    requestAnimationFrame(() => {
        testimonialsSlider.innerHTML = createTestimonialCard(testimonials[currentTestimonial]);
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    });
}

// Inicializar testimonios
updateTestimonials();
const testimonialInterval = setInterval(updateTestimonials, 5000);

// Smooth scroll para enlaces de navegación
document.querySelectorAll('a[href^="#"]:not(.back-to-top)').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animación de números para estadísticas
function animateNumbers() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        let count = 0;
        const duration = 2000;
        const increment = target / (duration / 16);

        const updateCount = () => {
            count += increment;
            if (count < target) {
                stat.textContent = Math.floor(count);
                requestAnimationFrame(updateCount);
            } else {
                stat.textContent = target;
            }
        };

        requestAnimationFrame(updateCount);
    });
}

// Observador de intersección para animar números cuando son visibles
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateNumbers();
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.5
});

document.querySelectorAll('.stats-section').forEach(section => {
    observer.observe(section);
});

// Limpiar intervalos cuando la página se oculta
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        clearInterval(testimonialInterval);
    } else {
        updateTestimonials();
        setInterval(updateTestimonials, 5000);
    }
});

// Efecto parallax en el hero
/*
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
});
*/

// Efecto de aparición para los elementos del menú
const observerOptions = {
    threshold: 0.1
};

// Navegación suave para los enlaces del menú
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Cambiar el estilo del header al hacer scroll
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        // Scroll hacia abajo
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        // Scroll hacia arriba
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
}); 