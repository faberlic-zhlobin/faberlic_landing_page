"use strict";

class ViewsCounter {
    constructor(initialViews = 1234) {
        this.thousandsElement = document.getElementById('views-thousands').querySelector('span');
        this.hundredsElement = document.getElementById('views-hundreds').querySelector('span');
        this.tensElement = document.getElementById('views-tens').querySelector('span');
        this.onesElement = document.getElementById('views-ones').querySelector('span');
        
        this.viewsCount = initialViews;
        
        this.updateDisplay();
        
        this.startAutoIncrement();
    }
    
    updateDisplay() {
        const thousands = Math.floor(this.viewsCount / 1000) % 10;
        const hundreds = Math.floor(this.viewsCount / 100) % 10;
        const tens = Math.floor(this.viewsCount / 10) % 10;
        const ones = this.viewsCount % 10;
        
        this.thousandsElement.textContent = thousands.toString();
        this.hundredsElement.textContent = hundreds.toString();
        this.tensElement.textContent = tens.toString();
        this.onesElement.textContent = ones.toString();
    }
    
    increment() {
        this.viewsCount++;
        
        if (this.viewsCount >= 10000) {
            this.viewsCount = 1000;
        }
        
        this.updateDisplay();
    }
    
    startAutoIncrement() {
        const scheduleNextIncrement = () => {
            const randomTime = Math.floor(Math.random() * (180000 - 60000 + 1) + 60000);
            
            setTimeout(() => {
                this.increment();
                scheduleNextIncrement();
            }, randomTime);
        };
        
        scheduleNextIncrement();
        
        setTimeout(() => {
            this.increment();
        }, 5000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const viewsCounter = new ViewsCounter(1234);
}); 