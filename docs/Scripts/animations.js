/**
 * Animations Manager - Los Pinos Apparel
 * 
 * Este script se encarga de:
 * 1. Gestionar las animaciones de entrada
 * 2. Optimizar el rendimiento de las animaciones
 * 3. Asegurar que las animaciones funcionen en todos los dispositivos
 */

(function() {
  'use strict';

  // Configuración de animaciones
  const animationConfig = {
    // Umbral de intersección para animaciones al hacer scroll
    threshold: 0.1,
    // Margen de raíz para animaciones
    rootMargin: '0px 0px -50px 0px',
    // Duración base de las animaciones
    baseDuration: 800,
    // Retraso entre elementos
    staggerDelay: 100
  };

  // Función para inicializar animaciones
  function initAnimations() {
    console.log('🎬 Inicializando animaciones...');
    
    // Configurar animaciones de entrada
    setupEntryAnimations();
    
    // Configurar animaciones al hacer scroll
    setupScrollAnimations();
    
    // Configurar animaciones de hover
    setupHoverAnimations();
    
    // Configurar animaciones específicas por página
    setupPageSpecificAnimations();
    
    console.log('✅ Animaciones inicializadas correctamente');
  }

  // Función para configurar animaciones de entrada
  function setupEntryAnimations() {
    // Animaciones para elementos del menú
    const menuItems = document.querySelectorAll('.nav-menu a');
    menuItems.forEach((item, index) => {
      item.style.animationDelay = `${0.1 + (index * 0.1)}s`;
    });

    // Animaciones para títulos del carrusel
    const carouselTitles = document.querySelectorAll('.carousel-caption h1, .hero-static-caption h1');
    carouselTitles.forEach(title => {
      title.style.animationDelay = '0.5s';
    });

    // Animaciones para subtítulos del carrusel
    const carouselSubtitles = document.querySelectorAll('.carousel-caption p, .hero-static-caption p');
    carouselSubtitles.forEach(subtitle => {
      subtitle.style.animationDelay = '0.8s';
    });

    // Animaciones para títulos de secciones
    const sectionTitles = document.querySelectorAll('section h1, section h2');
    sectionTitles.forEach(title => {
      title.style.animationDelay = '0.3s';
    });
  }

  // Función para configurar animaciones al hacer scroll
  function setupScrollAnimations() {
    // Verificar si Intersection Observer está disponible
    if (!('IntersectionObserver' in window)) {
      console.warn('⚠️ Intersection Observer no disponible, usando fallback');
      return;
    }

    // Crear observer para animaciones al hacer scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: animationConfig.threshold,
      rootMargin: animationConfig.rootMargin
    });

    // Observar elementos con clase animate-on-scroll
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(element => {
      observer.observe(element);
    });

    // Observar elementos específicos
    const specificElements = document.querySelectorAll('.tarjeta, .empleo-card, .valor-item, .contacto-card');
    specificElements.forEach((element, index) => {
      element.classList.add('animate-on-scroll');
      element.style.animationDelay = `${0.2 + (index * 0.1)}s`;
      observer.observe(element);
    });
  }

  // Función para configurar animaciones de hover
  function setupHoverAnimations() {
    // Agregar clase hover-animate a elementos interactivos
    const interactiveElements = document.querySelectorAll('.tarjeta, .empleo-card, .valor-item, .contacto-card, .boton');
    interactiveElements.forEach(element => {
      element.classList.add('hover-animate');
    });

    // Animaciones específicas para botones
    const buttons = document.querySelectorAll('.boton, .boton-enviar, .boton-ubicacion');
    buttons.forEach(button => {
      button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.05)';
        this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
      });

      button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '';
      });
    });
  }

  // Función para configurar animaciones específicas por página
  function setupPageSpecificAnimations() {
    const currentPage = window.location.pathname;

    // Animaciones para página de Responsabilidades
    if (currentPage.includes('Responsabilidades')) {
      const responsabilidadCards = document.querySelectorAll('.targeta-responsabilidad');
      responsabilidadCards.forEach((card, index) => {
        card.style.animationDelay = `${0.2 + (index * 0.1)}s`;
      });
    }

    // Animaciones para página de Empleos
    if (currentPage.includes('Empleos')) {
      const empleoCards = document.querySelectorAll('.empleo-card');
      empleoCards.forEach((card, index) => {
        card.style.animationDelay = `${0.2 + (index * 0.2)}s`;
      });
    }

    // Animaciones para página de Contacto
    if (currentPage.includes('contactanos')) {
      const contactoCards = document.querySelectorAll('.contacto-card');
      contactoCards.forEach((card, index) => {
        card.style.animationDelay = `${0.1 + (index * 0.1)}s`;
      });
    }

    // Animaciones para página de Nosotros
    if (currentPage.includes('Nosotros')) {
      const valorItems = document.querySelectorAll('.valor-item');
      valorItems.forEach((item, index) => {
        item.style.animationDelay = `${0.2 + (index * 0.1)}s`;
      });
    }
  }

  // Función para optimizar animaciones en dispositivos móviles
  function optimizeForMobile() {
    if (window.innerWidth <= 768) {
      // Reducir duración de animaciones en móviles
      const animatedElements = document.querySelectorAll('[style*="animation"]');
      animatedElements.forEach(element => {
        const currentAnimation = element.style.animation;
        if (currentAnimation) {
          // Reducir la duración en un 30%
          element.style.animation = currentAnimation.replace(/(\d+\.?\d*)s/g, (match, duration) => {
            return (parseFloat(duration) * 0.7) + 's';
          });
        }
      });

      // Reducir delays en móviles
      const elementsWithDelay = document.querySelectorAll('[style*="animation-delay"]');
      elementsWithDelay.forEach(element => {
        const currentDelay = element.style.animationDelay;
        if (currentDelay) {
          element.style.animationDelay = currentDelay.replace(/(\d+\.?\d*)s/g, (match, delay) => {
            return (parseFloat(delay) * 0.5) + 's';
          });
        }
      });
    }
  }

  // Función para pausar animaciones cuando la pestaña no está visible
  function setupVisibilityHandling() {
    let isPageVisible = true;

    document.addEventListener('visibilitychange', function() {
      isPageVisible = !document.hidden;
      
      const animatedElements = document.querySelectorAll('[style*="animation"]');
      animatedElements.forEach(element => {
        if (isPageVisible) {
          element.style.animationPlayState = 'running';
        } else {
          element.style.animationPlayState = 'paused';
        }
      });
    });
  }

  // Función para detectar preferencias de movimiento reducido
  function setupReducedMotion() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      console.log('♿ Preferencias de movimiento reducido detectadas');
      
      // Deshabilitar animaciones para usuarios con preferencias de movimiento reducido
      const animatedElements = document.querySelectorAll('[style*="animation"]');
      animatedElements.forEach(element => {
        element.style.animation = 'none';
        element.style.opacity = '1';
        element.style.transform = 'none';
      });
    }
  }

  // Función para mejorar el rendimiento de las animaciones
  function optimizePerformance() {
    // Usar transform3d para forzar aceleración por hardware
    const animatedElements = document.querySelectorAll('[style*="animation"]');
    animatedElements.forEach(element => {
      element.style.willChange = 'transform, opacity';
      
      // Limpiar willChange después de la animación
      element.addEventListener('animationend', function() {
        this.style.willChange = 'auto';
      });
    });
  }

  // Función para agregar animaciones personalizadas
  function addCustomAnimations() {
    // Animación para el logo
    const logo = document.querySelector('.logo');
    if (logo) {
      logo.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) rotate(5deg)';
        this.style.transition = 'transform 0.3s ease';
      });

      logo.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
      });
    }

    // Animación para elementos del menú
    const menuItems = document.querySelectorAll('.nav-menu a');
    menuItems.forEach(item => {
      item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.color = '#4CAF50';
      });

      item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.color = '';
      });
    });
  }

  // Función principal de inicialización
  function init() {
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initAnimations, 100);
      });
    } else {
      setTimeout(initAnimations, 100);
    }

    // Configuraciones adicionales
    setupVisibilityHandling();
    setupReducedMotion();
    optimizeForMobile();
    optimizePerformance();
    addCustomAnimations();
  }

  // Ejecutar inicialización
  init();

  // Exponer funciones globalmente para uso manual
  window.AnimationsManager = {
    init: initAnimations,
    optimize: optimizePerformance,
    addCustom: addCustomAnimations
  };

})();
