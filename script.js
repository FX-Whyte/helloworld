// ==========================
// Select DOM elements
// ==========================
const openBtn = document.querySelector('.open-btn');
const navBlack = document.querySelector('.nav-black');
const navLinks = document.querySelectorAll('.list li a');
const mainContent = document.getElementById('main-content');
const ctaBtn = document.querySelector('.cta-btn'); // For the "Learn More About Us" button

// ==========================
// Navigation Open/Close Logic
// ==========================
if (openBtn && navBlack) {
  openBtn.addEventListener('click', () => {
    navBlack.classList.add('visible');
    document.body.classList.add('nav-open');
  });
}

if (mainContent && navBlack) {
  mainContent.addEventListener('click', () => {
    if (navBlack.classList.contains('visible')) {
      navBlack.classList.remove('visible');
      document.body.classList.remove('nav-open');
    }
  });
}

// ==========================
// Set Home Link Active on Initial Load
// ==========================
navLinks.forEach(link => link.classList.remove('active'));
const homeLink = document.querySelector('.list li a[href="index.html"]');
if (homeLink) homeLink.classList.add('active');

// ==========================
// SPA Navigation (AJAX Page Load)
// ==========================
function attachContactFormHandler() {
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      // Collect form data
      const data = {
        name: contactForm.name.value,
        email: contactForm.email.value,
        message: contactForm.message.value
      };

      // Send data to backend
      try {
        const response = await fetch('http://localhost:4000/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          // Show thank you message with interchanged colors
          const section = contactForm.closest('.contact-section');
          section.innerHTML = `
            <h1 style="color:rgb(37, 37, 37);">Thank You!</h1>
            <p style="font-size:1.2em; 
            color:rgb(37, 37, 37); 
            margin:32px 0;">
            for contacting us at 
            <span style="color:rgba(7,240,209,1);">Hello World!</span><br>
              We'll get back to you soon.
            </p>
          `;
          setTimeout(() => {
            window.location.href = '/index.html';
          }, 10000);
        } else {
          alert('Failed to send message. Please try again.');
        }
      } catch (err) {
        alert('Failed to send message. Please try again.');
      }
    });
  }
}

// SPA navigation logic
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    const url = link.getAttribute('href');
    if (url && url !== '#') {
      e.preventDefault();

      fetch(url)
        .then(res => res.text())
        .then(html => {
          // Parse the fetched HTML and extract <main>
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const newContent = doc.querySelector('#main-content');
          if (newContent) {
            mainContent.className = newContent.className;
            mainContent.innerHTML = newContent.innerHTML;
            attachContactFormHandler(); // Attach contact form handler after AJAX load
          } else {
            mainContent.innerHTML = "<p>Page not found.</p>";
          }
          // Update active link styling
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
          // Run typewriter effect if home page is loaded
          if (
            link.getAttribute('href') === 'index.html' ||
            (link.pathname === '/' || link.pathname.endsWith('index.html'))
          ) {
            runTypewriterEffect();
          }
        });
    }
  });
});

// ==========================
// Allow normal navigation for CTA button
// ==========================
if (ctaBtn) {
  ctaBtn.addEventListener('click', function(e) {
    // Let the browser follow the link normally (no SPA)
  });
}

// ==========================
// Typewriter Effect Function
// ==========================
function runTypewriterEffect() {
  const typeTarget = document.getElementById('typewriter');
  if (typeTarget) {
    const beforeColor = "Welcome to ";
    const colored = "Hello World!";
    const fullText = beforeColor + colored;
    let i = 0;
    function type() {
      if (i <= fullText.length) {
        if (i <= beforeColor.length) {
          typeTarget.innerHTML = fullText.substring(0, i);
        } else {
          typeTarget.innerHTML =
            beforeColor +
            '<span style="color:rgba(7,240,209,1)">' +
            colored.substring(0, i - beforeColor.length) +
            "</span>";
        }
        i++;
        setTimeout(type, 120);
      }
    }
    type();
  }
}

// ==========================
// Run typewriter and contact handler on initial load
// ==========================
document.addEventListener('DOMContentLoaded', function() {
  runTypewriterEffect();
  attachContactFormHandler();
});

// ==========================
// Set Active Link on Initial Load
// ==========================
navLinks.forEach(link => {
  link.classList.remove('active');
  // If the link's href matches the current page, set it active
  if (
    window.location.pathname.endsWith(link.getAttribute('href')) ||
    (window.location.pathname === '/' && link.getAttribute('href') === 'index.html')
  ) {
    link.classList.add('active');
  }
});


