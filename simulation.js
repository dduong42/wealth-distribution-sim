class WealthSimulation {
    constructor() {
        this.numPeople = 100;
        this.initialWealth = 100;
        this.people = [];
        this.tick = 0;
        this.isRunning = false;
        this.animationId = null;
        this.speed = 50;
        this.frameCount = 0;
        
        this.barCanvas = document.getElementById('barChart');
        this.barCtx = this.barCanvas.getContext('2d');
        this.histCanvas = document.getElementById('histogram');
        this.histCtx = this.histCanvas.getContext('2d');
        
        this.sortByWealth = true;
        this.personColors = [];
        
        this.initializeControls();
        this.reset();
    }
    
    initializeControls() {
        document.getElementById('startBtn').addEventListener('click', () => this.start());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pause());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('speedSlider').addEventListener('input', (e) => {
            this.speed = parseInt(e.target.value);
        });
        document.getElementById('sortToggle').addEventListener('change', (e) => {
            this.sortByWealth = e.target.checked;
            this.drawBarChart();
        });
        document.getElementById('initialMoneyInput').addEventListener('change', (e) => {
            const newValue = parseInt(e.target.value);
            if (newValue >= 1 && newValue <= 1000) {
                this.initialWealth = newValue;
                this.reset();
            }
        });
    }
    
    reset() {
        this.tick = 0;
        this.people = Array(this.numPeople).fill(this.initialWealth);
        this.isRunning = false;
        this.frameCount = 0;
        this.accumulatedTicks = 0;
        
        // Generate consistent colors for each person
        this.personColors = Array(this.numPeople).fill(0).map((_, i) => {
            const hue = (i * 360 / this.numPeople) % 360;
            return `hsl(${hue}, 70%, 50%)`;
        });
        
        // Update description with new initial amount
        document.getElementById('simulationDescription').innerHTML = 
            `100 people start with $${this.initialWealth} each. Every tick, each person gives $1 to a random other person.
            Watch how wealth distributes over time.`;
        
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        
        this.updateStats();
        this.drawBarChart();
        this.drawHistogram();
    }
    
    start() {
        this.isRunning = true;
        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
        this.animate();
    }
    
    pause() {
        this.isRunning = false;
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    animate() {
        if (!this.isRunning) return;
        
        this.frameCount++;
        
        // Use exponential scaling for speed
        // Maps 1-100 to roughly 0.1-1000 ticks per second
        const ticksPerSecond = Math.pow(10, (this.speed - 1) / 33);
        const framesPerSecond = 60; // Assuming 60fps
        const ticksPerFrame = ticksPerSecond / framesPerSecond;
        
        // Accumulate fractional ticks
        if (!this.accumulatedTicks) this.accumulatedTicks = 0;
        this.accumulatedTicks += ticksPerFrame;
        
        // Execute whole ticks
        const wholeTicks = Math.floor(this.accumulatedTicks);
        this.accumulatedTicks -= wholeTicks;
        
        for (let i = 0; i < wholeTicks; i++) {
            this.performTick();
        }
        
        if (wholeTicks > 0) {
            this.updateStats();
            this.drawBarChart();
            this.drawHistogram();
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    performTick() {
        this.tick++;
        
        // Each person gives $1 to a random other person
        for (let i = 0; i < this.numPeople; i++) {
            if (this.people[i] > 0) {
                // Choose a random recipient (not self)
                let recipient;
                do {
                    recipient = Math.floor(Math.random() * this.numPeople);
                } while (recipient === i);
                
                this.people[i]--;
                this.people[recipient]++;
            }
        }
    }
    
    calculateGini() {
        // Sort wealth in ascending order
        const sorted = [...this.people].sort((a, b) => a - b);
        const n = sorted.length;
        const totalWealth = sorted.reduce((sum, w) => sum + w, 0);
        
        if (totalWealth === 0) return 0;
        
        let sumOfProducts = 0;
        for (let i = 0; i < n; i++) {
            sumOfProducts += (i + 1) * sorted[i];
        }
        
        return (2 * sumOfProducts) / (n * totalWealth) - (n + 1) / n;
    }
    
    updateStats() {
        document.getElementById('tickCount').textContent = this.tick;
        document.getElementById('brokeCount').textContent = this.people.filter(w => w === 0).length;
        document.getElementById('giniCoef').textContent = this.calculateGini().toFixed(3);
        document.getElementById('maxWealth').textContent = `$${Math.max(...this.people)}`;
    }
    
    drawBarChart() {
        const ctx = this.barCtx;
        const width = this.barCanvas.width;
        const height = this.barCanvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        const barWidth = width / this.numPeople;
        // Ensure minimum scale for visibility
        const currentMax = Math.max(...this.people);
        const minScale = Math.max(this.initialWealth * 1.5, 10); // At least 10 for visibility
        const maxWealth = Math.max(currentMax * 1.2, minScale);
        
        // Prepare data based on sort preference
        let dataToRender;
        if (this.sortByWealth) {
            // Sort people by wealth for better visualization
            dataToRender = this.people.map((wealth, idx) => ({wealth, idx}))
                .sort((a, b) => b.wealth - a.wealth);
        } else {
            // Keep original order to track individuals
            dataToRender = this.people.map((wealth, idx) => ({wealth, idx}));
        }
        
        dataToRender.forEach((person, i) => {
            const barHeight = (person.wealth / maxWealth) * (height - 40);
            const x = i * barWidth;
            const y = height - barHeight - 20;
            
            // Color based on sort mode
            if (this.sortByWealth) {
                // Color based on wealth
                const hue = person.wealth > this.initialWealth ? 120 : 
                           person.wealth < this.initialWealth / 2 ? 0 : 60;
                const saturation = 70;
                const lightness = 50;
                ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            } else {
                // Use consistent color for each person
                ctx.fillStyle = this.personColors[person.idx];
            }
            
            ctx.fillRect(x, y, barWidth - 1, barHeight);
        });
        
        // Draw baseline
        ctx.strokeStyle = '#999';
        ctx.beginPath();
        ctx.moveTo(0, height - 20);
        ctx.lineTo(width, height - 20);
        ctx.stroke();
        
        // Draw initial wealth line
        const initialY = height - ((this.initialWealth / maxWealth) * (height - 40)) - 20;
        ctx.strokeStyle = '#3498db';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(0, initialY);
        ctx.lineTo(width, initialY);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Label
        ctx.fillStyle = '#666';
        ctx.font = '12px sans-serif';
        const labelText = this.sortByWealth ? 'People (sorted by wealth)' : 'People (individual tracking)';
        ctx.fillText(labelText, 10, height - 5);
        const labelWidth = ctx.measureText(`$${this.initialWealth} (initial)`).width;
        ctx.fillText(`$${this.initialWealth} (initial)`, width - labelWidth - 10, initialY - 5);
    }
    
    drawHistogram() {
        const ctx = this.histCtx;
        const width = this.histCanvas.width;
        const height = this.histCanvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        // Create bins for histogram
        const maxWealth = Math.max(...this.people);
        // Adjust bin size based on the range of values
        const binSize = maxWealth < 50 ? Math.max(1, Math.floor(maxWealth / 10)) : 10;
        const numBins = Math.max(5, Math.ceil((maxWealth + 1) / binSize)); // At least 5 bins
        const bins = new Array(numBins).fill(0);
        
        this.people.forEach(wealth => {
            const binIndex = Math.floor(wealth / binSize);
            bins[binIndex]++;
        });
        
        const maxCount = Math.max(...bins);
        const binWidth = width / numBins;
        
        bins.forEach((count, i) => {
            const binHeight = (count / maxCount) * (height - 40);
            const x = i * binWidth;
            const y = height - binHeight - 20;
            
            ctx.fillStyle = '#3498db';
            ctx.fillRect(x, y, binWidth - 2, binHeight);
            
            // Label bins
            if (i % Math.ceil(numBins / 10) === 0) {
                ctx.fillStyle = '#666';
                ctx.font = '10px sans-serif';
                ctx.fillText(`$${i * binSize}`, x, height - 5);
            }
        });
        
        // Labels
        ctx.fillStyle = '#666';
        ctx.font = '12px sans-serif';
        ctx.fillText('Wealth Distribution', 10, 15);
    }
}

// Initialize simulation when page loads
document.addEventListener('DOMContentLoaded', () => {
    new WealthSimulation();
});