// Typewriter Effect for Hero Section
class TypewriterEffect {
    constructor(element, texts, options = {}) {
        this.element = element;
        this.texts = texts;
        this.speed = options.speed || 100;
        this.deleteSpeed = options.deleteSpeed || 50;
        this.pauseTime = options.pauseTime || 2000;
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.isPaused = false;
        
        this.start();
    }
    
    start() {
        this.type();
    }
    
    type() {
        const currentText = this.texts[this.currentTextIndex];
        
        if (this.isPaused) {
            setTimeout(() => {
                this.isPaused = false;
                this.isDeleting = true;
                this.type();
            }, this.pauseTime);
            return;
        }
        
        if (this.isDeleting) {
            // Delete characters
            if (this.currentCharIndex > 0) {
                this.currentCharIndex--;
                this.element.textContent = currentText.substring(0, this.currentCharIndex);
                setTimeout(() => this.type(), this.deleteSpeed);
            } else {
                // Move to next text
                this.isDeleting = false;
                this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
                setTimeout(() => this.type(), 500);
            }
        } else {
            // Type characters
            if (this.currentCharIndex < currentText.length) {
                this.currentCharIndex++;
                this.element.textContent = currentText.substring(0, this.currentCharIndex);
                setTimeout(() => this.type(), this.speed);
            } else {
                // Pause before deleting
                this.isPaused = true;
                this.type();
            }
        }
    }
}

// Initialize typewriter effect when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const typewriterElement = document.getElementById('typewriter-text');
    
    if (typewriterElement) {
        const texts = [
            "Hi, my name is Eric Raymond.",
            "I build intelligent systems.",
            "From robotics to augmented reality."
        ];
        
        new TypewriterEffect(typewriterElement, texts, {
            speed: 80,
            deleteSpeed: 40,
            pauseTime: 2500
        });
    }
});