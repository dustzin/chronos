// CHRONOS | Animation and Logic (GSAP + ScrollTrigger)

document.addEventListener("DOMContentLoaded", (event) => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // ==========================================
    // 0. NAVBAR SCROLL LOGIC
    // ==========================================
    let lastScroll = 0;
    const navbar = document.getElementById("navbar");
    window.addEventListener("scroll", () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 100 && currentScroll > lastScroll) {
            navbar.classList.add("nav-hidden");
        } else {
            navbar.classList.remove("nav-hidden");
        }
        lastScroll = currentScroll;
    });

    // ==========================================
    // 1. SCROLL PROGRESS
    // ==========================================
    gsap.to("#scroll-progress", {
        width: "100%",
        ease: "none",
        scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: true
        }
    });

    // ==========================================
    // 2. REVEAL TEXT (Staggered Entry)
    // ==========================================
    const revealElements = document.querySelectorAll(".reveal-text");
    revealElements.forEach(element => {
        let delay = element.classList.contains("delay-1") ? 0.3 : 0;
        gsap.to(element, {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            delay: delay,
            scrollTrigger: {
                trigger: element,
                start: "top 85%", // Trigger when top of element is at 85% of viewport
                toggleActions: "play none none reverse" // Play on enter, reverse on leave back
            }
        });
    });

    // ==========================================
    // 3. COLOR SELECTOR (IMAGE FADE & TILT)
    // ==========================================
    const colorButtons = document.querySelectorAll(".color-btn");
    const colorLabel = document.getElementById("color-name-display");
    const watermarkCover = document.getElementById("watermark-cover");
    const showcaseContainer = document.getElementById("product-showcase");
    const showcaseImg = document.getElementById("showcase-img");
    const designGlow = document.querySelector(".design-glow");

    colorButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Already active? Ignore
            if (btn.classList.contains("active")) return;
            
            // Remove active class from all
            colorButtons.forEach(b => b.classList.remove("active"));
            // Add to clicked
            btn.classList.add("active");
            
            const colorName = btn.getAttribute("aria-label");
            
            // Update Label & Watermark Cover
            if(colorLabel) colorLabel.textContent = colorName;
            if(watermarkCover) watermarkCover.textContent = colorName;
            
            // 1. Cross-fade Magico (Image Opacity)
            const newImageSrc = btn.getAttribute("data-image");
            if (showcaseImg && newImageSrc) {
                // Fade out
                gsap.to(showcaseImg, { 
                    opacity: 0, 
                    duration: 0.2, 
                    ease: "power2.inOut",
                    onComplete: () => {
                        showcaseImg.src = newImageSrc;
                        // Fade back in
                        gsap.to(showcaseImg, { opacity: 1, duration: 0.2, ease: "power2.inOut" });
                    }
                });
            }
            
            // 2. Atmosfera Cromática (Radial Gradient overlay)
            const newColor = btn.getAttribute("data-color");
            if (designGlow && newColor) {
                gsap.to(designGlow, { 
                    backgroundImage: `radial-gradient(circle at center, ${newColor} 0%, transparent 60%)`, 
                    duration: 1.5, 
                    ease: "power2.out" 
                });
            }
        });
    });

    // 3. Efeito de Tilt (Illusory 3D)
    if (showcaseContainer && showcaseImg) {
        showcaseContainer.addEventListener("mousemove", (e) => {
            const rect = showcaseContainer.getBoundingClientRect();
            // Posição x/y do mouse em relação ao centro do container (-1 a 1)
            const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
            const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
            
            // Calcula ângulos de rotação (ajuste o 10 para aumentar/diminuir o efeito)
            const tiltX = -y * 12; // Invertido para movimento natural
            const tiltY = x * 12;

            gsap.to(showcaseImg, {
                rotationX: tiltX,
                rotationY: tiltY,
                transformPerspective: 1000,
                transformOrigin: "center center",
                ease: "power0.none",
                duration: 0.3 // Responsividade rápida mas não instantânea
            });
        });

        // Quando o mouse sair, volta ao normal
        showcaseContainer.addEventListener("mouseleave", () => {
            gsap.to(showcaseImg, {
                rotationX: 0,
                rotationY: 0,
                ease: "power3.out",
                duration: 0.8
            });
        });
    }

    // ==========================================
    // 4. BENTO CARDS REVEAL
    // ==========================================
    const bentoCards = document.querySelectorAll(".bento-layout .card");
    gsap.fromTo(bentoCards, 
        { y: 50, opacity: 0 },
        { 
            y: 0, 
            opacity: 1, 
            duration: 1, 
            stagger: 0.15, 
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".bento-layout",
                start: "top 80%",
            }
        }
    );

    // ==========================================
    // 5. NEURO-ACCORDION (FAQ)
    // ==========================================
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        const question = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");
        const inner = item.querySelector(".faq-answer-inner");
        
        question.addEventListener("click", () => {
            const isActive = item.classList.contains("active");
            
            // Close all others
            faqItems.forEach(otherItem => {
                otherItem.classList.remove("active");
                otherItem.style.backgroundColor = "transparent";
                gsap.to(otherItem.querySelector(".faq-answer"), { height: 0, duration: 0.4, ease: "power2.inOut" });
                gsap.to(otherItem.querySelector(".faq-answer-inner"), { y: 20, opacity: 0, duration: 0.3 });
            });
            
            if (!isActive) {
                // Open this one
                item.classList.add("active");
                item.style.backgroundColor = "rgba(255, 255, 255, 0.03)";
                
                // Measure auto height
                gsap.set(answer, { height: "auto" });
                const fullHeight = answer.offsetHeight;
                gsap.set(answer, { height: 0 }); // reset back
                
                // Animate to full height
                gsap.to(answer, { height: fullHeight, duration: 0.5, ease: "power2.out" });
                // Animate text sliding up
                gsap.to(inner, { y: 0, opacity: 1, duration: 0.5, delay: 0.1, ease: "power2.out" });
            }
        });
    });

    // ==========================================
    // 6. HERO PARALLAX
    // ==========================================
    // Subtle parallax on the hero orb
    gsap.to(".glow-orb", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: 1
        }
    });

    // ==========================================
    // 7. THE PROBLEM TEXT COLOR CHANGE
    // ==========================================
    // Transiciona para um cinza muito claro (#F2F2F7) "ofuscante" suavemente ao entrar, 
    // mas ao voltar (sair pelo topo) ou descer para a proxima secao corta seco (snap back).
    gsap.to(".problem-section", {
        backgroundColor: "#F2F2F7",
        color: "#050505", // Text goes dark to contrast with light bg
        scrollTrigger: {
            trigger: ".problem-section",
            start: "top center",
            end: "bottom center",
            toggleActions: "play reset play reset", // Play when enter, reset when leave (hard cut back to black)
            scrub: false // We use scrub: false and a transition duration internally, or duration here
        },
        duration: 2.5,
        ease: "power2.inOut"
    });

    gsap.to(".problem-subtext", {
        color: "#525252",
        scrollTrigger: {
            trigger: ".problem-section",
            start: "top center",
            end: "bottom center",
            toggleActions: "play reset play reset",
        },
        duration: 2.5,
        ease: "power2.inOut"
    });

    // ==========================================
    // 8. MACRO FABRIC BLOCK (TEXTURE PARALLAX)
    // ==========================================
    // Moves 10% slower than scroll
    gsap.to(".texture-video", {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
            trigger: ".texture-section",
            start: "top bottom",
            end: "bottom top",
            scrub: 1
        }
    });

    // ==========================================
    // 9. VIDEO LAZY LOADING
    // ==========================================
    const lazyVideos = document.querySelectorAll('.lazy-video');
    const videoObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                if(video.dataset.src) {
                    video.src = video.dataset.src;
                    video.load();
                    // Playback will happen via the autoplay attribute / promise playing
                    video.play().catch(e => {
                        // Handle un-autoplaying browser policies just in case
                        console.warn('Autoplay prevented:', e);
                    });
                    video.classList.remove('lazy-video');
                    observer.unobserve(video);
                }
            }
        });
    }, { rootMargin: '0px 0px 400px 0px' }); // Load a bit before it comes into view

    lazyVideos.forEach(v => videoObserver.observe(v));
});
