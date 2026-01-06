const { expect } = require('chai');
const { By, until, Key } = require('selenium-webdriver');
const { setupDriver, teardownDriver, waitForPageLoad, handleTestFailure, getDriver } = require('./setup');

describe('BMI Calculator.net testovi', function() {
    this.timeout(60000);
    let driver;
    const BASE_URL = 'https://www.calculator.net/bmi-calculator.html';

    before(async function() {
        this.timeout(90000);
        driver = await setupDriver('BMI Calculator');
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

    describe('BMI Calculator testovi', function() {
        
        it('Test 1: Trebao bi loadati BMI Calculator stranicu i provjeriti naslov', async function() {
            await driver.get(BASE_URL);
            await waitForPageLoad();
            
            const title = await driver.getTitle();
            expect(title).to.equal('BMI Calculator');
        });

        it('Test 2: Trebao bi prikazati breadcrumbs navigaciju', async function() {
            await driver.get(BASE_URL);
            await waitForPageLoad();
            
            const breadcrumbs = await driver.findElement(By.css('#breadcrumbs'));
            const breadcrumbsText = await breadcrumbs.getText();
            
            expect(breadcrumbsText.toLowerCase()).to.include('home');
            expect(breadcrumbsText.toLowerCase()).to.include('fitness & health');
            expect(breadcrumbsText.toLowerCase()).to.include('bmi calculator');
        });

        it('Test 3: Trebao bi prikazati tri tab opcije (US Units, Metric Units, Other Units)', async function() {
            await driver.get(BASE_URL);
            await waitForPageLoad();
            await driver.sleep(1000);
            
            const topMenu = await driver.findElement(By.css('#topmenu'));
            const menuItems = await topMenu.findElements(By.css('li'));
            const menuTexts = await Promise.all(menuItems.map(item => item.getText()));
            
            expect(menuItems.length).to.equal(3);
            expect(menuTexts.join(' ')).to.include('US Units');
            expect(menuTexts.join(' ')).to.include('Metric Units');
            expect(menuTexts.join(' ')).to.include('Other Units');
        });

        it('Test 4: Trebao bi prikazati sve input polja za Metric Units', async function() {
            await driver.get(BASE_URL);
            await waitForPageLoad();
            await driver.sleep(1000);
            
            const ageInput = await driver.findElement(By.css('#cage'));
            const heightInput = await driver.findElement(By.css('#cheightmeter'));
            const weightInput = await driver.findElement(By.css('#ckg'));
            
            const isAgeVisible = await ageInput.isDisplayed();
            const isHeightVisible = await heightInput.isDisplayed();
            const isWeightVisible = await weightInput.isDisplayed();
            
            expect(isAgeVisible).to.be.true;
            expect(isHeightVisible).to.be.true;
            expect(isWeightVisible).to.be.true;
        });

        it('Test 5: Trebao bi omoguciti prebacivanje izmedju US i Metric jedinica', async function() {
            await driver.get(BASE_URL);
            await waitForPageLoad();
            await driver.sleep(1000);
            
            const usUnitsTab = await driver.findElement(By.xpath("//a[contains(text(), 'US Units')]"));
            await usUnitsTab.click();
            await driver.sleep(1000);
            
            const feetInput = await driver.findElement(By.css('#cheightfeet'));
            const inchInput = await driver.findElement(By.css('#cheightinch'));
            const poundInput = await driver.findElement(By.css('#cpound'));
            
            const isFeetVisible = await feetInput.isDisplayed();
            const isInchVisible = await inchInput.isDisplayed();
            const isPoundVisible = await poundInput.isDisplayed();
            
            expect(isFeetVisible).to.be.true;
            expect(isInchVisible).to.be.true;
            expect(isPoundVisible).to.be.true;
        });
        
        it('Test 6: Trebao bi izracunati BMI sa Metric jedinicama i prikazati rezultat', async function() {
            await driver.get(BASE_URL);
            await waitForPageLoad();
            await driver.sleep(1000);
            
            const ageInput = await driver.findElement(By.css('#cage'));
            await ageInput.clear();
            await ageInput.sendKeys('30');
            
            const heightInput = await driver.findElement(By.css('#cheightmeter'));
            await heightInput.clear();
            await heightInput.sendKeys('175');
            
            const weightInput = await driver.findElement(By.css('#ckg'));
            await weightInput.clear();
            await weightInput.sendKeys('70');
            
            const calculateButton = await driver.findElement(By.xpath("//input[@type='submit' and @value='Calculate']"));
            await calculateButton.click();
            await waitForPageLoad();
            await driver.sleep(2000);
            
            const resultDiv = await driver.findElement(By.css('.bigtext'));
            const resultText = await resultDiv.getText();
            
            expect(resultText).to.include('BMI');
            expect(resultText).to.include('22.9');
        });

        it('Test 7: Trebao bi prikazati BMI kategoriju (Normal, Overweight, itd.)', async function() {
            await driver.get(BASE_URL);
            await waitForPageLoad();
            await driver.sleep(1000);
            
            const ageInput = await driver.findElement(By.css('#cage'));
            await ageInput.clear();
            await ageInput.sendKeys('25');
            
            const heightInput = await driver.findElement(By.css('#cheightmeter'));
            await heightInput.clear();
            await heightInput.sendKeys('180');
            
            const weightInput = await driver.findElement(By.css('#ckg'));
            await weightInput.clear();
            await weightInput.sendKeys('65');
            
            const calculateButton = await driver.findElement(By.xpath("//input[@type='submit' and @value='Calculate']"));
            await calculateButton.click();
            await waitForPageLoad();
            await driver.sleep(2000);
            
            const resultDiv = await driver.findElement(By.css('.bigtext'));
            const resultText = await resultDiv.getText();
            
            expect(resultText.toLowerCase()).to.include('normal');
        });

        it('Test 8: Trebao bi omoguciti Clear funkciju za resetovanje forme', async function() {
            await driver.get(BASE_URL);
            await waitForPageLoad();
            await driver.sleep(1000);
            
            const ageInput = await driver.findElement(By.css('#cage'));
            await ageInput.clear();
            await ageInput.sendKeys('35');
            
            const heightInput = await driver.findElement(By.css('#cheightmeter'));
            await heightInput.clear();
            await heightInput.sendKeys('190');
            
            const weightInput = await driver.findElement(By.css('#ckg'));
            await weightInput.clear();
            await weightInput.sendKeys('85');
            
            const clearButton = await driver.findElement(By.xpath("//input[@type='button' and @value='Clear']"));
            await clearButton.click();
            await driver.sleep(1000);
            
            const ageValue = await ageInput.getAttribute('value');
            const heightValue = await heightInput.getAttribute('value');
            const weightValue = await weightInput.getAttribute('value');
            
            expect(ageValue).to.not.equal('35');
            expect(heightValue).to.not.equal('190');
            expect(weightValue).to.not.equal('85');
        });

        it('Test 9: Trebao bi prikazati BMI grafikon nakon kalkulacije', async function() {
            await driver.get(BASE_URL);
            await waitForPageLoad();
            await driver.sleep(1000);
            
            const calculateButton = await driver.findElement(By.xpath("//input[@type='submit' and @value='Calculate']"));
            await calculateButton.click();
            await waitForPageLoad();
            await driver.sleep(2000);
            
            const svgChart = await driver.findElement(By.css('svg'));
            const isSvgVisible = await svgChart.isDisplayed();
            
            expect(isSvgVisible).to.be.true;
        });

        it('Test 10: Trebao bi prikazati dodatne informacije (Healthy BMI range, BMI Prime, Ponderal Index)', async function() {
            await driver.get(BASE_URL);
            await waitForPageLoad();
            await driver.sleep(1000);
            
            const calculateButton = await driver.findElement(By.xpath("//input[@type='submit' and @value='Calculate']"));
            await calculateButton.click();
            await waitForPageLoad();
            await driver.sleep(2000);
            
            const resultSection = await driver.findElement(By.css('.rightresult'));
            const resultText = await resultSection.getText();
            
            expect(resultText.toLowerCase()).to.include('healthy bmi range');
            expect(resultText.toLowerCase()).to.include('bmi prime');
            expect(resultText.toLowerCase()).to.include('ponderal index');
        });
    });
});
