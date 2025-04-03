// Global variables
let isPlaying = false;
let backgroundMusic;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Three.js background immediately
    initThreeJSBackground();
    
    // Always initialize audio basic settings (doesn't play)
    initAudio(); 
    
    const loadingScreen = document.getElementById('loading-screen');
    const welcomeScreen = document.getElementById('welcome-screen');
    const galleryContainer = document.getElementById('gallery-container');
    
    // Remove the check for 'from=transition'
    // const urlParams = new URLSearchParams(window.location.search);
    // const fromTransition = urlParams.get('from') === 'transition';
    
    // Always start with the loading sequence, which then shows the welcome screen
    if (loadingScreen && welcomeScreen) {
        // Start loading sequence - USE initLoading instead of startLoadingSequence
        initLoading(() => { // <--- CORRECTED FUNCTION NAME
            // After loading, show welcome screen
            loadingScreen.style.display = 'none';
            welcomeScreen.style.display = 'flex'; // Or 'block' depending on CSS
            
            // Initialize welcome screen interactions (which handles gallery init on button click)
            initWelcomeScreen();
            
            // Initialize music player structure here, but don't force play.
            // Actual play is triggered by the welcome screen button click.
            initMusicPlayer();
            
        });
    } else {
        // Fallback if loading/welcome screens are missing
        console.warn("Loading or Welcome screen not found. Attempting to show gallery directly.");
        if (galleryContainer) galleryContainer.style.display = 'block'; // Or flex, grid etc.
        
        // Initialize gallery directly in this fallback case
        initGallery(); 
        initMusicPlayer();
        
        // Attempt to play music immediately in this fallback case
        setTimeout(() => {
             const playButton = document.querySelector('.player-play');
             if (playButton && backgroundMusic && backgroundMusic.paused) {
                 playButton.click();
             } else if (backgroundMusic && backgroundMusic.paused) {
                 // Less ideal fallback if button isn't ready
                 backgroundMusic.play().catch(e => console.error("Fallback direct play failed", e));
             }
        }, 500);
    }

    // Space dust might be part of ThreeJS now, or needs separate handling
    // createSpaceDust(); 
});

// Global flag to prevent multiple gallery initializations (optional, can be useful)
// let galleryInitialized = false;

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

function initLoading(callback) {
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
                            
                            // Gọi callback nếu được cung cấp
                            if (typeof callback === 'function') {
                                callback();
                            }
                            
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
                }, 300);
            }, 300);
        }
    };
}

// Function to initialize welcome screen and handle interactions
function initWelcomeScreen() {
    console.log('Initializing welcome screen');
    const welcomeScreen = document.getElementById('welcome-screen');
    const welcomeCard = document.querySelector('.welcome-card');
    const enterButton = document.getElementById('enter-button');
    const galleryContainer = document.getElementById('gallery-container');
    const pageTransitionOverlay = document.getElementById('page-transition-overlay');
    
    if (!welcomeScreen || !enterButton || !welcomeCard) {
        console.error('Welcome screen, card, or enter button not found');
        return;
    }
    
    // Make sure page transition overlay is ready
    if (!pageTransitionOverlay) {
        console.warn('Page transition overlay not found, creating one');
        const newOverlay = document.createElement('div');
        newOverlay.id = 'page-transition-overlay';
        newOverlay.className = 'page-transition-overlay';
        document.body.appendChild(newOverlay);
    }
    
    // Initialize welcome screen particles
    initButtonParticles();
    
    // Add hover sound to enter button
    enterButton.addEventListener('mouseenter', () => {
        const hoverSound = document.getElementById('hover-sound');
        if (hoverSound) {
            hoverSound.currentTime = 0;
            hoverSound.play().catch(e => console.log('Cannot play hover sound:', e));
        }
    });
    
    // Add click event to enter button with enhanced transition using GSAP Timeline
    console.log('Adding click listener to enter button for enhanced transition');
    enterButton.addEventListener('click', () => {
        console.log('Enter button clicked - Starting enhanced cosmic journey');
        
        // Play click sound
        document.getElementById('click-sound')?.play().catch(e => console.log('Audio play prevented: ', e));
        
        // GSAP Timeline for coordinated animations
        const tl = gsap.timeline({
            onComplete: () => {
                console.log('Transition complete, gallery revealed');
                // Callback after the entire timeline finishes
                welcomeScreen.style.display = 'none'; // Ensure welcome screen is hidden
            }
        });
        
        const canvas = document.getElementById('canvas-container');
        
        tl
        // 1. Animate Welcome Card Out
        .to(welcomeCard, {
            opacity: 0,
            scale: 0.8,
            y: -100, // Fly up slightly
            duration: 0.6,
            ease: "power3.in"
        }, 0) // Start at time 0
        
        // 2. Zoom Canvas and Fade (More dramatic)
        .to(canvas, {
            scale: 3, // Zoom in more
            opacity: 0.5,
            duration: 1.0, // Slightly faster zoom
            ease: "power3.in"
        }, 0.1) // Start slightly after card animation begins
        
        // 3. Activate Page Transition Overlay (Fade in)
        .to(pageTransitionOverlay, {
            opacity: 1,
            duration: 0.7, 
            ease: "power2.inOut",
            onStart: () => pageTransitionOverlay.classList.add('active')
        }, 0.5) // Start overlay fade in mid-zoom
        
        // --- Actions after overlay is fully opaque --- 
        .add(() => {
            console.log('Overlay active, preparing gallery');
            // Hide welcome screen immediately
            welcomeScreen.style.display = 'none';
            
            // Prepare gallery for display
            galleryContainer.style.display = 'flex';
            galleryContainer.style.opacity = '0';
            
            // Initialize gallery content
            initSimpleGallery();
            
            // Ensure music is playing
            if (backgroundMusic && backgroundMusic.paused) {
                backgroundMusic.play().catch(e => console.error('Could not autoplay music:', e));
                isPlaying = true;
                updateSoundIcons();
            }
        }, ">-=0.1") // Execute slightly before overlay finishes fading in
        
        // 4. Reset Canvas and Fade Out Overlay to reveal Gallery
        .to(canvas, {
            scale: 1, // Reset zoom
            opacity: 1,
            duration: 1.2, // Smooth transition back
            ease: "power3.out"
        }, "+=0.2") // Start after a short pause
        
        .to(galleryContainer, {
            opacity: 1,
            duration: 1.0, // Fade in gallery
            ease: "power2.out"
        }, "<+0.3") // Start gallery fade-in slightly after canvas starts resetting
        
        // Animate gallery items entrance within the main timeline
        .fromTo('.grid-item', 
            { y: 50, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 0.8, 
                stagger: 0.05,
                ease: "power2.out"
            }, "<+0.5") // Stagger items after gallery starts fading in
        
        .to(pageTransitionOverlay, {
            opacity: 0,
            duration: 0.8, // Fade out overlay
            ease: "power2.out",
            onComplete: () => pageTransitionOverlay.classList.remove('active')
        }, "<+0.2"); // Start fading out overlay as gallery reveals
    });
}

// New simple gallery initialization function without 3D
function initSimpleGallery() {
    console.log('Initializing simple gallery');
    const galleryContainer = document.getElementById('gallery-container');
    
    if (!galleryContainer) {
        console.error('Gallery container not found');
        return;
    }
    
    // Create a clean, minimalist header
    const header = document.createElement('header');
    header.className = 'gallery-header';
    header.innerHTML = `
        <h1 class="gallery-title">Bộ Sưu Tập Wonyoung</h1>
        <p class="gallery-subtitle">Khám phá hình ảnh tuyệt đẹp</p>
    `;
    
    // Create gallery content
    const galleryContent = document.createElement('div');
    galleryContent.className = 'gallery-content';
    galleryContent.innerHTML = `
        <div class="gallery-grid" id="gallery-grid"></div>
        <div class="continue-button-container">
            <button class="continue-button" id="continue-button">
                Tiếp Tục Hành Trình
                <i class="fas fa-arrow-right"></i>
            </button>
        </div>
    `;
    
    // Clear existing content
    galleryContainer.innerHTML = '';
    
    // Add new elements
    galleryContainer.appendChild(header);
    galleryContainer.appendChild(galleryContent);
    
    // Load gallery images
    loadGalleryImages();
    
    // Add event listener to continue button
    setTimeout(() => {
        const continueButton = document.getElementById('continue-button');
        if (continueButton) {
            continueButton.addEventListener('click', () => {
                // Transition to Image Journey section
                const pageTransitionOverlay = document.getElementById('page-transition-overlay');
                if (pageTransitionOverlay) {
                    pageTransitionOverlay.classList.add('active');
                    
                    setTimeout(() => {
                        // Hide gallery with first design
                        galleryContainer.style.opacity = '0';
                        
                        // Load second gallery design
                        setTimeout(() => {
                            initGalleryTwo();
                            
                            // Hide overlay
                            pageTransitionOverlay.classList.remove('active');
                        }, 600);
                    }, 500);
                }
            });
        }
    }, 1000);
    
    // Initialize music player UI
    initMusicPlayer();
}

// Second gallery design with different UX
function initGalleryTwo() {
    console.log('Initializing gallery design two');
    const galleryContainer = document.getElementById('gallery-container');
    
    if (!galleryContainer) {
        console.error('Gallery container not found');
        return;
    }
    
    // Reset gallery container
    galleryContainer.style.opacity = '0';
    
    // Change gallery structure for a new experience
    galleryContainer.innerHTML = `
        <header class="gallery-header-two">
            <h1 class="gallery-title-two">Hành Trình Wonyoung</h1>
            <p class="gallery-subtitle-two">Trải nghiệm khác biệt</p>
        </header>
        
        <div class="gallery-timeline" id="gallery-timeline"></div>
        
        <div class="navigation-controls">
            <button class="nav-button prev-button">
                <i class="fas fa-chevron-left"></i>
            </button>
            <div class="pagination-indicator" id="pagination-indicator"></div>
            <button class="nav-button next-button">
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    `;
    
    // Load timeline data
    loadTimelineContent();
    
    // Set up navigation controls
    setupTimelineNavigation();
    
    // Fade in the new gallery
    setTimeout(() => {
        galleryContainer.style.opacity = '1';
        
        // Animate timeline items
        const timelineItems = document.querySelectorAll('.timeline-item');
        gsap.fromTo(timelineItems, 
            { x: -100, opacity: 0 },
            { 
                x: 0, 
                opacity: 1, 
                duration: 0.8, 
                stagger: 0.2,
                ease: "back.out(1.5)"
            }
        );
    }, 100);
}

// Function to initialize audio and ensure it auto-plays
function initAudio() {
    console.log('Initializing audio...');
    
    // Get the background music element
    backgroundMusic = document.getElementById('background-music');
    if (!backgroundMusic) {
        console.error('Background music element not found');
        return;
    }
    
    // Ensure the music source is set
    if (backgroundMusic.querySelector('source').src.includes('mlem.mp3')) {
        console.log('Music source already set to mlem.mp3');
    } else {
        console.log('Setting music source to mlem.mp3');
        backgroundMusic.querySelector('source').src = 'mlem.mp3';
    }
    
    // Set volume to 30%
    backgroundMusic.volume = 0.3;
    
    // Force autoplay without user interaction
    const attemptPlay = () => {
        backgroundMusic.play()
            .then(() => {
                console.log('Background music started automatically');
                // isPlaying and icons are now handled by onplay listener
            })
            .catch(error => {
                console.warn('Auto-play prevented by browser:', error);
                // If autoplay is prevented, try again after a short delay
                // No longer retrying indefinitely here, browser interaction needed.
                // setTimeout(attemptPlay, 1000);
            });
    };
    
    // Initial play attempt
    attemptPlay();
    
    // Also attempt playback when visibility changes
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && backgroundMusic.paused) {
            console.log('Page became visible, attempting to restart music');
            backgroundMusic.play().catch(e => console.warn('Could not play music on visibility change', e));
        }
    });

    // Add core event listeners for play/pause state management
    backgroundMusic.addEventListener('play', () => {
        console.log('Music playing, isPlaying set to true');
        isPlaying = true;
        updateSoundIcons();
    });

    backgroundMusic.addEventListener('pause', () => {
        console.log('Music paused, isPlaying set to false');
        isPlaying = false;
        updateSoundIcons();
    });

    // Add event listeners for general sound toggle buttons (like in header/gallery)
    const soundToggleButtons = document.querySelectorAll('.sound-toggle');
    soundToggleButtons.forEach(button => {
        button.addEventListener('click', toggleMusic);
    });
    
    // REMOVED: Setup play next track handling (only one track now)
    // backgroundMusic.addEventListener('ended', () => {
    //     console.log('Track ended, playing next track');
    //     playNextTrack();
    // });
    
    // REMOVED: Initial update of all sound icons (now handled by play/pause listeners)
    // updateSoundIcons();
}

// Define the updateSoundIcons function (if not already defined)
function updateSoundIcons() {
    // Update all sound toggle icons
    const soundIcons = document.querySelectorAll('.sound-toggle i');
    const playerPlayIcon = document.querySelector('.player-play i');
    
    soundIcons.forEach(icon => {
        if (isPlaying) {
            if (icon.classList.contains('fa-volume-xmark')) {
                icon.classList.remove('fa-volume-xmark');
                icon.classList.add('fa-volume-high');
            }
        } else {
            if (icon.classList.contains('fa-volume-high')) {
                icon.classList.remove('fa-volume-high');
                icon.classList.add('fa-volume-xmark');
            }
        }
    });
    
    // Update player play button icon
    if (playerPlayIcon) {
        if (isPlaying) {
            if (playerPlayIcon.classList.contains('fa-play')) {
                playerPlayIcon.classList.remove('fa-play');
                playerPlayIcon.classList.add('fa-pause');
            }
        } else {
            if (playerPlayIcon.classList.contains('fa-pause')) {
                playerPlayIcon.classList.remove('fa-pause');
                playerPlayIcon.classList.add('fa-play');
            }
        }
    }
    
    // Also update any welcome screen icon if it exists
    const welcomeScreenSoundIcon = document.querySelector('.welcome-screen .sound-toggle i');
    if (welcomeScreenSoundIcon) {
        if (isPlaying) {
            welcomeScreenSoundIcon.className = 'fas fa-volume-high';
        } else {
            welcomeScreenSoundIcon.className = 'fas fa-volume-xmark';
        }
    }
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

// Function to initialize gallery
function initGallery() {
    console.log('Initializing gallery with new approach');
    
    try {
        // Khởi tạo gallery đơn giản
        initSimpleGallery();
        
        // Khởi tạo music player
        initMusicPlayer();
    } catch (error) {
        console.error('Error initializing gallery:', error);
    }
}

// Function to load gallery images with Wonyoung images
function loadGalleryImages() {
    const galleryGrid = document.querySelector('.gallery-grid');
    
    if (!galleryGrid) {
        console.error('Gallery grid not found');
        return;
    }
    
    // Gallery items data
    const galleryItems = [
        {
            id: 1,
            image: 'https://res.cloudinary.com/dacbvhtgz/image/upload/v1743494564/2022-12-18_16-56-14_UTC_nkbylf.jpg',
            title: 'Eleven Era',
            event: 'IVE Debut',
            date: 'December 2021',
            category: 'Performance',
            year: '2021'
        },
        {
            id: 2,
            image: 'https://res.cloudinary.com/dacbvhtgz/image/upload/v1743494571/2022-04-05_09-34-16_UTC_v5zdkm.jpg',
            title: 'Love Dive Era',
            event: 'Music Bank',
            date: 'April 2022',
            category: 'Performance',
            year: '2022'
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
            date: '2018-08-31',
            title: 'Ra mắt với Produce 48',
            description: 'Jang Wonyoung đã ra mắt thông qua chương trình sống còn Produce 48 và xếp hạng #1, trở thành center của nhóm nhạc IZ*ONE.',
            image: 'https://via.placeholder.com/300x400.png?text=Produce+48' // Placeholder
        },
        {
            date: '2018-10-29',
            title: 'Ra mắt cùng IZ*ONE',
            description: 'IZ*ONE chính thức ra mắt với mini album đầu tay "COLOR*IZ" và ca khúc chủ đề "La Vie en Rose".',
            image: 'https://via.placeholder.com/300x400.png?text=IZ*ONE+Debut' // Placeholder
        },
        {
            date: '2021-04-29',
            title: 'Tan rã IZ*ONE',
            description: 'Sau 2 năm 6 tháng hoạt động, IZ*ONE chính thức tan rã. Wonyoung trở về Starship Entertainment.',
            image: 'https://via.placeholder.com/300x400.png?text=IZ*ONE+Disband' // Placeholder
        },
        {
            date: '2021-12-01',
            title: 'Ra mắt cùng IVE',
            description: 'Wonyoung ra mắt với tư cách là thành viên của nhóm nhạc mới IVE với single đầu tay "ELEVEN".',
            image: 'https://via.placeholder.com/300x400.png?text=IVE+Debut' // Placeholder
        },
        {
            date: '2022-04-05',
            title: 'Comeback với LOVE DIVE',
            description: 'IVE phát hành single thứ hai "LOVE DIVE" và đạt được thành công lớn, giúp nhóm giành nhiều cúp trên các chương trình âm nhạc.',
            image: 'https://via.placeholder.com/300x400.png?text=LOVE+DIVE' // Placeholder
        },
        {
            date: '2022-08-22',
            title: 'Phát hành After LIKE',
            description: 'IVE phát hành single thứ ba "After LIKE", tiếp tục khẳng định vị thế của nhóm trong ngành công nghiệp âm nhạc Kpop.',
            image: 'https://via.placeholder.com/300x400.png?text=After+LIKE' // Placeholder
        },
        {
            date: '2023-04-10',
            title: 'Album đầu tay I\'VE IVE',
            description: 'IVE phát hành album đầu tay "I\'VE IVE" với ca khúc chủ đề "I AM" và tiếp tục gặt hái nhiều thành công.',
            image: 'https://via.placeholder.com/300x400.png?text=I\'VE+IVE+Album' // Placeholder
        },
        {
            date: '2023-10-13',
            title: 'Phát hành album I\'VE MINE',
            description: 'IVE phát hành album thứ hai "I\'VE MINE" với ca khúc chủ đề "Baddie", thể hiện sự trưởng thành trong âm nhạc.',
            image: 'https://via.placeholder.com/300x400.png?text=I\'VE+MINE+Album' // Placeholder
        },
        {
            date: '2024-07-29',
            title: 'MLEM Single Release',
            description: 'IVE phát hành bản single mùa hè "MLEM" với sự tỏa sáng của Wonyoung, đánh dấu phong cách mới cho nhóm.',
            image: 'https://via.placeholder.com/300x400.png?text=MLEM+Single' // Placeholder
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
            <div class="timeline-date">${formatDate(new Date(event.date))}</div>
            <h3 class="timeline-title">${event.title}</h3>
            <p class="timeline-description">${event.description}</p>
        `;
        
        // Add delay based on index for staggered animation
        eventElement.style.animationDelay = `${index * 0.3}s`;
        
        // Add star and glow elements
        eventElement.appendChild(starElement);
        eventElement.appendChild(glowElement);
        
        timelineEvents.appendChild(eventElement);
    });
    
    // Add cosmic particles to timeline
    const timelineContainer = document.querySelector('.timeline-container');
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'cosmic-particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 15 + 10}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        timelineContainer.appendChild(particle);
    }
    
    // Add more particles to cosmic background
    const cosmicBackground = document.querySelector('.cosmic-background');
    if (cosmicBackground) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'cosmic-particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.width = `${1 + Math.random() * 2}px`;
            particle.style.height = particle.style.width;
            particle.style.animationDuration = `${Math.random() * 15 + 10}s`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            cosmicBackground.appendChild(particle);
        }
    }
    
    // Animate timeline events on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add sound effect when element becomes visible
                const revealSound = document.getElementById('hover-sound');
                if (revealSound) {
                    try {
                        revealSound.currentTime = 0;
                        revealSound.play().catch(e => console.log('Audio play prevented: ', e));
                    } catch (error) {
                        console.log('Audio play error: ', error);
                    }
                }
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
    const musicPlayer = document.getElementById('music-player');
    // Ensure backgroundMusic is the global variable initialized in initAudio
    if (!backgroundMusic) {
         console.error("Background music element not found or not initialized!");
         backgroundMusic = document.getElementById('background-music'); // Attempt fallback
         if (!backgroundMusic) return;
    }
    
    const playButton = musicPlayer.querySelector('.player-play');
    const prevButton = musicPlayer.querySelector('.player-prev');
    const nextButton = musicPlayer.querySelector('.player-next');
    const volumeSlider = musicPlayer.querySelector('.volume-slider');
    const timeline = musicPlayer.querySelector('.player-timeline');
    const progress = musicPlayer.querySelector('.timeline-progress');
    const albumArt = musicPlayer.querySelector('.album-art');
    const trackName = musicPlayer.querySelector('.track-name');
    const artistName = musicPlayer.querySelector('.artist-name');
    const playerToggleButton = document.getElementById('player-toggle-btn');
    const playerContainer = musicPlayer.querySelector('.player-container');
    const gallerySoundToggle = document.getElementById('gallery-sound-toggle'); // Gallery sound button

    if (!musicPlayer || !playButton || !volumeSlider || !albumArt || !trackName || !artistName) {
        console.error("Essential Music player elements not found!");
        return;
    }
    
    // Default Wonyoung image
    const defaultCoverImage = "https://res.cloudinary.com/dacbvhtgz/image/upload/v1743494564/2024-02-08_09-00-03_UTC_8_vgl2px.jpg";
    
    // Define the playlist - ONLY ONE TRACK
    const playlist = [
        { name: 'Mlem', artist: 'IVE - Wonyoung', src: 'mlem.mp3', cover: defaultCoverImage }
        // { name: 'Love Dive', artist: 'IVE', src: 'https://res.cloudinary.com/dacbvhtgz/video/upload/v1743495389/IVE_LOVE_DIVE_MV_u5yd8k.mp4', cover: defaultCoverImage },
        // { name: 'After LIKE', artist: 'IVE', src: 'https://res.cloudinary.com/dacbvhtgz/video/upload/v1743495391/IVE_After_LIKE_MV_qf5jzv.mp4', cover: defaultCoverImage }
    ];
    
    let currentTrack = 0;
    // Global isPlaying flag is updated by initAudio event listeners
    
    // Toggle Player Visibility
    if (playerToggleButton && playerContainer) {
        playerToggleButton.addEventListener('click', () => {
             document.getElementById('click-sound')?.play().catch(e => console.log('Audio play prevented: ', e));
            // playerContainer.classList.toggle('visible'); // REMOVED: Logic now handled by parent .expanded class
            musicPlayer.classList.toggle('active');    // <-- ADDED THIS LINE TO TOGGLE 'active'
            musicPlayer.classList.toggle('expanded');  // <-- KEPT THIS LINE TO TOGGLE 'expanded'

        });
        // Start expanded and visible
        // playerContainer.classList.add('visible'); // REMOVED: Logic now handled by parent .expanded class
        musicPlayer.classList.add('expanded'); // Start expanded
        musicPlayer.classList.add('active');   // <-- ADDED: Ensure it starts active if expanded
    }else {
        console.log('Player is not expanded');
        musicPlayer.classList.remove('expanded');
        // musicPlayer.classList.remove('active'); // <-- REMOVED: Let the toggle handle this if needed initially
    }
    
    // Play/Pause Button
    playButton.addEventListener('click', () => {
        document.getElementById('click-sound')?.play().catch(e => console.log('Audio play prevented: ', e));
        togglePlayPause();
    });
    
    // Centralized Play/Pause Logic
    function togglePlayPause() {
        if (!backgroundMusic) return;
        if (backgroundMusic.paused || backgroundMusic.ended) {
            backgroundMusic.play().catch(e => {
                console.error('Error playing audio via toggle:', e);
                // updateSoundIcons(false); // Icons updated via listeners
            });
        } else {
            backgroundMusic.pause();
        }
        // Icons are updated via the onplay/onpause event handlers in initAudio
    }
    
    // Sync with gallery sound toggle button
    if (gallerySoundToggle) {
        gallerySoundToggle.addEventListener('click', () => {
            togglePlayPause();
        });
    }
    
    // Previous track - DISABLED
    if (prevButton) {
        prevButton.disabled = true;
        prevButton.style.opacity = '0.5';
        prevButton.style.pointerEvents = 'none';
        // Remove existing listener if any (although unlikely needed here)
        // prevButton.replaceWith(prevButton.cloneNode(true)); 
    }
    // prevButton.addEventListener('click', () => {
    //     document.getElementById('click-sound')?.play().catch(e => console.log('Audio play prevented: ', e));
    //     currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    //     loadTrack(currentTrack);
    // });
    
    // Next track - DISABLED
    if (nextButton) {
        nextButton.disabled = true;
        nextButton.style.opacity = '0.5';
        nextButton.style.pointerEvents = 'none';
        // Remove existing listener if any
        // nextButton.replaceWith(nextButton.cloneNode(true));
    }
    // nextButton.addEventListener('click', () => {
    //     document.getElementById('click-sound')?.play().catch(e => console.log('Audio play prevented: ', e));
    //     currentTrack = (currentTrack + 1) % playlist.length;
    //     loadTrack(currentTrack);
    // });
    
    // Volume control
    volumeSlider.addEventListener('input', () => {
        if (!backgroundMusic) return;
        let volume = volumeSlider.value / 100;
        backgroundMusic.volume = volume;
        backgroundMusic.muted = (volume === 0); // Mute if volume is 0
        // Icons updated via onvolumechange in initAudio
    });
    // Set initial volume based on slider value
    if (backgroundMusic) backgroundMusic.volume = volumeSlider.value / 100;

    // Timeline control
    timeline.addEventListener('click', (e) => {
        if (!backgroundMusic || !backgroundMusic.duration) return;
        const timelineWidth = timeline.clientWidth;
        const clickPosition = e.offsetX;
        const duration = backgroundMusic.duration;
        backgroundMusic.currentTime = (clickPosition / timelineWidth) * duration;
    });
    
    // Update progress bar
    backgroundMusic.addEventListener('timeupdate', () => {
        if (!backgroundMusic || !backgroundMusic.duration) {
            progress.style.width = '0%';
            return;
        }
        const duration = backgroundMusic.duration;
        const currentTime = backgroundMusic.currentTime;
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
    });
    
    // Load track function - Refined
    function loadTrack(index) {
        if (!backgroundMusic || index < 0 || index >= playlist.length) {
            console.error("Cannot load track, invalid index or audio element missing.");
            return;
        }
        const track = playlist[index];
        currentTrack = index; // Ensure currentTrack index is updated
        
        // Update track info
        trackName.textContent = track.name;
        artistName.textContent = track.artist;
        albumArt.src = track.cover || defaultCoverImage;
        
        // Determine if audio should play after loading
        // Check the *intended* state (was it playing before loading new track?)
        const wasPlaying = !backgroundMusic.paused && backgroundMusic.currentTime > 0;

        // Update audio source
        // Check if src actually needs changing to avoid unnecessary reloads
        const currentSrc = backgroundMusic.currentSrc.split('/').pop(); // Get filename from full URL
        const newSrcFilename = track.src.split('/').pop();
        
        if (currentSrc !== newSrcFilename) {
             console.log(`Loading track: ${track.name}, Src: ${track.src}`);
             backgroundMusic.src = track.src;
             backgroundMusic.load(); // Important: explicitly load the new source
        } else {
            console.log(`Track ${track.name} already loaded or same source.`);
            // If src is the same, but audio was stopped (e.g., ended), ensure we can replay if needed
            backgroundMusic.currentTime = 0;
        }

        // Reset progress bar
        progress.style.width = '0%';

        // Use 'canplaythrough' event to play if it was playing before
        const playWhenReady = () => {
            if (wasPlaying) {
                backgroundMusic.play().catch(e => console.error('Error auto-playing loaded track:', e));
            }
            backgroundMusic.removeEventListener('canplaythrough', playWhenReady); // Clean up
        };

        // If the source changed, wait for it to be ready
        if (currentSrc !== newSrcFilename) {
             backgroundMusic.removeEventListener('canplaythrough', playWhenReady); // Remove old listener first
             backgroundMusic.addEventListener('canplaythrough', playWhenReady);
        } else if (wasPlaying) {
            // If src is the same and it was playing, play immediately (or after a tiny delay)
            // This handles replaying the same track or clicking next/prev quickly
            setTimeout(() => {
                 backgroundMusic.play().catch(e => console.error('Error re-playing track:', e));
            }, 50); // Small delay helps sometimes
        }
    }
    
    // Initialize first track info (loads src, doesn't play yet)
    loadTrack(currentTrack); 
    console.log("Music player initialized. LoadTrack called for initial track.");

    // REMOVED the old setTimeout auto-play logic
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

// Function to initialize the image journey section
function initImageJourney() {
    const container = document.querySelector('.image-journey-container');
    const section = document.getElementById('image-journey-section');
    
    if (!container || !section) return; // Exit if elements not found

    // Sample timeline data (should match the one used elsewhere)
    const timelineData = [
        {
            date: '2018-08-31',
            title: 'Ra mắt với Produce 48',
            description: 'Jang Wonyoung đã ra mắt thông qua chương trình sống còn Produce 48 và xếp hạng #1, trở thành center của nhóm nhạc IZ*ONE.',
            image: 'https://via.placeholder.com/300x400.png?text=Produce+48' // Placeholder
        },
        {
            date: '2018-10-29',
            title: 'Ra mắt cùng IZ*ONE',
            description: 'IZ*ONE chính thức ra mắt với mini album đầu tay "COLOR*IZ" và ca khúc chủ đề "La Vie en Rose".',
            image: 'https://via.placeholder.com/300x400.png?text=IZ*ONE+Debut' // Placeholder
        },
        {
            date: '2021-04-29',
            title: 'Tan rã IZ*ONE',
            description: 'Sau 2 năm 6 tháng hoạt động, IZ*ONE chính thức tan rã. Wonyoung trở về Starship Entertainment.',
            image: 'https://via.placeholder.com/300x400.png?text=IZ*ONE+Disband' // Placeholder
        },
        {
            date: '2021-12-01',
            title: 'Ra mắt cùng IVE',
            description: 'Wonyoung ra mắt với tư cách là thành viên của nhóm nhạc mới IVE với single đầu tay "ELEVEN".',
            image: 'https://via.placeholder.com/300x400.png?text=IVE+Debut' // Placeholder
        },
        {
            date: '2022-04-05',
            title: 'Comeback với LOVE DIVE',
            description: 'IVE phát hành single thứ hai "LOVE DIVE" và đạt được thành công lớn, giúp nhóm giành nhiều cúp trên các chương trình âm nhạc.',
            image: 'https://via.placeholder.com/300x400.png?text=LOVE+DIVE' // Placeholder
        },
        {
            date: '2022-08-22',
            title: 'Phát hành After LIKE',
            description: 'IVE phát hành single thứ ba "After LIKE", tiếp tục khẳng định vị thế của nhóm trong ngành công nghiệp âm nhạc Kpop.',
            image: 'https://via.placeholder.com/300x400.png?text=After+LIKE' // Placeholder
        },
        {
            date: '2023-04-10',
            title: 'Album đầu tay I\'VE IVE',
            description: 'IVE phát hành album đầu tay "I\'VE IVE" với ca khúc chủ đề "I AM" và tiếp tục gặt hái nhiều thành công.',
            image: 'https://via.placeholder.com/300x400.png?text=I\'VE+IVE+Album' // Placeholder
        },
        {
            date: '2023-10-13',
            title: 'Phát hành album I\'VE MINE',
            description: 'IVE phát hành album thứ hai "I\'VE MINE" với ca khúc chủ đề "Baddie", thể hiện sự trưởng thành trong âm nhạc.',
            image: 'https://via.placeholder.com/300x400.png?text=I\'VE+MINE+Album' // Placeholder
        },
        {
            date: '2024-07-29',
            title: 'MLEM Single Release',
            description: 'IVE phát hành bản single mùa hè "MLEM" với sự tỏa sáng của Wonyoung, đánh dấu phong cách mới cho nhóm.',
            image: 'https://via.placeholder.com/300x400.png?text=MLEM+Single' // Placeholder
        }
    ];

    container.innerHTML = ''; // Clear previous content

    timelineData.forEach((event, index) => {
        const journeyItem = document.createElement('div');
        journeyItem.className = 'journey-item';
        journeyItem.style.animationDelay = `${index * 0.15}s`; // Stagger animation

        journeyItem.innerHTML = `
            <img src="${event.image}" alt="${event.title}" class="journey-image" loading="lazy">
            <div class="journey-info">
                <h4 class="journey-title">${event.title}</h4>
                <p class="journey-date">${formatDate(event.date)}</p>
                <p class="journey-description">${event.description}</p>
            </div>
        `;
        container.appendChild(journeyItem);
    });

    // Intersection observer for reveal animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.journey-item').forEach(item => {
        observer.observe(item);
    });
}

// Helper function to format date (assuming it exists elsewhere)
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Existing initTimeline function (can be removed or kept if needed elsewhere)
// function initTimeline() { ... }

// ... rest of the script

// Function to toggle music play/pause
function toggleMusic() {
    if (!backgroundMusic) return;
    
    if (isPlaying) {
        backgroundMusic.pause();
        isPlaying = false;
    } else {
        backgroundMusic.play()
            .then(() => {
                isPlaying = true;
            })
            .catch(e => console.error('Could not play audio on toggle:', e));
    }
    
    updateSoundIcons();
}

// Function to play the next track in the playlist
function playNextTrack() {
    // Get the current song info
    const currentSongElement = document.querySelector('.current-song');
    const playlist = [
        { title: 'Mlem', artist: 'IVE', file: 'mlem.mp3' },
        { title: 'Love Dive', artist: 'IVE', file: 'love_dive.mp3' },
        { title: 'Eleven', artist: 'IVE', file: 'eleven.mp3' },
        { title: 'After Like', artist: 'IVE', file: 'after_like.mp3' }
    ];
    
    let currentIndex = 0;
    
    // Find current index in playlist
    if (currentSongElement) {
        const currentTitle = currentSongElement.querySelector('.song-title')?.textContent;
        currentIndex = playlist.findIndex(song => song.title === currentTitle);
    }
    
    // Move to next song
    currentIndex = (currentIndex + 1) % playlist.length;
    const nextSong = playlist[currentIndex];
    
    // Update audio source
    if (backgroundMusic) {
        backgroundMusic.querySelector('source').src = nextSong.file;
        backgroundMusic.load();
        backgroundMusic.play()
            .then(() => {
                isPlaying = true;
                updateSoundIcons();
                
                // Update music player UI if exists
                updateMusicPlayerUI(nextSong);
            })
            .catch(e => console.error('Could not play next track:', e));
    }
}

// Function to update music player UI
function updateMusicPlayerUI(songInfo) {
    const titleElement = document.querySelector('.song-title');
    const artistElement = document.querySelector('.song-artist');
    const coverElement = document.querySelector('.player-cover img');
    
    if (titleElement) titleElement.textContent = songInfo.title;
    if (artistElement) artistElement.textContent = songInfo.artist;
    
    // Update cover image based on song
    if (coverElement) {
        let coverUrl;
        switch(songInfo.title) {
            case 'Mlem':
                coverUrl = 'https://res.cloudinary.com/dacbvhtgz/image/upload/v1743494575/2024-07-30_08-13-29_UTC_sblx0m.jpg';
                break;
            case 'Love Dive':
                coverUrl = 'https://res.cloudinary.com/dacbvhtgz/image/upload/v1743494571/2022-04-05_09-34-16_UTC_v5zdkm.jpg';
                break;
            case 'Eleven':
                coverUrl = 'https://res.cloudinary.com/dacbvhtgz/image/upload/v1743494564/2022-12-18_16-56-14_UTC_nkbylf.jpg';
                break;
            case 'After Like':
                coverUrl = 'https://res.cloudinary.com/dacbvhtgz/image/upload/v1743494578/2022-10-19_11-41-35_UTC_omuflj.jpg';
                break;
            default:
                coverUrl = 'https://res.cloudinary.com/dacbvhtgz/image/upload/v1743494575/2024-07-30_08-13-29_UTC_sblx0m.jpg';
        }
        coverElement.src = coverUrl;
    }
}

// Function to load timeline content for gallery two
function loadTimelineContent() {
    const timelineContainer = document.getElementById('gallery-timeline');
    if (!timelineContainer) return;
    
    // Timeline data - sự kiện quan trọng của Wonyoung
    const timelineData = [
        {
            date: '2018-08-31',
            title: 'Ra mắt với Produce 48',
            description: 'Jang Wonyoung được chọn là center cho bài hát chủ đề và xếp hạng #1 trong chung kết.',
            image: 'https://res.cloudinary.com/dacbvhtgz/image/upload/v1743494564/2022-12-18_16-56-14_UTC_nkbylf.jpg'
        },
        {
            date: '2018-10-29',
            title: 'Ra mắt với IZ*ONE',
            description: 'Album đầu tay COLOR*IZ với ca khúc chủ đề La Vie en Rose.',
            image: 'https://res.cloudinary.com/dacbvhtgz/image/upload/v1743494571/2022-04-05_09-34-16_UTC_v5zdkm.jpg'
        },
        {
            date: '2021-04-29',
            title: 'Tan rã cùng IZ*ONE',
            description: 'Kết thúc hoạt động nhóm 2 năm 6 tháng với concert kỷ niệm "ONE, THE STORY".',
            image: 'https://res.cloudinary.com/dacbvhtgz/image/upload/v1743494564/2024-02-08_09-00-03_UTC_8_vgl2px.jpg'
        },
        {
            date: '2021-12-01',
            title: 'Ra mắt với IVE',
            description: 'Debut cùng IVE với ca khúc "ELEVEN" dưới Starship Entertainment.',
            image: 'https://res.cloudinary.com/dacbvhtgz/image/upload/v1743494564/2022-12-18_16-56-14_UTC_nkbylf.jpg'
        },
        {
            date: '2022-04-05',
            title: 'Comeback với LOVE DIVE',
            description: 'Ca khúc đã giành các giải thưởng Daesang và thành công lớn trên các bảng xếp hạng.',
            image: 'https://res.cloudinary.com/dacbvhtgz/image/upload/v1743494571/2022-04-05_09-34-16_UTC_v5zdkm.jpg'
        },
        {
            date: '2022-08-22',
            title: 'Phát hành After LIKE',
            description: 'Hit thứ ba liên tiếp của IVE, kết hợp sample từ "I Will Survive".',
            image: 'https://res.cloudinary.com/dacbvhtgz/image/upload/v1743494578/2022-10-19_11-41-35_UTC_omuflj.jpg'
        },
        {
            date: '2023-04-10',
            title: 'Album đầu tiên "I\'VE IVE"',
            description: 'Album đầy đủ đầu tiên với ca khúc chủ đề "I AM".',
            image: 'https://res.cloudinary.com/dacbvhtgz/image/upload/v1743494564/2023-10-13_09-29-25_UTC_nxfwpe.jpg'
        },
        {
            date: '2023-10-13',
            title: 'Phát hành album "I\'VE MINE"',
            description: 'Ca khúc chủ đề "Baddie" và "Off The Record" thu hút nhiều sự chú ý.',
            image: 'https://res.cloudinary.com/dacbvhtgz/image/upload/v1743494575/2024-07-30_08-13-29_UTC_sblx0m.jpg'
        },
        {
            date: '2024-07-29',
            title: 'Single mùa hè "MLEM"',
            description: 'Ca khúc mùa hè sôi động với vũ đạo độc đáo được fan yêu thích.',
            image: 'https://res.cloudinary.com/dacbvhtgz/image/upload/v1743494575/2024-07-30_08-13-29_UTC_sblx0m.jpg'
        }
    ];
    
    // Create timeline items with modern design
    timelineContainer.innerHTML = '';
    
    // Create pagination indicators
    const paginationIndicator = document.getElementById('pagination-indicator');
    if (paginationIndicator) {
        paginationIndicator.innerHTML = '';
        for (let i = 0; i < timelineData.length; i++) {
            const dot = document.createElement('span');
            dot.className = 'pagination-dot';
            if (i === 0) dot.classList.add('active');
            dot.dataset.index = i;
            
            dot.addEventListener('click', () => {
                showTimelineItem(i);
            });
            
            paginationIndicator.appendChild(dot);
        }
    }
    
    // Create timeline items
    timelineData.forEach((item, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        if (index === 0) timelineItem.classList.add('active');
        timelineItem.dataset.index = index;
        
        // Format date for display
        const dateObj = new Date(item.date);
        const formattedDate = dateObj.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        timelineItem.innerHTML = `
            <div class="timeline-content">
                <div class="timeline-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="timeline-text">
                    <div class="timeline-date">${formattedDate}</div>
                    <h3 class="timeline-title">${item.title}</h3>
                    <p class="timeline-description">${item.description}</p>
                </div>
            </div>
        `;
        
        timelineContainer.appendChild(timelineItem);
    });
}

// Function to setup timeline navigation
function setupTimelineNavigation() {
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const paginationDots = document.querySelectorAll('.pagination-dot');
    
    let currentIndex = 0;
    const totalItems = timelineItems.length;
    
    // Function to show specific timeline item
    window.showTimelineItem = function(index) {
        // Hide all items
        timelineItems.forEach(item => {
            item.classList.remove('active');
            gsap.to(item, {
                opacity: 0,
                x: -50,
                duration: 0.3,
                display: 'none'
            });
        });
        
        // Update pagination dots
        paginationDots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show selected item
        if (timelineItems[index]) {
            currentIndex = index;
            
            // Show current item with animation
            gsap.fromTo(timelineItems[index],
                { opacity: 0, x: 50, display: 'block' },
                { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }
            );
            
            timelineItems[index].classList.add('active');
            
            // Update pagination
            if (paginationDots[index]) {
                paginationDots[index].classList.add('active');
            }
        }
    };
    
    // Previous button
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            let newIndex = currentIndex - 1;
            if (newIndex < 0) newIndex = totalItems - 1;
            showTimelineItem(newIndex);
        });
    }
    
    // Next button
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            let newIndex = currentIndex + 1;
            if (newIndex >= totalItems) newIndex = 0;
            showTimelineItem(newIndex);
        });
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (document.querySelector('.timeline-item.active')) {
            if (e.key === 'ArrowLeft') {
                let newIndex = currentIndex - 1;
                if (newIndex < 0) newIndex = totalItems - 1;
                showTimelineItem(newIndex);
            } else if (e.key === 'ArrowRight') {
                let newIndex = currentIndex + 1;
                if (newIndex >= totalItems) newIndex = 0;
                showTimelineItem(newIndex);
            }
        }
    });
    
    // Auto-advance timer (optional)
    const autoAdvanceInterval = 7000; // 7 seconds per slide
    let autoAdvanceTimer = setInterval(() => {
        // Only auto-advance if user is on the timeline view
        if (document.querySelector('.timeline-item.active')) {
            let newIndex = currentIndex + 1;
            if (newIndex >= totalItems) newIndex = 0;
            showTimelineItem(newIndex);
        }
    }, autoAdvanceInterval);
    
    // Stop auto-advance on user interaction
    const stopAutoAdvance = () => {
        clearInterval(autoAdvanceTimer);
        // Restart after a longer period of inactivity
        setTimeout(() => {
            autoAdvanceTimer = setInterval(() => {
                if (document.querySelector('.timeline-item.active')) {
                    let newIndex = currentIndex + 1;
                    if (newIndex >= totalItems) newIndex = 0;
                    showTimelineItem(newIndex);
                }
            }, autoAdvanceInterval);
        }, 30000); // 30 seconds of inactivity before restarting
    };
    
    // Stop auto-advance on user interaction
    document.querySelectorAll('.nav-button, .pagination-dot').forEach(el => {
        el.addEventListener('click', stopAutoAdvance);
    });
}

// Function to show image preview when clicking on a gallery item
function showImagePreview(item) {
    // Create preview overlay
    const previewOverlay = document.createElement('div');
    previewOverlay.className = 'image-preview-overlay';
    
    // Create preview content
    previewOverlay.innerHTML = `
        <div class="image-preview-container">
            <img src="${item.image}" alt="${item.title}">
            <div class="image-preview-info">
                <h2>${item.title}</h2>
                <p>${item.event} - ${item.date}</p>
                <p class="image-preview-category">${item.category}</p>
            </div>
            <button class="image-preview-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(previewOverlay);
    
    // Animate in
    setTimeout(() => {
        previewOverlay.classList.add('active');
    }, 10);
    
    // Close on click
    const closeButton = previewOverlay.querySelector('.image-preview-close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            previewOverlay.classList.remove('active');
            setTimeout(() => {
                previewOverlay.remove();
            }, 300);
        });
    }
    
    // Close on background click
    previewOverlay.addEventListener('click', (e) => {
        if (e.target === previewOverlay) {
            previewOverlay.classList.remove('active');
            setTimeout(() => {
                previewOverlay.remove();
            }, 300);
        }
    });
}

// Function to add cosmic particle effects to gallery
function addCosmicParticlesToGallery() {
    const galleryContainer = document.getElementById('gallery-container');
    if (!galleryContainer) return;
    
    // Create particles container if it doesn't exist
    let particlesContainer = document.querySelector('.gallery-cosmic-particles');
    if (!particlesContainer) {
        particlesContainer = document.createElement('div');
        particlesContainer.className = 'gallery-cosmic-particles';
        particlesContainer.style.position = 'absolute';
        particlesContainer.style.top = '0';
        particlesContainer.style.left = '0';
        particlesContainer.style.width = '100%';
        particlesContainer.style.height = '100%';
        particlesContainer.style.pointerEvents = 'none';
        particlesContainer.style.zIndex = '1';
        galleryContainer.appendChild(particlesContainer);
    }
    
    // Clear existing particles
    particlesContainer.innerHTML = '';
    
    // Create cosmic particles
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'cosmic-particle';
        
        // Random properties
        const size = Math.random() * 3 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 10;
        
        // Set styles
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.boxShadow = `0 0 ${size + 5}px rgba(224, 170, 255, 0.8)`;
        particle.style.animation = `floatParticle ${duration}s infinite linear`;
        particle.style.animationDelay = `${delay}s`;
        
        particlesContainer.appendChild(particle);
    }
}