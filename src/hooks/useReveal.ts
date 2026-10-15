import { useEffect } from 'react';

/**
 * Shared IntersectionObserver for fast, lightweight fade-up reveal on scroll.
 * Observes all elements with class 'reveal-init' and adds 'reveal-active'.
 * Automatically respects prefers-reduced-motion.
 */
export function useReveal() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elements = document.querySelectorAll('.reveal-init');

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('reveal-active'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-active');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '60px 0px 20px 0px',
        threshold: 0.01,
      }
    );

    elements.forEach((el) => observer.observe(el));

    // Dynamic MutationObserver to catch any elements mounted post-hydration or during category switches
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.classList.contains('reveal-init') && !node.classList.contains('reveal-active')) {
              observer.observe(node);
            }
            node.querySelectorAll?.('.reveal-init:not(.reveal-active)').forEach((child) => {
              observer.observe(child);
            });
          }
        });
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}
