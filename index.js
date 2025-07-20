(() => {
  window.bouzoukiOptions = {
    tuning: "D,A,F,C",
    defaultTonic: "D",
  };

  const mainContainer = document.getElementById("main-container");
  const sections = Array.from(mainContainer.children);
  const sidebar = document.querySelector("sidebar-element");
  const navbarTitle = document.getElementById("navbar-title");

  function showSection(sectionId) {
    sections.forEach((section) => {
      const isActive = section.id === sectionId;
      if (!isActive) {
        const firstChild = section.firstElementChild;
        if (typeof firstChild?.stop === "function") {
          firstChild.stop();
        }
      }
      section.classList.toggle("d-none", !isActive);
    });
  }

  sidebar.addEventListener("sectionSelected", (event) => {
    const { section, title } = event.detail;
    showSection(section);
    if (navbarTitle) {
      navbarTitle.textContent = title;
    }
  });

  // Fire the initial sectionSelected event and show first section
  const firstLink = sidebar.querySelector('a[data-section="scales-list-container"]');
  const firstTitle = firstLink ? firstLink.textContent.trim() : "Δρόμοι";
  sidebar.dispatchEvent(
    new CustomEvent("sectionSelected", {
      detail: { section: "scales-list-container", title: firstTitle },
      bubbles: true,
      composed: true,
    })
  );
})();
