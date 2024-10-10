document.addEventListener("DOMContentLoaded", () => {
    // Lenis smooth scrolling
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 700);
    });
    gsap.ticker.lagSmoothing(0);
  
    // Image sequence scrolling
    const canvas = document.getElementById("sequence-canvas");
    const ctx = canvas.getContext("2d");
    const scrollText = document.getElementById("scroll-text");
  
    const frameCount = 210;
    const currentFrame = (index) =>
      `sequence/${String(index).padStart(5, "0")}.jpg`;
  
    const images = [];
    const imageSeq = {
      frame: 0,
    };
  
    // Preload images and set up canvas once all images are loaded
    const preloadImages = () => {
      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i + 1);
        img.onload = () => {
          images.push(img);
          if (images.length === frameCount) {
            console.log("All images loaded");
            setupCanvas();
            setupScrollTrigger();
          }
        };
        img.onerror = () => {
          console.error(`Failed to load image: ${currentFrame(i + 1)}`);
        };
      }
    };
  
    const setupCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render();
    };
  
    const setupScrollTrigger = () => {
      gsap.to(imageSeq, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
          scrub: 0.15,
          trigger: ".scroll-container",
          start: "top top",
          end: "bottom bottom",
          scroller: "body",
        },
        onUpdate: render,
      });
  
      // Text opacity animation
      gsap.to(scrollText, {
        opacity: 1,
        scrollTrigger: {
          scrub: true,
          trigger: ".scroll-container",
          start: `+=${160 / (frameCount - 1) * 100}%`,
          end: `+=${frameCount - 10 / (frameCount - 1) * 100}%`,
          scroller: "body",
        },
      });
    };
  
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const img = images[imageSeq.frame];
      if (img) {
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      }
    }
  
    // Handle window resize
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render();
    });
  
    preloadImages();
  });