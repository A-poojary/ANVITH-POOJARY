document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const loader = document.getElementById("loader");
  const nav = document.getElementById("mainNav");
  const navLinks = [...document.querySelectorAll(".nav-link")];
  const revealElements = [...document.querySelectorAll(".reveal")];
  const skillBars = [...document.querySelectorAll(".skill-progress .progress-bar")];
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const resumeBtn = document.getElementById("resumeBtn");
  const backToTop = document.getElementById("backToTop");

  // -----------------------------
  // Loading screen
  // -----------------------------
  window.addEventListener("load", () => {
    window.setTimeout(() => {
      loader?.classList.add("hidden");
      body.classList.remove("loading");
    }, 550);
  });

  // -----------------------------
  // Navbar state on scroll
  // -----------------------------
  const handleNavScroll = () => {
    nav?.classList.toggle("scrolled", window.scrollY > 20);
  };

  handleNavScroll();
  window.addEventListener("scroll", handleNavScroll, { passive: true });

  // -----------------------------
  // Scroll reveal animation
  // -----------------------------
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14 });

  revealElements.forEach((element) => revealObserver.observe(element));

  // -----------------------------
  // Animated skill progress bars
  // -----------------------------
  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const bar = entry.target;
      const progress = bar.dataset.progress || "0";
      bar.style.width = progress + "%";

      observer.unobserve(bar);
    });
  }, { threshold: 0.25 });

  skillBars.forEach((bar) => skillObserver.observe(bar));

  // -----------------------------
  // Active nav section
  // -----------------------------
  const sections = [...document.querySelectorAll("main section[id]")];

  const updateActiveNav = () => {
    const marker = window.scrollY + window.innerHeight * 0.32;
    let currentId = "home";

    sections.forEach((section) => {
      if (section.offsetTop <= marker) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === "#" + currentId;
      link.classList.toggle("active", isActive);
    });
  };

  updateActiveNav();
  window.addEventListener("scroll", updateActiveNav, { passive: true });

  // -----------------------------
  // Close mobile menu after click
  // -----------------------------
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const collapseElement = document.getElementById("navbarNav");
      if (!collapseElement || window.innerWidth >= 992) return;

      const collapse = bootstrap.Collapse.getInstance(collapseElement)
        || new bootstrap.Collapse(collapseElement, { toggle: false });

      collapse.hide();
    });
  });

  // -----------------------------
  // Resume generation
  // Opens a printable, clean resume in a new window.
  // -----------------------------
  resumeBtn?.addEventListener("click", () => {
    const resumeWindow = window.open("", "_blank", "width=900,height=900");

    if (!resumeWindow) {
      alert("Please allow pop-ups for this website to generate the resume.");
      return;
    }

    const resumeHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ANVITH POOJARY — Resume</title>
        <style>
          body {
            font-family: Arial, Helvetica, sans-serif;
            margin: 0;
            padding: 42px;
            color: #172033;
            line-height: 1.55;
          }
          .header {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            border-bottom: 2px solid #6d5dfc;
            padding-bottom: 18px;
          }
          h1 { margin: 0 0 6px; font-size: 32px; }
          h2 {
            margin: 26px 0 8px;
            font-size: 17px;
            color: #4f3fe0;
            text-transform: uppercase;
            letter-spacing: .08em;
          }
          .muted { color: #5b657b; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 30px; }
          .item strong { display: block; margin-bottom: 2px; }
          ul { margin-top: 8px; padding-left: 18px; }
          .print-note {
            margin-top: 28px;
            padding: 12px 15px;
            background: #f4f3ff;
            border-radius: 8px;
            font-size: 12px;
          }
          @media print {
            .print-note { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>ANVITH POOJARY</h1>
            <div class="muted">VLSI (Design & Technology) Student</div>
          </div>
          <div class="muted" style="text-align:right;">
            anvithpoojari1721@gmail.com<br>
            +91 7026412717
          </div>
        </div>

        <h2>Profile</h2>
        <p>
          Engineering student interested in coding, software development,
          problem-solving, VLSI, and building innovative technology projects.
        </p>

        <h2>Education</h2>
        <div class="grid">
          <div class="item">
            <strong>B.E. — VLSI Design & Technology</strong>
            <span class="muted">ST Joseph Engineering College, Mangalore · 3rd Semester</span>
          </div>
          <div class="item">
            <strong>PUC</strong>
            <span class="muted">Janatha PU College, Kundapur</span>
          </div>
        </div>

        <h2>Technical Skills</h2>
        <ul>
          <li>Python</li>
          <li>C</li>
          <li>C++</li>
          <li>Advanced C</li>
        </ul>

        <h2>Certificates</h2>
        <ul>
          <li>Google Cloud — Generative AI</li>
          <li>Manipal University — Stellar Hack: A Vibe-a-thon</li>
          <li>Buddy4Study — Psychometric Assessment</li>
          <li>Google — Pitch Night Edition</li>
          <li>ChemAtom Certification</li>
        </ul>

        <h2>Location</h2>
        <p class="muted">Byndoor, Kundapur, Udupi District, Karnataka — 576219</p>

        <div class="print-note">
          Use your browser's Print dialog and choose <strong>Save as PDF</strong>
          to download this resume.
        </div>

        <script>
          window.addEventListener("load", () => setTimeout(() => window.print(), 450));
        </script>
      </body>
      </html>
    `;

    resumeWindow.document.open();
    resumeWindow.document.write(resumeHtml);
    resumeWindow.document.close();
  });

  // -----------------------------
  // Contact form validation
  // Opens the user's email client after successful validation.
  // -----------------------------
  const fields = {
    name: {
      element: document.getElementById("name"),
      validate(value) {
        return value.trim().length >= 2;
      }
    },
    email: {
      element: document.getElementById("email"),
      validate(value) {
        return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(value.trim());
      }
    },
    subject: {
      element: document.getElementById("subject"),
      validate(value) {
        return value.trim().length >= 3;
      }
    },
    message: {
      element: document.getElementById("message"),
      validate(value) {
        return value.trim().length >= 10;
      }
    }
  };

  Object.values(fields).forEach(({ element }) => {
    element?.addEventListener("input", () => {
      element.classList.remove("is-invalid");
      formStatus.textContent = "";
      formStatus.classList.remove("error");
    });
  });

  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.textContent = "";
    formStatus.classList.remove("error");

    let valid = true;

    Object.values(fields).forEach(({ element, validate }) => {
      const isValid = validate(element.value);
      element.classList.toggle("is-invalid", !isValid);
      if (!isValid) valid = false;
    });

    if (!valid) {
      formStatus.textContent = "Please correct the highlighted fields.";
      formStatus.classList.add("error");
      return;
    }

    const name = fields.name.element.value.trim();
    const email = fields.email.element.value.trim();
    const subject = fields.subject.element.value.trim();
    const message = fields.message.element.value.trim();

    const mailSubject = encodeURIComponent(subject);
    const mailBody = encodeURIComponent(
      "Name: " + name + "\n" +
      "Email: " + email + "\n\n" +
      message
    );

    formStatus.textContent = "Validation complete — opening your email app...";
    window.location.href =
      `mailto:anvithpoojari1721@gmail.com?subject=${mailSubject}&body=${mailBody}`;

    contactForm.reset();
    Object.values(fields).forEach(({ element }) => element.classList.remove("is-invalid"));
  });

  // -----------------------------
  // Back to top
  // -----------------------------
  backToTop?.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});