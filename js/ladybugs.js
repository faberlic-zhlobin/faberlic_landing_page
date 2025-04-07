
class Ladybug {
    constructor(controller, id) {
        this.id = id;
        this.controller = controller;
        this.element = this.createLadybugElement();
        this.x = Math.random() * 90;
        this.y = Math.random() * 90;
        this.speed = 0.7 + Math.random() * 1.0; 
        this.direction = Math.random() * 360;
        this.rotationSpeed = 0.15 + Math.random() * 0.3; 
        
        
        this.targetDirection = this.direction;
        this.targetSpeed = this.speed;
        this.lastRepelTime = 0;
        this.smoothingFactor = 0.05; 
        
        
        
        
        
        const baseAngle = this.id % 2 === 0 ? 25 : -25;
        const variability = 15; 
        this.directionBias = baseAngle + (Math.random() * variability - variability/2);
        
        
        this.states = ['wander', 'flee', 'rest', 'eating', 'sleeping', 'flying', 'dancing', 'following', 'landing', 'dragging'];
        this.state = 'wander'; 
        
        this.stateTimer = 0;
        this.nearbyLadybugs = [];
        this.targetElement = null;
        this.targetLeaf = null;
        this.isHappy = false; 
        this.trail = []; 
        this.trailUpdateCounter = 0;
        
        
        this.isDragging = false;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
        this.originalScale = 1;
        this.beforeDragState = null;
        
        
        this.mouseDownTime = 0;
        this.mouseDownX = 0;
        this.mouseDownY = 0;
        this.clickThreshold = 300; 
        this.moveThreshold = 5; 
        this.potentialDrag = false; 
        
        this.personality = {
            sociability: Math.random(), 
            curiosity: Math.random(),   
            laziness: Math.random(),    
            playfulness: Math.random(), 
            fearfulness: Math.random()  
        };
        
        this.updatePosition();
        this.setupEventListeners();
    }

    createLadybugElement() {
        const ladybug = document.createElement('div');
        ladybug.className = 'ladybug';
        ladybug.id = `ladybug-${this.id}`;
        
        
        const body = document.createElement('div');
        body.className = 'ladybug-body';
        
        
        const spotPositions = [
            {x: 30, y: 30}, 
            {x: 70, y: 30}, 
            {x: 50, y: 50}, 
            {x: 30, y: 70}, 
            {x: 70, y: 70}
        ];
        
        spotPositions.forEach(pos => {
            const spot = document.createElement('div');
            spot.className = 'ladybug-spot';
            spot.style.left = `${pos.x}%`;
            spot.style.top = `${pos.y}%`;
            
            
            const size = 10 + Math.random() * 5;
            spot.style.width = `${size}%`;
            spot.style.height = `${size}%`;
            
            body.appendChild(spot);
        });
        
        
        const head = document.createElement('div');
        head.className = 'ladybug-head';
        
        
        const leftAntenna = document.createElement('div');
        leftAntenna.className = 'ladybug-antenna ladybug-antenna-left';
        
        const rightAntenna = document.createElement('div');
        rightAntenna.className = 'ladybug-antenna ladybug-antenna-right';
        
        head.appendChild(leftAntenna);
        head.appendChild(rightAntenna);
        
        
        const leftEye = document.createElement('div');
        leftEye.className = 'ladybug-eye ladybug-eye-left';
        
        const rightEye = document.createElement('div');
        rightEye.className = 'ladybug-eye ladybug-eye-right';
        
        head.appendChild(leftEye);
        head.appendChild(rightEye);
        
        
        const smile = document.createElement('div');
        smile.className = 'ladybug-smile';
        head.appendChild(smile);
        
        body.appendChild(head);
        
        
        const divider = document.createElement('div');
        divider.className = 'ladybug-divider';
        body.appendChild(divider);
        
        
        for (let i = 1; i <= 6; i++) {
            const leg = document.createElement('div');
            leg.className = `ladybug-leg ladybug-leg-${i}`;
            leg.style.animationDelay = `${Math.random() * 0.5}s`;
            
            body.appendChild(leg);
        }
        
        
        ladybug.appendChild(body);
        
        return ladybug;
    }

    setupEventListeners() {
        
        
        
        this.element.addEventListener('mouseover', () => {
            if (this.isDragging || this.potentialDrag) return;
            
            
            if (Math.random() < this.personality.fearfulness) {
                this.startFlee();
            } else if (Math.random() < this.personality.playfulness) {
                
                this.startDancing();
            }
        });
        
        
        this.element.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
        
        
        this.element.addEventListener('touchstart', this.handleTouchStart.bind(this));
        document.addEventListener('touchmove', this.handleTouchMove.bind(this));
        document.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }
    
    startSleeping() {
        
        this.changeState('sleeping', 3000 + Math.random() * 4000); 
        this.speed = 0; 
        
        
        this.sleepElements = [];
        
        
        for (let i = 0; i < 5; i++) {
            const sleepZ = document.createElement('div');
            sleepZ.className = 'ladybug-sleep-z';
            sleepZ.innerHTML = 'z';
            sleepZ.style.position = 'absolute';
            sleepZ.style.fontSize = `${10 + i * 2}px`;
            sleepZ.style.fontWeight = 'bold';
            sleepZ.style.top = '-15px';
            sleepZ.style.right = `${-5 - i * 10}px`;
            sleepZ.style.opacity = '0';
            sleepZ.style.zIndex = '1001';
            sleepZ.style.pointerEvents = 'none';
            sleepZ.style.animation = `sleepZ ${2 + i * 0.5}s infinite`;
            sleepZ.style.animationDelay = `${i * 0.7}s`;
            sleepZ.style.color = '#210f4b'; 
            sleepZ.style.textShadow = '1px 1px 2px rgba(0,0,0,0.2)';
            
            this.element.appendChild(sleepZ);
            this.sleepElements.push(sleepZ);
        }
    }
    
    endSleeping() {
        
        if (this.sleepElements && this.sleepElements.length) {
            this.sleepElements.forEach(element => {
                if (element && element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            });
            this.sleepElements = [];
        }
    }
    
    
    showHappiness() {
        this.isHappy = true;
        
        
        
        
        const heartColor = '#ff5252';
        
        
        const heart = document.createElement('div');
        heart.className = 'ladybug-heart';
        
        
        heart.innerHTML = '&#x2764;';
        heart.style.position = 'fixed'; 
        
        heart.style.fontSize = '28px'; 
        heart.style.fontWeight = 'bold';
        
        
        const rect = this.element.getBoundingClientRect();
        
        heart.style.left = `${rect.left + rect.width / 2 - 14}px`; 
        heart.style.top = `${rect.top - 20}px`;  
        
        
        heart.style.color = heartColor;
        heart.style.opacity = '0';
        heart.style.zIndex = '1001';
        heart.style.pointerEvents = 'none';
        heart.style.filter = 'drop-shadow(0 0 3px rgba(255,0,0,0.7))';
        
        
        document.body.appendChild(heart);
        
        
        const duration = 1.5; 
        
        
        const keyframes = `
            @keyframes heart${this.id} {
                0% {
                    opacity: 0;
                    transform: translateY(0) scale(0.5);
                }
                20% {
                    opacity: 1;
                    transform: translateY(-15px) scale(1.2);
                }
                80% {
                    opacity: 0.8;
                    transform: translateY(-45px) scale(1.4);
                }
                100% {
                    opacity: 0;
                    transform: translateY(-70px) scale(1);
                }
            }
        `;
        
        
        const style = document.createElement('style');
        style.textContent = keyframes;
        document.head.appendChild(style);
        
        
        heart.style.animation = `heart${this.id} ${duration}s ease-out forwards`;
        
        
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }, duration * 1000);
    }

    startFlee() {
        this.changeState('flee', 2000); 
        
        
        this.targetSpeed = 2.2 + Math.random() * 1.5; 
        
        
        const cursorX = this.controller.lastMouseX;
        const cursorY = this.controller.lastMouseY;
        
        if (cursorX !== null && cursorY !== null) {
            
            const dx = this.x - cursorX;
            const dy = this.y - cursorY;
            this.targetDirection = Math.atan2(dy, dx) * 180 / Math.PI;
            
            
            this.targetDirection += (Math.random() - 0.5) * 20; 
        } else {
            
            this.targetDirection = (this.direction + 120 + Math.random() * 40) % 360; 
        }
    }
    
    startDancing() {
        this.changeState('dancing', 4000); 
        this.speed = 0.1; 
    }
    
    startFlying() {
        this.changeState('flying', 5000); 
        this.targetSpeed = 4 + Math.random() * 2; 
        this.y -= 3; 
    }
    
    startEating(leaf) {
        this.targetLeaf = leaf;
        
        this.changeState('eating', 1000 + Math.random() * 2000);
        this.speed = 0; 
        
        
        leaf.classList.add('eaten');
        
        
        setTimeout(() => {
            if (leaf && leaf.parentNode) {
                leaf.parentNode.removeChild(leaf);
                
                
                this.controller.createLeaf();
            }
        }, 3000);
    }
    
    startFollowing(target) {
        
        this.changeState('following', 1000 + Math.random() * 2000);
        this.targetLadybug = target;
        this.speed = 1.5 + Math.random() * 1.0; 
    }
    
    startLanding(element) {
        
        this.changeState('landing', 1000 + Math.random() * 2000);
        this.targetElement = element;
        this.speed = 1 + Math.random(); 
    }
    
    endLanding() {
        if (this.targetElement) {
            
            this.changeState('rest', 1000 + Math.random() * 2000);
            this.speed = 0;
        }
    }

    changeState(newState, duration) {
        
        if (this.state === newState) {
            this.stateTimer = duration;
            return;
        }
        
        
        this.element.classList.remove(this.state);
        
        
        if (this.state === 'sleeping') {
            this.endSleeping();
        } else if (this.state === 'landing' && newState !== 'rest') {
            this.targetElement = null;
        }
        
        
        this.state = newState;
        this.stateTimer = duration;
        this.element.classList.add(newState);
        
        
        if (newState === 'wander') {
            
            this.targetSpeed = 0.7 + Math.random() * 0.9; 
        } else if (newState === 'rest') {
            this.speed = 0;
            this.targetSpeed = 0;
        }
    }

    updatePosition() {
        
        const isMobile = window.innerWidth <= 768;
        
        
        
        const roundedX = Math.round(this.x * 100) / 100;
        const roundedY = Math.round(this.y * 100) / 100;
        
        
        this.element.style.left = `${roundedX}vw`;
        this.element.style.top = `${roundedY}vh`;
        
        
        if (!['dancing', 'sleeping', 'eating', 'rest'].includes(this.state)) {
            
            if (this.state === 'dragging') {
                
                return;
            }
            
            
            
            const safeDirection = this.direction;
            const isVertical = safeDirection % 180 === 90;
            
            
            const rotateAngle = isVertical ? 
                safeDirection + (Math.random() < 0.5 ? 3 : -3) : 
                safeDirection;
                
            
            const roundedAngle = Math.round(rotateAngle);
            
            
            this.element.style.transform = `rotate(${roundedAngle}deg)`;
        }
        
        
        if (!isMobile && this.speed > 1.0 && ++this.trailUpdateCounter % 5 === 0) {
            this.createTrail();
        }
    }
    
    createTrail() {
        
        const trail = document.createElement('div');
        trail.className = 'ladybug-trail';
        trail.style.left = `${this.x}vw`;
        trail.style.top = `${this.y}vh`;
        
        
        document.body.appendChild(trail);
        
        
        this.trail.push(trail);
        
        
        if (this.trail.length > 10) {
            const oldTrail = this.trail.shift();
            if (oldTrail && oldTrail.parentNode) {
                oldTrail.parentNode.removeChild(oldTrail);
            }
        }
        
        
        setTimeout(() => {
            if (trail && trail.parentNode) {
                trail.parentNode.removeChild(trail);
                const index = this.trail.indexOf(trail);
                if (index > -1) {
                    this.trail.splice(index, 1);
                }
            }
        }, 1500);
    }

    detectCollision(otherLadybugs, interactiveElements, leaves) {
        
        const currentTime = Date.now();
        
        
        this.nearbyLadybugs = otherLadybugs.filter(other => {
            if (other.id === this.id) return false;
            
            
            const dx = other.x - this.x;
            const dy = other.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            
            return distance < 20;
        });
        
        
        this.nearbyLadybugs.sort((a, b) => {
            const distA = Math.sqrt(Math.pow(a.x - this.x, 2) + Math.pow(a.y - this.y, 2));
            const distB = Math.sqrt(Math.pow(b.x - this.x, 2) + Math.pow(b.y - this.y, 2));
            return distA - distB;
        });
        
        
        const minDistance = 20; 
        const criticalDistance = 12; 
        
        
        let nearbyCount = 0;
        for (const other of otherLadybugs) {
            if (other.id === this.id) continue;
            
            const dx = other.x - this.x;
            const dy = other.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < criticalDistance * 1.5) {
                nearbyCount++;
            }
        }
        
        
        const crowdFactor = Math.min(1.5, nearbyCount * 0.4); 
        
        
        const repelCooldown = 150 + (nearbyCount * 30); 
        
        
        let wasRepelled = false;
        
        for (const other of otherLadybugs) {
            if (other.id === this.id) continue;
            
            const dx = other.x - this.x;
            const dy = other.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            
            if (distance < minDistance) {
                
                const repelAngle = Math.atan2(-dy, -dx);
                const forceFactor = Math.pow(1 - (distance / minDistance), 1.5);
                
                
                this.x += Math.cos(repelAngle) * forceFactor * 0.15;
                this.y += Math.sin(repelAngle) * forceFactor * 0.15;
                
                
                if (currentTime - this.lastRepelTime < repelCooldown && this.state !== 'flee') {
                    continue;
                }
                
                this.lastRepelTime = currentTime;
                wasRepelled = true;
                
                
                const repelStrength = Math.pow(1 - (distance / minDistance), 2.2) * (1.8 + crowdFactor);
                
                
                if (distance < criticalDistance) {
                    
                    const pushAmount = (criticalDistance - distance + 0.8) * (1.5 + crowdFactor);
                    
                    
                    this.x += Math.cos(repelAngle) * pushAmount * 0.7;
                    this.y += Math.sin(repelAngle) * pushAmount * 0.7;
                    
                    
                    const baseDirection = (repelAngle * 180 / Math.PI);
                    
                    this.direction = baseDirection + this.directionBias;
                    
                    this.targetDirection = this.direction;
                    
                    
                    this.speed = 1.8 + Math.random() * 0.8 + crowdFactor;
                    this.targetSpeed = this.speed;
                    
                    
                    this.changeState('flee', 1500 + crowdFactor * 1000);
                } 
                
                else {
                    
                    const baseOppositeDirection = (repelAngle * 180 / Math.PI);
                    
                    this.targetDirection = baseOppositeDirection + this.directionBias + (Math.random() * 10 - 5);
                    
                    
                    this.targetSpeed = 1.0 + 1.2 * repelStrength;
                    
                    
                    if (this.state === 'following' && this.targetLadybug && this.targetLadybug.id === other.id) {
                        this.changeState('flee', 1200);
                    }
                }
                
                
                this.move(60);
                
                
                break;
            }
        }
        
        
        
        
        if (this.nearbyLadybugs.length > 1 && !wasRepelled && Math.random() < 0.15) {
            this.targetDirection = Math.random() * 360;
            this.targetSpeed = 0.9 + Math.random() * 0.6;
        }
        
        
        if (interactiveElements && interactiveElements.length > 0) {
            for (const element of interactiveElements) {
                const rect = element.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                
                
                const bugX = (this.x * viewportWidth) / 100;
                const bugY = (this.y * viewportHeight) / 100;
                
                
                if (bugX > rect.left - 50 && bugX < rect.right + 50 &&
                    bugY > rect.top - 50 && bugY < rect.bottom + 50) {
                    
                    
                    if (this.state === 'wander' && Math.random() < 0.01) {
                        this.startLanding(element);
                        break;
                    }
                }
            }
        }
        
        
        if (leaves && leaves.length > 0) {
            for (const leaf of leaves) {
                const leafRect = leaf.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                
                
                const bugX = (this.x * viewportWidth) / 100;
                const bugY = (this.y * viewportHeight) / 100;
                
                
                if (bugX > leafRect.left - 20 && bugX < leafRect.right + 20 &&
                    bugY > leafRect.top - 20 && bugY < leafRect.bottom + 20) {
                    
                    
                    if (['wander', 'following'].includes(this.state) && 
                        Math.random() < 0.03 && 
                        !leaf.classList.contains('eaten')) {
                        this.startEating(leaf);
                        break;
                    }
                }
            }
        }
    }

    update(deltaTime) {
        
        if (this.isDragging) return;
        
        
        if (!this.lastPosition) {
            this.lastPosition = { x: this.x, y: this.y };
            this.stuckTime = 0;
            this.positionCheckTimer = 0;
            this.stuckRotation = 0; 
        }
        
        
        this.positionCheckTimer += deltaTime;
        if (this.positionCheckTimer > 300) {
            const distMoved = Math.sqrt(
                Math.pow(this.x - this.lastPosition.x, 2) + 
                Math.pow(this.y - this.lastPosition.y, 2)
            );
            
            
            if (distMoved < 0.1) {
                this.stuckTime += this.positionCheckTimer;
                
                
                const isVerticallyStuck = Math.abs(this.direction % 180) < 10 || Math.abs(this.direction % 180 - 180) < 10;
                
                if (isVerticallyStuck) {
                    this.stuckRotation += this.positionCheckTimer;
                } else {
                    this.stuckRotation = 0;
                }
                
                
                if (this.stuckRotation > 1000) {
                    
                    this.targetDirection = 45 + Math.random() * 90; 
                    if (Math.random() < 0.5) this.targetDirection += 180; 
                    
                    this.targetSpeed = 1.0 + Math.random() * 0.5;
                    this.changeState('wander', 0);
                    this.stuckRotation = 0;
                    this.stuckTime = 0;
                    
                    
                    this.move(300);
                }
                
                else if (this.stuckTime > 800 && 
                   !['sleeping', 'eating', 'rest'].includes(this.state)) {
                    
                    if (this.element.classList.contains('dragging')) {
                        this.endDragging();
                    }
                    
                    
                    this.targetDirection = this.direction + (Math.random() * 40 - 20); 
                    this.targetSpeed = 0.6 + Math.random() * 0.4; 
                    this.changeState('wander', 0);
                    this.stuckTime = 0;
                    
                    
                    this.element.style.transition = '';
                }
            } else {
                
                this.stuckTime = 0;
                this.stuckRotation = 0;
            }
            
            
            this.lastPosition.x = this.x;
            this.lastPosition.y = this.y;
            this.positionCheckTimer = 0;
        }
        
        
        this.updateMovementParameters(deltaTime);
        
        
        if (this.stateTimer > 0) {
            this.stateTimer -= deltaTime;
            if (this.stateTimer <= 0) {
                
                if (this.state === 'flee') {
                    
                    this.changeState('rest', 800);
                } else if (this.state === 'rest') {
                    
                    this.changeState('wander', 0);
                } else if (this.state === 'eating') {
                    
                    this.targetLeaf = null;
                    this.changeState('rest', 500);
                } else if (this.state === 'sleeping') {
                    
                    this.changeState('wander', 0);
                } else if (this.state === 'flying') {
                    
                    this.targetSpeed = 1;
                    this.changeState('wander', 0);
                } else if (this.state === 'dancing') {
                    
                    this.changeState('wander', 0);
                } else if (this.state === 'following') {
                    
                    this.targetLadybug = null;
                    if (Math.random() < 0.7) {
                        this.changeState('wander', 0);
                    } else {
                        
                        this.changeState('rest', 700);
                    }
                } else if (this.state === 'landing') {
                    
                    this.endLanding();
                } else {
                    
                    this.changeState('wander', 0);
                }
            }
        }

        
        if (this.state === 'wander') {
            this.handleWandering(deltaTime);
        } else if (this.state === 'following' && this.targetLadybug) {
            this.followTarget(deltaTime);
        } else if (this.state === 'landing' && this.targetElement) {
            this.landOnElement(deltaTime);
        } else if (this.state === 'flee') {
            
            this.move(deltaTime);
        } else if (this.state === 'flying') {
            
            this.move(deltaTime);
            if (Math.random() < 0.03) { 
                
                this.targetDirection += (Math.random() - 0.5) * 20; 
            }
        }
        
        
        this.updatePosition();
    }
    
    
    updateMovementParameters(deltaTime) {
        
        const isMobile = window.innerWidth <= 768;
        
        
        
        const baseSmoothingFactor = isMobile ? 0.04 : 0.05;
        
        
        
        const deltaScale = Math.min(deltaTime / 30, 2.0); 
        const smoothing = baseSmoothingFactor * deltaScale;
        
        
        const maxStepDir = isMobile ? 6.0 : 8.0;  
        const maxStepSpeed = isMobile ? 0.12 : 0.15;
        
        
        const angleDiff = this.targetDirection - this.direction;
        
        const normalizedDiff = ((angleDiff + 180) % 360) - 180;
        
        const directionChange = Math.max(-maxStepDir, Math.min(maxStepDir, normalizedDiff * smoothing));
        this.direction += directionChange;
        
        
        const speedDiff = this.targetSpeed - this.speed;
        const speedChange = Math.max(-maxStepSpeed, Math.min(maxStepSpeed, speedDiff * smoothing * 1.5));
        this.speed += speedChange;
    }

    handleWandering(deltaTime) {
        
        
        
        if (Math.random() < 0.003) { 
            this.targetDirection += (Math.random() - 0.5) * 25; 
        }
        
        
        this.targetSpeed = 0.9 + Math.random() * 1.1; 
        
        
        if (Math.random() < 0.0005) {
            const randomState = Math.random();
            
            
            if (randomState < this.personality.laziness * 0.5) { 
                
                this.startSleeping();
            } else if (randomState < this.personality.laziness * 0.5 + 0.003) { 
                
                this.startFlying();
            } else if (randomState < this.personality.laziness * 0.5 + 0.006) { 
                
                this.startDancing();
            }
        }
        
        
        
        if (this.nearbyLadybugs.length > 0) {
            
            const followFactor = Math.max(0.1, 1 - this.nearbyLadybugs.length * 0.1);
            
            if (Math.random() < this.personality.sociability * 0.1 * followFactor) {
                const closest = this.nearbyLadybugs[0];
                this.startFollowing(closest);
            }
        }
        
        
        this.move(deltaTime);
    }
    
    followTarget(deltaTime) {
        if (!this.targetLadybug) return;
        
        
        const dx = this.targetLadybug.x - this.x;
        const dy = this.targetLadybug.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        
        const followDistance = 6; 
        
        if (distance < followDistance) {
            
            const repelAngle = Math.atan2(-dy, -dx);
            
            this.targetDirection = repelAngle * 180 / Math.PI + (Math.random() * 10 - 5);
            
            
            const proximityFactor = 1 - (distance / followDistance);
            this.targetSpeed = 0.8 + proximityFactor * 1.0;
            
            
            if (Math.random() < 0.02) {
                this.changeState('wander', 0);
                return;
            }
        } else if (distance < followDistance * 1.5) {
            
            if (Math.random() < 0.8) {
                this.targetSpeed = 0;
            } else {
                
                const orbitAngle = Math.atan2(dy, dx) + (Math.PI / 2 + (Math.random() - 0.5) * Math.PI / 4);
                this.targetDirection = orbitAngle * 180 / Math.PI;
                this.targetSpeed = 0.2 + Math.random() * 0.1;
            }
        } else {
            
            this.targetSpeed = 0.8 + Math.random() * 0.3;
            
            const targetDirection = Math.atan2(dy, dx) * 180 / Math.PI;
            
            
            this.targetDirection = targetDirection + (Math.random() * 10 - 5);
        }
        
        
        this.move(deltaTime);
    }

    landOnElement(deltaTime) {
        if (!this.targetElement) return;
        
        const rect = this.targetElement.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        
        const targetX = ((rect.left + rect.width / 2) / viewportWidth) * 100;
        const targetY = ((rect.top + rect.height / 2) / viewportHeight) * 100;
        
        
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        
        if (distance < 3) {
            this.endLanding();
            return;
        }
        
        const targetDirection = Math.atan2(dy, dx) * 180 / Math.PI;
        
        
        this.targetDirection = targetDirection;
        
        
        this.move(deltaTime);
    }
    
    move(deltaTime) {
        
        if (this.speed < 0.3) {
            this.speed = 0;
            return;
        }

        
        if (Math.abs(this.direction % 180 - 90) < 1) {
            
            this.direction += (Math.random() < 0.5 ? 5 : -5);
        }

        
        const isMobile = window.innerWidth <= 768;
        
        
        
        const speedFactor = isMobile ? 750 : 700;
        
        const radians = this.direction * Math.PI / 180;
        
        this.x += Math.cos(radians) * this.speed * deltaTime / speedFactor;
        this.y += Math.sin(radians) * this.speed * deltaTime / speedFactor;
        
        
        const borderMargin = isMobile ? 8 : 6; 
        const pushForce = isMobile ? 0.85 : 0.8; 
        
        
        const impulseScale = isMobile ? 0.25 : 0.3;
        
        if (this.x < borderMargin) {
            
            this.x += pushForce * (borderMargin - this.x) / borderMargin;
            this.targetDirection = (Math.random() * 60) % 360; 
            this.targetSpeed = 0.9 + Math.random() * 0.6;
            
            this.x += impulseScale;
        } else if (this.x > (100 - borderMargin)) {
            
            this.x -= pushForce * (this.x - (100 - borderMargin)) / borderMargin;
            this.targetDirection = (180 + Math.random() * 60 - 30) % 360;
            this.targetSpeed = 0.9 + Math.random() * 0.6;
            
            this.x -= impulseScale;
        }
        
        if (this.y < borderMargin) {
            
            this.y += pushForce * (borderMargin - this.y) / borderMargin;
            this.targetDirection = (90 + Math.random() * 60 - 30) % 360;
            this.targetSpeed = 0.9 + Math.random() * 0.6;
            
            this.y += impulseScale;
        } else if (this.y > (100 - borderMargin)) {
            
            this.y -= pushForce * (this.y - (100 - borderMargin)) / borderMargin;
            this.targetDirection = (270 + Math.random() * 60 - 30) % 360;
            this.targetSpeed = 0.9 + Math.random() * 0.6;
            
            this.y -= impulseScale;
        }
        
        
        if (this.x < 0) this.x = 0.5;
        if (this.x > 100) this.x = 99.5;
        if (this.y < 0) this.y = 0.5;
        if (this.y > 100) this.y = 99.5;
    }

    
    startDragging() {
        this.isDragging = true;
        this.changeState('dragging');
        
        
        this.originalScale = this.element.style.transform ? 
            parseFloat(this.element.style.transform.replace('scale(', '').replace(')', '')) || 1 : 1;
        
        
        this.element.style.transition = '';
        
        
        this.element.style.transition = 'transform 0.2s ease-out';
        
        
        this.element.style.transform = 'scale(1.8)';
        
        
        this.element.classList.add('dragging');
        
        
        this.makeAngryFace();
        
        
        this.element.style.zIndex = '1100';
        
        
        this.speed = 0;
        this.targetSpeed = 0;
        
        
        this.angerSigns = [];
        
        
        const count = 2 + Math.floor(Math.random());
        
        for (let i = 0; i < count; i++) {
            const angerSign = document.createElement('div');
            angerSign.className = 'ladybug-anger-sign';
            angerSign.innerHTML = '&#x2757;'; 
            angerSign.style.position = 'absolute';
            
            angerSign.style.fontSize = `${18 + i * 3}px`;
            angerSign.style.fontWeight = 'bold';
            angerSign.style.top = `-${20 + i * 10}px`;
            angerSign.style.right = `${-10 - i * 15}px`;
            angerSign.style.color = '#FF3333';
            angerSign.style.textShadow = '1px 1px 2px rgba(0,0,0,0.3)';
            angerSign.style.zIndex = '1101';
            angerSign.style.pointerEvents = 'none';
            angerSign.style.transform = `rotate(${-15 + Math.random() * 30}deg)`;
            angerSign.style.animation = `angerAnimation ${0.8 + i * 0.2}s infinite alternate`;
            angerSign.style.animationDelay = `${i * 0.15}s`;
            
            this.element.appendChild(angerSign);
            this.angerSigns.push(angerSign);
        }
        
        
        this.angerAnimationStyle = document.createElement('style');
        this.angerAnimationStyle.textContent = `
            @keyframes angerAnimation {
                0% {
                    transform: scale(0.7) translateY(0) rotate(-5deg);
                }
                100% {
                    transform: scale(1.1) translateY(-5px) rotate(5deg);
                }
            }
        `;
        document.head.appendChild(this.angerAnimationStyle);
    }
    
    
    endDragging() {
        
        if (!this.isDragging) return;
        
        this.isDragging = false;
        
        
        this.element.classList.remove('dragging');
        
        
        this.restoreNormalFace();
        
        
        this.element.style.zIndex = '1000';
        
        
        if (this.angerSigns && this.angerSigns.length) {
            this.angerSigns.forEach(sign => {
                if (sign && sign.parentNode) {
                    sign.parentNode.removeChild(sign);
                }
            });
            this.angerSigns = [];
        }
        
        
        if (this.angerAnimationStyle && this.angerAnimationStyle.parentNode) {
            this.angerAnimationStyle.parentNode.removeChild(this.angerAnimationStyle);
            this.angerAnimationStyle = null;
        }
        
        
        this.element.style.transition = '';
        
        
        const safeRestore = () => {
            
            this.element.style.transform = `scale(${this.originalScale || 1})`;
            
            
            setTimeout(() => {
                
                let newDirection;
                do {
                    newDirection = Math.random() * 360;
                } while (Math.abs(newDirection % 180 - 90) < 15); 
                
                this.direction = newDirection;
                this.targetDirection = newDirection;
                
                
                const rotateAngle = this.direction;
                this.element.style.transform = `rotate(${rotateAngle}deg)`;
                
                
                this.speed = 0.6 + Math.random() * 1.0;
                this.targetSpeed = this.speed;
                
                
                const radians = this.direction * Math.PI / 180;
                this.x += Math.cos(radians) * 0.5;
                this.y += Math.sin(radians) * 0.5;
                this.updatePosition();
                
                
                if (this.beforeDragState) {
                    this.changeState(this.beforeDragState);
                    this.beforeDragState = null;
                } else {
                    this.changeState('wander');
                }
            }, 50);
        };
        
        
        safeRestore();
    }

    
    handleMouseDown(e) {
        e.preventDefault();
        e.stopPropagation();
        
        
        this.mouseDownTime = Date.now();
        this.mouseDownX = e.clientX;
        this.mouseDownY = e.clientY;
        
        
        this.potentialDrag = true;
        
        
        const rect = this.element.getBoundingClientRect();
        this.dragOffsetX = e.clientX - rect.left;
        this.dragOffsetY = e.clientY - rect.top;
    }
    
    
    handleMouseMove(e) {
        
        if (this.isDragging) {
            
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            
            const left = mouseX - this.dragOffsetX;
            const top = mouseY - this.dragOffsetY;
            
            
            const vw = window.innerWidth / 100;
            const vh = window.innerHeight / 100;
            
            this.x = left / vw;
            this.y = top / vh;
            
            
            this.updatePosition();
            return;
        }
        
        
        if (this.potentialDrag) {
            const dx = e.clientX - this.mouseDownX;
            const dy = e.clientY - this.mouseDownY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            
            if (distance > this.moveThreshold) {
                
                this.beforeDragState = this.state;
                
                
                this.startDragging();
            }
        }
    }
    
    
    handleMouseUp(e) {
        
        if (!this.potentialDrag && !this.isDragging) return;
        
        
        if (this.isDragging) {
            this.endDragging();
            this.potentialDrag = false;
            return;
        }
        
        
        if (this.potentialDrag) {
            const clickDuration = Date.now() - this.mouseDownTime;
            
            
            if (clickDuration < this.clickThreshold) {
                this.showHappiness();
            }
            
            this.potentialDrag = false;
        }
    }

    
    handleTouchStart(e) {
        e.preventDefault();
        e.stopPropagation();
        
        
        const touch = e.touches[0];
        
        
        this.mouseDownTime = Date.now();
        this.mouseDownX = touch.clientX;
        this.mouseDownY = touch.clientY;
        
        
        this.potentialDrag = true;
        
        
        const rect = this.element.getBoundingClientRect();
        this.dragOffsetX = touch.clientX - rect.left;
        this.dragOffsetY = touch.clientY - rect.top;
    }
    
    
    handleTouchMove(e) {
        
        if (this.isDragging) {
            
            const touch = e.touches[0];
            
            
            const touchX = touch.clientX;
            const touchY = touch.clientY;
            
            
            const left = touchX - this.dragOffsetX;
            const top = touchY - this.dragOffsetY;
            
            
            const vw = window.innerWidth / 100;
            const vh = window.innerHeight / 100;
            
            this.x = left / vw;
            this.y = top / vh;
            
            
            this.updatePosition();
            return;
        }
        
        
        if (this.potentialDrag) {
            const touch = e.touches[0];
            const dx = touch.clientX - this.mouseDownX;
            const dy = touch.clientY - this.mouseDownY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            
            if (distance > this.moveThreshold) {
                
                this.beforeDragState = this.state;
                
                
                this.startDragging();
            }
        }
    }
    
    
    handleTouchEnd(e) {
        
        if (!this.potentialDrag && !this.isDragging) return;
        
        
        if (this.isDragging) {
            this.endDragging();
            this.potentialDrag = false;
            return;
        }
        
        
        if (this.potentialDrag) {
            const clickDuration = Date.now() - this.mouseDownTime;
            
            
            if (clickDuration < this.clickThreshold) {
                this.showHappiness();
            }
            
            this.potentialDrag = false;
        }
    }

    
    makeAngryFace() {
        
        const leftEye = this.element.querySelector('.ladybug-eye-left');
        const rightEye = this.element.querySelector('.ladybug-eye-right');
        const smile = this.element.querySelector('.ladybug-smile');
        
        
        if (leftEye) {
            leftEye.style.height = '20%';
            leftEye.style.transform = 'rotate(-20deg)';
        }
        
        if (rightEye) {
            rightEye.style.height = '20%';
            rightEye.style.transform = 'rotate(20deg)';
        }
        
        
        if (smile) {
            smile.style.borderBottom = 'none';
            smile.style.borderTop = '2px solid #210f4b';
            smile.style.borderRadius = '50% 50% 0 0';
            smile.style.top = '60%';
        }
        
        
        const leftAntenna = this.element.querySelector('.ladybug-antenna-left');
        const rightAntenna = this.element.querySelector('.ladybug-antenna-right');
        
        if (leftAntenna) {
            leftAntenna.style.animation = 'antennaShake 0.3s infinite';
        }
        
        if (rightAntenna) {
            rightAntenna.style.animation = 'antennaShake 0.3s infinite';
            rightAntenna.style.animationDelay = '0.15s';
        }
    }
    
    
    restoreNormalFace() {
        
        const leftEye = this.element.querySelector('.ladybug-eye-left');
        const rightEye = this.element.querySelector('.ladybug-eye-right');
        const smile = this.element.querySelector('.ladybug-smile');
        
        
        if (leftEye) {
            leftEye.style.height = '25%';
            leftEye.style.transform = 'none';
        }
        
        if (rightEye) {
            rightEye.style.height = '25%';
            rightEye.style.transform = 'none';
        }
        
        
        if (smile) {
            smile.style.borderBottom = '2px solid #210f4b';
            smile.style.borderTop = 'none';
            smile.style.borderRadius = '0 0 50% 50%';
            smile.style.top = '55%';
        }
        
        
        const leftAntenna = this.element.querySelector('.ladybug-antenna-left');
        const rightAntenna = this.element.querySelector('.ladybug-antenna-right');
        
        if (leftAntenna) {
            leftAntenna.style.animation = 'antennaWiggle 2s ease-in-out infinite';
            leftAntenna.style.animationDelay = '-0.5s';
        }
        
        if (rightAntenna) {
            rightAntenna.style.animation = 'antennaWiggle 2s ease-in-out infinite';
            rightAntenna.style.animationDelay = '-1s';
        }
    }
}


class LadybugController {
    constructor() {
        
        this.container = document.createElement('div');
        this.container.className = 'ladybugs-container';
        document.body.appendChild(this.container);
        
        
        this.ladybugs = [];
        
        
        this.interactiveElements = Array.from(document.querySelectorAll('.offer-card, .countdown-timer, .promo-bar'));
        
        
        this.leaves = [];
        
        
        this.lastUpdateTime = Date.now();
        
        
        this.lastMouseX = null;
        this.lastMouseY = null;
        
        
        const countValue = getComputedStyle(document.documentElement).getPropertyValue('--ladybug-count').trim();
        this.count = parseInt(countValue) || 7; 
        
        
        this.isPageVisible = true;
        
        
        this.updateInterval = null;
        
        
        this.setupMouseTracking();
        
        this.setupVisibilityTracking();
        this.createLeaves(10); 
        this.createLadybugs();
        this.startUpdateLoop();
    }
    
    setupMouseTracking() {
        
        document.addEventListener('mousemove', (e) => {
            
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            this.lastMouseX = (e.clientX / viewportWidth) * 100;
            this.lastMouseY = (e.clientY / viewportHeight) * 100;
        });
        
        
        document.addEventListener('mouseout', () => {
            this.lastMouseX = null;
            this.lastMouseY = null;
        });
    }
    
    setupVisibilityTracking() {
        
        document.addEventListener('visibilitychange', () => {
            this.isPageVisible = document.visibilityState === 'visible';
            
            
            if (this.isPageVisible) {
                
                if (this.updateInterval) {
                    clearInterval(this.updateInterval);
                    this.updateInterval = null;
                }
                this.lastUpdateTime = Date.now();
                requestAnimationFrame(this.update.bind(this));
            } else {
                
                if (!this.updateInterval) {
                    this.updateInterval = setInterval(() => {
                        const currentTime = Date.now();
                        const deltaTime = currentTime - this.lastUpdateTime;
                        this.updateLadybugs(deltaTime);
                        this.lastUpdateTime = currentTime;
                    }, 50); 
                }
            }
        });
    }
    
    createLeaves(count = 1) {
        for (let i = 0; i < count; i++) {
            const leaf = document.createElement('div');
            leaf.className = 'leaf';
            
            
            leaf.style.left = `${5 + Math.random() * 90}vw`;
            leaf.style.top = `${5 + Math.random() * 90}vh`;
            
            
            leaf.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            document.body.appendChild(leaf);
            this.leaves.push(leaf);
        }
    }
    
    createLadybugs() {
        for (let i = 0; i < this.count; i++) {
            const ladybug = new Ladybug(this, i);
            this.container.appendChild(ladybug.element);
            this.ladybugs.push(ladybug);
        }
    }
    
    
    updateLadybugs(deltaTime) {
        
        const cappedDeltaTime = Math.min(deltaTime, 50);
        
        
        this.leaves = this.leaves.filter(leaf => document.body.contains(leaf));
        
        
        this.ladybugs.forEach(ladybug => {
            
            ladybug.detectCollision(this.ladybugs, this.interactiveElements, this.leaves);
            ladybug.update(cappedDeltaTime);
        });
    }
    
    
    update() {
        if (!this.isPageVisible) return;
        
        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastUpdateTime;
        
        this.updateLadybugs(deltaTime);
        
        this.lastUpdateTime = currentTime;
        
        
        
        if ('requestAnimationFrame' in window) {
            requestAnimationFrame(this.update.bind(this));
        } else {
            
            setTimeout(this.update.bind(this), 16);
        }
    }
    
    startUpdateLoop() {
        
        this.lastUpdateTime = Date.now();
        requestAnimationFrame(this.update.bind(this));
    }
}


const styleSheet = document.createElement('style');
styleSheet.textContent = `
@keyframes heartFloat {
    0% {
        opacity: 0;
        transform: scale(1, 0.5) translateY(0) rotate(0deg);
    }
    20% {
        opacity: 1;
        transform: scale(1, 0.5) translateY(-5px) rotate(5deg);
    }
    60% {
        opacity: 1;
        transform: scale(1, 0.5) translateY(-15px) rotate(-5deg);
    }
    100% {
        opacity: 0;
        transform: scale(1, 0.5) translateY(-25px) rotate(10deg);
    }
}

@keyframes sleepZ {
    0% {
        opacity: 0;
        transform: translateY(0) scale(0.7);
    }
    30% {
        opacity: 0.8;
        transform: translateY(-5px) scale(0.8) rotate(-5deg);
    }
    70% {
        opacity: 1;
        transform: translateY(-15px) scale(1) rotate(5deg);
    }
    100% {
        opacity: 0;
        transform: translateY(-25px) scale(0.7) rotate(15deg);
    }
}

.ladybug-heart {
    display: inline-block;
    color: #ff6b6b;
    filter: drop-shadow(0 1px 1px rgba(0,0,0,0.1));
}

.ladybug-sleep-z {
    font-family: 'Arial', sans-serif;
    color: #210f4b;
    font-style: italic;
    filter: drop-shadow(0 1px 1px rgba(0,0,0,0.1));
}
`;
document.head.appendChild(styleSheet);


document.addEventListener('DOMContentLoaded', () => {
    const controller = new LadybugController();
}); 
