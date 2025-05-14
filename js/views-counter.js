"use strict";

class CountdownViewsTimer {
    constructor(endDateString) {
        this.endDate = new Date(endDateString);

        // Получаем элементы для цифр таймера согласно HTML структуре ДД:ЧЧ:ММ:СС
        this.daysTens = document.getElementById('timer-days-tens')?.querySelector('span');
        this.daysOnes = document.getElementById('timer-days-ones')?.querySelector('span');
        this.hoursTens = document.getElementById('timer-hours-tens')?.querySelector('span');
        this.hoursOnes = document.getElementById('timer-hours-ones')?.querySelector('span');
        this.minutesTens = document.getElementById('timer-minutes-tens')?.querySelector('span');
        this.minutesOnes = document.getElementById('timer-minutes-ones')?.querySelector('span');
        this.secondsTens = document.getElementById('timer-seconds-tens')?.querySelector('span');
        this.secondsOnes = document.getElementById('timer-seconds-ones')?.querySelector('span');

        this.timerInterval = null;

        // Проверка наличия всех элементов
        if (!this.daysTens || !this.daysOnes || !this.hoursTens || !this.hoursOnes || 
            !this.minutesTens || !this.minutesOnes || !this.secondsTens || !this.secondsOnes) {
            console.error("Не найдены все элементы для отображения таймера ДД:ЧЧ:ММ:СС.");
            return;
        }

        this.updateTimerDisplay(); // Первоначальное обновление
        this.startTimer();       // Запуск таймера
    }

    updateTimerDisplay() {
        const now = new Date();
        const diffMs = this.endDate.getTime() - now.getTime();

        if (diffMs <= 0) {
            this.displayTime(0, 0, 0, 0);
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
            }
            // Опционально: скрыть таймер или показать сообщение
            // const timerContainer = document.querySelector('.views-counter');
            // if (timerContainer) { timerContainer.style.display = 'none'; }
            return;
        }

        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

        this.displayTime(days, hours, minutes, seconds);
    }

    displayTime(days, hours, minutes, seconds) {
        this.updateDigits(this.daysTens, this.daysOnes, days);
        this.updateDigits(this.hoursTens, this.hoursOnes, hours);
        this.updateDigits(this.minutesTens, this.minutesOnes, minutes);
        this.updateDigits(this.secondsTens, this.secondsOnes, seconds);
    }

    updateDigits(tensEl, onesEl, value) {
        if (tensEl && onesEl) {
            const tens = Math.floor(value / 10);
            const ones = value % 10;
            tensEl.textContent = tens.toString();
            onesEl.textContent = ones.toString();
        } else {
            // console.warn("Элементы цифр не найдены для значения:", value);
        }
    }

    startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        this.timerInterval = setInterval(() => {
            this.updateTimerDisplay();
        }, 1000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const currentYear = new Date().getFullYear();
    const endDateString = `${currentYear}-06-01T23:59:59`; // 1 июня, конец дня

    // Проверяем, что мы на странице, где есть необходимый набор элементов для таймера
    if (document.getElementById('timer-days-tens') && 
        document.getElementById('timer-days-ones') &&
        document.getElementById('timer-hours-tens') && 
        document.getElementById('timer-hours-ones') &&
        document.getElementById('timer-minutes-tens') && 
        document.getElementById('timer-minutes-ones') &&
        document.getElementById('timer-seconds-tens') && 
        document.getElementById('timer-seconds-ones')) {
        new CountdownViewsTimer(endDateString);
    } 
}); 