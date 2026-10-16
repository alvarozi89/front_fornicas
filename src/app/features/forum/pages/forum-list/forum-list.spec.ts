import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForumList } from './forum-list';

describe('ForumList', () => {
  let component: ForumList;
  let fixture: ComponentFixture<ForumList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForumList],
    }).compileComponents();

    fixture = TestBed.createComponent(ForumList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
