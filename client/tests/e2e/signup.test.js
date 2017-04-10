/* eslint func-names: "off"*/
/* eslint no-unused-vars: "off"*/
// import faker from 'faker';

const config = require('../../../nightwatch.conf.js');

module.exports = {
  '@disabled': true,
  'Signup Page': function (browser) {
    browser
      .url('http://localhost:7070/signup')
      .waitForElementVisible('body')
      .saveScreenshot('doc-man-signup.png')
      .end();
  },

  'Signup New User': function (browser) {
    browser
      .url('http://localhost:7070/signup')
      .waitForElementVisible('body')
      .setValue('input[type=text]', 'lagbaja')
      .setValue('input[type=text]', 'tamedo')
      .setValue('input[type=text]', 'lagbaja')
      .setValue('input[type=email]', 'lagbaja@tamedo.com')
      .setValue('input[type=password]', 'lagbaja')
      .setValue('input[type=password]', 'lagbaja')
      .click('button[type="submit"]')
      .waitForElementVisible('h4')
      .assert.urlEquals('http://localhost:7070/')
      .assert.containsText('h4', 'DASHBOARD')
      .assert.containsText('nav', 'Saved Documents')
      .assert.containsText('nav', 'Logout')
      .assert.elementNotPresent('#adminTab')
      .assert.cssClassNotPresent('nav', 'admin')
      .end();
  }
};
