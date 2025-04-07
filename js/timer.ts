class CountdownTimer {
    private endDate: Date;
    private timerInterval: number | undefined;

    
    private daysTens: HTMLElement | null;
    private daysOnes: HTMLElement | null;
    private hoursTens: HTMLElement | null;
    private hoursOnes: HTMLElement | null;
    private minutesTens: HTMLElement | null;
    private minutesOnes: HTMLElement | null;
    private secondsTens: HTMLElement | null;
    private secondsOnes: HTMLElement | null;

    constructor(endDateString: string) {
        
        this.endDate = new Date(endDateString);

        
        this.daysTens = document.getElementById('days-tens');
        this.daysOnes = document.getElementById('days-ones');
        this.hoursTens = document.getElementById('hours-tens');
        this.hoursOnes = document.getElementById('hours-ones');
        this.minutesTens = document.getElementById('minutes-tens');
        this.minutesOnes = document.getElementById('minutes-ones');
        this.secondsTens = document.getElementById('seconds-tens');
        this.secondsOnes = document.getElementById('seconds-ones');

        
        this.updateTimer();
        this.startTimer();
    }

    
    private updateTimer(): void {
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

    
    private updateDisplay(days: number, hours: number, minutes: number, seconds: number): void {
        this.updateDigits(this.daysTens, this.daysOnes, days);
        this.updateDigits(this.hoursTens, this.hoursOnes, hours);
        this.updateDigits(this.minutesTens, this.minutesOnes, minutes);
        this.updateDigits(this.secondsTens, this.secondsOnes, seconds);
    }

    
    private updateDigits(tensElement: HTMLElement | null, onesElement: HTMLElement | null, value: number): void {
        if (tensElement && onesElement) {
            const tens = Math.floor(value / 10);
            const ones = value % 10;
            
            tensElement.textContent = tens.toString();
            onesElement.textContent = ones.toString();
        }
    }

    
    private startTimer(): void {
        this.timerInterval = setInterval(() => {
            this.updateTimer();
        }, 1000);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);
    targetDate.setHours(12);
    targetDate.setMinutes(3);
    targetDate.setSeconds(43);
    
    new CountdownTimer(targetDate.toString());
}); 
