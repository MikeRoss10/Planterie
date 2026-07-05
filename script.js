const mainImage = document.querySelector(".main-image");
const imageCount = document.querySelector(".image-count");
const thumbs = [...document.querySelectorAll(".thumb")];
const quantityInput = document.querySelector("#quantity");
const cartButton = document.querySelector(".cart-button");
const butterflies = [...document.querySelectorAll(".butterfly")];
const storySection = document.querySelector(".image-story");
const mediaFrame = document.querySelector("#mediaFrame");
const mediaTilt = document.querySelector("#mediaTilt");

if (mediaFrame && mediaTilt) {
  mediaFrame.addEventListener("mousemove", (event) => {
    const rect = mediaFrame.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    const rotateY = x * 14;
    const rotateX = y * -14;
    mediaTilt.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  });

  mediaFrame.addEventListener("mouseleave", () => {
    mediaTilt.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
  });
}

thumbs.forEach((thumb, index) => {
  thumb.addEventListener("click", () => {
    thumbs.forEach((item) => item.classList.remove("is-active"));
    thumb.classList.add("is-active");
    mainImage.classList.add("is-swapping");
    window.setTimeout(() => {
      mainImage.src = thumb.dataset.image;
      mainImage.alt = thumb.dataset.alt;
      imageCount.textContent = `${index + 1}/${thumbs.length}`;
      mainImage.classList.remove("is-swapping");
    }, 140);
  });
});

document.querySelectorAll(".quantity-button").forEach((button) => {
  button.addEventListener("click", () => {
    const step = Number(button.dataset.step);
    const current = Number.parseInt(quantityInput.value, 10) || 1;
    quantityInput.value = Math.max(1, current + step);
  });
});

document.querySelectorAll(".accordion > button").forEach((button) => {
  button.addEventListener("click", () => {
    const accordion = button.closest(".accordion");
    const expanded = accordion.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(expanded));
  });
});

document.querySelector(".purchase-panel").addEventListener("submit", (event) => {
  event.preventDefault();
  const quantity = Number.parseInt(quantityInput.value, 10) || 1;
  cartButton.textContent = `Added to cart (${quantity})`;
  window.setTimeout(() => {
    cartButton.textContent = "Add to cart";
  }, 1400);
});

const updateButterflies = () => {
  const scrollY = window.scrollY;

  if (!storySection) return;

  const start = storySection.offsetTop - window.innerHeight * 0.68;
  const travel = Math.max(1, document.documentElement.scrollHeight - start - window.innerHeight * 0.2);
  const rawProgress = (scrollY - start) / travel;
  const butterflyProgress = Math.min(1, Math.max(0, rawProgress));

  butterflies.forEach((butterfly, index) => {
    const sideOffset = index === 0 ? -72 : -142;
    const x = sideOffset + butterflyProgress * (window.innerWidth + 210 + index * 80);
    const wave = Math.sin(butterflyProgress * Math.PI * (3.6 + index) + index * 1.4);
    const y = window.innerHeight * (0.34 + index * 0.18) + wave * 82;
    const opacity = butterflyProgress <= 0 ? 0 : Math.max(0, Math.min(0.9, 1 - Math.abs(butterflyProgress - 0.54) * 1.6));
    const scale = 0.78 + Math.sin(butterflyProgress * Math.PI) * 0.38 - index * 0.08;

    butterfly.style.setProperty("--butterfly-x", `${x}px`);
    butterfly.style.setProperty("--butterfly-y", `${y}px`);
    butterfly.style.setProperty("--butterfly-opacity", opacity.toFixed(2));
    butterfly.style.setProperty("--butterfly-scale", scale.toFixed(2));
  });
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

updateButterflies();
window.addEventListener("scroll", updateButterflies, { passive: true });
