/**
 * Cache Cleaner - Sistema de limpieza automática de caché
 * Los Pinos Apparel
 * 
 * Este script se encarga de:
 * 1. Limpiar el caché del navegador
 * 2. Forzar la recarga de recursos CSS y JS
 * 3. Forzar la recarga de imágenes
 * 4. Detectar navegación hacia atrás/adelante
 */

(function() {
  'use strict';

  // Función principal de limpieza de caché
  function clearCache() {
    console.log('🔄 Iniciando limpieza de caché...');
    
    // 1. Limpiar caché del navegador
    if ('caches' in window) {
      caches.keys().then(function(names) {
        console.log('🗑️ Limpiando caché del navegador...');
        for (let name of names) {
          caches.delete(name);
        }
        console.log('✅ Caché del navegador limpiado');
      }).catch(function(error) {
        console.warn('⚠️ Error al limpiar caché del navegador:', error);
      });
    }

    // 2. Forzar recarga de recursos CSS
    const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
    cssLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.includes('http') && !href.includes('?')) {
        const newHref = href + '?v=' + Date.now();
        link.setAttribute('href', newHref);
        console.log('🔄 CSS actualizado:', href);
      }
    });

    // 3. Forzar recarga de scripts
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
      const src = script.getAttribute('src');
      if (src && !src.includes('http') && !src.includes('?') && !src.includes('cache-cleaner.js')) {
        const newSrc = src + '?v=' + Date.now();
        script.setAttribute('src', newSrc);
        console.log('🔄 Script actualizado:', src);
      }
    });

    // 4. Forzar recarga de imágenes
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      const src = img.getAttribute('src');
      if (src && !src.includes('http') && !src.includes('?')) {
        const newSrc = src + '?v=' + Date.now();
        img.setAttribute('src', newSrc);
        console.log('🔄 Imagen actualizada:', src);
      }
    });

    // 5. Limpiar localStorage si es necesario
    if (window.localStorage) {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('cache') || key.includes('temp')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log('🗑️ localStorage limpiado:', key);
      });
    }

    console.log('✅ Limpieza de caché completada');
  }

  // Función para detectar navegación hacia atrás/adelante
  function handleBackForwardNavigation() {
    if (window.performance && window.performance.navigation) {
      const navigationType = window.performance.navigation.type;
      if (navigationType === window.performance.navigation.TYPE_BACK_FORWARD) {
        console.log('🔄 Detectada navegación hacia atrás/adelante, recargando página...');
        window.location.reload(true);
      }
    }
  }

  // Función para limpiar caché en intervalos regulares
  function setupPeriodicCacheCleaning() {
    // Limpiar caché cada 30 minutos
    setInterval(function() {
      console.log('⏰ Limpieza periódica de caché...');
      clearCache();
    }, 30 * 60 * 1000); // 30 minutos
  }

  // Función para limpiar caché antes de que la página se descargue
  function setupBeforeUnloadCleaning() {
    window.addEventListener('beforeunload', function() {
      console.log('🚪 Limpiando caché antes de salir...');
      clearCache();
    });
  }

  // Función para detectar cambios en la conexión
  function setupConnectionChangeHandler() {
    if ('ononline' in window) {
      window.addEventListener('online', function() {
        console.log('🌐 Conexión restaurada, limpiando caché...');
        clearCache();
      });
    }
  }

  // Función para limpiar caché en respuesta a eventos específicos
  function setupEventBasedCleaning() {
    // Limpiar caché cuando el usuario hace clic en enlaces internos
    document.addEventListener('click', function(e) {
      const target = e.target.closest('a');
      if (target && target.href && target.href.includes(window.location.origin)) {
        console.log('🔗 Enlace interno detectado, limpiando caché...');
        clearCache();
      }
    });

    // Limpiar caché cuando se detecta un error de carga
    window.addEventListener('error', function(e) {
      if (e.target.tagName === 'IMG' || e.target.tagName === 'LINK' || e.target.tagName === 'SCRIPT') {
        console.log('❌ Error de carga detectado, limpiando caché...');
        clearCache();
      }
    });
  }

  // Función de inicialización
  function init() {
    console.log('🚀 Inicializando Cache Cleaner...');
    
    // Ejecutar limpieza inicial
    clearCache();
    
    // Configurar limpieza en eventos
    setupBeforeUnloadCleaning();
    setupConnectionChangeHandler();
    setupEventBasedCleaning();
    setupPeriodicCacheCleaning();
    
    // Manejar navegación hacia atrás/adelante
    handleBackForwardNavigation();
    
    console.log('✅ Cache Cleaner inicializado correctamente');
  }

  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // También ejecutar cuando la página esté completamente cargada
  window.addEventListener('load', function() {
    console.log('📄 Página completamente cargada, verificando caché...');
    clearCache();
  });

  // Exponer funciones globalmente para uso manual
  window.CacheCleaner = {
    clear: clearCache,
    init: init
  };

})();
