const { Browser, Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const config = require('./config');

class DriverFactory {
    constructor() {
        this.driver = null;
    }

    async createDriver() {
        const options = new chrome.Options();
        
        // Headless mode - koristi novi headless mode za novije verzije Chrome-a
        if (config.browser.headless) {
            options.addArguments('--headless=new');
        }
        
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        options.addArguments('--disable-gpu');
        options.addArguments(`--window-size=${config.browser.windowSize.width},${config.browser.windowSize.height}`);
        
        try {
            this.driver = await new Builder()
                .forBrowser(Browser.CHROME)
                .setChromeOptions(options)
                .build();
            
            await this.driver.manage().setTimeouts({
                implicit: config.timeouts.implicit,
                pageLoad: config.timeouts.pageLoad,
                script: config.timeouts.script
            });
            
            if (!config.browser.headless) {
                await this.driver.manage().window().maximize();
            }
            
            return this.driver;
        } catch (error) {
            console.error('Greška pri kreiranju WebDriver-a:', error.message);
            throw error;
        }
    }

    getDriver() {
        return this.driver;
    }

    async quitDriver() {
        if (this.driver) {
            try {
                await this.driver.quit();
            } catch (error) {
                console.error('Greška pri zatvaranju driver-a:', error.message);
            }
            this.driver = null;
        }
    }
}

module.exports = new DriverFactory();
