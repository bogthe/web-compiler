import { WebCompilerPage } from './app.po';

describe('web-compiler App', () => {
  let page: WebCompilerPage;

  beforeEach(() => {
    page = new WebCompilerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
