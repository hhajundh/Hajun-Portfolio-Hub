"use strict";

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-nav");

function setMenuOpen(open) {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
  navigation.classList.toggle("is-open", open);
}

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  setMenuOpen(!isOpen);
});

navigation?.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenuOpen(false);
});

const dialogBackdrop = document.querySelector("[data-project-dialog]");
const projectDialog = dialogBackdrop?.querySelector('[role="dialog"]');
const openProjectButton = document.querySelector("[data-open-project]");
const closeProjectButton = document.querySelector("[data-close-project]");
let previousFocus = null;

function openProjectDialog() {
  if (!dialogBackdrop || !projectDialog) return;
  previousFocus = document.activeElement;
  dialogBackdrop.classList.add("is-open");
  dialogBackdrop.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  closeProjectButton?.focus();
}

function closeProjectDialog() {
  if (!dialogBackdrop || !projectDialog) return;
  dialogBackdrop.classList.remove("is-open");
  dialogBackdrop.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (previousFocus instanceof HTMLElement) previousFocus.focus();
}

openProjectButton?.addEventListener("click", openProjectDialog);
closeProjectButton?.addEventListener("click", closeProjectDialog);

dialogBackdrop?.addEventListener("click", (event) => {
  if (event.target === dialogBackdrop) closeProjectDialog();
});

document.addEventListener("keydown", (event) => {
  if (!dialogBackdrop?.classList.contains("is-open")) return;
  if (event.key === "Escape") {
    closeProjectDialog();
    return;
  }
  if (event.key !== "Tab" || !projectDialog) return;

  const focusableElements = [...projectDialog.querySelectorAll(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )];
  if (focusableElements.length === 0) return;
  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = String(new Date().getFullYear());

const sections = [...document.querySelectorAll("main section[id]")];
const sectionLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((link) => {
        if (link.getAttribute("href") === `#${entry.target.id}`) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  sections.forEach((section) => sectionObserver.observe(section));
}
