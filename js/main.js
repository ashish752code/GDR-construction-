/* ============================
   GDR CONSTRUCTION COMPANY
   Main JavaScript
   ============================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Preloader ----
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader && preloader.classList.add('hidden'), 500);
  });

  // ---- Mobile Nav ----
  const hamburger   = document.getElementById('hamburger');
  const overlay     = document.getElementById('mobile-nav-overlay');
  const sidebar     = document.getElementById('mobile-nav-sidebar');
  const closeBtn    = document.getElementById('sidebar-close');

  function openSidebar()  { overlay.classList.add('open'); sidebar.classList.add('open'); document.body.style.overflow='hidden'; hamburger.classList.add('open'); }
  function closeSidebar() { overlay.classList.remove('open'); sidebar.classList.remove('open'); document.body.style.overflow=''; hamburger.classList.remove('open'); }

  hamburger && hamburger.addEventListener('click', openSidebar);
  closeBtn  && closeBtn.addEventListener('click',  closeSidebar);
  overlay   && overlay.addEventListener('click',   closeSidebar);

  // Mobile accordion
  document.querySelectorAll('.mobile-link[data-toggle]').forEach(link => {
    link.addEventListener('click', () => {
      const target = document.getElementById(link.dataset.toggle);
      const arrow  = link.querySelector('.mobile-arrow');
      const isOpen = target.classList.contains('open');
      // Close all
      document.querySelectorAll('.mobile-submenu').forEach(m => m.classList.remove('open'));
      document.querySelectorAll('.mobile-arrow').forEach(a => a.classList.remove('open'));
      document.querySelectorAll('.mobile-link').forEach(l => l.classList.remove('active-menu'));
      if (!isOpen) {
        target.classList.add('open');
        arrow && arrow.classList.add('open');
        link.classList.add('active-menu');
      }
    });
  });

  // ---- Hero Slider ----
  const slides    = document.querySelectorAll('.slide');
  const dotsBtns  = document.querySelectorAll('.slider-dot');
  let   current   = 0;
  let   timer;

  function goToSlide(n) {
    slides[current].classList.remove('active');
    dotsBtns[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dotsBtns[current].classList.add('active');
  }

  function nextSlide() { goToSlide(current + 1); }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(nextSlide, 5000);
  }

  if (slides.length) {
    slides[0].classList.add('active');
    dotsBtns[0] && dotsBtns[0].classList.add('active');
    startTimer();
    dotsBtns.forEach((dot, i) => dot.addEventListener('click', () => { goToSlide(i); startTimer(); }));
  }

  // ---- Services Carousel ----
  const serviceCards    = document.querySelectorAll('.service-card');
  const carouselDots    = document.querySelectorAll('.carousel-dot');
  const carouselTrack   = document.querySelector('.services-carousel');
  let   serviceIndex    = 0;
  let   serviceTimer;

  function goToService(n) {
    serviceIndex = (n + serviceCards.length) % serviceCards.length;
    if (carouselTrack) carouselTrack.style.transform = `translateX(-${serviceIndex * 100}%)`;
    carouselDots.forEach((d, i) => d.classList.toggle('active', i === serviceIndex));
  }

  function startServiceTimer() {
    clearInterval(serviceTimer);
    serviceTimer = setInterval(() => goToService(serviceIndex + 1), 4000);
  }

  if (carouselDots.length) {
    goToService(0);
    startServiceTimer();
    carouselDots.forEach((dot, i) => dot.addEventListener('click', () => { goToService(i); startServiceTimer(); }));
  }

  // ---- Scroll Animations (IntersectionObserver) ----
  const fadeEls = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    fadeEls.forEach(el => io.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  // ---- Scroll-to-top ----
  const scrollTop = document.getElementById('scroll-top');
  window.addEventListener('scroll', () => {
    scrollTop && scrollTop.classList.toggle('visible', window.scrollY > 400);
  });
  scrollTop && scrollTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ---- Stats Counter ----
  const statNumbers = document.querySelectorAll('.count-up');
  let   counted     = false;

  function countUp() {
    if (counted) return;
    const bar = document.querySelector('.stats-bar');
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      counted = true;
      statNumbers.forEach(el => {
        const end  = parseInt(el.dataset.target, 10);
        const step = Math.ceil(end / 60);
        let   cur  = 0;
        const t = setInterval(() => {
          cur = Math.min(cur + step, end);
          el.textContent = cur + (el.dataset.suffix || '');
          if (cur >= end) clearInterval(t);
        }, 30);
      });
    }
  }
  window.addEventListener('scroll', countUp);
  countUp();

  // ---- Active nav link on scroll ----
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.desktop-nav > li > a[href^="#"]');

  window.addEventListener('scroll', () => {
    let scrollPos = window.scrollY + 120;
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollPos && sec.offsetTop + sec.offsetHeight > scrollPos) {
        navLinks.forEach(a => {
          a.closest('li').classList.toggle('active', a.getAttribute('href') === '#' + sec.id);
        });
      }
    });
  });
});
