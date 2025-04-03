document.addEventListener('DOMContentLoaded', function() {
    // Tạo hiệu ứng space dust
    createSpaceDust();
    
    // Initialize loading sequence
    initLoading();
    
    // Initialize Three.js background
    initThreeJSBackground();
    
    // Initialize welcome screen elements
    initWelcomeScreen();
    
    // Handle audio controls and autoplay music
    initAudio(true); // Pass true to autoplay
    
    // Button particles effect
    initButtonParticles();
    
    // Ẩn timeline mặc định
    const timelineSection = document.getElementById('timeline-section');
    if (timelineSection) {
        timelineSection.style.display = 'none';
    }
});

// Tạo hiệu ứng không gian - space dust
function createSpaceDust() {
    const spaceDust = document.createElement('div');
    spaceDust.className = 'space-dust';
    document.body.appendChild(spaceDust);
    
    // Tạo các hạt bụi không gian
    for (let i = 0; i < 50; i++) {
        const dust = document.createElement('div');
        dust.className = 'dust-particle';
        
        // Vị trí ngẫu nhiên
        dust.style.left = `${Math.random() * 100}%`;
        dust.style.top = `${Math.random() * 100}%`;
        
        // Kích thước ngẫu nhiên
        const size = Math.random() * 3 + 1;
        dust.style.width = `${size}px`;
        dust.style.height = `${size}px`;
        
        // Độ sáng ngẫu nhiên
        const opacity = Math.random() * 0.7 + 0.3;
        dust.style.opacity = opacity;
        
        // Thời gian animation ngẫu nhiên
        const duration = Math.random() * 20 + 10;
        dust.style.animation = `floatDust ${duration}s linear infinite`;
        
        // Delay bắt đầu animation ngẫu nhiên
        dust.style.animationDelay = `${Math.random() * 10}s`;
        
        spaceDust.appendChild(dust);
    }
}

function initLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    const countdownElement = document.getElementById('countdown');
    const progressBar = document.getElementById('loading-progress-bar');
    const loadingText = document.getElementById('loading-text');
    const welcomeScreen = document.getElementById('welcome-screen');
    
    // Thêm hiệu ứng đếm ngược nâng cao
    const countdownRing = document.createElement('div');
    countdownRing.className = 'countdown-ring';
    loadingScreen.insertBefore(countdownRing, countdownElement);
    
    // Loading texts array
    const loadingTexts = [
        "Đang chuẩn bị vũ trụ",
        "Đang tạo các vì sao",
        "Đang thu thập ánh sáng",
        "Đang kết nối các thiên hà",
        "Vũ trụ sẵn sàng..."
    ];
    
    // Start countdown
    let count = 3;
    countdownElement.textContent = count;
    countdownElement.style.opacity = 1;
    
    // Countdown animation
    const countdown = setInterval(() => {
        countdownElement.style.opacity = 0;
        
        // Tạo hiệu ứng ring mới
        const newRing = document.createElement('div');
        newRing.className = 'countdown-ring';
        loadingScreen.insertBefore(newRing, countdownElement);
        
        setTimeout(() => {
            count--;
            if (count > 0) {
                countdownElement.textContent = count;
                countdownElement.style.opacity = 1;
                countdownElement.style.animation = 'countdownPulse 1s ease-in-out';
                
                // Reset animation
                countdownElement.addEventListener('animationend', function resetAnim() {
                    countdownElement.style.animation = '';
                    countdownElement.removeEventListener('animationend', resetAnim);
                });
            } else {
                clearInterval(countdown);
                countdownElement.style.display = 'none';
                
                // Start progress bar animation
                let progress = 0;
                let textIndex = 0;
                loadingText.textContent = loadingTexts[textIndex];
                
                const progressInterval = setInterval(() => {
                    progress += Math.random() * 10;
                    if (progress > 100) progress = 100;
                    
                    progressBar.style.width = `${progress}%`;
                    
                    // Update loading text occasionally
                    if (progress > (textIndex+1) * 20 && textIndex < loadingTexts.length - 1) {
                        textIndex++;
                        loadingText.textContent = loadingTexts[textIndex];
                    }
                    
                    if (progress >= 100) {
                        clearInterval(progressInterval);
                        
                        // Hiệu ứng chuyển cảnh vào welcome screen
                        setTimeout(() => {
                            loadingScreen.classList.add('hidden');
                            welcomeScreen.classList.add('active');
                            
                            // Activate elements in welcome screen
                            document.querySelector('.welcome-title').style.opacity = 1;
                            document.querySelector('.welcome-title').style.transform = 'translateY(0)';
                            
                            document.querySelector('.welcome-subtitle').style.opacity = 1;
                            document.querySelector('.welcome-subtitle').style.transform = 'translateY(0)';
                            
                            document.querySelector('.enter-button-container').style.opacity = 1;
                            document.querySelector('.enter-button-container').style.transform = 'translateY(0)';
                        }, 1000);
                    }
                }, 100);
            }
        }, 500);
    }, 1000);
}

function initThreeJSBackground() {
    // Basic Three.js setup
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // Create stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.02,
        transparent: true
    });
    
    const starsCount = 5000;
    const starsPositions = new Float32Array(starsCount * 3);
    const starsColors = new Float32Array(starsCount * 3);
    const starsSizes = new Float32Array(starsCount);
    
    for (let i = 0; i < starsCount; i++) {
        const i3 = i * 3;
        
        // Position
        starsPositions[i3] = (Math.random() - 0.5) * 20;
        starsPositions[i3 + 1] = (Math.random() - 0.5) * 20;
        starsPositions[i3 + 2] = (Math.random() - 0.5) * 20;
        
        // Size variation
        starsSizes[i] = Math.random() * 0.02 + 0.01;
        
        // Color
        let colorChoice = Math.random();
        if (colorChoice < 0.2) {
            // Purple star
            starsColors[i3] = 0.6;
            starsColors[i3 + 1] = 0.2;
            starsColors[i3 + 2] = 1.0;
        } else if (colorChoice < 0.4) {
            // Blue star
            starsColors[i3] = 0.2;
            starsColors[i3 + 1] = 0.4;
            starsColors[i3 + 2] = 1.0;
        } else if (colorChoice < 0.6) {
            // Pink star
            starsColors[i3] = 1.0;
            starsColors[i3 + 1] = 0.2;
            starsColors[i3 + 2] = 0.7;
        } else {
            // White star
            starsColors[i3] = 1.0;
            starsColors[i3 + 1] = 1.0;
            starsColors[i3 + 2] = 1.0;
        }
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(starsColors, 3));
    starsGeometry.setAttribute('size', new THREE.BufferAttribute(starsSizes, 1));
    starsMaterial.vertexColors = true;
    
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    
    // Create nebula
    const nebulaGeometry = new THREE.BufferGeometry();
    const nebulaMaterial = new THREE.PointsMaterial({
        color: 0x9d4edd,
        size: 0.05,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });
    
    const nebulaCount = 1000;
    const nebulaPositions = new Float32Array(nebulaCount * 3);
    
    for (let i = 0; i < nebulaCount; i++) {
        const i3 = i * 3;
        const angle = Math.random() * Math.PI * 2;
        const radius = 2 + Math.random() * 3;
        
        nebulaPositions[i3] = Math.cos(angle) * radius;
        nebulaPositions[i3 + 1] = (Math.random() - 0.5) * 3;
        nebulaPositions[i3 + 2] = Math.sin(angle) * radius;
    }
    
    nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(nebulaPositions, 3));
    const nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
    scene.add(nebula);
    
    // Create glowing stars
    const glowingStars = [];
    for (let i = 0; i < 20; i++) {
        const geometry = new THREE.SphereGeometry(0.03 + Math.random() * 0.02, 16, 16);
        const material = new THREE.MeshBasicMaterial({
            color: new THREE.Color(
                Math.random() * 0.5 + 0.5,
                Math.random() * 0.5 + 0.5,
                Math.random() * 0.5 + 0.5
            ),
            transparent: true,
            opacity: 0.8
        });
        
        const star = new THREE.Mesh(geometry, material);
        star.position.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
        );
        
        // Animation properties
        star.userData = {
            pulseSpeed: 0.01 + Math.random() * 0.03,
            glowSize: 0.01 + Math.random() * 0.03,
            originalSize: 0.03 + Math.random() * 0.02,
            phase: Math.random() * Math.PI * 2
        };
        
        scene.add(star);
        glowingStars.push(star);
    }
    
    // Handle mouse movement
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Create transition overlay
    const transitionOverlay = document.createElement('div');
    transitionOverlay.className = 'transition-overlay';
    document.body.appendChild(transitionOverlay);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate stars slowly
        stars.rotation.y += 0.0005;
        stars.rotation.x += 0.0002;
        
        // Rotate nebula
        nebula.rotation.y += 0.001;
        
        // Respond to mouse movement with slight camera movement
        camera.position.x += (mouseX * 0.1 - camera.position.x) * 0.01;
        camera.position.y += (mouseY * 0.1 - camera.position.y) * 0.01;
        camera.lookAt(scene.position);
        
        // Update glowing stars
        for (let i = 0; i < glowingStars.length; i++) {
            const star = glowingStars[i];
            const data = star.userData;
            
            // Pulse effect
            const scale = data.originalSize + Math.sin(data.phase) * data.glowSize;
            star.scale.set(scale, scale, scale);
            star.material.opacity = 0.5 + Math.sin(data.phase) * 0.5;
            data.phase += data.pulseSpeed;
        }
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Export functions for other modules to use
    window.galaxyFunctions = {
        setWarpSpeed: function(enabled) {
            if (enabled) {
                gsap.to(camera.position, {
                    z: 15,
                    duration: 2,
                    ease: "power2.in"
                });
                
                gsap.to(stars.rotation, {
                    y: stars.rotation.y + Math.PI * 4,
                    duration: 2,
                    ease: "power2.in"
                });
            } else {
                gsap.to(camera.position, {
                    z: 5,
                    duration: 1,
                    ease: "power2.out"
                });
            }
        },
        
        triggerTransition: function(callback) {
            transitionOverlay.classList.add('active');
            
            setTimeout(() => {
                if (callback) callback();
                
                setTimeout(() => {
                    transitionOverlay.classList.remove('active');
                }, 500);
            }, 500);
        }
    };
}

function initWelcomeScreen() {
    const enterButton = document.getElementById('enter-button');
    const welcomeScreen = document.getElementById('welcome-screen');
    const galleryContainer = document.getElementById('gallery-container');
    const timelineSection = document.getElementById('timeline-section');
    
    // Enter button effect
    enterButton.addEventListener('mouseenter', () => {
        // Create particles when hovering
        enterButton.style.transform = 'translateY(-2px) scale(1.05)';
        enterButton.style.boxShadow = '0 8px 25px rgba(157, 78, 221, 0.7)';
        document.getElementById('hover-sound').play().catch(e => console.log('Audio play prevented: ', e));
    });
    
    enterButton.addEventListener('mouseleave', () => {
        enterButton.style.transform = '';
        enterButton.style.boxShadow = '';
    });
    
    // Enter button click will transition to gallery view
    enterButton.addEventListener('click', () => {
        document.getElementById('click-sound').play().catch(e => console.log('Audio play prevented: ', e));
        
        // Trigger space warp effect
        window.galaxyFunctions.setWarpSpeed(true);
        
        // Hide welcome screen with animation
        welcomeScreen.style.opacity = '0';
        welcomeScreen.style.transform = 'translateY(-20px) scale(0.9)';
        
        // Use transition overlay
        setTimeout(() => {
            window.galaxyFunctions.triggerTransition(() => {
                welcomeScreen.style.display = 'none';
                
                // Show gallery
                galleryContainer.style.display = 'block';
                
                // Show timeline section
                if (timelineSection) {
                    timelineSection.style.display = 'block';
                    
                    // Force reflow to ensure animations work
                    void timelineSection.offsetWidth;
                    
                    // Add entrance animation class
                    timelineSection.classList.add('timeline-activated');
                }
                
                // Force reflow
                void galleryContainer.offsetWidth;
                
                // Start animations
                galleryContainer.classList.add('active');
                
                // Return camera to normal
                setTimeout(() => {
                    window.galaxyFunctions.setWarpSpeed(false);
                }, 500);
                
                // Initialize gallery content
                initGallery();
            });
        }, 1000);
    });
}

function initAudio(autoplay = false) {
    const backgroundMusic = document.getElementById('background-music');
    const soundToggle = document.getElementById('sound-toggle');
    const soundIcon = document.getElementById('sound-icon');
    let isMuted = !autoplay; // If autoplay is true, we start with sound on
    
    // Set music source to mlem.mp3
    backgroundMusic.src = 'mlem.mp3';
    
    // Set initial state of music
    if (!isMuted) {
        backgroundMusic.volume = 0.3; // Set to 30% volume
        soundIcon.className = 'fas fa-volume-up';
        
        // Try to play music automatically
        const playPromise = backgroundMusic.play();
        
        // Handle autoplay restrictions
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                console.log('Autoplay prevented. User must interact first.');
                isMuted = true;
                soundIcon.className = 'fas fa-volume-mute';
            });
        }
    }
    
    // Toggle sound
    soundToggle.addEventListener('click', () => {
        isMuted = !isMuted;
        if (isMuted) {
            backgroundMusic.pause();
            soundIcon.className = 'fas fa-volume-mute';
        } else {
            backgroundMusic.volume = 0.3; // Set to 30% volume
            backgroundMusic.play().catch(() => {
                // Handle autoplay restrictions
                console.log('Autoplay prevented. User must interact first.');
            });
            soundIcon.className = 'fas fa-volume-up';
        }
    });
}

function initButtonParticles() {
    const buttonParticles = document.getElementById('button-particles');
    const enterButton = document.getElementById('enter-button');
    
    enterButton.addEventListener('mousemove', (e) => {
        // Calculate position relative to the button
        const rect = enterButton.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Create a particle
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '3px';
        particle.style.height = '3px';
        particle.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        particle.style.borderRadius = '50%';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.pointerEvents = 'none';
        particle.style.transform = 'translate(-50%, -50%)';
        particle.style.transition = 'opacity 1s ease, transform 1s ease';
        
        buttonParticles.appendChild(particle);
        
        // Animate the particle
        setTimeout(() => {
            particle.style.opacity = '0';
            particle.style.transform = `translate(-50%, -50%) translate(${(Math.random() - 0.5) * 50}px, ${(Math.random() - 0.5) * 50}px)`;
            
            // Remove the particle after animation
            setTimeout(() => {
                buttonParticles.removeChild(particle);
            }, 1000);
        }, 10);
    });
}

// Gallery initialization function
function initGallery() {
    loadGalleryImages();
    initViewToggle();
    initFilters();
    initLightbox();
    initThreeDCarousel();
    initGalaxyView();
    initTimeline();
    initMusicPlayer();
    initFavorites();
    initARViewer();
    initThemeToggle();
    initLanguageSelector();
}

// Function to load gallery images with Wonyoung images
function loadGalleryImages() {
    const galleryGrid = document.querySelector('.gallery-grid');
    
    // Generate gallery items
    const galleryItems = generateGalleryItems();
    
    // Clear existing content
    galleryGrid.innerHTML = '';
    
    // Add items to grid
    galleryItems.forEach(item => {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        gridItem.dataset.id = item.id;
        gridItem.dataset.category = item.category;
        gridItem.dataset.year = item.year;
        
        gridItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="grid-item-info">
                <h3 class="grid-item-title">${item.title}</h3>
                <p class="grid-item-subtitle">${item.event} - ${item.date}</p>
            </div>
        `;
        
        gridItem.addEventListener('click', () => {
            openLightbox(item);
        });
        
        galleryGrid.appendChild(gridItem);
    });
}

// Function to generate gallery items with Wonyoung default image
function generateGalleryItems() {
    const defaultImage = "https://res.cloudinary.com/dacbvhtgz/image/upload/v1743494564/2024-02-08_09-00-03_UTC_8_vgl2px.jpg";
    
    // Sample gallery items with Wonyoung images
    return [
        {
            id: 1,
            title: 'Music Bank Performance',
            event: 'Music Bank',
            date: '2023-06-12',
            category: 'stage',
            year: '2023',
            image: defaultImage,
            outfit: 'Blue Dress'
        },
        {
            id: 2,
            title: 'Cosmopolitan Photoshoot',
            event: 'Magazine Cover',
            date: '2023-01-15',
            category: 'photoshoot',
            year: '2023',
            image: defaultImage,
            outfit: 'White Elegant Suit'
        },
        {
            id: 3,
            title: 'Inkigayo Performance',
            event: 'Inkigayo',
            date: '2022-12-04',
            category: 'stage',
            year: '2022',
            image: defaultImage,
            outfit: 'Red Performance Outfit'
        },
        {
            id: 4,
            title: 'Brand Ambassador Event',
            event: 'Brand Event',
            date: '2022-10-20',
            category: 'event',
            year: '2022',
            image: defaultImage,
            outfit: 'Pink Gown'
        },
        {
            id: 5,
            title: 'Airport Fashion',
            event: 'Daily Life',
            date: '2022-09-15',
            category: 'daily',
            year: '2022',
            image: defaultImage,
            outfit: 'Casual Streetwear'
        },
        {
            id: 6,
            title: 'After LIKE MV Behind',
            event: 'Music Video',
            date: '2022-08-22',
            category: 'photoshoot',
            year: '2022',
            image: defaultImage,
            outfit: 'MV Outfit'
        },
        {
            id: 7,
            title: 'KCON 2022',
            event: 'Concert',
            date: '2022-05-08',
            category: 'stage',
            year: '2022',
            image: defaultImage,
            outfit: 'Stage Outfit'
        },
        {
            id: 8,
            title: 'Fansign Event',
            event: 'Fan Meeting',
            date: '2022-04-16',
            category: 'event',
            year: '2022',
            image: defaultImage,
            outfit: 'Casual Elegant'
        },
        {
            id: 9,
            title: 'IVE Debut Showcase',
            event: 'Showcase',
            date: '2021-12-01',
            category: 'stage',
            year: '2021',
            image: defaultImage,
            outfit: 'ELEVEN Outfit'
        },
        {
            id: 10,
            title: 'Summer Vacation',
            event: 'Daily Life',
            date: '2021-08-10',
            category: 'daily',
            year: '2021',
            image: defaultImage,
            outfit: 'Summer Casual'
        },
        {
            id: 11,
            title: 'IZ*ONE Final Concert',
            event: 'Concert',
            date: '2021-03-14',
            category: 'stage',
            year: '2021',
            image: defaultImage,
            outfit: 'Formal Gown'
        },
        {
            id: 12,
            title: 'MAMA Awards',
            event: 'Award Show',
            date: '2020-12-06',
            category: 'event',
            year: '2020',
            image: defaultImage,
            outfit: 'Red Carpet Gown'
        }
    ];
}

// Function to handle view toggle
function initViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const galleryViews = document.querySelectorAll('.gallery-view');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const viewType = button.dataset.view;
            document.getElementById('click-sound').play().catch(e => console.log('Audio play prevented: ', e));
            
            // Update active button
            viewButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update active view
            galleryViews.forEach(view => view.classList.remove('active'));
            document.getElementById(`${viewType}-view`).classList.add('active');
            
            // If 3D carousel or galaxy view, initialize them
            if (viewType === 'carousel') {
                // Additional initialization for 3D carousel if needed
            } else if (viewType === 'galaxy') {
                // Additional initialization for galaxy view if needed
            }
        });
    });
}

// Function to initialize filters
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const yearFilter = document.getElementById('year-filter');
    const searchInput = document.querySelector('.search-box input');
    const gridItems = document.querySelectorAll('.grid-item');
    
    // Category filter
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.getElementById('click-sound').play().catch(e => console.log('Audio play prevented: ', e));
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const category = button.dataset.filter;
            
            gridItems.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Year filter
    yearFilter.addEventListener('change', () => {
        const year = yearFilter.value;
        
        gridItems.forEach(item => {
            if (year === 'all' || item.dataset.year === year) {
                if (item.style.display !== 'none') {
                    item.style.display = 'block';
                }
            } else {
                item.style.display = 'none';
            }
        });
    });
    
    // Search functionality
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        
        gridItems.forEach(item => {
            const title = item.querySelector('.grid-item-title').textContent.toLowerCase();
            const subtitle = item.querySelector('.grid-item-subtitle').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || subtitle.includes(searchTerm)) {
                if (item.style.display !== 'none') {
                    item.style.display = 'block';
                }
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// Function to initialize lightbox
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    let currentImageIndex = 0;
    const galleryItems = Array.from(document.querySelectorAll('.grid-item'));
    
    // Close lightbox
    lightboxClose.addEventListener('click', () => {
        document.getElementById('click-sound').play().catch(e => console.log('Audio play prevented: ', e));
        lightbox.classList.remove('active');
    });
    
    // Close on overlay click
    lightbox.querySelector('.lightbox-overlay').addEventListener('click', () => {
        lightbox.classList.remove('active');
    });
    
    // Prevent closing when clicking on content
    lightbox.querySelector('.lightbox-content').addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // Previous image
    lightboxPrev.addEventListener('click', () => {
        document.getElementById('click-sound').play().catch(e => console.log('Audio play prevented: ', e));
        currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
        const prevItem = galleryItems[currentImageIndex].dataset.id;
        const item = getGalleryItemById(prevItem);
        updateLightboxContent(item);
    });
    
    // Next image
    lightboxNext.addEventListener('click', () => {
        document.getElementById('click-sound').play().catch(e => console.log('Audio play prevented: ', e));
        currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
        const nextItem = galleryItems[currentImageIndex].dataset.id;
        const item = getGalleryItemById(nextItem);
        updateLightboxContent(item);
    });
    
    // Key navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            lightbox.classList.remove('active');
        } else if (e.key === 'ArrowLeft') {
            lightboxPrev.click();
        } else if (e.key === 'ArrowRight') {
            lightboxNext.click();
        }
    });
    
    // Favorite button
    const favoriteBtn = document.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', () => {
        document.getElementById('click-sound').play().catch(e => console.log('Audio play prevented: ', e));
        
        const icon = favoriteBtn.querySelector('i');
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            favoriteBtn.style.color = '#e84393';
            
            // Add to favorites
            const currentItemId = document.querySelector('.lightbox-image').dataset.id;
            addToFavorites(getGalleryItemById(currentItemId));
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            favoriteBtn.style.color = '';
            
            // Remove from favorites
            const currentItemId = document.querySelector('.lightbox-image').dataset.id;
            removeFromFavorites(currentItemId);
        }
    });
    
    // Download button
    const downloadBtn = document.querySelector('.download-btn');
    downloadBtn.addEventListener('click', () => {
        document.getElementById('click-sound').play().catch(e => console.log('Audio play prevented: ', e));
        
        const imageUrl = document.querySelector('.lightbox-image').src;
        const a = document.createElement('a');
        a.href = imageUrl;
        a.download = `wonyoung-${Date.now()}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
    
    // Share button
    const shareBtn = document.querySelector('.share-btn');
    shareBtn.addEventListener('click', () => {
        document.getElementById('click-sound').play().catch(e => console.log('Audio play prevented: ', e));
        
        // Check if Web Share API is supported
        if (navigator.share) {
            navigator.share({
                title: document.querySelector('.lightbox-title').textContent,
                text: 'Check out this amazing Jang Wonyoung photo!',
                url: window.location.href
            }).catch(err => {
                console.log('Error sharing:', err);
            });
        } else {
            // Fallback - copy URL to clipboard
            const dummyInput = document.createElement('input');
            document.body.appendChild(dummyInput);
            dummyInput.value = window.location.href;
            dummyInput.select();
            document.execCommand('copy');
            document.body.removeChild(dummyInput);
            
            alert('URL copied to clipboard!');
        }
    });
}

// Function to open lightbox
function openLightbox(item) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const galleryItems = Array.from(document.querySelectorAll('.grid-item'));
    
    // Set current index
    currentImageIndex = galleryItems.findIndex(gridItem => gridItem.dataset.id == item.id);
    
    // Update content
    updateLightboxContent(item);
    
    // Show lightbox
    lightbox.classList.add('active');
    document.getElementById('click-sound').play().catch(e => console.log('Audio play prevented: ', e));
    
    // Add zoom functionality
    lightboxImage.addEventListener('click', () => {
        if (lightboxImage.classList.contains('zoomed')) {
            lightboxImage.classList.remove('zoomed');
            lightboxImage.style.transform = '';
        } else {
            lightboxImage.classList.add('zoomed');
            lightboxImage.style.transform = 'scale(1.5)';
        }
    });
}

// Function to update lightbox content
function updateLightboxContent(item) {
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxTitle = document.querySelector('.lightbox-title');
    const eventInfo = document.getElementById('event-info');
    const dateInfo = document.getElementById('date-info');
    const outfitInfo = document.getElementById('outfit-info');
    
    // Reset zoom
    lightboxImage.classList.remove('zoomed');
    lightboxImage.style.transform = '';
    
    // Update image with fade effect
    lightboxImage.style.opacity = 0;
    setTimeout(() => {
        lightboxImage.src = item.image;
        lightboxImage.dataset.id = item.id;
        lightboxImage.style.opacity = 1;
    }, 300);
    
    // Update details
    lightboxTitle.textContent = item.title;
    eventInfo.textContent = item.event;
    dateInfo.textContent = item.date;
    outfitInfo.textContent = item.outfit;
    
    // Check if in favorites
    const favoriteBtn = document.querySelector('.favorite-btn');
    const icon = favoriteBtn.querySelector('i');
    
    if (isInFavorites(item.id)) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        favoriteBtn.style.color = '#e84393';
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        favoriteBtn.style.color = '';
    }
}

// Function to initialize 3D carousel
function initThreeDCarousel() {
    const container = document.querySelector('.carousel-container');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 7;
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // Controls
    let autoRotate = true;
    let rotationSpeed = 0.005;
    let targetRotationY = 0;
    
    // Create carousel group
    const carouselGroup = new THREE.Group();
    scene.add(carouselGroup);
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x9d4edd, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    // Get gallery images
    const galleryItems = Array.from(document.querySelectorAll('.grid-item'));
    const totalItems = galleryItems.length;
    
    // Load textures and create planes
    galleryItems.forEach((item, index) => {
        const imgSrc = item.querySelector('img').src;
        const texture = new THREE.TextureLoader().load(imgSrc);
        
        // Create material with texture
        const material = new THREE.MeshStandardMaterial({
            map: texture,
            side: THREE.DoubleSide
        });
        
        // Create plane geometry
        const geometry = new THREE.PlaneGeometry(3, 2);
        const mesh = new THREE.Mesh(geometry, material);
        
        // Position in circle
        const angle = (index / totalItems) * Math.PI * 2;
        const radius = 5;
        mesh.position.x = Math.cos(angle) * radius;
        mesh.position.z = Math.sin(angle) * radius;
        
        // Look at center
        mesh.lookAt(0, 0, 0);
        
        // Add to carousel
        carouselGroup.add(mesh);
        
        // Make interactive
        mesh.userData = { 
            id: item.dataset.id,
            index: index 
        };
    });
    
    // Add raycaster for interactivity
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    // Add event listeners
    container.addEventListener('click', onCarouselClick);
    container.addEventListener('mousemove', onCarouselMouseMove);
    
    prevBtn.addEventListener('click', () => {
        document.getElementById('click-sound').play().catch(e => console.log('Audio play prevented: ', e));
        targetRotationY += Math.PI * 2 / totalItems;
        autoRotate = false;
        setTimeout(() => { autoRotate = true; }, 2000);
    });
    
    nextBtn.addEventListener('click', () => {
        document.getElementById('click-sound').play().catch(e => console.log('Audio play prevented: ', e));
        targetRotationY -= Math.PI * 2 / totalItems;
        autoRotate = false;
        setTimeout(() => { autoRotate = true; }, 2000);
    });
    
    function onCarouselClick(event) {
        // Calculate mouse position
        mouse.x = (event.clientX - container.getBoundingClientRect().left) / container.clientWidth * 2 - 1;
        mouse.y = -((event.clientY - container.getBoundingClientRect().top) / container.clientHeight) * 2 + 1;
        
        // Update the picking ray with the camera and mouse position
        raycaster.setFromCamera(mouse, camera);
        
        // Calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects(carouselGroup.children);
        
        if (intersects.length > 0) {
            const itemId = intersects[0].object.userData.id;
            const gridItem = document.querySelector(`.grid-item[data-id="${itemId}"]`);
            const imgSrc = gridItem.querySelector('img').src;
            
            // Get item data and open lightbox
            const itemData = getGalleryItemById(itemId);
            openLightbox(itemData);
        }
    }
    
    function onCarouselMouseMove(event) {
        // Calculate mouse position
        mouse.x = (event.clientX - container.getBoundingClientRect().left) / container.clientWidth * 2 - 1;
        mouse.y = -((event.clientY - container.getBoundingClientRect().top) / container.clientHeight) * 2 + 1;
        
        // Update the picking ray with the camera and mouse position
        raycaster.setFromCamera(mouse, camera);
        
        // Calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects(carouselGroup.children);
        
        if (intersects.length > 0) {
            container.style.cursor = 'pointer';
        } else {
            container.style.cursor = 'default';
        }
    }
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        if (autoRotate) {
            carouselGroup.rotation.y += rotationSpeed;
        } else {
            // Smooth rotation to target
            carouselGroup.rotation.y += (targetRotationY - carouselGroup.rotation.y) * 0.05;
        }
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// Function to initialize galaxy view
function initGalaxyView() {
    const container = document.querySelector('.galaxy-container');
    
    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 20;
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // Create galaxy center
    const galaxyCenter = new THREE.Object3D();
    scene.add(galaxyCenter);
    
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    
    // Point light at center
    const centerLight = new THREE.PointLight(0x9d4edd, 2, 100);
    centerLight.position.set(0, 0, 0);
    galaxyCenter.add(centerLight);
    
    // Get gallery images
    const galleryItems = Array.from(document.querySelectorAll('.grid-item'));
    const imageObjects = [];
    
    // Load textures and create image planes
    galleryItems.forEach((item, index) => {
        const imgSrc = item.querySelector('img').src;
        const texture = new THREE.TextureLoader().load(imgSrc);
        
        // Create material with texture
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true
        });
        
        // Create plane geometry
        const size = 1.5 + Math.random() * 0.5;
        const geometry = new THREE.PlaneGeometry(size, size * 0.7);
        const mesh = new THREE.Mesh(geometry, material);
        
        // Random position in 3D space
        const radius = 5 + Math.random() * 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI - Math.PI / 2;
        
        mesh.position.x = radius * Math.sin(theta) * Math.cos(phi);
        mesh.position.y = radius * Math.sin(phi);
        mesh.position.z = radius * Math.cos(theta) * Math.cos(phi);
        
        // Random rotation
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        mesh.rotation.z = Math.random() * Math.PI;
        
        // Random orbit parameters
        const orbitSpeed = 0.001 + Math.random() * 0.002;
        const orbitRadius = radius;
        const orbitAngle = theta;
        const orbitY = mesh.position.y;
        
        imageObjects.push({
            mesh,
            orbitSpeed,
            orbitRadius,
            orbitAngle,
            orbitY,
            id: item.dataset.id
        });
        
        // Add to scene
        galaxyCenter.add(mesh);
    });
    
    // Add raycaster for interactivity
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    // Add event listeners
    container.addEventListener('click', onGalaxyClick);
    container.addEventListener('mousemove', onGalaxyMouseMove);
    
    function onGalaxyClick(event) {
        // Calculate mouse position
        mouse.x = (event.clientX - container.getBoundingClientRect().left) / container.clientWidth * 2 - 1;
        mouse.y = -((event.clientY - container.getBoundingClientRect().top) / container.clientHeight) * 2 + 1;
        
        // Update the picking ray with the camera and mouse position
        raycaster.setFromCamera(mouse, camera);
        
        // Calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects(galaxyCenter.children);
        
        if (intersects.length > 0) {
            // Find the image object
            const selectedObject = imageObjects.find(obj => obj.mesh === intersects[0].object);
            if (selectedObject) {
                const itemId = selectedObject.id;
                const itemData = getGalleryItemById(itemId);
                openLightbox(itemData);
            }
        }
    }
    
    function onGalaxyMouseMove(event) {
        // Calculate mouse position
        mouse.x = (event.clientX - container.getBoundingClientRect().left) / container.clientWidth * 2 - 1;
        mouse.y = -((event.clientY - container.getBoundingClientRect().top) / container.clientHeight) * 2 + 1;
        
        // Update the picking ray with the camera and mouse position
        raycaster.setFromCamera(mouse, camera);
        
        // Calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects(galaxyCenter.children);
        
        // Reset all image scales
        imageObjects.forEach(obj => {
            obj.mesh.scale.set(1, 1, 1);
        });
        
        if (intersects.length > 0) {
            // Enlarge the hovered image
            const selectedObject = imageObjects.find(obj => obj.mesh === intersects[0].object);
            if (selectedObject) {
                selectedObject.mesh.scale.set(1.2, 1.2, 1.2);
                container.style.cursor = 'pointer';
            }
        } else {
            container.style.cursor = 'default';
        }
    }
    
    // Handle mouse movement for camera control
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Update image orbits
        imageObjects.forEach(obj => {
            obj.orbitAngle += obj.orbitSpeed;
            
            obj.mesh.position.x = obj.orbitRadius * Math.sin(obj.orbitAngle);
            obj.mesh.position.z = obj.orbitRadius * Math.cos(obj.orbitAngle);
            
            // Make images always face the camera
            obj.mesh.lookAt(camera.position);
        });
        
        // Rotate galaxy center slightly
        galaxyCenter.rotation.y += 0.001;
        
        // Move camera based on mouse
        camera.position.x += (mouseX * 5 - camera.position.x) * 0.01;
        camera.position.y += (mouseY * 5 - camera.position.y) * 0.01;
        camera.lookAt(scene.position);
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// Helper function to get gallery item by id
function getGalleryItemById(id) {
    // In a real app, this would come from an API or database
    // For demo purposes, we'll recreate the object
    const galleryItems = [
        {
            id: 1,
            image: "https://res.cloudinary.com/dacbvhtgz/image/upload/v1743494564/2024-02-08_09-00-03_UTC_8_vgl2px.jpg",
            title: 'Music Bank Performance',
            event: 'Music Bank',
            date: '2023-06-12',
            category: 'stage',
            year: '2023',
            outfit: 'Blue Dress'
        },
        {
            id: 2,
            image: "https://res.cloudinary.com/dacbvhtgz/image/upload/v1743494564/2024-02-08_09-00-03_UTC_8_vgl2px.jpg",
            title: 'Cosmopolitan Photoshoot',
            event: 'Magazine Cover',
            date: '2023-01-15',
            category: 'photoshoot',
            year: '2023',
            outfit: 'White Elegant Suit'
        },
        {
            id: 3,
            image: "https://res.cloudinary.com/dacbvhtgz/image/upload/v1743494564/2024-02-08_09-00-03_UTC_8_vgl2px.jpg",
            title: 'Inkigayo Performance',
            event: 'Inkigayo',
            date: '2022-12-04',
            category: 'stage',
            year: '2022',
            outfit: 'Red Performance Outfit'
        },
        {
            id: 4,
            image: "https://res.cloudinary.com/dacbvhtgz/image/upload/v1743494564/2024-02-08_09-00-03_UTC_8_vgl2px.jpg",
            title: 'Brand Ambassador Event',
            event: 'Brand Event',
            date: '2022-10-20',
            category: 'event',
            year: '2022',
            outfit: 'Pink Gown'
        },
        {
            id: 5,
            image: "https://res.cloudinary.com/dacbvhtgz/image/upload/v1743494564/2024-02-08_09-00-03_UTC_8_vgl2px.jpg",
            title: 'Airport Fashion',
            event: 'Daily Life',
            date: '2022-09-15',
            category: 'daily',
            year: '2022',
            outfit: 'Casual Streetwear'
        },
        {
            id: 6,
            image: "https://res.cloudinary.com/dacbvhtgz/image/upload/v1743494564/2024-02-08_09-00-03_UTC_8_vgl2px.jpg",
            title: 'After LIKE MV Behind',
            event: 'Music Video',
            date: '2022-08-22',
            category: 'photoshoot',
            year: '2022',
            outfit: 'MV Outfit'
        },
        {
            id: 7,
            image: "https://res.cloudinary.com/dacbvhtgz/image/upload/v1743494564/2024-02-08_09-00-03_UTC_8_vgl2px.jpg",
            title: 'KCON 2022',
            event: 'Concert',
            date: '2022-05-08',
            category: 'stage',
            year: '2022',
            outfit: 'Stage Outfit'
        },
        {
            id: 8,
            image: "https://res.cloudinary.com/dacbvhtgz/image/upload/v1743494564/2024-02-08_09-00-03_UTC_8_vgl2px.jpg",
            title: 'Fansign Event',
            event: 'Fan Meeting',
            date: '2022-04-16',
            category: 'event',
            year: '2022',
            outfit: 'Casual Elegant'
        },
        {
            id: 9,
            image: "https://res.cloudinary.com/dacbvhtgz/image/upload/v1743494564/2024-02-08_09-00-03_UTC_8_vgl2px.jpg",
            title: 'IVE Debut Showcase',
            event: 'Showcase',
            date: '2021-12-01',
            category: 'stage',
            year: '2021',
            outfit: 'ELEVEN Outfit'
        },
        {
            id: 10,
            image: "https://res.cloudinary.com/dacbvhtgz/image/upload/v1743494564/2024-02-08_09-00-03_UTC_8_vgl2px.jpg",
            title: 'Summer Vacation',
            event: 'Daily Life',
            date: '2021-08-10',
            category: 'daily',
            year: '2021',
            outfit: 'Summer Casual'
        },
        {
            id: 11,
            image: "https://res.cloudinary.com/dacbvhtgz/image/upload/v1743494564/2024-02-08_09-00-03_UTC_8_vgl2px.jpg",
            title: 'IZ*ONE Final Concert',
            event: 'Concert',
            date: '2021-03-14',
            category: 'stage',
            year: '2021',
            outfit: 'Formal Gown'
        },
        {
            id: 12,
            image: "https://res.cloudinary.com/dacbvhtgz/image/upload/v1743494564/2024-02-08_09-00-03_UTC_8_vgl2px.jpg",
            title: 'MAMA Awards',
            event: 'Award Show',
            date: '2020-12-06',
            category: 'event',
            year: '2020',
            outfit: 'Red Carpet Gown'
        }
    ];
    
    return galleryItems.find(item => item.id == id);
}

// Function to initialize timeline with mystical effects
function initTimeline() {
    const timelineEvents = document.querySelector('.timeline-events');
    
    // Sample timeline data
    const timelineData = [
        {
            date: '2018-09-01',
            title: 'Ra mắt với Produce 48',
            description: 'Wonyoung giành vị trí #1 trong chương trình sống còn Produce 48 và ra mắt với nhóm IZ*ONE.'
        },
        {
            date: '2021-04-29',
            title: 'Tan rã IZ*ONE',
            description: 'Sau 2.5 năm hoạt động, IZ*ONE chính thức tan rã. Wonyoung trở về công ty Starship Entertainment.'
        },
        {
            date: '2021-12-01',
            title: 'Ra mắt với IVE',
            description: 'Wonyoung chính thức ra mắt cùng nhóm nhạc mới IVE với single "ELEVEN".'
        },
        {
            date: '2022-04-05',
            title: 'Phát hành "LOVE DIVE"',
            description: 'IVE phát hành single thứ hai "LOVE DIVE" và đạt được thành công lớn trên các bảng xếp hạng âm nhạc.'
        },
        {
            date: '2022-08-22',
            title: 'Phát hành "After LIKE"',
            description: 'IVE tiếp tục thành công với single "After LIKE", củng cố vị thế trong làng nhạc K-pop.'
        },
        {
            date: '2023-04-10',
            title: 'Album đầu tay "I\'ve IVE"',
            description: 'IVE phát hành album đầy đủ đầu tiên "I\'ve IVE" với title track "I AM".'
        }
    ];
    
    // Xóa bỏ timeline events cũ nếu có
    timelineEvents.innerHTML = '';
    
    // Create timeline events with mystical effects
    timelineData.forEach((event, index) => {
        const eventElement = document.createElement('div');
        eventElement.className = 'timeline-event';
        
        // Add mystical star element
        const starElement = document.createElement('div');
        starElement.className = 'timeline-star';
        
        // Create cosmic glow effect
        const glowElement = document.createElement('div');
        glowElement.className = 'cosmic-glow';
        
        eventElement.innerHTML = `
            <div class="timeline-date">${formatDate(event.date)}</div>
            <h3 class="timeline-title">${event.title}</h3>
            <p class="timeline-description">${event.description}</p>
        `;
        
        // Add delay based on index for staggered animation
        eventElement.style.animationDelay = `${index * 0.2}s`;
        
        // Add star and glow elements
        eventElement.appendChild(starElement);
        eventElement.appendChild(glowElement);
        
        timelineEvents.appendChild(eventElement);
    });
    
    // Add cosmic particles to timeline
    const timelineContainer = document.querySelector('.timeline-container');
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'cosmic-particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 15 + 10}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        timelineContainer.appendChild(particle);
    }
    
    // Animate timeline events on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });
    
    document.querySelectorAll('.timeline-event').forEach(event => {
        observer.observe(event);
    });
}

// Function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Function to initialize music player
function initMusicPlayer() {
    const playerToggle = document.getElementById('player-toggle-btn');
    const musicPlayer = document.getElementById('music-player');
    const playButton = document.querySelector('.player-play');
    const prevButton = document.querySelector('.player-prev');
    const nextButton = document.querySelector('.player-next');
    const volumeSlider = document.querySelector('.volume-slider');
    const timeline = document.querySelector('.player-timeline');
    const progress = document.querySelector('.timeline-progress');
    const backgroundMusic = document.getElementById('background-music');
    
    // Sample playlist
    const playlist = [
        {
            name: 'Love Dive',
            artist: 'IVE',
            src: 'https://assets.codepen.io/217233/ambience.mp3', // Placeholder URL
            cover: 'https://i.imgur.com/uKQqsuA.jpg'
        },
        {
            name: 'ELEVEN',
            artist: 'IVE',
            src: 'https://assets.codepen.io/217233/ambience.mp3', // Placeholder URL
            cover: 'https://res.cloudinary.com/dacbvhtgz/image/upload/v1743494564/2024-02-08_09-00-03_UTC_8_vgl2px.jpg'
        },
        {
            name: 'After LIKE',
            artist: 'IVE',
            src: 'https://assets.codepen.io/217233/ambience.mp3', // Placeholder URL
            cover: 'https://res.cloudinary.com/dacbvhtgz/image/upload/v1718695130/xwmqeytqj85j5mkydxpk.jpg'
        }
    ];
    
    let currentTrack = 0;
    let isPlaying = false;
    
    // Toggle player visibility
    playerToggle.addEventListener('click', () => {
        document.getElementById('click-sound').play().catch(e => console.log('Audio play prevented: ', e));
        musicPlayer.classList.toggle('active');
    });
    
    // Play/Pause
    playButton.addEventListener('click', () => {
        document.getElementById('click-sound').play().catch(e => console.log('Audio play prevented: ', e));
        
        if (isPlaying) {
            backgroundMusic.pause();
            playButton.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            backgroundMusic.play().catch(e => console.log('Audio play prevented: ', e));
            playButton.innerHTML = '<i class="fas fa-pause"></i>';
        }
        
        isPlaying = !isPlaying;
    });
    
    // Previous track
    prevButton.addEventListener('click', () => {
        document.getElementById('click-sound').play().catch(e => console.log('Audio play prevented: ', e));
        currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrack);
    });
    
    // Next track
    nextButton.addEventListener('click', () => {
        document.getElementById('click-sound').play().catch(e => console.log('Audio play prevented: ', e));
        currentTrack = (currentTrack + 1) % playlist.length;
        loadTrack(currentTrack);
    });
    
    // Volume control
    volumeSlider.addEventListener('input', () => {
        backgroundMusic.volume = volumeSlider.value / 100;
    });
    
    // Timeline control
    timeline.addEventListener('click', (e) => {
        const timelineWidth = timeline.clientWidth;
        const clickPosition = e.offsetX;
        const duration = backgroundMusic.duration;
        
        backgroundMusic.currentTime = (clickPosition / timelineWidth) * duration;
    });
    
    // Update progress
    backgroundMusic.addEventListener('timeupdate', () => {
        const duration = backgroundMusic.duration;
        if (duration) {
            const currentTime = backgroundMusic.currentTime;
            const progressPercent = (currentTime / duration) * 100;
            progress.style.width = `${progressPercent}%`;
        }
    });
    
    // Load track
    function loadTrack(index) {
        const track = playlist[index];
        
        // Update track info
        document.querySelector('.track-name').textContent = track.name;
        document.querySelector('.artist-name').textContent = track.artist;
        document.querySelector('.album-art').src = track.cover;
        
        // Update audio source
        backgroundMusic.src = track.src;
        
        // Play if already playing
        if (isPlaying) {
            backgroundMusic.play().catch(e => console.log('Audio play prevented: ', e));
        }
    }
    
    // Initialize first track
    loadTrack(currentTrack);
}

// Functions for favorites
function initFavorites() {
    const favoritesDrawer = document.getElementById('favorites-drawer');
    const favoritesContainer = document.querySelector('.favorites-container');
    const closeButton = document.querySelector('.drawer-close');
    
    // Close drawer
    closeButton.addEventListener('click', () => {
        document.getElementById('click-sound').play().catch(e => console.log('Audio play prevented: ', e));
        favoritesDrawer.classList.remove('active');
    });
    
    // Check for existing favorites
    loadFavorites();
}

// Function to add item to favorites
function addToFavorites(item) {
    // Get existing favorites from localStorage
    let favorites = JSON.parse(localStorage.getItem('wonyoungFavorites')) || [];
    
    // Check if already in favorites
    if (!favorites.some(fav => fav.id == item.id)) {
        favorites.push(item);
        localStorage.setItem('wonyoungFavorites', JSON.stringify(favorites));
        
        // Update favorites in UI
        updateFavoritesUI();
    }
}

// Function to remove item from favorites
function removeFromFavorites(id) {
    // Get existing favorites from localStorage
    let favorites = JSON.parse(localStorage.getItem('wonyoungFavorites')) || [];
    
    // Remove item
    favorites = favorites.filter(item => item.id != id);
    localStorage.setItem('wonyoungFavorites', JSON.stringify(favorites));
    
    // Update favorites in UI
    updateFavoritesUI();
}

// Function to check if item is in favorites
function isInFavorites(id) {
    // Get existing favorites from localStorage
    const favorites = JSON.parse(localStorage.getItem('wonyoungFavorites')) || [];
    
    // Check if ID exists
    return favorites.some(item => item.id == id);
}

// Function to load favorites
function loadFavorites() {
    // Get favorites from localStorage
    const favorites = JSON.parse(localStorage.getItem('wonyoungFavorites')) || [];
    
    // Update UI
    updateFavoritesUI();
}

// Function to update favorites UI
function updateFavoritesUI() {
    const favoritesContainer = document.querySelector('.favorites-container');
    const favorites = JSON.parse(localStorage.getItem('wonyoungFavorites')) || [];
    
    // Clear container
    favoritesContainer.innerHTML = '';
    
    if (favorites.length === 0) {
        favoritesContainer.innerHTML = '<p class="text-center">Chưa có ảnh yêu thích nào.</p>';
        return;
    }
    
    // Add each favorite
    favorites.forEach(item => {
        const favoriteItem = document.createElement('div');
        favoriteItem.className = 'favorite-item';
        
        favoriteItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="favorite-img">
            <div class="favorite-info">
                <h4 class="favorite-title">${item.title}</h4>
                <p class="favorite-date">${item.event} - ${item.date}</p>
            </div>
            <button class="favorite-remove" data-id="${item.id}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        favoritesContainer.appendChild(favoriteItem);
        
        // Add click handler to open lightbox
        favoriteItem.addEventListener('click', (e) => {
            if (!e.target.closest('.favorite-remove')) {
                openLightbox(item);
            }
        });
        
        // Add remove handler
        const removeButton = favoriteItem.querySelector('.favorite-remove');
        removeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('click-sound').play().catch(e => console.log('Audio play prevented: ', e));
            removeFromFavorites(item.id);
        });
    });
}

// Function to initialize AR viewer
function initARViewer() {
    const arViewer = document.getElementById('ar-viewer');
    const arContainer = document.querySelector('.ar-container');
    const closeButton = document.querySelector('.ar-close');
    
    // Close AR viewer
    closeButton.addEventListener('click', () => {
        document.getElementById('click-sound').play().catch(e => console.log('Audio play prevented: ', e));
        arViewer.classList.remove('active');
    });
    
    // For demo purposes, we'll just show a button in the lightbox to open AR view
    // Create AR button in lightbox
    const lightboxActions = document.querySelector('.lightbox-actions');
    const arButton = document.createElement('button');
    arButton.className = 'action-btn ar-btn';
    arButton.innerHTML = '<i class="fas fa-cube"></i><span>AR View</span>';
    
    lightboxActions.appendChild(arButton);
    
    arButton.addEventListener('click', () => {
        document.getElementById('click-sound').play().catch(e => console.log('Audio play prevented: ', e));
        
        // Get current image
        const currentImage = document.querySelector('.lightbox-image').src;
        
        // Initialize AR scene with that image
        initARScene(currentImage);
        
        // Show AR viewer
        arViewer.classList.add('active');
    });
}

// Function to initialize AR scene
function initARScene(imageSrc) {
    const container = document.querySelector('.ar-container');
    
    // Clear previous content
    container.innerHTML = '';
    
    // Create scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 3;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);
    
    // Load texture from current image
    const texture = new THREE.TextureLoader().load(imageSrc);
    
    // Create material and geometry
    const material = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide
    });
    
    const geometry = new THREE.PlaneGeometry(2, 3);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    // Add controls
    const rotateBtn = document.querySelector('.ar-rotate');
    const zoomInBtn = document.querySelector('.ar-zoom-in');
    const zoomOutBtn = document.querySelector('.ar-zoom-out');
    
    let isRotating = false;
    let rotationSpeed = 0.01;
    
    // Rotation control
    rotateBtn.addEventListener('click', () => {
        document.getElementById('click-sound').play().catch(e => console.log('Audio play prevented: ', e));
        isRotating = !isRotating;
        rotateBtn.classList.toggle('active');
    });
    
    // Zoom in
    zoomInBtn.addEventListener('click', () => {
        document.getElementById('click-sound').play().catch(e => console.log('Audio play prevented: ', e));
        if (camera.position.z > 1) {
            camera.position.z -= 0.5;
        }
    });
    
    // Zoom out
    zoomOutBtn.addEventListener('click', () => {
        document.getElementById('click-sound').play().catch(e => console.log('Audio play prevented: ', e));
        if (camera.position.z < 5) {
            camera.position.z += 0.5;
        }
    });
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        if (isRotating) {
            mesh.rotation.y += rotationSpeed;
        }
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// Function to initialize theme toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle-btn');
    const icon = themeToggle.querySelector('i');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('wonyoungTheme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
    
    // Theme toggle handler
    themeToggle.addEventListener('click', () => {
        document.getElementById('click-sound').play().catch(e => console.log('Audio play prevented: ', e));
        
        document.body.classList.toggle('light-theme');
        
        if (document.body.classList.contains('light-theme')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('wonyoungTheme', 'light');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('wonyoungTheme', 'dark');
        }
    });
}

// Function to initialize language selector
function initLanguageSelector() {
    const languageSelect = document.getElementById('language-select');
    
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('wonyoungLanguage');
    if (savedLanguage) {
        languageSelect.value = savedLanguage;
        translateUI(savedLanguage);
    }
    
    // Language change handler
    languageSelect.addEventListener('change', () => {
        document.getElementById('click-sound').play().catch(e => console.log('Audio play prevented: ', e));
        
        const selectedLanguage = languageSelect.value;
        translateUI(selectedLanguage);
        localStorage.setItem('wonyoungLanguage', selectedLanguage);
    });
}

// Function to translate UI
function translateUI(language) {
    // Translation data for different languages
    const translations = {
        vi: {
            all: 'Tất cả',
            event: 'Sự kiện',
            photoshoot: 'Photoshoot',
            stage: 'Stage',
            daily: 'Daily',
            allYears: 'Mọi năm',
            search: 'Tìm kiếm...',
            favorites: 'Bộ sưu tập yêu thích',
            noFavorites: 'Chưa có ảnh yêu thích nào.',
            event_label: 'Sự kiện:',
            date_label: 'Ngày:',
            outfit_label: 'Outfit:',
            favorite: 'Yêu thích',
            download: 'Tải về',
            share: 'Chia sẻ',
            timeline: 'Chặng đường của Wonyoung',
            exploreUniverse: 'Khám phá vũ trụ'
        },
        en: {
            all: 'All',
            event: 'Event',
            photoshoot: 'Photoshoot',
            stage: 'Stage',
            daily: 'Daily',
            allYears: 'All Years',
            search: 'Search...',
            favorites: 'Favorites Collection',
            noFavorites: 'No favorite images yet.',
            event_label: 'Event:',
            date_label: 'Date:',
            outfit_label: 'Outfit:',
            favorite: 'Favorite',
            download: 'Download',
            share: 'Share',
            timeline: 'Wonyoung\'s Journey',
            exploreUniverse: 'Explore Universe'
        },
        ko: {
            all: '모두',
            event: '이벤트',
            photoshoot: '포토슛',
            stage: '무대',
            daily: '일상',
            allYears: '모든 연도',
            search: '검색...',
            favorites: '즐겨찾기 컬렉션',
            noFavorites: '아직 즐겨찾기 이미지가 없습니다.',
            event_label: '이벤트:',
            date_label: '날짜:',
            outfit_label: '의상:',
            favorite: '즐겨찾기',
            download: '다운로드',
            share: '공유',
            timeline: '장원영의 여정',
            exploreUniverse: '우주 탐험'
        }
    };
    
    // Get translation for selected language
    const trans = translations[language];
    
    // Update UI with translations
    document.querySelectorAll('[data-filter="all"]').forEach(el => el.textContent = trans.all);
    document.querySelectorAll('[data-filter="event"]').forEach(el => el.textContent = trans.event);
    document.querySelectorAll('[data-filter="photoshoot"]').forEach(el => el.textContent = trans.photoshoot);
    document.querySelectorAll('[data-filter="stage"]').forEach(el => el.textContent = trans.stage);
    document.querySelectorAll('[data-filter="daily"]').forEach(el => el.textContent = trans.daily);
    
    document.querySelector('#year-filter option[value="all"]').textContent = trans.allYears;
    document.querySelector('.search-box input').placeholder = trans.search;
    
    document.querySelector('.drawer-header h3').textContent = trans.favorites;
    if (document.querySelector('.favorites-container p')) {
        document.querySelector('.favorites-container p').textContent = trans.noFavorites;
    }
    
    document.querySelectorAll('.info-label')[0].textContent = trans.event_label;
    document.querySelectorAll('.info-label')[1].textContent = trans.date_label;
    document.querySelectorAll('.info-label')[2].textContent = trans.outfit_label;
    
    document.querySelector('.favorite-btn span').textContent = trans.favorite;
    document.querySelector('.download-btn span').textContent = trans.download;
    document.querySelector('.share-btn span').textContent = trans.share;
    
    document.querySelector('.section-title').textContent = trans.timeline;
    document.querySelector('#enter-button').textContent = trans.exploreUniverse;
}

// Initialize button particles
function initButtonParticles() {
    const particlesContainer = document.getElementById('button-particles');
    
    // Create particles.js configuration
    particlesJS('button-particles', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#e0aaff'
            },
            shape: {
                type: 'circle'
            },
            opacity: {
                value: 0.5,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: false
            },
            move: {
                enable: true,
                speed: 1,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'bubble'
                },
                onclick: {
                    enable: true,
                    mode: 'repulse'
                },
                resize: true
            },
            modes: {
                bubble: {
                    distance: 100,
                    size: 5,
                    duration: 2,
                    opacity: 0.8,
                    speed: 3
                },
                repulse: {
                    distance: 200,
                    duration: 0.4
                }
            }
        },
        retina_detect: true
    });
}