// ===== VARIÁVEIS GLOBAIS =====
let currentSlideIndex = 0;
let currentLightboxImage = 0;
const galleryImages = [
    'images/IMG-20250806-WA0006.jpg',
    'images/IMG-20250806-WA0007.jpg',
    'images/IMG-20250806-WA0012.jpg',
    'images/IMG-20250806-WA0014.jpg',
    'images/IMG-20250806-WA0010.jpg',
    'images/IMG-20250806-WA0020.jpg'
];

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeCarousel();
    initializeScrollAnimations();
    initializeFormValidation();
    initializeSmoothScroll();
    initializeImageErrorHandling();
    initializeLightbox();
    initializeTestimonialCarousel();
    initializeSpecialEffects(); // Esta linha está correta
});

// ===== NAVEGAÇÃO MÓVEL =====
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            }
        }
    });
}

// ===== CARROSSEL DE IMAGENS =====
function initializeCarousel() {
    const prevBtn = document.getElementById('carousel-prev-btn');
    const nextBtn = document.getElementById('carousel-next-btn');
    const dotsContainer = document.getElementById('carousel-dots-container');

    if (prevBtn && nextBtn && dotsContainer) {
        prevBtn.addEventListener('click', () => changeSlide(-1));
        nextBtn.addEventListener('click', () => changeSlide(1));

        dotsContainer.addEventListener('click', (e) => {
            if (e.target.matches('.dot')) {
                const index = parseInt(e.target.dataset.slideIndex);
                showSlide(index);
            }
        });
        
        setInterval(() => {
            changeSlide(1);
        }, 5000);
    }
}

function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0) return;
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;

    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[index].classList.add('active');
    dots[index].classList.add('active');
    
    currentSlideIndex = index;
}

function changeSlide(direction) {
    showSlide(currentSlideIndex + direction);
}

// ===== LIGHTBOX DA GALERIA =====
function initializeLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.addEventListener('click', closeLightbox);

        const closeBtn = document.getElementById('lightbox-close');
        const prevBtn = document.getElementById('lightbox-prev');
        const nextBtn = document.getElementById('lightbox-next');
        const content = lightbox.querySelector('.lightbox-content');
        
        content.addEventListener('click', (e) => e.stopPropagation());

        if (closeBtn) closeBtn.addEventListener('click', (e) => {e.stopPropagation(); closeLightbox();});
        if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); changeLightboxImage(-1); });
        if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); changeLightboxImage(1); });
    }
}

function openLightbox(imageIndex) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    if (lightbox && lightboxImg) {
        currentLightboxImage = imageIndex;
        lightboxImg.src = galleryImages[imageIndex];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function changeLightboxImage(direction) {
    const lightboxImg = document.getElementById('lightbox-img');
    if (!lightboxImg) return;
    
    currentLightboxImage += direction;
    if (currentLightboxImage >= galleryImages.length) currentLightboxImage = 0;
    if (currentLightboxImage < 0) currentLightboxImage = galleryImages.length - 1;
    
    lightboxImg.src = galleryImages[currentLightboxImage];
}

// ===== ANIMAÇÕES DE SCROLL =====
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(
        '.service-card, .client-item, .gallery-item, .highlight-item, .event-item, .artist-image, .artist-info'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// ===== SCROLL SUAVE =====
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 70;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });
}

// ===== FORMULÁRIO DE CONTATO (LÓGICA REAL COM FORMSPREE) =====
function initializeFormValidation() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener("submit", handleSubmit);
    }
}

async function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;
    const data = new FormData(form);
    
    // Animação de envio
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    button.disabled = true;

    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: data,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            form.reset();
        } else {
            response.json().then(data => {
                if (Object.hasOwn(data, 'errors')) {
                    const errorMessage = data["errors"].map(error => error["message"]).join(", ");
                    showNotification(`Erro: ${errorMessage}`, 'error');
                } else {
                    showNotification("Oops! Ocorreu um problema ao enviar sua mensagem.", 'error');
                }
            })
        }
    } catch (error) {
        showNotification("Oops! Ocorreu um problema ao enviar sua mensagem.", 'error');
    } finally {
        // Restaura botão
        button.innerHTML = originalText;
        button.disabled = false;
    }
}

// ===== SISTEMA DE NOTIFICAÇÕES =====
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) existingNotification.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> <span>${message}</span> <button class="notification-close">&times;</button>`;
    
    document.body.appendChild(notification);
    
    notification.querySelector('.notification-close').addEventListener('click', () => notification.remove());

    setTimeout(() => {
        notification.remove();
    }, 5000);
}


// ===== IMAGENS QUEBRADAS (PLACEHOLDERS) =====
function initializeImageErrorHandling() {
    document.querySelectorAll('img').forEach((img) => {
        img.addEventListener('error', function() {
            this.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%23009246' offset='0%25'/%3E%3Cstop stop-color='%23FFFFFF' offset='50%25'/%3E%3Cstop stop-color='%23CE2B37' offset='100%25'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='800' height='600'/%3E%3Ctext fill='%23333' font-family='Arial, sans-serif' font-size='40' dy='1em' font-weight='bold' x='50%25' y='45%25' text-anchor='middle'%3E" + this.alt + "%3C/text%3E%3C/svg%3E";
        });
    });
}

// ===== EFEITOS ESPECIAIS (CONTADOR CORRIGIDO) =====
function initializeSpecialEffects() {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (counter) => {
        const finalValueText = counter.dataset.target; 
        const targetNumber = parseInt(finalValueText, 10);
        const suffix = finalValueText.replace(/[\d.,+\s]/g, ''); // Extrai o '%' ou qualquer outro símbolo
        
        if (isNaN(targetNumber)) return;

        let currentNumber = 0;
        const duration = 2000;
        const frameRate = 60;
        const totalFrames = Math.round(duration / (1000 / frameRate));
        const increment = targetNumber / totalFrames;

        const updateCounter = () => {
            currentNumber += increment;
            if (currentNumber < targetNumber) {
                counter.textContent = Math.ceil(currentNumber) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = finalValueText; 
            }
        };
        updateCounter();
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                counter.dataset.target = counter.textContent;
                animateCounter(counter);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.8 });
    
    counters.forEach(counter => observer.observe(counter));
}

// ===== CARROSSEL DE DEPOIMENTOS =====
let currentTestimonialIndex = 0;

function initializeTestimonialCarousel() {
    const slides = document.querySelectorAll('#testimonial-carousel .testimonial-slide');
    if (slides.length === 0) return;

    createTestimonialDots(slides.length);
    showTestimonial(0);

    setInterval(() => {
        showTestimonial(currentTestimonialIndex + 1);
    }, 6000); // Muda a cada 6 segundos
}

function createTestimonialDots(count) {
    const dotsContainer = document.getElementById('testimonial-dots');
    dotsContainer.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.addEventListener('click', () => showTestimonial(i));
        dotsContainer.appendChild(dot);
    }
}

function showTestimonial(index) {
    const slides = document.querySelectorAll('#testimonial-carousel .testimonial-slide');
    const dots = document.querySelectorAll('#testimonial-dots .dot');
    
    if (index >= slides.length) {
        index = 0;
    } else if (index < 0) {
        index = slides.length - 1;
    }

    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[index].classList.add('active');
    dots[index].classList.add('active');
    
    currentTestimonialIndex = index;
}