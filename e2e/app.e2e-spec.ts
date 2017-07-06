import { OpenfactSyncWebConsolePage } from './app.po';

describe('openfact-sync-web-console App', () => {
  let page: OpenfactSyncWebConsolePage;

  beforeEach(() => {
    page = new OpenfactSyncWebConsolePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to ofs!!');
  });
});
