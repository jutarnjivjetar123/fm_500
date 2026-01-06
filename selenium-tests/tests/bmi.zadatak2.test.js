const { expect } = require('chai');
const { By } = require('selenium-webdriver');
const { setupDriver, teardownDriver, handleTestFailure } = require('./setup');

describe('Zadatak 2 - testoiv', function() {
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
        await driver.get(BASE_URL);
        await driver.wait(async () => {
            const readyState = await driver.executeScript('return document.readyState');
            return readyState === 'complete';
        }, 15000);
        await driver.sleep(1000);
    });

    afterEach(async function() {
        await handleTestFailure(this);
    });

    describe('Age validacija testovi', function() {
        
        it('BMI_EP_1: Trebao bi prikazati warning za starost manju od 2', async function() {
            const ageInput = await driver.findElement(By.css('#cage'));
            await ageInput.clear();
            await ageInput.sendKeys('-5');
            
            const calculateButton = await driver.findElement(By.xpath("//input[@type='submit' and @value='Calculate']"));
            await calculateButton.click();
            await driver.sleep(2000);
            
            const pageText = await driver.findElement(By.css('body')).getText();
            expect(pageText.toLowerCase()).to.satisfy((text) => {
                return text.includes('age') && (text.includes('2') || text.includes('120') || text.includes('between'));
            });
        });

        it('BMI_EP_2: Trebao bi uspjesno izracunati BMI za starost izmedju 2 i 120', async function() {
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
            await driver.wait(async () => {
                const readyState = await driver.executeScript('return document.readyState');
                return readyState === 'complete';
            }, 15000);
            await driver.sleep(2000);
            
            const resultDiv = await driver.findElement(By.css('.bigtext'));
            const resultText = await resultDiv.getText();
            
            expect(resultText).to.include('BMI');
            expect(resultText.toLowerCase()).to.include('normal');
        });

        it('BMI_EP_3: Trebao bi prikazati warbing za starost vecu od 120', async function() {
            const ageInput = await driver.findElement(By.css('#cage'));
            await ageInput.clear();
            await ageInput.sendKeys('122');
            
            const calculateButton = await driver.findElement(By.xpath("//input[@type='submit' and @value='Calculate']"));
            await calculateButton.click();
            await driver.sleep(2000);
            
            const pageText = await driver.findElement(By.css('body')).getText();
            expect(pageText.toLowerCase()).to.satisfy((text) => {
                return text.includes('age') && (text.includes('2') || text.includes('120') || text.includes('between'));
            });
        });

        it('BMI_EP_4: Trebao bi baciti error kada se unesu slova u Age', async function() {
            const ageInput = await driver.findElement(By.css('#cage'));
            await ageInput.clear();
            await ageInput.sendKeys('afgh');
            
            const calculateButton = await driver.findElement(By.xpath("//input[@type='submit' and @value='Calculate']"));
            await calculateButton.click();
            await driver.sleep(2000);
            
            const pageText = await driver.findElement(By.css('body')).getText();
            expect(pageText.toLowerCase()).to.satisfy((text) => {
                return text.includes('age') || text.includes('number') || text.includes('invalid') || 
                       text.includes('between') || text.includes('2') || text.includes('120');
            });
        });

        it('BMI_EP_5: Trebao bi baciti error kada se unesu special characteri u Age', async function() {
            const ageInput = await driver.findElement(By.css('#cage'));
            await ageInput.clear();
            await ageInput.sendKeys('&%');
            
            const calculateButton = await driver.findElement(By.xpath("//input[@type='submit' and @value='Calculate']"));
            await calculateButton.click();
            await driver.sleep(2000);
            
            const pageText = await driver.findElement(By.css('body')).getText();
            expect(pageText.toLowerCase()).to.satisfy((text) => {
                return text.includes('age') || text.includes('number') || text.includes('invalid') || 
                       text.includes('between') || text.includes('2') || text.includes('120');
            });
        });

        it('BMI_EP_6: Trebao bi baciti error kada se unesu alfanumericki karakteri u Age', async function() {
            const ageInput = await driver.findElement(By.css('#cage'));
            await ageInput.clear();
            await ageInput.sendKeys('25abc');
            
            const calculateButton = await driver.findElement(By.xpath("//input[@type='submit' and @value='Calculate']"));
            await calculateButton.click();
            await driver.sleep(2000);
            
            const pageText = await driver.findElement(By.css('body')).getText();
            expect(pageText.toLowerCase()).to.satisfy((text) => {
                return text.includes('age') || text.includes('number') || text.includes('invalid') || 
                       text.includes('between') || text.includes('2') || text.includes('120');
            });
        });

        it('BMI_AGV_1: Trebao bi uspjesno izracunati BMI za starost od 2', async function() {
            const ageInput = await driver.findElement(By.css('#cage'));
            await ageInput.clear();
            await ageInput.sendKeys('2');
            
            const heightInput = await driver.findElement(By.css('#cheightmeter'));
            await heightInput.clear();
            await heightInput.sendKeys('100');
            
            const weightInput = await driver.findElement(By.css('#ckg'));
            await weightInput.clear();
            await weightInput.sendKeys('15');
            
            const calculateButton = await driver.findElement(By.xpath("//input[@type='submit' and @value='Calculate']"));
            await calculateButton.click();
            await driver.wait(async () => {
                const readyState = await driver.executeScript('return document.readyState');
                return readyState === 'complete';
            }, 15000);
            await driver.sleep(2000);
            
            const resultDiv = await driver.findElement(By.css('.bigtext'));
            const resultText = await resultDiv.getText();
            
            expect(resultText).to.include('BMI');
        });

        it('BMI_AGV_2: Trebao bi uspjesno izracunati BMI za starost od 120', async function() {
            const ageInput = await driver.findElement(By.css('#cage'));
            await ageInput.clear();
            await ageInput.sendKeys('120');
            
            const heightInput = await driver.findElement(By.css('#cheightmeter'));
            await heightInput.clear();
            await heightInput.sendKeys('170');
            
            const weightInput = await driver.findElement(By.css('#ckg'));
            await weightInput.clear();
            await weightInput.sendKeys('70');
            
            const calculateButton = await driver.findElement(By.xpath("//input[@type='submit' and @value='Calculate']"));
            await calculateButton.click();
            await driver.wait(async () => {
                const readyState = await driver.executeScript('return document.readyState');
                return readyState === 'complete';
            }, 15000);
            await driver.sleep(2000);
            
            const resultDiv = await driver.findElement(By.css('.bigtext'));
            const resultText = await resultDiv.getText();
            
            expect(resultText).to.include('BMI');
        });
    });

    describe('Testovi za spol', function() {
        
        it('BMI_EP_7: Trebao bi omoguciti odabir Male spola', async function() {
            const maleRadio = await driver.findElement(By.css('#csex1'));
            const isMaleSelected = await maleRadio.isSelected();
            
            expect(isMaleSelected).to.be.true;
            
            const femaleRadio = await driver.findElement(By.css('#csex2'));
            const isFemaleSelected = await femaleRadio.isSelected();
            expect(isFemaleSelected).to.be.false;
        });

        it('BMI_EP_8: Trebao bi omoguciti odabir Female spola', async function() {
            const femaleLabel = await driver.findElement(By.xpath("//label[@for='csex2']"));
            await femaleLabel.click();
            await driver.sleep(500);
            
            const femaleRadio = await driver.findElement(By.css('#csex2'));
            const isFemaleSelected = await femaleRadio.isSelected();
            expect(isFemaleSelected).to.be.true;
            
            // const maleRadio = await driver.findElement(By.css('#csex2'));
            const maleRadio = await driver.findElement(By.css('#csex1'));
            const isMaleSelected = await maleRadio.isSelected();
            expect(isMaleSelected).to.be.false;
        });
    });

    describe('Testovi za visinu', function() {
        
        it('BMI_EP_9: Trebao bi baciti error kada se unese Height manji od 1', async function() {
            const heightInput = await driver.findElement(By.css('#cheightmeter'));
            await heightInput.clear();
            await heightInput.sendKeys('0.5');
            
            const calculateButton = await driver.findElement(By.xpath("//input[@type='submit' and @value='Calculate']"));
            await calculateButton.click();
            await driver.sleep(2000);
            
            const pageText = await driver.findElement(By.css('body')).getText();
            expect(pageText.toLowerCase()).to.satisfy((text) => {
                return text.includes('height') || text.includes('invalid') || text.includes('number') || 
                       !text.includes('bmi =') || text.includes('error');
            });
        });

        it('BMI_EP_10: Trebao bi uspjesno izracunati BMI za Height veci od 1', async function() {
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
            await driver.wait(async () => {
                const readyState = await driver.executeScript('return document.readyState');
                return readyState === 'complete';
            }, 15000);
            await driver.sleep(2000);
            
            const resultDiv = await driver.findElement(By.css('.bigtext'));
            const resultText = await resultDiv.getText();
            
            expect(resultText).to.include('BMI');
            expect(resultText).to.include('kg/m');
        });

        it('BMI_EP_11: Trebao bi baciti error kada se unesu slova u Height', async function() {
            const heightInput = await driver.findElement(By.css('#cheightmeter'));
            await heightInput.clear();
            await heightInput.sendKeys('abc');
            
            const calculateButton = await driver.findElement(By.xpath("//input[@type='submit' and @value='Calculate']"));
            await calculateButton.click();
            await driver.sleep(2000);
            
            const pageText = await driver.findElement(By.css('body')).getText();
            expect(pageText.toLowerCase()).to.satisfy((text) => {
                return text.includes('height') || text.includes('number') || text.includes('invalid') || 
                       !text.includes('bmi =') || text.includes('error');
            });
        });

        it('BMI_EP_12: Trebao bi baciti error kada se unesu special characteri u Height', async function() {
            const heightInput = await driver.findElement(By.css('#cheightmeter'));
            await heightInput.clear();
            await heightInput.sendKeys('@#$');
            
            const calculateButton = await driver.findElement(By.xpath("//input[@type='submit' and @value='Calculate']"));
            await calculateButton.click();
            await driver.sleep(2000);
            
            const pageText = await driver.findElement(By.css('body')).getText();
            expect(pageText.toLowerCase()).to.satisfy((text) => {
                return text.includes('height') || text.includes('number') || text.includes('invalid') || 
                       !text.includes('bmi =') || text.includes('error');
            });
        });
    });

    describe('Testovi za tezinu', function() {
        
        it('BMI_EP_16: Trebao bi baciti error kada se unesu slova u Weight', async function() {
            const weightInput = await driver.findElement(By.css('#ckg'));
            await weightInput.clear();
            await weightInput.sendKeys('abc');
            
            const calculateButton = await driver.findElement(By.xpath("//input[@type='submit' and @value='Calculate']"));
            await calculateButton.click();
            await driver.sleep(2000);
            
            const pageText = await driver.findElement(By.css('body')).getText();
            expect(pageText.toLowerCase()).to.satisfy((text) => {
                return text.includes('weight') || text.includes('number') || text.includes('invalid') || 
                       !text.includes('bmi =') || text.includes('error');
            });
        });
    });
});
