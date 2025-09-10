// Hide loading screen after page load
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loadingScreen').classList.add('hidden');
  }, 1500);
});

// Generate particles
const particlesContainer = document.getElementById('particles');
for (let i = 0; i < 50; i++) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  particle.style.left = Math.random() * 100 + '%';
  particle.style.animationDelay = Math.random() * 20 + 's';
  particle.style.animationDuration = (15 + Math.random() * 10) + 's';
  particlesContainer.appendChild(particle);
}

// Book interactions
const books = document.querySelectorAll('.book:not(.book-decorative)');
books.forEach(book => {
  book.addEventListener('click', function() {
    const targetSection = this.dataset.section;
    const targetElement = document.getElementById(targetSection);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  });

  // 3D tilt effect on hover
  book.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    this.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  });

  book.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) rotateX(0) rotateY(0) scale(1)';
  });
});

// Interactive cards mouse tracking
const cards = document.querySelectorAll('.interactive-card');
cards.forEach(card => {
  card.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    this.style.setProperty('--mouse-x', x + '%');
    this.style.setProperty('--mouse-y', y + '%');
  });
});

// Scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      
      // Animar contenedores deslizantes
      const slideContainers = entry.target.querySelectorAll('.slide-container');
      slideContainers.forEach((container, index) => {
        setTimeout(() => {
          container.classList.add('visible');
        }, index * 200); // Añade un pequeño retraso si hay múltiples contenedores
      });

      // Animate counters
      if (entry.target.querySelector('.stat-number')) {
        const statNumbers = entry.target.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-count'));
          const duration = 2000;
          const increment = target / (duration / 16);
          let current = 0;
          
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            stat.textContent = Math.floor(current);
          }, 16);
        });
      }
    }
  });
}, observerOptions);

document.querySelectorAll('.content-section').forEach(section => {
  observer.observe(section);
});

// Progress bar
window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPercentage = (scrollTop / scrollHeight) * 100;
  document.getElementById('progressBar').style.width = scrollPercentage + '%';
  
  // Show/hide floating nav
  const floatingNav = document.getElementById('floatingNav');
  if (scrollTop > 500) {
    floatingNav.classList.add('visible');
  } else {
    floatingNav.classList.remove('visible');
  }
  
  // Show/hide back to top button
  const backToTop = document.getElementById('backToTop');
  if (scrollTop > 1000) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
  
  // Update active nav dot
  const sections = document.querySelectorAll('.content-section, .hero-library');
  const navDots = document.querySelectorAll('.nav-dot');
  
  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 100 && rect.bottom >= 100) {
      navDots.forEach(dot => dot.classList.remove('active'));
      if (navDots[index]) {
        navDots[index].classList.add('active');
      }
    }
  });
});

// Navigation dots click
document.querySelectorAll('.nav-dot').forEach(dot => {
  dot.addEventListener('click', function() {
    const target = this.dataset.target;
    const element = document.getElementById(target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Back to top
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Parallax effect on bookshelf
let ticking = false;
function updateParallax() {
  const scrolled = window.pageYOffset;
  const bookshelf = document.getElementById('bookshelf');
  if (bookshelf) {
    const speed = 0.5;
    const yPos = -(scrolled * speed);
    bookshelf.style.transform = `rotateX(5deg) translateY(${yPos}px)`;
  }
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateParallax);
    ticking = true;
  }
});

function getRandomBookColor() {
  const colors = [
    ['#d15959ff', '#a8581bff'], // marrón oscuro
    ['#D4AF37', '#8B7355'], // ocre dorado
    ['#8B4513', '#654321']  // marrón rojizo
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function shuffleBooks() {
  const shelf = document.querySelector('.shelf');
  const books = Array.from(shelf.children);
  
  // Asignar colores aleatorios a los libros decorativos
  books.forEach(book => {
    if (book.classList.contains('book-decorative')) {
      const [color1, color2] = getRandomBookColor();
      book.style.background = `linear-gradient(135deg, ${color1}, ${color2})`;
    }
  });
  
  // Mezclar los libros
  for (let i = books.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    shelf.appendChild(books[j]);
  }
}

// Llamar a la función cuando se carga la página
document.addEventListener('DOMContentLoaded', shuffleBooks);

const statsSlider = document.getElementById('statsSlider');
const circleButton = document.querySelector('.circle-button');

circleButton.addEventListener('click', function() {
  statsSlider.classList.toggle('active');
});

// Cerrar el slider cuando se hace clic fuera de él
document.addEventListener('click', function(event) {
  if (!statsSlider.contains(event.target) && !circleButton.contains(event.target)) {
    statsSlider.classList.remove('active');
  }
});

document.getElementById('teacherStatsBtn').addEventListener('click', function() {
  const statsContainer = document.getElementById('teacherStatsContainer');
  statsContainer.style.display = 'block';
  
  // Optional: Smooth scroll to the new content
  statsContainer.scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('closeSliderBtn').addEventListener('click', function() {
  document.getElementById('statsSlider').classList.remove('active');
});

function openCard(type) {
  const overlay = document.getElementById('cardOverlay');
  const card = document.getElementById(type + 'Card');
  
  overlay.style.display = 'flex';
  card.style.display = 'block';

  // Cerrar al hacer click en el overlay o en el botón de cerrar
  overlay.onclick = function(e) {
    if (e.target === overlay || e.target.className === 'close-card') {
      overlay.style.display = 'none';
      card.style.display = 'none';
    }
  };
}
function showPopup(imageSrc) {
            document.getElementById('popupImg').src = imageSrc;
            document.getElementById('popup').style.display = 'block';
            document.getElementById('overlay').style.display = 'block';
        }

        document.getElementById('overlay').onclick = function() {
            document.getElementById('popup').style.display = 'none';
            document.getElementById('overlay').style.display = 'none';
        }

// Función para crear efectos hover en el mapa del cerebro
function initBrainMapEffects() {
    const areas = document.querySelectorAll('area');
    const cerebroContainer = document.querySelector('.cerebro-container');
    
    areas.forEach(area => {
        const highlight = document.createElement('div');
        highlight.className = `area-highlight highlight-${area.getAttribute('title').toLowerCase()}`;
        cerebroContainer.appendChild(highlight);

        area.addEventListener('mouseenter', () => {
            const coords = area.getAttribute('coords').split(',');
            const points = [];
            
            for (let i = 0; i < coords.length; i += 2) {
                points.push({
                    x: parseInt(coords[i]),
                    y: parseInt(coords[i + 1])
                });
            }

            // Calcular dimensiones del área
            const minX = Math.min(...points.map(p => p.x));
            const maxX = Math.max(...points.map(p => p.x));
            const minY = Math.min(...points.map(p => p.y));
            const maxY = Math.max(...points.map(p => p.y));

            // Aplicar posición y dimensiones al highlight
            highlight.style.left = `${minX}px`;
            highlight.style.top = `${minY}px`;
            highlight.style.width = `${maxX - minX}px`;
            highlight.style.height = `${maxY - minY}px`;
            highlight.style.opacity = '1';
        });

        area.addEventListener('mouseleave', () => {
            highlight.style.opacity = '0';
        });
    });
}

// Llamar a la función cuando el documento esté listo
document.addEventListener('DOMContentLoaded', () => {
    initBrainMapEffects();
    createBrainAreas();
});

function createBrainAreas() {
  const cerebroContainer = document.querySelector('.cerebro-container');
  const areas = document.querySelectorAll('area');
  
  // Crear SVG contenedor
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.position = 'absolute';
  svg.style.top = '0';
  svg.style.left = '0';
  svg.style.width = '100%';
  svg.style.height = '100%';
  svg.style.pointerEvents = 'none';
  
  areas.forEach(area => {
    const coords = area.getAttribute('coords').split(',');
    const title = area.getAttribute('title').toLowerCase();
    
    // Crear path para cada área
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    // Construir el comando path SVG
    let d = 'M ';
    for(let i = 0; i < coords.length; i += 2) {
      d += `${coords[i]},${coords[i+1]} `;
      if(i === 0) d += 'L ';
    }
    d += 'Z';
    
    path.setAttribute('d', d);
    path.classList.add('brain-area', `area-${title}`);
    
    svg.appendChild(path);
  });
  
  cerebroContainer.appendChild(svg);
}
