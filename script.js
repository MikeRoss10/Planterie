// ---- Booking modal (Book Now flow) ----
// Wired up first and defensively, so nothing else on the page can block it.
(function setupBooking() {
  const bookNowButton = document.querySelector("#bookNowButton");
  const bookingOverlay = document.querySelector("#bookingOverlay");
  const bookingClose = document.querySelector("#bookingClose");
  const bookingDate = document.querySelector("#bookingDate");
  const bookingTime = document.querySelector("#bookingTime");
  const bookingError = document.querySelector("#bookingError");
  const bookingConfirmButton = document.querySelector("#bookingConfirmButton");
  const bookingStepForm = document.querySelector("#bookingStepForm");
  const bookingStepSuccess = document.querySelector("#bookingStepSuccess");
  const bookingSummary = document.querySelector("#bookingSummary");
  const bookingDoneButton = document.querySelector("#bookingDoneButton");
  const quantityInputRef = document.querySelector("#quantity");

  if (!bookNowButton || !bookingOverlay) return;

  try {
    const todayIso = new Date().toISOString().split("T")[0];
    if (bookingDate) bookingDate.min = todayIso;
  } catch (err) {
    console.error("Booking date init failed:", err);
  }

  const openBooking = () => {
    bookingOverlay.hidden = false;
    if (bookingStepForm) bookingStepForm.hidden = false;
    if (bookingStepSuccess) bookingStepSuccess.hidden = true;
    if (bookingError) bookingError.hidden = true;
    document.body.style.overflow = "hidden";
  };

  const closeBooking = () => {
    bookingOverlay.hidden = true;
    document.body.style.overflow = "";
  };

  bookNowButton.addEventListener("click", openBooking);

  if (bookingClose) {
    bookingClose.addEventListener("click", closeBooking);
  }

  bookingOverlay.addEventListener("click", (event) => {
    if (event.target === bookingOverlay) closeBooking();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !bookingOverlay.hidden) closeBooking();
  });

  if (bookingConfirmButton) {
    bookingConfirmButton.addEventListener("click", () => {
      const dateValue = bookingDate ? bookingDate.value : "";
      const timeValue = bookingTime ? bookingTime.value : "";

      if (!dateValue || !timeValue) {
        if (bookingError) bookingError.hidden = false;
        return;
      }

      if (bookingError) bookingError.hidden = true;

      const quantity = quantityInputRef ? Number.parseInt(quantityInputRef.value, 10) || 1 : 1;
      let formattedDate = dateValue;
      try {
        formattedDate = new Date(`${dateValue}T00:00:00`).toLocaleDateString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      } catch (err) {
        console.error("Date formatting failed:", err);
      }

      if (bookingSummary) {
        bookingSummary.textContent = `${formattedDate} at ${timeValue} for ${quantity} ${quantity > 1 ? "people" : "person"}.`;
      }
      if (bookingStepForm) bookingStepForm.hidden = true;
      if (bookingStepSuccess) bookingStepSuccess.hidden = false;
    });
  }

  if (bookingDoneButton) {
    bookingDoneButton.addEventListener("click", closeBooking);
  }
})();

// ---- Hero gallery tilt ----
(function setupTilt() {
  const mediaFrame = document.querySelector("#mediaFrame");
  const mediaTilt = document.querySelector("#mediaTilt");
  if (!mediaFrame || !mediaTilt) return;

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
})();

// ---- Thumbnail gallery ----
(function setupGallery() {
  const mainImage = document.querySelector(".main-image");
  const imageCount = document.querySelector(".image-count");
  const thumbs = [...document.querySelectorAll(".thumb")];
  if (!mainImage || thumbs.length === 0) return;

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener("click", () => {
      thumbs.forEach((item) => item.classList.remove("is-active"));
      thumb.classList.add("is-active");
      mainImage.classList.add("is-swapping");
      window.setTimeout(() => {
        mainImage.src = thumb.dataset.image;
        mainImage.alt = thumb.dataset.alt;
        if (imageCount) imageCount.textContent = `${index + 1}/${thumbs.length}`;
        mainImage.classList.remove("is-swapping");
      }, 140);
    });
  });
})();

// ---- Quantity stepper ----
(function setupQuantity() {
  const quantityInput = document.querySelector("#quantity");
  if (!quantityInput) return;

  document.querySelectorAll(".quantity-button").forEach((button) => {
    button.addEventListener("click", () => {
      const step = Number(button.dataset.step);
      const current = Number.parseInt(quantityInput.value, 10) || 1;
      quantityInput.value = Math.max(1, current + step);
    });
  });
})();

// ---- Accordions ----
(function setupAccordions() {
  document.querySelectorAll(".accordion > button").forEach((button) => {
    button.addEventListener("click", () => {
      const accordion = button.closest(".accordion");
      if (!accordion) return;
      const expanded = accordion.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(expanded));
    });
  });
})();

// ---- Prevent legacy form submit ----
(function setupPurchasePanel() {
  const purchasePanel = document.querySelector(".purchase-panel");
  if (!purchasePanel) return;
  purchasePanel.addEventListener("submit", (event) => {
    event.preventDefault();
  });
})();

// ---- Butterflies drifting on scroll ----
(function setupButterflies() {
  const butterflies = [...document.querySelectorAll(".butterfly")];
  const storySection = document.querySelector(".image-story");
  if (butterflies.length === 0 || !storySection) return;

  const updateButterflies = () => {
    const scrollY = window.scrollY;
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

  updateButterflies();

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        updateButterflies();
        ticking = false;
      });
    },
    { passive: true }
  );
})();

// ---- Reveal-on-scroll ----
(function setupReveal() {
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length === 0) return;

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

  revealEls.forEach((element) => revealObserver.observe(element));
})();
