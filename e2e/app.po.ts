import { browser, by, element } from 'protractor';

export class OpenfactSyncWebConsolePage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('ofs-root h1')).getText();
  }
}
