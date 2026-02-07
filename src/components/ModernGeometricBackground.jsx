import React, { useEffect, useRef } from 'react';

const ModernGeometricBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Configuration
        const shapes = [];
        const shapeCount = 15;
        const colors = [
            'rgba(79, 70, 229, 0.15)',  // Indigo (Primary)
            'rgba(124, 58, 237, 0.15)', // Violet (Secondary)
            'rgba(244, 63, 94, 0.10)',  // Rose (Accent)
            'rgba(56, 189, 248, 0.10)', // Light Blue (Highlight)
        ];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        class Shape {
            constructor() {
                this.init();
            }

            init() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 100 + 50; // Larger shapes
                this.speedX = (Math.random() - 0.5) * 0.5; // Slow movement
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.rotation = Math.random() * 360;
                this.rotationSpeed = (Math.random() - 0.5) * 0.2;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.type = Math.random() > 0.5 ? 'square' : 'circle';
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.rotation += this.rotationSpeed;

                // Wrap around edges
                if (this.x < -this.size) this.x = canvas.width + this.size;
                if (this.x > canvas.width + this.size) this.x = -this.size;
                if (this.y < -this.size) this.y = canvas.height + this.size;
                if (this.y > canvas.height + this.size) this.y = -this.size;
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate((this.rotation * Math.PI) / 180);

                ctx.fillStyle = this.color;

                if (this.type === 'square') {
                    // Draw rounded square (Squircle-ish)
                    const radius = 20;
                    ctx.beginPath();
                    ctx.roundRect(-this.size / 2, -this.size / 2, this.size, this.size, radius);
                    ctx.fill();
                } else {
                    // Draw circle
                    ctx.beginPath();
                    ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            }
        }

        const init = () => {
            shapes.length = 0;
            for (let i = 0; i < shapeCount; i++) {
                shapes.push(new Shape());
            }
        };

        const animate = () => {
            // Clear with a very slight fade for trail effect (optional, disabling for cleaner look)
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw a subtle gradient overlay
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, 'rgba(15, 23, 42, 0)'); // Transparent
            gradient.addColorStop(1, 'rgba(30, 41, 59, 0.2)'); // Slight dark tint bottom right
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            shapes.forEach(shape => {
                shape.update();
                shape.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        resizeCanvas();
        init();
        animate();

        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
};

export default ModernGeometricBackground;
