# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a JavaScript visualization of the wealth distribution simulation described in the article "When Random People Give Money to Random Other People". The simulation demonstrates how random exchanges of money between people can lead to wealth inequality.

### Key Simulation Rules
- 100 people start with $100 each
- Every tick of the clock, each person with money gives $1 to a randomly chosen other person
- The visualization shows how wealth concentrates over time despite the random nature of exchanges

## Project Structure

```
/
├── index.html       # Main HTML file with visualization container
├── styles.css       # Styling for the interface
├── simulation.js    # Core simulation logic and visualization code
└── CLAUDE.md       # This file
```

## Development Commands

This is a vanilla JavaScript project with no build process. To run:

1. Open `index.html` directly in a web browser, or
2. Use a local web server (e.g., `python -m http.server 8000` or `npx http-server`)

## Architecture

### Core Components

1. **WealthSimulation Class** (`simulation.js`)
   - Manages the simulation state (100 people, wealth distribution)
   - Handles animation loop and tick logic
   - Calculates statistics (Gini coefficient, broke count)
   - Renders two visualizations:
     - Bar chart: Shows individual wealth sorted by amount
     - Histogram: Shows wealth distribution across bins

2. **Key Methods**
   - `performTick()`: Executes one round of random money transfers
   - `calculateGini()`: Computes Gini coefficient for inequality measurement
   - `drawBarChart()`: Renders sorted wealth bars with color coding
   - `drawHistogram()`: Shows distribution of wealth across ranges

### Visualization Design
- Bar chart uses color coding: green (above initial), yellow (near initial), red (below half)
- Blue dashed line indicates initial wealth level ($100)
- Speed slider controls ticks per animation frame (1-100)

## Mathematical Background

The simulation explores how random exchanges create inequality through:
- Random walk dynamics on wealth distribution states
- Emergence of power-law-like distributions
- High probability of individuals reaching $0 (approximately 1/e ≈ 36.8% of states)