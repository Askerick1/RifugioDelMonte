const language = document.querySelector("#language");
const navigation = document.querySelector("#nav");
const toggle = document.querySelector(".toggle");
const booking = document.querySelector("#booking");

function setLanguage(code) {
  const copy = translations[code] || translations.ru;
  document.documentElement.lang = Object.hasOwn(translations, code) ? code : "ru";
  document.title = copy.title;
  document.querySelector('meta[name="description"]').content = copy.description;
  language.value = document.documentElement.lang;
  const map = document.querySelector("#restaurant-map");
  const mapLocale = { ru: "ru_RU", kk: "kk_KZ", en: "en_US" }[language.value];
  map.title = "Rifugio del Monte — " + copy.addressText;
  const mapUrl = "https://yandex.kz/map-widget/v1/?mode=search&ol=biz&oid=44406784025&z=16&lang=" + mapLocale;
  if (map.src !== mapUrl) map.src = mapUrl;
  for (const element of document.querySelectorAll("[data-t]")) element.textContent = copy[element.dataset.t];
  for (const element of document.querySelectorAll("[data-a]")) element.setAttribute("aria-label", copy[element.dataset.a]);
  for (const element of document.querySelectorAll("[data-alt]")) element.alt = copy[element.dataset.alt];
}
function setNavigation(open) {
  navigation.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.querySelector("use").setAttribute("href", open ? "#close" : "#bars");
}
function restoreLanguage() {
  const param = new URL(location.href).searchParams.get("lang");
  setLanguage(["ru", "kk", "en"].includes(param) ? param : "ru");
}
language.addEventListener("change", () => {
  setLanguage(language.value);
  if (location.protocol !== "file:") {
    const url = new URL(location.href);
    url.searchParams.set("lang", language.value);
    history.replaceState(null, "", url);
  }
});
toggle.addEventListener("click", () => setNavigation(toggle.getAttribute("aria-expanded") === "false"));
navigation.addEventListener("click", () => setNavigation(false));
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && navigation.classList.contains("open")) {
    setNavigation(false);
    toggle.focus();
  }
});
document.addEventListener("click", event => {
  if (!event.target.closest(".header")) setNavigation(false);
});
for (const button of document.querySelectorAll("[data-book]")) {
  button.addEventListener("click", () => {
    setNavigation(false);
    booking.showModal();
  });
}
document.querySelector("[data-close]").addEventListener("click", () => booking.close());
booking.addEventListener("click", event => {
  if (event.target !== booking) return;
  const bounds = booking.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) booking.close();
});
window.addEventListener("popstate", restoreLanguage);
restoreLanguage();
