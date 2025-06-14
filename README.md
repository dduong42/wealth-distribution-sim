# Wealth Distribution Simulation

An interactive visualization demonstrating how random money exchanges lead to wealth inequality, based on Jordan Ellenberg's article ["When random people give money to random other people"](https://quomodocumque.wordpress.com/2017/06/27/when-random-people-give-money-to-random-other-people/).

## Live Demo

Open `index.html` in a web browser to run the simulation.

## Overview

This simulation starts with 100 people, each having an equal amount of money. At each tick:
- Every person with money gives $1 to a randomly chosen other person
- The visualization shows how wealth naturally concentrates despite the random nature of exchanges

## Features

### Visualizations
- **Animated Bar Chart**: Shows individual wealth in real-time
  - Sorted view: Bars arranged by wealth (green = wealthy, yellow = average, red = poor)
  - Individual tracking: Each person maintains their position with a unique color
- **Histogram**: Distribution of wealth across different ranges

### Controls
- **Start/Pause/Reset**: Control simulation execution
- **Initial Money**: Set starting amount per person ($1-$1000)
- **Speed Control**: Progressive scale from very slow (0.1 ticks/sec) to very fast (10,000 ticks/sec)
- **Sort Toggle**: Switch between sorted and individual tracking views

### Statistics
- **Tick Counter**: Number of exchange rounds completed
- **Broke Count**: People with $0
- **Gini Coefficient**: Measure of inequality (0 = perfect equality, 1 = perfect inequality)
- **Max Wealth**: Highest individual wealth

## Mathematical Insights

The simulation demonstrates several key concepts:
- Random processes can create systematic inequality
- Wealth distribution tends toward exponential/power-law patterns
- About 36.8% (1/e) of states involve someone being completely broke
- The Gini coefficient increases over time, showing growing inequality

## Technical Details

Built with vanilla JavaScript using:
- Canvas API for visualizations
- RequestAnimationFrame for smooth animations
- Exponential speed scaling for better control
- Dynamic scaling for different initial wealth values

## Running Locally

1. Clone the repository
2. Open `index.html` in a modern web browser
3. No build process or dependencies required

## License

This project is open source and available under the MIT License.