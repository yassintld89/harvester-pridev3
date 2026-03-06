const header = document.getElementById("header");
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
const sections = Array.from(document.querySelectorAll('main section[id]'));

function closeNav() {
  if (!nav || !burger) return;
  nav.classList.remove("open");
  burger.setAttribute("aria-expanded", "false");
}

if (burger && nav) {
  burger.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (!nav.contains(target) && !burger.contains(target)) {
      closeNav();
    }
  });

  navLinks.forEach((link) => link.addEventListener("click", closeNav));
}

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 10);
}

function updateActiveLink() {
  if (!sections.length) return;
  const offset = window.scrollY + (header ? header.offsetHeight + 160 : 160);
  let currentId = sections[0].id;

  sections.forEach((section) => {
    if (offset >= section.offsetTop) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
  });
}

const revealItems = Array.from(document.querySelectorAll(".reveal"));
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -6% 0px"
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

window.addEventListener(
  "scroll",
  () => {
    updateHeader();
    updateActiveLink();
  },
  { passive: true }
);

window.addEventListener("resize", updateActiveLink);

updateHeader();
updateActiveLink();

const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}

function openMail(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const name = formData.get("name") || "";
  const company = formData.get("company") || "";
  const email = formData.get("email") || "";
  const destination = formData.get("destination") || "";
  const message = formData.get("message") || "";

  const subject = encodeURIComponent("Harvester Pride | Quote Request");
  const body = encodeURIComponent(
    [
      `Name: ${name}`,
      `Company: ${company}`,
      `Email: ${email}`,
      `Destination: ${destination}`,
      "",
      "Message:",
      `${message}`
    ].join("\n")
  );

  window.location.href = `mailto:info@harvesterpride.com?subject=${subject}&body=${body}`;
  return false;
}

window.openMail = openMail;
