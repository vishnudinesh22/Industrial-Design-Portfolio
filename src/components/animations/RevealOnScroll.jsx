import { useEffect, useRef } from 'react';
import useReducedMotion from '../../hooks/useReducedMotion';
import { motionSettings } from './motionSettings';

export function useEntranceAnimations(sectionId) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (reducedMotion || !ref.current) return;
    const root = ref.current;
    const animations = [];
    function pop(element, delay = 0, hero = false) {
      if (!element?.animate) return;
      // Individual transforms preserve the original artwork's rotation and geometry.
      const animation = element.animate([
        { opacity: 0, translate: '0 '+(hero ? 24 : 16)+'px', scale: hero ? '.9' : '.97' },
        { opacity: 1, translate: '0 -2px', scale: hero ? '1.015' : '1.005', offset: .75 },
        { opacity: 1, translate: '0 0', scale: '1' },
      ], { duration: hero ? motionSettings.heroDuration : motionSettings.revealDuration, delay, easing: motionSettings.ease, fill: 'backwards' });
      animations.push(animation);
      animation.addEventListener('finish', () => animation.cancel(), { once: true });
    }
    if (sectionId === 'hero') {
      pop(root.querySelector('h1'), motionSettings.heroDelay, true);
      root.querySelectorAll('[data-node-id="180:135"],[data-node-id="178:121"]').forEach((element, index) => pop(element, 240 + index * motionSettings.heroStagger, true));
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { pop(entry.target, Number(entry.target.dataset.popDelay) || 0); observer.unobserve(entry.target); } });
    }, { threshold: .15 });
    const targets = root.querySelectorAll('.content-container>h2,.content-container>.layout-row:not(:has(.project-card)),.project-card,.mobile-about-top,[data-node-id="150:16"],[data-node-id="159:2"],[data-node-id="354:63"]');
    targets.forEach((element, index) => {
      element.dataset.popDelay = element.classList.contains('project-card') ? String((index % 3) * motionSettings.cardStagger) : '0';
      observer.observe(element);
    });
    return () => { observer.disconnect(); animations.forEach(animation => animation.cancel()); };
  }, [sectionId, reducedMotion]);
  return ref;
}
