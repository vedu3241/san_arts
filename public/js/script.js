document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS animation library
  AOS.init({
    duration: 900, // Using the higher duration value
    easing: "ease-in-out",
    once: true,
  });

  // Optional: Lazy load testimonials for a staggered effect
  const testimonials = document.querySelectorAll(".testimonial-card");
  if (testimonials.length > 0) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fadeIn");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    testimonials.forEach((card) => observer.observe(card));
  }

  // Form validation and animation
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", function (e) {  
      const formElements = Array.from(this.elements);
      let hasError = false;

      formElements.forEach((el) => {
        if (el.hasAttribute("required") && !el.value.trim()) {
          e.preventDefault();
          hasError = true;
          el.classList.add("border-red-500", "animate-shake");

          // Remove animation class after animation completes
          setTimeout(() => el.classList.remove("animate-shake"), 500);
        } else if (el.hasAttribute("required")) {
          el.classList.remove("border-red-500");
        }
      });

      if (!hasError) {
        // Show success animation on button
        const button = form.querySelector('button[type="submit"]');
        if (button) {
          button.innerHTML = `
              <span class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>`;
        }
      }
    });

    // Real-time validation feedback
    const inputs = form.querySelectorAll("input[required], textarea[required]");
    inputs.forEach((input) => {
      input.addEventListener("blur", function () {
        this.classList.toggle("border-red-500", !this.value.trim());
      });

      input.addEventListener("input", function () {
        this.classList.remove("border-red-500");
      });
    });
  }
});
