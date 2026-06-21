document.addEventListener("DOMContentLoaded", () => {
    const steps = document.querySelectorAll('.step');
    const pastPhoto = document.getElementById('photo-past');
    const presentPhoto = document.getElementById('photo-present');

    if (!presentPhoto || steps.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.2
    };

    const handleStepChange = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                const stepIndex = parseInt(entry.target.getAttribute('data-step'));

                if (stepIndex === 1) {
                    presentPhoto.src = "images/Present.png";
                    presentPhoto.style.opacity = "1";
                } else if (stepIndex === 2) {
                    presentPhoto.style.opacity = "0";
                    if (pastPhoto) pastPhoto.src = "images/Past.png";
                }
            } else {
                entry.target.classList.remove('active');
            }
        });
    };

    const observer = new IntersectionObserver(handleStepChange, observerOptions);
    steps.forEach(step => observer.observe(step));
});