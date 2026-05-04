document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".site-header");
    const fadeItems = document.querySelectorAll(".fade-in");
    const backToTop = document.querySelector(".back-to-top");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: "0px 0px -40px 0px",
        }
    );

    fadeItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 70}ms`;
        observer.observe(item);
    });

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (event) => {
            const target = document.querySelector(anchor.getAttribute("href"));
            if (!target) {
                return;
            }

            event.preventDefault();
            target.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });
    });

    const updateScrollState = () => {
        header.classList.toggle("is-scrolled", window.scrollY > 24);
        if (backToTop) {
            backToTop.classList.toggle("visible", window.scrollY > 120);
        }
    };

    window.addEventListener("scroll", updateScrollState);
    updateScrollState();
});
