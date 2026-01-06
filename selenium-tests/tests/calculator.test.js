const { expect } = require('chai');
const { By } = require('selenium-webdriver');
const { setupDriver, teardownDriver, waitForPageLoad, handleTestFailure } = require('./setup');

describe('Calculator.net testovi', function() {
    this.timeout(60000);
    let driver;
    const BASE_URL = 'https://www.calculator.net';

    before(async function() {
        this.timeout(90000);
        driver = await setupDriver('Calculator.net');
    });

    after(async function() {
        await teardownDriver();
    });

    beforeEach(async function() {
        console.log(`Pokretanje testa: ${this.currentTest.title}`);
    });

    afterEach(async function() {
        await handleTestFailure(this);
    });

    describe('Homepage testovi', function() {
        
        it('Test 1: Trebao bi loadati homepage i provjeriti naslov', async function() {
            await driver.get(BASE_URL);
            await waitForPageLoad();
            
            const title = await driver.getTitle();
            expect(title.toLowerCase()).to.include('calculator');
        });

        it('Test 2: Trebao bi prikazati logo', async function() {
            await driver.get(BASE_URL);
            await waitForPageLoad();
            
            const logo = await driver.findElement(By.css('#logo img'));
            const isLogoDisplayed = await logo.isDisplayed();
            const logoAltText = await logo.getAttribute('alt');
            
            expect(isLogoDisplayed).to.be.true;
            expect(logoAltText).to.equal('Calculator.net');
        });

        it('Test 3: Trebao bi prikazati login link', async function() {
            await driver.get(BASE_URL);
            await waitForPageLoad();
            
            const signInLink = await driver.findElement(By.css('#login a'));
            const isVisible = await signInLink.isDisplayed();
            const linkText = await signInLink.getText();
            
            expect(isVisible).to.be.true;
            expect(linkText.toLowerCase()).to.equal('sign in');
        });

        it('Test 4: Trebao bi prikazati scientific calculator i default vrijednost', async function() {
            await driver.get(BASE_URL);
            await waitForPageLoad();
            await driver.sleep(1000);
            
            const sciCalc = await driver.findElement(By.css('#sciout'));
            const isVisible = await sciCalc.isDisplayed();
            
            const output = await driver.findElement(By.css('#sciOutPut'));
            const value = await output.getText();
            
            expect(isVisible).to.be.true;
            expect(value).to.equal('0');
        });

        it('Test 5: Trebao bi prikazati search bar', async function() {
            await driver.get(BASE_URL);
            await waitForPageLoad();
            
            const searchBox = await driver.findElement(By.css('#calcSearchTerm'));
            const isVisible = await searchBox.isDisplayed();
            
            expect(isVisible).to.be.true;
        });

        it('Test 6: Trebao bi prikazati search button', async function() {
            await driver.get(BASE_URL);
            await waitForPageLoad();
            
            const searchBtn = await driver.findElement(By.css('#bluebtn'));
            const isVisible = await searchBtn.isDisplayed();
            const btnText = await searchBtn.getText();
            
            expect(isVisible).to.be.true;
            expect(btnText.toLowerCase()).to.equal('search');
        });

        it('Test 7: Trebao bi prikazati footer sa linkovima', async function() {
            await driver.get(BASE_URL);
            await waitForPageLoad();
            
            await driver.executeScript('window.scrollTo(0, document.body.scrollHeight);');
            await driver.sleep(2000);
            
            const footer = await driver.findElement(By.css('#footer'));
            const isVisible = await footer.isDisplayed();
            const footerText = await footer.getText();
            
            const aboutUsLink = await driver.findElement(By.linkText('about us'));
            const sitemapLink = await driver.findElement(By.linkText('sitemap'));
            const termsLink = await driver.findElement(By.linkText('terms of use'));
            const privacyLink = await driver.findElement(By.linkText('privacy policy'));
            
            const aboutVisible = await aboutUsLink.isDisplayed();
            const sitemapVisible = await sitemapLink.isDisplayed();
            const termsVisible = await termsLink.isDisplayed();
            const privacyVisible = await privacyLink.isDisplayed();
            
            expect(footerText).to.include('Calculator.net');
            expect(isVisible).to.be.true;
            expect(aboutVisible).to.be.true;
            expect(sitemapVisible).to.be.true;
            expect(termsVisible).to.be.true;
            expect(privacyVisible).to.be.true;

            const lowerText = footerText.toLowerCase();
            expect(lowerText).to.include('about us');
            expect(lowerText).to.include('sitemap');
            expect(lowerText).to.include('terms of use');
            expect(lowerText).to.include('privacy policy');
            
        });
    });
});
