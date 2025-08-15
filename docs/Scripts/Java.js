// ========================================
// CONFIGURACIÓN GLOBAL
// ========================================
const CONFIG = {
    RETRY_ATTEMPTS: 5,
    RETRY_DELAY: 100,
    AUTO_PLAY_INTERVAL: 5000,
    SCROLL_THRESHOLD: 50
};

// ========================================
// UTILIDADES
// ========================================
const Utils = {
    // Obtener nombre de página actual
    getCurrentPage() {
        return window.location.pathname.split('/').pop() || 'Inicio.html';
    },
    
    // Verificar si es una página específica
    isPage(pageName) {
        return this.getCurrentPage() === pageName;
    },
    
    // Verificar si es página de contacto
    isContactPage() {
        const currentPage = this.getCurrentPage().toLowerCase();
        return currentPage.includes('contactanos') || currentPage.includes('contacto');
    },
    
    // Log con timestamp
    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = `[${timestamp}]`;
        
        switch(type) {
            case 'error':
                console.error(`${prefix} ${message}`);
                break;
            case 'warn':
                console.warn(`${prefix} ${message}`);
                break;
            default:
                console.log(`${prefix} ${message}`);
        }
    },
    
    // Delay asíncrono
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// ========================================
// GESTOR DE PÁGINAS
// ========================================
const PageManager = {
    // Configuración de páginas
    pages: {
        'Inicio.html': {
            hasCarousel: true,
            carouselType: 'main',
            initFunction: null
        },
        'Noticias.html': {
            hasCarousel: true,
            carouselType: 'noticias',
            initFunction: 'initNoticiasCarousel'
        },
        'Responsabilidades.html': {
            hasCarousel: true,
            carouselType: 'responsabilidades',
            initFunction: 'initResponsabilidadesCarousel'
        },
        'Empleos.html': {
            hasCarousel: false,
            carouselType: null,
            initFunction: null
        },
        'Contactanos.html': {
            hasCarousel: false,
            carouselType: null,
            initFunction: 'initContactFAQ'
        }
    },
    
    // Obtener configuración de página actual
    getCurrentPageConfig() {
        const currentPage = Utils.getCurrentPage();
        return this.pages[currentPage] || this.pages['Inicio.html'];
    },
    
    // Verificar si la página actual tiene carrusel
    hasCarousel() {
        return this.getCurrentPageConfig().hasCarousel;
    },
    
    // Obtener tipo de carrusel
    getCarouselType() {
        return this.getCurrentPageConfig().carouselType;
    },
    
    // Obtener función de inicialización
    getInitFunction() {
        return this.getCurrentPageConfig().initFunction;
    }
};

// ========================================
// GESTOR DE HEADER Y FOOTER
// ========================================
const HeaderFooterManager = {
    // Cargar header
    async loadHeader() {
        try {
            const headerContainer = document.getElementById('header-container');
            if (!headerContainer) {
                Utils.log('No se encontró el contenedor del header', 'error');
                return false;
            }
            
            const response = await fetch('Header.html');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const headerContent = await response.text();
            headerContainer.innerHTML = headerContent;
            Utils.log('Header cargado exitosamente');
            
            // Disparar evento para indicar que el header se cargó
            document.dispatchEvent(new Event('headerLoaded'));
            return true;
        } catch (error) {
            Utils.log(`Error cargando el header: ${error.message}`, 'error');
            this.createFallbackHeader();
            return false;
        }
    },
    
    // Cargar footer
    async loadFooter() {
        try {
            const footerContainer = document.getElementById('footer-container');
            if (!footerContainer) {
                Utils.log('No se encontró el contenedor del footer, omitiendo carga');
                return false;
            }
            
            const response = await fetch('Footer.html');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const footerContent = await response.text();
            footerContainer.innerHTML = footerContent;
            Utils.log('Footer cargado exitosamente');
            return true;
        } catch (error) {
            Utils.log(`Error cargando el footer: ${error.message}`, 'error');
            this.createFallbackFooter();
            return false;
        }
    },
    
    // Crear header de respaldo
    createFallbackHeader() {
        const headerHTML = `
            <header class="main-header" id="menu">
                <div class="logo">
                    <img src="/Imagenes/LogoPinos.webp" alt="Los Pinos Apparel" />
                </div>
                
                <!-- Botón hamburguesa para móviles -->
                <div class="hamburger-menu" id="hamburger-menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                
                <!-- Menú de navegación -->
                <nav class="nav-menu" id="nav-menu">
                    <div class="nav-header">
                        <button class="close-menu" id="close-menu">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <ul>
                        <li><a href="Inicio.html">INICIO</a></li>
                        <li><a href="Nosotros.html">NOSOTROS</a></li>
                        <li><a href="Responsabilidades.html">RESPONSABILIDADES</a></li>
                        <li><a href="Noticias.html">NOTICIAS</a></li>
                        <li><a href="Empleos.html">EMPLEOS</a></li>
                        <li><a href="contactanos.html">CONTÁCTANOS</a></li>
                    </ul>
                </nav>
                
                <!-- Overlay para cerrar el menú -->
                <div class="menu-overlay" id="menu-overlay"></div>
            </header>
        `;
        
        const headerContainer = document.getElementById('header-container');
        if (headerContainer) {
            headerContainer.innerHTML = headerHTML;
            Utils.log('Header creado como respaldo');
            document.dispatchEvent(new Event('headerLoaded'));
        }
    },
    
    // Crear footer de respaldo
    createFallbackFooter() {
        const footerHTML = `
            <footer class="footer">
                <div class="footer-content">
                    <div class="footer-info">
                        <div class="footer-column">
                            <i class="fas fa-map-marker-alt"></i>
                            <h3>Dirección</h3>
                            <p>Barrio Saragoza, 19 avenida, 7 calle Siguatepeque, Comayagua, Honduras</p>
                        </div>
                        
                        <div class="footer-column">
                            <i class="fas fa-phone"></i>
                            <h3>Teléfono</h3>
                            <p>+504 27773-5353</p>
                        </div>
                        
                        <div class="footer-column">
                            <i class="fas fa-envelope"></i>
                            <h3>Email</h3>
                            <p>karen.cruz@gkglobal.com</p>
                        </div>
                        
                        <div class="footer-column">
                            <i class="fas fa-thumbs-up"></i>
                            <h3>Redes Sociales</h3>
                            <p>Facebook | LinkedIn</p>
                        </div>
                    </div>
                </div>
                
                <div class="footer-bottom">
                    <p>&copy; 2025 Los Pinos Apparel</p>
                    <p>Powered by</p>
                </div>
            </footer>
        `;
        
        const footerContainer = document.getElementById('footer-container');
        if (footerContainer) {
            footerContainer.innerHTML = footerHTML;
            Utils.log('Footer creado como respaldo');
        }
    }
};

// Función para enviar email
function enviarEmail(event) {
    event.preventDefault();
  
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const mensaje = document.getElementById('mensaje').value;
  
    // Validar que los campos requeridos estén llenos
    if (!nombre || !email || !mensaje) {
      alert('Por favor, completa todos los campos requeridos');
      return;
    }
  
    console.log('Enviando datos:', { nombre, email, mensaje });
  
    fetch('http://10.10.20.26:3000/api/contacto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre, correo: email, mensaje })
    })
    .then(response => {
      console.log('Respuesta del servidor:', response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Datos recibidos:', data);
      alert(data.mensaje || '¡Datos enviados correctamente!');
      // Limpiar el formulario después del envío exitoso
      document.getElementById('contacto-form').reset();
    })
    .catch(error => {
      console.error('Error completo:', error);
      alert('Error al enviar los datos: ' + error.message);
    });
  }

// Función para inicializar el formulario de contacto
function initContactForm() {
    const form = document.getElementById('contacto-form');
    if (form) {
        form.addEventListener('submit', enviarEmail);
        console.log('Formulario de contacto inicializado');
    } else {
        console.log('Formulario de contacto no encontrado');
    }
}

// ========================================
// GESTOR DE CARRUSELES
// ========================================
const CarouselManager = {
    // Configuración de carruseles
    carousels: {
        main: {
            images: [
                { src: '/Imagenes/FondoCarrusel.webp', text: 'LOS PINOS \nAPPAREL', dataImage: 'FondoCarrusel' },
                { src: '/Imagenes/Carrusel3.webp', text: 'CONFECCIÓN PROFESIONAL RESPALDADA \nPOR UN EQUIPO CAPACITADO', dataImage: 'Carrusel6' },
                { src: '/Imagenes/carrusel4.webp', text: 'VESTIMOS EL LIDERAZGO.\nEXPORTAMOS CONFIANZA', dataImage: 'carrusel4' },
                { src: '/Imagenes/Carrusel2.webp', text: 'CALIDAD QUE IMPONE PRESENCIA', dataImage: 'Carrusel2' },
                { src: '/Imagenes/Carrusel5.webp', text: '', dataImage: 'Carrusel5' },
                { src: '/Imagenes/Carrusel6.webp', text: 'LOS PINOS \nAPPAREL', dataImage: 'Carrusel3' }
            ],
            width: 16.666, 
            autoPlay: true
        },
        noticias: {
            images: [
                { src: '/Imagenes/CarruselNoticias/Inicio.jpeg', text: '', dataImage: 'Principal' },
                { src: '/Imagenes/CarruselNoticias/EstilodeVida.jpeg', text: 'Estilo de vida', dataImage: 'EstiloDeVida' },
                { src: '/Imagenes/CarruselNoticias/Tecnología.jpeg', text: 'Tecnologia', dataImage: 'Tecnologia' },
                { src: '/Imagenes/CarruselNoticias/Textiles.jpeg', text: 'Textiles', dataImage: 'Textiles' }
            ],
            width: 25, 
            autoPlay: true
        },
        responsabilidades: {
            images: [
                { src: '/Imagenes/FondoCarrusel.webp', text: 'RESPONSABILIDADES', dataImage: 'FondoCarrusel' },
                { src: '/Imagenes/Carrusel3.webp', text: 'COMPROMISO SOCIAL', dataImage: 'Carrusel3' }
            ],
            width: 50, 
            autoPlay: true
        }
    },
    
    // Crear carrusel genérico
    createCarousel(type, containerId) {
        const config = this.carousels[type];
        if (!config) {
            Utils.log(`Tipo de carrusel no encontrado: ${type}`, 'error');
            return false;
        }
        
        const container = document.getElementById(containerId);
        if (!container) {
            Utils.log(`Contenedor no encontrado: ${containerId}`, 'error');
            return false;
        }
        
        const carouselHTML = `
            <section class="hero">
                <div class="carousel-container">
                    <div class="carousel-slide">
                        ${config.images.map(img => `
                            <div class="carousel-item" data-image="${img.dataImage}">
                                <img src="${img.src}" alt="${img.dataImage}" />
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- Flechas de navegación -->
                    <button class="prev" onclick="CarouselManager.prevSlide('${type}')">&#10094;</button>
                    <button class="next" onclick="CarouselManager.nextSlide('${type}')">&#10095;</button>
                    
                    <!-- Indicadores de puntos -->
                    <div class="carousel-indicators">
                        ${config.images.map((_, index) => `
                            <span class="carousel-indicator ${index === 0 ? 'active' : ''}" onclick="CarouselManager.goToSlide('${type}', ${index})"></span>
                        `).join('')}
                    </div>
                    
                    <!-- Captión del carrusel -->
                    <div class="carousel-caption">
                        <h1 id="carousel-text">${config.images[0].text}</h1>
                    </div>
                </div>
            </section>
        `;
        
        container.innerHTML = carouselHTML;
        Utils.log(`Carrusel ${type} creado exitosamente`);
        return true;
    },
    
    // Inicializar carrusel
    initCarousel(type) {
        const config = this.carousels[type];
        if (!config) return;
        
        const carouselSlide = document.querySelector('.carousel-slide');
        const indicators = document.querySelectorAll('.carousel-indicator');
        const carouselText = document.getElementById('carousel-text');
        
        if (!carouselSlide || !indicators.length) {
            Utils.log(`Elementos del carrusel ${type} no encontrados`, 'error');
            return;
        }
        
        let currentIndex = 0;
        const totalItems = config.images.length;
        
        // Función para actualizar el carrusel
        const updateCarousel = () => {
            const translateX = -currentIndex * config.width;
            carouselSlide.style.transform = `translateX(${translateX}%)`;
            
            // Actualizar indicadores
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentIndex);
            });
            
            // Actualizar texto
            if (carouselText) {
                const text = config.images[currentIndex].text;
                carouselText.innerHTML = text.replace(/\n/g, '<br>');
                carouselText.style.display = text ? 'block' : 'none';
            }
        };
        
        // Event listeners para indicadores
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
                if (config.autoPlay) this.resetAutoPlay(type);
            });
        });
        
        // Auto-play
        if (config.autoPlay) {
            this.startAutoPlay(type, () => {
                currentIndex = (currentIndex + 1) % totalItems;
                updateCarousel();
            });
        }
        
        // Inicializar
        updateCarousel();
        
        Utils.log(`Carrusel ${type} inicializado exitosamente`);
    },
    
    // Navegación del carrusel
    prevSlide(type) {
        const config = this.carousels[type];
        if (!config) return;
        
        const carouselSlide = document.querySelector('.carousel-slide');
        const indicators = document.querySelectorAll('.carousel-indicator');
        const carouselText = document.getElementById('carousel-text');
        
        if (!carouselSlide) return;
        
        const totalItems = config.images.length;
        let currentIndex = 0;
        
        // Encontrar índice actual
        indicators.forEach((indicator, index) => {
            if (indicator.classList.contains('active')) {
                currentIndex = index;
            }
        });
        
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        
        // Actualizar
        const translateX = -currentIndex * config.width;
        carouselSlide.style.transform = `translateX(${translateX}%)`;
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
        
        if (carouselText) {
            const text = config.images[currentIndex].text;
            carouselText.innerHTML = text.replace(/\n/g, '<br>');
            carouselText.style.display = text ? 'block' : 'none';
        }
        
        if (config.autoPlay) this.resetAutoPlay(type);
    },
    
    nextSlide(type) {
        const config = this.carousels[type];
        if (!config) return;
        
        const carouselSlide = document.querySelector('.carousel-slide');
        const indicators = document.querySelectorAll('.carousel-indicator');
        const carouselText = document.getElementById('carousel-text');
        
        if (!carouselSlide) return;
        
        const totalItems = config.images.length;
        let currentIndex = 0;
        
        // Encontrar índice actual
        indicators.forEach((indicator, index) => {
            if (indicator.classList.contains('active')) {
                currentIndex = index;
            }
        });
        
        currentIndex = (currentIndex + 1) % totalItems;
        
        // Actualizar
        const translateX = -currentIndex * config.width;
        carouselSlide.style.transform = `translateX(${translateX}%)`;
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
        
        if (carouselText) {
            const text = config.images[currentIndex].text;
            carouselText.innerHTML = text.replace(/\n/g, '<br>');
            carouselText.style.display = text ? 'block' : 'none';
        }
        
        if (config.autoPlay) this.resetAutoPlay(type);
    },
    
    goToSlide(type, index) {
        const config = this.carousels[type];
        if (!config || index < 0 || index >= config.images.length) return;
        
        const carouselSlide = document.querySelector('.carousel-slide');
        const indicators = document.querySelectorAll('.carousel-indicator');
        const carouselText = document.getElementById('carousel-text');
        
        if (!carouselSlide) return;
        
        // Actualizar
        const translateX = -index * config.width;
        carouselSlide.style.transform = `translateX(${translateX}%)`;
        
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
        
        if (carouselText) {
            const text = config.images[index].text;
            carouselText.innerHTML = text.replace(/\n/g, '<br>');
            carouselText.style.display = text ? 'block' : 'none';
        }
        
        if (config.autoPlay) this.resetAutoPlay(type);
    },
    
    // Auto-play
    autoPlayIntervals: {},
    
    startAutoPlay(type, callback) {
        if (this.autoPlayIntervals[type]) {
            clearInterval(this.autoPlayIntervals[type]);
        }
        
        this.autoPlayIntervals[type] = setInterval(callback, CONFIG.AUTO_PLAY_INTERVAL);
    },
    
    stopAutoPlay(type) {
        if (this.autoPlayIntervals[type]) {
            clearInterval(this.autoPlayIntervals[type]);
            delete this.autoPlayIntervals[type];
        }
    },
    
    resetAutoPlay(type) {
        this.stopAutoPlay(type);
        const config = this.carousels[type];
        if (config && config.autoPlay) {
            this.startAutoPlay(type, () => {
                this.nextSlide(type);
            });
        }
    }
};

// ========================================
// GESTOR DE MENÚ MÓVIL
// ========================================
const MobileMenuManager = {
    // Inicializar menú móvil
    init() {
        const hamburgerMenu = document.getElementById('hamburger-menu');
        const navMenu = document.getElementById('nav-menu');
        const closeMenu = document.getElementById('close-menu');
        const menuOverlay = document.getElementById('menu-overlay');
        
        if (!hamburgerMenu || !navMenu || !closeMenu || !menuOverlay) {
            Utils.log('No se encontraron todos los elementos del menú móvil', 'error');
            return false;
        }
        
        // Abrir menú
        hamburgerMenu.addEventListener('click', () => {
            Utils.log('Abriendo menú móvil');
            navMenu.classList.add('active');
            hamburgerMenu.classList.add('active');
            menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        // Cerrar menú
        const closeMobileMenu = () => {
            Utils.log('Cerrando menú móvil');
            navMenu.classList.remove('active');
            hamburgerMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        };
        
        // Event listeners
        closeMenu.addEventListener('click', closeMobileMenu);
        menuOverlay.addEventListener('click', closeMobileMenu);
        
        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
        
        // Marcar página activa
        this.markActivePage();
        
        // Cerrar menú al hacer clic en enlaces
        const menuLinks = navMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(closeMobileMenu, 100);
            });
        });
        
        Utils.log('Menú móvil inicializado exitosamente');
        return true;
    },
    
    // Inicializar con reintentos
    async initWithRetry(maxRetries = CONFIG.RETRY_ATTEMPTS, delay = CONFIG.RETRY_DELAY) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            Utils.log(`Intento ${attempt} de inicializar menú móvil...`);
            
            if (this.init()) {
                return true;
            }
            
            if (attempt < maxRetries) {
                Utils.log(`Reintentando en ${delay}ms...`);
                await Utils.delay(delay);
            }
        }
        
        Utils.log(`No se pudo inicializar el menú móvil después de ${maxRetries} intentos`, 'error');
        return false;
    },
    
    // Marcar página activa
    markActivePage() {
        const currentPage = Utils.getCurrentPage();
        const menuLinks = document.querySelectorAll('.nav-menu a');
        
        menuLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }
};

// ========================================
// GESTOR DE SCROLL
// ========================================
const ScrollManager = {
    // Manejar scroll del header
    handleHeaderScroll() {
        const header = document.querySelector('.main-header');
        if (!header) {
            Utils.log('No se encontró el header para aplicar scroll effect', 'warn');
            return;
        }
        
        if (Utils.isContactPage()) {
            // En la página de contacto, mantener el header siempre con fondo
            header.classList.add('scrolled');
        } else {
            // En otras páginas, comportamiento normal
            if (window.scrollY > CONFIG.SCROLL_THRESHOLD) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    },
    
    // Inicializar
    init() {
        window.addEventListener('scroll', this.handleHeaderScroll);
        this.handleHeaderScroll(); // Ejecutar una vez para establecer el estado inicial
    }
};

// ========================================
// GESTOR DE PÁGINAS ESPECÍFICAS
// ========================================
const PageSpecificManager = {
    // Inicializar página de contacto
    initContactPage() {
        const header = document.querySelector('.main-header');
        if (header) {
            header.classList.add('scrolled');
            Utils.log('Header configurado como estático para página de contacto');
        }
        
        // Inicializar formulario de contacto
        setTimeout(() => {
            initContactForm();
        }, 100);
        
        // Inicializar FAQ si existe
        setTimeout(() => {
            this.initContactFAQ();
        }, 200);
    },
    
    // Inicializar FAQ de contacto
    initContactFAQ() {
        const faqQuestions = document.querySelectorAll('.faq-pregunta');
        console.log('🔍 Buscando elementos FAQ:', faqQuestions.length);
        console.log('🔍 Elementos encontrados:', faqQuestions);
        
        if (faqQuestions.length === 0) {
            Utils.log('No se encontraron elementos FAQ para inicializar', 'warn');
            return;
        }
        
        Utils.log(`Inicializando FAQ de contacto con ${faqQuestions.length} elementos...`);
        
        faqQuestions.forEach((pregunta, index) => {
            console.log(`🔍 Procesando FAQ ${index + 1}:`, pregunta);
            
            // Remover event listeners existentes para evitar duplicados
            pregunta.removeEventListener('click', pregunta.faqClickHandler);
            
            // Crear nuevo event listener
            pregunta.faqClickHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const faqItem = pregunta.parentElement;
                const respuesta = faqItem.querySelector('.faq-respuesta');
                const icon = pregunta.querySelector('i');
                
                if (!faqItem || !respuesta || !icon) {
                    Utils.log('Elementos del FAQ no encontrados', 'error');
                    return;
                }
                
                Utils.log(`FAQ ${index + 1} clickeado, estado actual: ${faqItem.classList.contains('activo')}`);
                
                // Toggle del estado activo
                const isActive = faqItem.classList.contains('activo');
                faqItem.classList.toggle('activo');
                
                if (!isActive) {
                    // Abrir FAQ
                    respuesta.style.maxHeight = respuesta.scrollHeight + 'px';
                    icon.style.transform = 'rotate(180deg)';
                    Utils.log(`FAQ ${index + 1} abierto`);
                } else {
                    // Cerrar FAQ
                    respuesta.style.maxHeight = '0';
                    icon.style.transform = 'rotate(0deg)';
                    Utils.log(`FAQ ${index + 1} cerrado`);
                }
            };
            
            // Agregar event listener
            pregunta.addEventListener('click', pregunta.faqClickHandler);
            
            // Agregar indicador visual de que es clickeable
            pregunta.style.cursor = 'pointer';
            
            Utils.log(`FAQ ${index + 1} inicializado correctamente`);
        });
        
        Utils.log('FAQ de contacto inicializado exitosamente');
    },
    
    // Inicializar sección Visión
    initVisionSection() {
        const visionRows = document.querySelectorAll('.vision-row');
        if (visionRows.length === 0) return;
        
        visionRows.forEach(row => {
            const button = row.querySelector('.expand-btn');
            if (!button) return;
            
            button.addEventListener('click', () => {
                this.toggleVision(row);
            });
        });
    },
    
    // Toggle sección Visión
    toggleVision(visionRow) {
        const icon = visionRow.querySelector('.expand-btn i');
        
        visionRow.classList.toggle('expanded');
        
        if (icon) {
            if (visionRow.classList.contains('expanded')) {
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');
            } else {
                icon.classList.remove('fa-minus');
                icon.classList.add('fa-plus');
            }
        }
        
        // Cerrar otras filas (comportamiento acordeón)
        const allVisionRows = document.querySelectorAll('.vision-row');
        allVisionRows.forEach(row => {
            if (row !== visionRow && row.classList.contains('expanded')) {
                row.classList.remove('expanded');
                const otherIcon = row.querySelector('.expand-btn i');
                if (otherIcon) {
                    otherIcon.classList.remove('fa-minus');
                    otherIcon.classList.add('fa-plus');
                }
            }
        });
    }
};

// ========================================
// GESTOR DE CARGA DE PÁGINA
// ========================================
const PageLoadingManager = {
    // Estado de carga
    isInitialized: false,
    isPageFullyLoaded: false,
    
    // Mensajes de estado de carga
    loadingMessages: [
        'Inicializando aplicación...',
        'Cargando componentes...',
        'Preparando carrusel...',
        'Cargando imágenes...',
        'Finalizando configuración...',
        '¡Listo!'
    ],
    
    // Inicializar el gestor de carga
    init() {
        this.isInitialized = true;
        this.isPageFullyLoaded = false;
        
        // Mostrar mensaje inicial
        this.updateLoadingMessage(0);
        
        Utils.log('Gestor de carga inicializado - esperando carga real de la página');
        
        // Iniciar monitoreo real de la carga
        this.startRealPageLoading();
    },
    
    // Iniciar monitoreo real de la carga de la página
    startRealPageLoading() {
        // Esperar a que el DOM esté completamente listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.onDOMReady();
            });
        } else {
            this.onDOMReady();
        }
    },
    
    // Cuando el DOM está listo
    onDOMReady() {
        Utils.log('DOM listo - iniciando carga real de elementos');
        this.updateLoadingMessage(1);
        
        // Monitorear carga real de imágenes
        this.monitorRealImageLoading();
        
        // Monitorear carga del carrusel
        this.monitorCarouselLoading();
        
        // Monitorear carga de fuentes
        this.monitorFontLoading();
        
        // Verificar si ya está todo listo
        this.checkIfPageIsReady();
    },
    
    // Monitorear carga real de imágenes
    monitorRealImageLoading() {
        const criticalImages = document.querySelectorAll('img[src*="/Imagenes/"]');
        
        if (criticalImages.length === 0) {
            Utils.log('No se encontraron imágenes críticas');
            return;
        }
        
        Utils.log(`Monitoreando carga real de ${criticalImages.length} imágenes críticas`);
        this.updateLoadingMessage(3);
        
        let loadedImages = 0;
        const totalImages = criticalImages.length;
        
        const markImageLoaded = () => {
            loadedImages++;
            Utils.log(`Imagen realmente cargada: ${loadedImages}/${totalImages}`);
            
            if (loadedImages === totalImages) {
                Utils.log('Todas las imágenes están realmente cargadas');
                this.checkIfPageIsReady();
            }
        };
        
        criticalImages.forEach(img => {
            if (img.complete && img.naturalWidth > 0) {
                // La imagen ya está completamente cargada
                markImageLoaded();
            } else {
                // Esperar a que la imagen se cargue realmente
                img.addEventListener('load', markImageLoaded);
                img.addEventListener('error', () => {
                    Utils.log(`Error al cargar imagen, pero continuando`);
                    markImageLoaded();
                });
            }
        });
    },
    
    // Monitorear carga del carrusel
    monitorCarouselLoading() {
        this.updateLoadingMessage(2);
        
        // Esperar a que el carrusel esté realmente funcional
        const checkCarousel = () => {
            const carouselSlide = document.querySelector('.carousel-slide');
            const indicators = document.querySelectorAll('.carousel-indicator');
            
            if (carouselSlide && indicators.length > 0) {
                Utils.log('Carrusel está realmente funcional');
                this.checkIfPageIsReady();
            } else {
                // Reintentar en 100ms
                setTimeout(checkCarousel, 100);
            }
        };
        
        checkCarousel();
    },
    
    // Monitorear carga de fuentes
    monitorFontLoading() {
        // Verificar si las fuentes de Google están cargadas
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => {
                Utils.log('Fuentes de Google cargadas');
                this.checkIfPageIsReady();
            });
        } else {
            // Fallback: esperar un tiempo razonable
            setTimeout(() => {
                Utils.log('Fuentes asumidas como cargadas (fallback)');
                this.checkIfPageIsReady();
            }, 1000);
        }
    },
    
    // Verificar si la página está realmente lista
    checkIfPageIsReady() {
        // Solo marcar como lista si no se ha marcado antes
        if (this.isPageFullyLoaded) return;
        
        this.isPageFullyLoaded = true;
        Utils.log('Página completamente cargada en el fondo - ocultando spinner');
        this.updateLoadingMessage(5); // "¡Listo!"
        
        // Ocultar spinner después de un breve delay para mostrar "¡Listo!"
        setTimeout(() => {
            this.hideLoadingSpinner();
        }, 500);
    },
    
    // Ocultar el spinner de carga
    hideLoadingSpinner() {
        const loadingSpinner = document.getElementById('loading-spinner');
        const mainContent = document.getElementById('main-content');
        
        if (loadingSpinner && mainContent) {
            // Ocultar el spinner
            loadingSpinner.classList.add('hidden');
            
            // Mostrar el contenido principal
            mainContent.classList.add('page-loaded');
            
            // Remover el spinner completamente
            setTimeout(() => {
                loadingSpinner.remove();
            }, 400);
            
            Utils.log('Spinner ocultado y página mostrada');
        }
    },
    
    // Actualizar el mensaje de carga
    updateLoadingMessage(index) {
        const loadingMessageElement = document.getElementById('loading-message');
        if (loadingMessageElement && this.loadingMessages[index]) {
            loadingMessageElement.textContent = this.loadingMessages[index];
        }
    },
    
    // Método legacy para compatibilidad
    handlePageLoading() {
        if (this.isInitialized) {
            this.checkIfPageIsReady();
            return;
        }
        
        // Fallback para el sistema anterior
        const loadingSpinner = document.getElementById('loading-spinner');
        const mainContent = document.getElementById('main-content');
        
        if (loadingSpinner && mainContent) {
            loadingSpinner.classList.add('hidden');
            mainContent.classList.add('page-loaded');
            
            setTimeout(() => {
                loadingSpinner.remove();
            }, 500);
            
            Utils.log('Página cargada (método legacy)');
        }
    }
};

// ========================================
// FUNCIONES GLOBALES (para compatibilidad)
// ========================================

// Funciones del carrusel (para onclick en HTML)
function prevSlide() {
    const currentPage = Utils.getCurrentPage();
    if (currentPage === 'Noticias.html') {
        CarouselManager.prevSlide('noticias');
    } else if (currentPage === 'Responsabilidades.html') {
        CarouselManager.prevSlide('responsabilidades');
    } else {
        CarouselManager.prevSlide('main');
    }
}

function nextSlide() {
    const currentPage = Utils.getCurrentPage();
    if (currentPage === 'Noticias.html') {
        CarouselManager.nextSlide('noticias');
    } else if (currentPage === 'Responsabilidades.html') {
        CarouselManager.nextSlide('responsabilidades');
    } else {
        CarouselManager.nextSlide('main');
    }
}

function goToSlide(index) {
    const currentPage = Utils.getCurrentPage();
    if (currentPage === 'Noticias.html') {
        CarouselManager.goToSlide('noticias', index);
    } else if (currentPage === 'Responsabilidades.html') {
        CarouselManager.goToSlide('responsabilidades', index);
    } else {
        CarouselManager.goToSlide('main', index);
    }
}

// Función para manejar la carga de página (compatibilidad)
function handlePageLoading() {
    PageLoadingManager.handlePageLoading();
}

// Función para mostrar mapa
function mostrarMapa() {
    const mapaContainer = document.getElementById('mapa-contenido');
    if (!mapaContainer) return;
    
    const mapaHTML = `
        <div class="container">
            <div class="mapa-detalle">
                <div class="mapa-header">
                    <h2>Nuestra Ubicación</h2>
                </div>
                <div class="mapa-body">
                    <div class="mapa-container">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d770.9302204019078!2d-87.849517624046!3d14.58803267060549!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f6595aaa0cd6e69%3A0xad98f45abf9ef942!2sAlamode%20S.A.!5e1!3m2!1ses-419!2shn!4v1754601310111!5m2!1ses-419!2shn"
                            allowfullscreen="" 
                            loading="lazy" 
                            referrerpolicy="no-referrer-when-downgrade">
                        </iframe>
                    </div>
                    <div class="mapa-info">
                        <h3>Información de Contacto</h3>
                        <p class="direccion">Alamode S.A.</p>
                        <p>Siguatepeque, Honduras</p>
                        <p>Teléfono: +504 27773-5353</p>
                        <p>Email: karen.cruz@gkglobal.com</p>
                        <p>Horario: Lunes a Viernes 8:00 AM - 5:00 PM</p>
                    </div>
                    <button class="Redireccionar" onclick="window.location.href='contactanos.html'">Ir a Contáctanos</button>
                </div>
            </div>
        </div>
    `;
    
    mapaContainer.innerHTML = mapaHTML;
    mapaContainer.classList.add('activo');
    mapaContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ========================================
// INICIALIZACIÓN PRINCIPAL
// ========================================
const App = {
    // Inicializar aplicación
    async init() {
        try {
            Utils.log('Iniciando aplicación...');
            
            // Inicializar el gestor de carga REAL
            PageLoadingManager.init();
            
            // Cargar header y footer
            await Promise.all([
                HeaderFooterManager.loadHeader(),
                HeaderFooterManager.loadFooter()
            ]);
            
            // Obtener configuración de página actual
            const pageConfig = PageManager.getCurrentPageConfig();
            const currentPage = Utils.getCurrentPage();
            
            Utils.log(`Página detectada: ${currentPage}`);
            Utils.log(`Configuración: ${JSON.stringify(pageConfig)}`);
            
            // Configurar página específica
            if (Utils.isContactPage()) {
                PageSpecificManager.initContactPage();
            }
            
            // Manejar carrusel si es necesario
            if (pageConfig.hasCarousel) {
                const carouselType = pageConfig.carouselType;
                const containerId = this.getCarouselContainerId(carouselType);
                
                if (containerId) {
                    Utils.log(`Creando carrusel ${carouselType}...`);
                    CarouselManager.createCarousel(carouselType, containerId);
                    CarouselManager.initCarousel(carouselType);
                }
            }
            
            // Inicializar menú móvil
            Utils.log('Inicializando menú móvil...');
            await MobileMenuManager.initWithRetry();
            
            // Inicializar scroll manager
            ScrollManager.init();
            
            // Inicializar funcionalidades específicas de página
            this.initPageSpecificFeatures();
            
            // Monitorear carga de imágenes críticas (ahora manejado por PageLoadingManager)
            this.monitorImageLoading();
            
            // Timeout de seguridad para ocultar spinner si algo falla
            setTimeout(() => {
                const loadingSpinner = document.getElementById('loading-spinner');
                if (loadingSpinner) {
                    Utils.log('Timeout de seguridad: ocultando spinner');
                    PageLoadingManager.hideLoadingSpinner();
                }
            }, 8000); // 8 segundos de timeout
            
            Utils.log('Aplicación inicializada exitosamente');
            
        } catch (error) {
            Utils.log(`Error durante la inicialización: ${error.message}`, 'error');
        }
    },
    
    // Obtener ID del contenedor del carrusel
    getCarouselContainerId(carouselType) {
        const containerMap = {
            'main': 'carousel-container',
            'noticias': 'noticias-carousel-container',
            'responsabilidades': 'carousel-container'
        };
        
        return containerMap[carouselType];
    },
    
    // Inicializar funcionalidades específicas de página
    initPageSpecificFeatures() {
        const currentPage = Utils.getCurrentPage();
        
        // Inicializar FAQ de contacto
        if (currentPage === 'Contactanos.html') {
            PageSpecificManager.initContactFAQ();
        }
        
        // Inicializar sección Visión
        if (currentPage === 'Nosotros.html') {
            PageSpecificManager.initVisionSection();
        }
    },
    
    // Monitorear la carga de imágenes críticas
    monitorImageLoading() {
        // Esta función ahora es manejada por PageLoadingManager
        // Solo mantenemos un log para compatibilidad
        Utils.log('Monitoreo de imágenes delegado al PageLoadingManager');
    }
};

// ========================================
// EVENT LISTENERS
// ========================================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Event listener para cuando el header se carga dinámicamente
document.addEventListener('headerLoaded', () => {
    Utils.log('Header cargado dinámicamente');
    
    // Reinicializar menú móvil
    setTimeout(() => {
        MobileMenuManager.initWithRetry(10, 200);
    }, 100);
    
    // Marcar página activa
    MobileMenuManager.markActivePage();
});
