# Information Monitor

This software replaces complex information monitor setups built with multiple scripts. It offers an easy solution to display images and websites, switching between them automatically.

## Features

- [x] Open pre-configured websites
- [x] Switch automatically after a pre-defined time
- [x] Display images from a local folder
- [x] Automatically add all pictures from a folder

## Prerequisites

- [Node.js](https://nodejs.org/) (and npm)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## How to Start

To run the application in development mode:

```bash
npm start
```

## How to Build

To build the application for distribution:

```bash
# Create a directory build
npm run pack

# Create a distributable installer
npm run dist
```

## Configuration & Usage

1. **Default Image**: Place a default JPG image named `basicImage.jpg` in the `html` folder.
2. **Slideshow**: 
   - Ensure a folder named `slideshow` exists in the main directory.
   - Add your images to the `slideshow` folder (JPG, PNG, etc.).
   - The display order is defined by filenames (e.g., `000.jpg`, `001.jpg`, `002.png`).
3. **Configuration**:
   - Edit `config.json` to define websites and display duration.
   - You can add an infinite number of websites.
   - Display duration for pictures and websites is adjustable.
4. **Runtime**:
   - Settings are automatically re-applied after one cycle.
   - Press **F11** to toggle full screen.

Have fun!
