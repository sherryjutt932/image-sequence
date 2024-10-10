document.addEventListener("DOMContentLoaded", () => {
  // Lenis smooth scrolling
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Image sequence scrolling
  const imageContainer = document.getElementById("imageContainer");
  const scrollText = document.getElementById("scroll-text");

  const frameCount = 210;
  const currentFrame = (index) =>
    `sequence/${String(index).padStart(5, "0")}.jpg`;

  const preloadImages = () => {
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i + 1);
      img.classList.add("sequence-image");
      img.style.zIndex = i + 1;
      if (i === 0) {
        img.style.opacity = 1; // Set the first image to be visible initially
      }
      imageContainer.appendChild(img);
    }
    setupScrollTrigger();
  };

  const setupScrollTrigger = () => {
    const images = document.querySelectorAll('.sequence-image');
    
    gsap.to(images, {
      opacity: (i, target) => {
        const progress = gsap.utils.wrap(0, 1, i / (frameCount - 1));
        return gsap.utils.interpolate(0, 1, progress);
      },
      ease: "none",
      scrollTrigger: {
        trigger: ".scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.1, // Minimal scrub for responsiveness
        onUpdate: (self) => {
          const frameIndex = Math.round(self.progress * (frameCount - 1));
          images.forEach((img, i) => {
            img.style.opacity = i === frameIndex ? 1 : 0;
          });
        }
      },
    });

    
    // Text opacity animation
    gsap.to(scrollText, {
      opacity: 1,
      scrollTrigger: {
        scrub: true,
        trigger: ".scroll-container",
        start: `+=${160 / (frameCount - 1) * 100}%`,
        end: `+=${frameCount - 10 / (frameCount - 1) * 100}%`,
      },
    });
  };

  preloadImages();
});