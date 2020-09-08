import { CoursesCardListComponent } from './courses-card-list.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoursesModule } from '../courses.module';
import { setupCourses } from '../common/setup-test-data';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('CoursesCardListComponent', () => {

  let component: CoursesCardListComponent;
  let fixture: ComponentFixture<CoursesCardListComponent>;
  let el: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CoursesModule]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CoursesCardListComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
      });
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the course list', () => {
    component.courses = setupCourses();
    fixture.detectChanges();
    const courses = el.queryAll(By.css('.course-card'));
    expect(courses).toBeTruthy(`Couldn't find cards`);
    expect(courses.length).toBe(12, 'Unexpected number of courses');
  });

  it('should display the first course', () => {
    component.courses = setupCourses();
    fixture.detectChanges();
    const firstCourse = component.courses[0];
    const courseCard = el.query(By.css('.course-card:first-child')),
      title = el.query(By.css('mat-card-title')),
      image = el.query(By.css('img'));
    expect(courseCard).toBeTruthy('could not find course card');
    expect(title.nativeElement.textContent).toBe(firstCourse.titles.description);
    expect(image.nativeElement.src).toBe(firstCourse.iconUrl);
  });

});


