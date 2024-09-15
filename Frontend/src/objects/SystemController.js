const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const robot = require('robotjs');
const openurl = require('openurl');

class SystemController {
    constructor() {
        this.robot = robot;
        this.fs = fs;
        this.path = path;
        this.PNG = PNG;
    }

    async takeScreenshot() {
        console.log('Taking screenshot');
        const screenshot = this.robot.screen.capture();
        const { width, height, image } = screenshot;
        const png = new this.PNG({ width, height });

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (width * y + x) * 4;
                const r = image[idx];
                const g = image[idx + 1];
                const b = image[idx + 2];
                const a = image[idx + 3];
                const pngIdx = (png.width * y + x) << 2;

                png.data[pngIdx] = r;
                png.data[pngIdx + 1] = g;
                png.data[pngIdx + 2] = b;
                png.data[pngIdx + 3] = a;
            }
        }

        const filePath = this.path.join(__dirname, `../../screenshots/screenshot-${Date.now()}-${Math.random().toString(36).substring(7)}.png`);
        png.pack().pipe(this.fs.createWriteStream(filePath))
            .on('finish', () => {
                console.log(`Screenshot saved to ${filePath}`);
            })
            .on('error', (err) => {
                console.error('Error saving screenshot:', err);
            });
        return filePath;
    }

    async openDefaultBrowser(url) {
        try {
            openurl.open(url);
            console.log(`Opened ${url} in the default browser`);
        } catch (err) {
            console.error('Error opening browser:', err);
        }
    }
}

module.exports = SystemController;
