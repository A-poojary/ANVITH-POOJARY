/* Portfolio interactions: loading state, scroll reveal, navigation, and form validation. */
(function () {
  'use strict';

  const pageLoader = document.getElementById('pageLoader');
  const navbar = document.getElementById('mainNav');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const revealItems = document.querySelectorAll('[data-reveal]');
  const sections = document.querySelectorAll('main section[id]');
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const downloadResume = document.getElementById('downloadResume');
  const shareButton = document.getElementById('shareButton');

  // Let the browser paint the page before removing the loading screen.
  window.addEventListener('load', function () {
    window.setTimeout(function () {
      pageLoader.classList.add('is-hidden');
    }, 450);
  });

  // Reveal content as it enters the viewport.
  revealItems.forEach(function (item) {
    const delay = item.dataset.revealDelay || 0;
    item.style.setProperty('--reveal-delay', delay + 'ms');
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach(function (item) { revealObserver.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
  }

  // Keep the navigation state in sync with the section currently in view.
  function updateNavigation() {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
    let currentSection = 'home';

    sections.forEach(function (section) {
      if (window.scrollY >= section.offsetTop - 150) {
        currentSection = section.id;
      }
    });

    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentSection);
    });
  }

  window.addEventListener('scroll', updateNavigation, { passive: true });
  updateNavigation();

  // Collapse the mobile menu after a navigation choice.
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth < 992 && navMenu.classList.contains('show')) {
        bootstrap.Collapse.getOrCreateInstance(navMenu).hide();
      }
    });
  });

  // Generate a small resume file so the download action works without a server.
  downloadResume.addEventListener('click', function (event) {
    event.preventDefault();
    const resume = [
      'ANVITH POOJARY',
      'VLSI STUDENT',
      '',
      'Byndoor, Kundapur, Udupi District, Karnataka - 576219',
      'Email: anvithpoojari1721@gnail.com',
      'Phone: +91 7026412717',
      'GitHub: https://github.com/A-poojary',
      '',
      'EDUCATION',
      'B.E. in Very Large Scale Integration (VLSI), SJEC, Mangaluru',
      'Currently in 3rd Semester',
      '',
      'SKILLS',
      'Power Electronics | Basic Electronics | Generative AI',
      '',
      'PROJECTS',
      'Barcode Reader | Google Student Ambassador AI Generation Prompts'
    ].join('\n');
    const file = new Blob([resume], { type: 'text/plain' });
    const downloadUrl = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'Anvith-Poojary-Resume.txt';
    link.click();
    URL.revokeObjectURL(downloadUrl);
  });

  // Share through the device when supported, with a copy-link fallback.
  shareButton.addEventListener('click', async function () {
    const shareData = {
      title: 'Anvith Poojary | VLSI Student',
      text: 'Explore Anvith Poojary\'s VLSI student portfolio.',
      url: window.location.href.split('#')[0]
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        shareButton.innerHTML = '<i class="bi bi-check2"></i> Shared';
      } catch (error) {
        if (error.name !== 'AbortError') shareButton.innerHTML = '<i class="bi bi-exclamation-circle"></i> Try again';
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        shareButton.innerHTML = '<i class="bi bi-check2"></i> Link copied';
      } catch (error) {
        window.prompt('Copy this portfolio link:', shareData.url);
      }
    }

    window.setTimeout(function () {
      shareButton.innerHTML = '<i class="bi bi-share"></i> Share';
    }, 2500);
  });

  // Validate each required field before showing a success state.
  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const fields = contactForm.querySelectorAll('input, textarea');
    let formIsValid = true;

    fields.forEach(function (field) {
      const isEmail = field.type === 'email';
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
      const fieldIsValid = field.value.trim() !== '' && (!isEmail || validEmail);
      field.classList.toggle('is-invalid', !fieldIsValid);
      field.classList.toggle('is-valid', fieldIsValid);
      if (!fieldIsValid) formIsValid = false;
    });

    formStatus.classList.remove('error');
    if (!formIsValid) {
      formStatus.textContent = 'Please check the highlighted fields.';
      formStatus.classList.add('error');
      return;
    }

    formStatus.textContent = 'Thanks, Anvith will be in touch soon.';
    contactForm.reset();
    fields.forEach(function (field) { field.classList.remove('is-valid'); });
  });

  contactForm.querySelectorAll('input, textarea').forEach(function (field) {
    field.addEventListener('input', function () {
      field.classList.remove('is-invalid');
      formStatus.textContent = '';
    });
  });
}());
