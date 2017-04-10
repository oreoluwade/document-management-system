/* eslint func-names: "off"*/
/* eslint no-unused-vars: "off"*/
const config = require('../../../nightwatch.conf.js');

module.exports = {
  'Document Management System': function (browser) {
    browser
      .url('http://localhost:7070/login')
      .waitForElementVisible('body')
      .assert.title('DOCUMENT MANAGEMENT SYSTEM')
      .saveScreenshot('document-management-login.png')
      .end();
  },

  'Login Users': function (browser) {
    browser
      .url('http://localhost:7070/login')
      .waitForElementVisible('body')
      .setValue('input[type=text]', 'admin')
      .setValue('input[type=password]', 'adminkey')
      .click('button[type="submit"]')
      .waitForElementVisible('h5')
      .assert.urlEquals('http://localhost:7070/dashboard')
      .end();
  },

  'Admin Dashboard Page': function (browser) {
    browser
      .url('http://localhost:7070/dashboard')
      .waitForElementVisible('input[type=text]')
      .setValue('input[type=text]', 'admin@admin.com')
      .setValue('input[type=password]', 'adminkey')
      .click('button[type="submit"]')
      .waitForElementVisible('nav', 5000)
      .assert.urlEquals('http://localhost:7070/login')
      .assert.containsText('nav', 'Home')
      .assert.containsText('nav', 'Saved Documents')
      .assert.containsText('nav', 'Manage Users')
      .assert.containsText('nav', 'Manage Roles')
      .assert.containsText('nav', 'Logout')
      .end();
  },

  'Regular Users Dashboard Page': function (browser) {
    browser
      .url('http://localhost:7070/dashboard')
      .waitForElementVisible('body')
      .setValue('input[type=text]', 'eseohe@gmail.com')
      .setValue('input[type=password]', 'thequeeness')
      .click('button[type="submit"]')
      .waitForElementVisible('nav', 5000)
      .assert.urlEquals('http://localhost:7070/login')
      .assert.containsText('nav', 'Home')
      .assert.containsText('nav', 'Saved Documents')
      .assert.containsText('nav', 'Logout')
      .assert.elementNotPresent('#admin')
      .assert.cssClassNotPresent('nav', 'admin')
      .end();
  }
};
