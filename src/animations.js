import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function animateHero() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.fromTo('[data-animate="hero-sub"]', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 });
  tl.fromTo('[data-animate="hero-title"] .ani-line span', { y: '100%' }, { y: '0%', stagger: 0.12, duration: 0.9 }, '-=0.3');
  tl.fromTo('[data-animate="hero-desc"]', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.5');
  tl.fromTo('[data-animate="hero-cta"]', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.3');
  tl.fromTo('[data-animate="hero-right"]', { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, ease: 'power2.out' }, '-=0.5');
  return tl;
}

export function animateNumbers() {
  document.querySelectorAll('[data-count]').forEach(function(el) {
    var target = parseFloat(el.dataset.count);
    var suffix = el.dataset.suffix || '';
    if (isNaN(target) || target <= 0) return;
    var usesW = suffix.indexOf('w') !== -1;
    var obj = { val: 0 };
    gsap.to(obj, {
      val: target, duration: 2.2, ease: 'power3.out',
      onUpdate: function() {
        var v = Math.floor(obj.val);
        if (usesW && target >= 10000) {
          el.textContent = (v / 10000).toFixed(target % 1 !== 0 ? 1 : 0) + suffix;
        } else {
          el.textContent = v.toLocaleString() + suffix;
        }
      },
      scrollTrigger: { trigger: el.closest('section') || el.parentElement, start: 'top 80%', toggleActions: 'play none none reset' }
    });
  });
}

export function animateSectionLabels() {
  gsap.utils.toArray('[data-animate="section-label"]').forEach(function(el) {
    gsap.fromTo(el, { x: -80, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el.closest('section'), start: 'top 80%', toggleActions: 'play none none reverse' }
    });
  });
}

export function animateCards() {
  gsap.utils.toArray('[data-animate="card"]').forEach(function(el, i) {
    gsap.fromTo(el, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: i * 0.12,
      scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' }
    });
  });
}

export function animateParallax() {
  gsap.utils.toArray('[data-animate="parallax"]').forEach(function(el) {
    var img = el.querySelector('img');
    if (!img) return;
    gsap.fromTo(el, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 1, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
    });
    gsap.fromTo(img, { y: -30 }, { y: 30, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 }
    });
  });
}

export function animateTimeline() {
  gsap.utils.toArray('[data-animate="timeline"]').forEach(function(el, i) {
    gsap.fromTo(el, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'power2.out', delay: i * 0.15,
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
    });
  });
}

export function animateTags() {
  gsap.utils.toArray('[data-animate="tag"]').forEach(function(el, i) {
    gsap.fromTo(el, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.4)', delay: i * 0.06,
      scrollTrigger: { trigger: el.closest('section'), start: 'top 80%', toggleActions: 'play none none reverse' }
    });
  });
}

export function initAnimations() {
  var ctx = gsap.context(function() {
    animateHero();
    animateNumbers();
    animateSectionLabels();
    animateCards();
    animateParallax();
    animateTimeline();
    animateTags();
  });
  ScrollTrigger.refresh();
  return ctx;
}
