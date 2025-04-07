"use strict";
class CountdownTimer {
    constructor(endDateString) {
        this.endDate = new Date(endDateString);
        
        this.daysTens = document.getElementById('days-tens').querySelector('span');
        this.daysOnes = document.getElementById('days-ones').querySelector('span');
        this.hoursTens = document.getElementById('hours-tens').querySelector('span');
        this.hoursOnes = document.getElementById('hours-ones').querySelector('span');
        this.minutesTens = document.getElementById('minutes-tens').querySelector('span');
        this.minutesOnes = document.getElementById('minutes-ones').querySelector('span');
        this.secondsTens = document.getElementById('seconds-tens').querySelector('span');
        this.secondsOnes = document.getElementById('seconds-ones').querySelector('span');
        
        this.checkAndFixTimerStructure();
        
        this.setFixedWidthForDigits();
        
        this.updateTimer();
        this.startTimer();
    }
    
    checkAndFixTimerStructure() {
        const digitElements = document.querySelectorAll('.timer-digit');
        
        digitElements.forEach(digit => {
            if (!digit.querySelector('.timer-digit-front')) {
                const frontElement = document.createElement('div');
                frontElement.className = 'timer-digit-front';
                digit.appendChild(frontElement);
            }
            
            if (!digit.querySelector('.timer-digit-back')) {
                const backElement = document.createElement('div');
                backElement.className = 'timer-digit-back';
                digit.appendChild(backElement);
            }
            
            const span = digit.querySelector('span');
            if (span && digit.childNodes[0] === span) {
                digit.appendChild(span);
            }
        });
    }
    
    setFixedWidthForDigits() {
        const digits = document.querySelectorAll('.timer-digit span');
        digits.forEach(digit => {
            digit.style.width = '1em';
            digit.style.textAlign = 'center';
            digit.style.display = 'inline-block';
            digit.style.lineHeight = '1';
        });
    }
    
    updateTimer() {
        const now = new Date();
        const diff = this.endDate.getTime() - now.getTime();
        if (diff <= 0) {
            this.updateDisplay(0, 0, 0, 0);
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
            }
            return;
        }
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        this.updateDisplay(days, hours, minutes, seconds);
    }
    
    updateDisplay(days, hours, minutes, seconds) {
        this.updateDigits(this.daysTens, this.daysOnes, days);
        this.updateDigits(this.hoursTens, this.hoursOnes, hours);
        this.updateDigits(this.minutesTens, this.minutesOnes, minutes);
        this.updateDigits(this.secondsTens, this.secondsOnes, seconds);
    }
    
    updateDigits(tensElement, onesElement, value) {
        if (tensElement && onesElement) {
            const tens = Math.floor(value / 10);
            const ones = value % 10;
            tensElement.textContent = tens.toString();
            onesElement.textContent = ones.toString();
        }
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.updateTimer();
        }, 1000);
    }
    
    addSeparatorLines() {
        const digitBlocks = document.querySelectorAll('.timer-unit');
        
        digitBlocks.forEach(block => {
            const blockStyle = {
                position: 'relative',
                display: 'flex',
                gap: '0',
                backgroundColor: 'transparent',
                borderRadius: 'var(--digit-border-radius)',
            };
            
            Object.assign(block.style, blockStyle);
            
            let darkBg = block.querySelector('.timer-unit-dark-bg');
            if (!darkBg) {
                darkBg = document.createElement('div');
                darkBg.className = 'timer-unit-dark-bg';
                block.appendChild(darkBg);
            }
            
            const digitOffset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--digit-offset').trim()) || 3;
            
            Object.assign(darkBg.style, {
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                backgroundColor: 'var(--digit-back-color)',
                borderRadius: 'calc(var(--digit-border-radius) + 3px)',
                zIndex: '0'
            });
            
            let lightBg = block.querySelector('.timer-unit-light-bg');
            if (!lightBg) {
                lightBg = document.createElement('div');
                lightBg.className = 'timer-unit-light-bg';
                block.appendChild(lightBg);
            }
            //vghvv
            Object.assign(lightBg.style, {
                position: 'absolute',
                top: '0',
                left: '0',
                width: 'calc(100% - 3px)',
                height: 'calc(100% - 7px)',
                backgroundColor: 'var(--digit-bg-color)',
                borderRadius: 'var(--digit-border-radius)',
                zIndex: '1',
                transform: 'none'
            });
            
            const digits = block.querySelectorAll('.timer-digit');
            
            digits.forEach(digit => {
                digit.style.zIndex = '2';
                digit.style.position = 'relative';
            });
            
            if (digits.length === 2) {
                const separator = document.createElement('div');
                separator.className = 'digit-separator';
                
                Object.assign(separator.style, {
                    position: 'absolute',
                    left: `calc(50% - 4px)`,
                    top: '0',
                    height: '100%',
                    width: '0',
                    borderRight: '1px dashed #597db4',
                    zIndex: '3',
                    pointerEvents: 'none'
                });
                
                block.appendChild(separator);
            }
        });
    }
}

const style = document.createElement('style');
style.textContent = `
.digit-separator {
    position: absolute;
    border-right: 1px dashed #597db4;
    z-index: 3;
    pointer-events: none;
}

.timer-digit:first-child::after {
    display: none !important;
    content: none !important;
    border: none !important;
}

.timer-unit::before,
.timer-unit::after {
    display: none !important;
    content: none !important;
}

.timer-unit-dark-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--digit-back-color);
    border-radius: calc(var(--digit-border-radius) + 3px);
    z-index: 0;
}

.timer-unit-light-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% - 3px);
    height: calc(100% - 7px);
    background-color: var(--digit-bg-color);
    border-radius: var(--digit-border-radius);
    z-index: 1;
}

.timer-digit {
    position: relative;
    z-index: 2;
}

.timer-digit {
    min-width: 56px;
    min-height: 84px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.timer-digit span {
    font-size: 2.8rem;
}

@media (max-width: 768px) {
    .timer-unit-dark-bg,
    .timer-unit-light-bg {
        display: block !important;
    }
    
    .timer-unit-dark-bg {
        background-color: var(--digit-back-color) !important;
        border-radius: calc(var(--digit-border-radius) + 3px) !important;
        z-index: 0 !important;
        width: 100% !important;
        height: 100% !important;
    }
    
    .timer-unit-light-bg {
        background-color: var(--digit-bg-color) !important;
        border-radius: var(--digit-border-radius) !important;
        z-index: 1 !important;
        width: calc(100% - 3px) !important;
        height: calc(100% - 7px) !important;
    }
    
    .digit-separator {
        left: calc(50% - 4px) !important;
    }
    
    .timer-digit {
        min-width: 49px;
        min-height: 70px;
    }
    
    .timer-digit span {
        font-size: 2.45rem;
    }
}

@media (max-width: 600px) {
    .timer-blocks {
        display: grid;
        grid-template-columns: repeat(2, 1fr) !important;
        grid-gap: 15px !important;
        margin: 0 auto;
        width: 95% !important;
        max-width: 500px !important;
    }
    
    .timer-digit {
        min-width: 42px !important;
        min-height: 63px !important;
    }
    
    .timer-digit span {
        font-size: 2.1rem !important;
    }
    
    .timer-block {
        margin-bottom: 14px !important;
    }
}

@media (max-width: 400px) {
    .timer-digit {
        min-width: 39px !important;
        min-height: 59px !important;
    }
    
    .timer-digit span {
        font-size: 2rem !important;
    }
    
    .timer-blocks {
        grid-gap: 14px !important;
    }
}
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    const currentYear = new Date().getFullYear();
    const endDateString = `${currentYear}-04-20T23:59:59`; 
    
    const timer = new CountdownTimer(endDateString);
    
    timer.addSeparatorLines();
});
