
  (function(){
    'use strict';
    var langButton=document.getElementById('language'),menu=document.getElementById('menu'),links=document.getElementById('navlinks'),bar=document.getElementById('progress');
    var language='es';
    try{language=localStorage.getItem('tfoc-language')||(navigator.language.toLowerCase().indexOf('es')===0?'es':'en')}catch(e){language=navigator.language.toLowerCase().indexOf('es')===0?'es':'en'}
    function setLanguage(value){
      language=value==='en'?'en':'es';document.body.classList.toggle('en',language==='en');document.documentElement.lang=language;
      langButton.textContent=language==='es'?'EN':'ES';langButton.setAttribute('aria-label',language==='es'?'Cambiar idioma a inglés':'Switch language to Spanish');
      if(lightbox.hasAttribute('open'))updateLightbox();
    }
    langButton.addEventListener('click',function(){setLanguage(language==='es'?'en':'es');try{localStorage.setItem('tfoc-language',language)}catch(e){}});
    menu.addEventListener('click',function(){var isOpen=links.classList.toggle('open');menu.setAttribute('aria-expanded',String(isOpen));menu.setAttribute('aria-label',isOpen?'Cerrar menú':'Abrir menú');menu.textContent=isOpen?'×':'☰'});
    links.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){links.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='☰'})});
    var shots=Array.from(document.querySelectorAll('.gallery-grid button')),lightbox=document.getElementById('lightbox'),lightboxImage=document.getElementById('lightbox-image'),caption=document.getElementById('lightbox-caption'),current=0,lastFocus=null;
    function updateLightbox(){var shot=shots[current];lightboxImage.src=shot.getAttribute('data-full');caption.textContent=shot.getAttribute('data-caption-'+language);lightboxImage.alt=caption.textContent}
    function openLightbox(index){current=index;lastFocus=document.activeElement;updateLightbox();lightbox.setAttribute('open','');document.body.classList.add('modal-open');document.getElementById('close-lightbox').focus()}
    function closeLightbox(){lightbox.removeAttribute('open');document.body.classList.remove('modal-open');if(lastFocus&&lastFocus.focus)lastFocus.focus()}
    function advance(delta){current=(current+delta+shots.length)%shots.length;updateLightbox()}
    shots.forEach(function(shot,index){shot.addEventListener('click',function(){openLightbox(index)})});
    document.getElementById('close-lightbox').addEventListener('click',closeLightbox);
    document.getElementById('previous-image').addEventListener('click',function(){advance(-1)});
    document.getElementById('next-image').addEventListener('click',function(){advance(1)});
    lightbox.addEventListener('click',function(e){if(e.target===lightbox)closeLightbox()});
    document.addEventListener('keydown',function(e){if(!lightbox.hasAttribute('open'))return;if(e.key==='Escape')closeLightbox();if(e.key==='ArrowRight')advance(1);if(e.key==='ArrowLeft')advance(-1);if(e.key==='Tab'){var focusables=Array.from(lightbox.querySelectorAll('button'));var first=focusables[0],last=focusables[focusables.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
    var ticking=false;function onScroll(){if(ticking)return;ticking=true;requestAnimationFrame(function(){var max=document.documentElement.scrollHeight-innerHeight;bar.style.width=(max>0?Math.max(0,Math.min(100,scrollY/max*100)):0)+'%';ticking=false})}
    window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);onScroll();
    document.getElementById('year').textContent=new Date().getFullYear();setLanguage(language);
  })();
  
