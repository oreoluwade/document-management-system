/* eslint func-names: "off"*/
/* eslint no-unused-vars: "off"*/
// import faker from 'faker';

const config = require('../../../nightwatch.conf.js');

module.exports = {
  '@disabled': true,
  'Saved Documents Page': function (browser) {
    browser
      .url('http://localhost:7070/')
      .waitForElementVisible('body')
      .setValue('input[type=text]', 'eseohe@gmail.com')
      .setValue('input[type=password]', 'thequeeness')
      .click('button[type="submit"]')
      .waitForElementVisible('nav', 10000)
      .assert.urlEquals('http://localhost:7070/')
      .assert.containsText('nav', 'home')
      .waitForElementVisible('li[id="personalDocs"]', 10000)
      .click('li[id="personalDocs"]')
      .moveToElement('li[id="personalDocs"]', 0, 0)
      .mouseButtonClick(0)
      .waitForElementVisible('div[id="card-alert"]', 5000)
      .assert.urlEquals('http://localhost:7070/document')
      .assert.containsText('h4', 'Saved Documents')
      .assert.containsText('div[id="card-alert"]',
      'INFO : You have 0 Saved Documents')
      .assert.elementPresent('div[id="editButton"]')
      .moveToElement('div[id="editButton"]', 0, 0)
      .mouseButtonClick(0)
      .waitForElementVisible('input[id=title]', 5000)
      .waitForElementVisible('input[id=title]', 10000)
      .waitForElementVisible('select[id="mySelectBox"]')
      .setValue('input[id=title]', 'Surgical Precision')
      .setValue('div.fr-element', 'Masterful Dodgery')
      .setValue('select[id="mySelectBox"]', 'public')
      .click('input[type="submit"]')
      .waitForElementVisible('div[id="card-alert"]', 5000)
      .waitForElementVisible('div[id="card-alert"]', 10000)
      .assert.containsText('div[id="card-alert"]',
      'Masterful Dodgery')
      .end();
  }
};
