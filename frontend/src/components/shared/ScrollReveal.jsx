import { useEffect } from "react";

const REVEAL_SELECTOR = ["main:not(.home-page) section", ".home-page > section:not(.hero)", ".property-card", ".project-card", ".agent-card", ".blog-card", ".category", ".why-item", ".amenity-tile", ".location-card", ".contact-card", ".auth-card", ".empty-state", ".not-found-content", ".placeholder-card"].join(",");

/** One lightweight observer for all current and asynchronously rendered page content. */
export default function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const homeElements = document.querySelectorAll(".home-page .reveal-ready, footer .reveal-ready");
    homeElements.forEach((element) => {
      element.classList.remove("reveal-ready", "is-revealed");
      element.style.removeProperty("--reveal-delay");
    });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.2 });
    const register = (scope = document) => {
      scope.querySelectorAll(REVEAL_SELECTOR).forEach((element, index) => {
        const isHomepageSection = element.matches(".home-page > section:not(.hero)");
        if ((element.closest(".home-page") && !isHomepageSection) || element.classList.contains("reveal-ready")) return;
        element.classList.add("reveal-ready");
        element.style.setProperty("--reveal-delay", `${(index % 6) * 60}ms`);
        observer.observe(element);
      });
    };
    register();
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.matches?.(REVEAL_SELECTOR)) register(node.parentElement || document);
          register(node);
        }
      }));
    });
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => { mutations.disconnect(); observer.disconnect(); };
  }, []);
  return null;
}
