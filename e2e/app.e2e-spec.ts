import { OpenfactSyncWebConsolePage } from './app.po';

describe('openfactsync-ui App', () => {
  let page: OpenfactSyncWebConsolePage;

  beforeEach(() => {
    page = new OpenfactSyncWebConsolePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to ofs!!');
  });
});
