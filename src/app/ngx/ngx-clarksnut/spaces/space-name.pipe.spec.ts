import { async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SpaceNamePipe } from './space-name.pipe';

describe('Pipe used for Name Space', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpaceNamePipe]
    });
  });

  it('Replace first underscore with space', async(() => {
    // given
    const fixture = new SpaceNamePipe();
    // when
    const spaceNameTansformed = fixture.transform('a_test_with_space');
    // then
    expect(spaceNameTansformed).toEqual('a test with space');
  }));

  it('Do not fail with undefined/nil value', async(() => {
    // given
    const fixture = new SpaceNamePipe();
    // when
    const spaceNameTansformed = fixture.transform(undefined);
    // then
    expect(spaceNameTansformed).toEqual(undefined);
  }));
});
