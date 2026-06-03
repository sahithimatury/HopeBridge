// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const forms = document.querySelectorAll('.auth-form');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and forms
            tabButtons.forEach(btn => btn.classList.remove('active'));
            forms.forEach(form => form.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding form
            this.classList.add('active');
            document.getElementById(targetTab + '-form').classList.add('active');
        });
    });

    // Password strength checker
    const signupPassword = document.getElementById('signup-password');
    const strengthFill = document.getElementById('strength-fill');
    const strengthText = document.getElementById('strength-text');

    if (signupPassword) {
        signupPassword.addEventListener('input', function() {
            const password = this.value;
            const strength = checkPasswordStrength(password);
            
            strengthFill.className = 'strength-fill ' + strength.level;
            strengthText.textContent = strength.text;
        });
    }

    // Form submission handlers
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');

    if (signinForm) {
        signinForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSignIn();
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSignUp();
        });
    }
});

// Password toggle functionality
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Password strength checker
function checkPasswordStrength(password) {
    let score = 0;
    let feedback = [];

    if (password.length >= 8) score += 1;
    else feedback.push('at least 8 characters');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('lowercase letters');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('uppercase letters');

    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('numbers');

    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push('special characters');

    if (score < 2) {
        return { level: 'weak', text: 'Weak password' };
    } else if (score < 3) {
        return { level: 'fair', text: 'Fair password' };
    } else if (score < 4) {
        return { level: 'good', text: 'Good password' };
    } else {
        return { level: 'strong', text: 'Strong password' };
    }
}

// Sign in handler
function handleSignIn() {
    const username = document.getElementById('signin-username').value;
    const password = document.getElementById('signin-password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    // Simulate authentication process
    showLoadingState('signin');
    
    setTimeout(() => {
        hideLoadingState('signin');
        if (username && password) {
            showNotification('Welcome to Hope Bridge! Ready to make a difference.', 'success');
            console.log('Sign in successful:', { username, rememberMe });
            
            // Redirect to homepage after successful login
            setTimeout(() => {
                window.location.href = 'homepage.html';
            }, 2000);
        } else {
            showNotification('Invalid credentials. Please try again.', 'error');
        }
    }, 2000);
}

// Sign up handler
function handleSignUp() {
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const termsAgreed = document.getElementById('terms-agreement').checked;

    // Validation
    if (!username || !email || !password || !confirmPassword) {
        showNotification('Please fill in all fields.', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Passwords do not match.', 'error');
        return;
    }

    if (!termsAgreed) {
        showNotification('Please agree to the terms and conditions.', 'error');
        return;
    }

    const strength = checkPasswordStrength(password);
    if (strength.level === 'weak') {
        showNotification('Password is too weak. Please choose a stronger password.', 'error');
        return;
    }

    // Simulate registration process
    showLoadingState('signup');
    
    setTimeout(() => {
        hideLoadingState('signup');
        showNotification('Account created successfully! Welcome to Hope Bridge.', 'success');
        console.log('Sign up successful:', { username, email });
        
        // Redirect to disaster management homepage after 2 seconds
        setTimeout(() => {
            window.location.href = 'homepage.html';
        }, 2000);
    }, 2000);
}

// Loading state management
function showLoadingState(formType) {
    const button = document.querySelector(`#${formType}-form .auth-btn`);
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    button.disabled = true;
    button.dataset.originalText = originalText;
}

function hideLoadingState(formType) {
    const button = document.querySelector(`#${formType}-form .auth-btn`);
    button.innerHTML = button.dataset.originalText;
    button.disabled = false;
}

// Notification system
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
        border: 1px solid ${type === 'success' ? '#22c55e' : '#ef4444'};
        color: ${type === 'success' ? '#22c55e' : '#ef4444'};
        padding: 15px 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 1000;
        backdrop-filter: blur(10px);
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ===== HOMEPAGE FUNCTIONALITY =====

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the homepage
    if (document.querySelector('.navbar')) {
        initializeHomepage();
    }
});

function initializeHomepage() {
    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section, .hero-section');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Update active nav link
                navLinks.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
                
                // Calculate offset for fixed navbar
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                // Smooth scroll to section with offset
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Change Account functionality
    const accountLink = document.querySelector('.account-link');
    if (accountLink) {
        accountLink.addEventListener('click', function(e) {
            e.preventDefault();
            showAccountModal();
        });
    }
    
    // Intersection Observer for active navigation
    const observerOptions = {
        root: null,
        rootMargin: '-100px 0px -50% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Add scroll to top functionality
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(45deg, #22c55e, #16a34a);
        border: none;
        border-radius: 50%;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add hover effect to scroll to top button
    scrollToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 6px 20px rgba(34, 197, 94, 0.4)';
    });
    
    scrollToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 15px rgba(34, 197, 94, 0.3)';
    });
    
    // Add scroll effect to navbar
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Add navbar transition
    navbar.style.transition = 'transform 0.3s ease-in-out';
    
    // Service cards hover effects
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Problem/Solution cards hover effects
    const problemSolutionCards = document.querySelectorAll('.problem-card, .solution-card');
    problemSolutionCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Contact items hover effects
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0) scale(1)';
        });
    });
    
    // Add loading animation to logo
    const logoIcon = document.querySelector('.main-logo i');
    if (logoIcon) {
        logoIcon.addEventListener('click', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'logoGlow 2s ease-in-out infinite alternate';
            }, 10);
        });
    }
    
    // Add parallax effect to hero background
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// Account modal functionality
function showAccountModal() {
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    `;
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.cssText = `
        background: rgba(13, 27, 42, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(34, 197, 94, 0.3);
        border-radius: 20px;
        padding: 40px;
        max-width: 400px;
        width: 90%;
        text-align: center;
        box-shadow: 0 0 50px rgba(34, 197, 94, 0.2);
        animation: slideUp 0.3s ease;
    `;
    
    modalContent.innerHTML = `
        <h3 style="color: #f8fafc; margin-bottom: 20px; font-size: 1.5rem;">Account Options</h3>
        <div style="display: flex; flex-direction: column; gap: 15px;">
            <button class="modal-btn" onclick="switchToLogin()" style="
                background: linear-gradient(45deg, #22c55e, #3b82f6);
                border: none;
                border-radius: 10px;
                padding: 15px 20px;
                color: white;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            ">
                <i class="fas fa-sign-in-alt"></i> Switch to Login
            </button>
            <button class="modal-btn" onclick="logout()" style="
                background: rgba(239, 68, 68, 0.2);
                border: 1px solid #ef4444;
                border-radius: 10px;
                padding: 15px 20px;
                color: #ef4444;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            ">
                <i class="fas fa-sign-out-alt"></i> Logout
            </button>
            <button class="modal-btn" onclick="closeModal()" style="
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 10px;
                padding: 15px 20px;
                color: #f8fafc;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            ">
                <i class="fas fa-times"></i> Cancel
            </button>
        </div>
    `;
    
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    
    // Add hover effects to modal buttons
    const modalButtons = modalContent.querySelectorAll('.modal-btn');
    modalButtons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.3)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
    
    // Close modal when clicking overlay
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    // Add CSS animations
    const modalStyle = document.createElement('style');
    modalStyle.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(modalStyle);
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    }
}

function switchToLogin() {
    closeModal();
    window.location.href = 'index.html';
}

function logout() {
    closeModal();
    showNotification('Logged out successfully. Thank you for using HopeBridge!', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}