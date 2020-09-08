import { CoursesService } from './courses.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { COURSES, findLessonsForCourse } from '../../../../server/db-data';
import { Course } from '../model/course';
import { HttpErrorResponse } from '@angular/common/http';

describe('CoursesService', () => {

  let coursesService: CoursesService,
    httpTestingController: HttpTestingController,
    courseId: number,
    changes: Partial<Course>;

  beforeAll(() => {

    courseId = 12;
    changes = { titles: { description: 'Testing Course' } };

  });

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CoursesService]
    });
    coursesService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);

  });

  it('should be created', () => {
    expect(coursesService).toBeTruthy();
  });

  it('should retrieve all courses', () => {

    coursesService.findAllCourses().subscribe(courses => {
      expect(courses).toBeTruthy('No courses returned');
      expect(courses.length).toBe(12, 'incorrect no of courses');
      const course = courses.find((c) => c.id === courseId);
      expect(course.titles.description).toBe('Angular Testing Course');
    });

    const req = httpTestingController.expectOne('/api/courses');
    expect(req.request.method).toEqual('GET');
    req.flush({ payload: Object.values(COURSES) });

  });

  it('should find a course by id', () => {

    coursesService.findCourseById(courseId).subscribe(course => {
      expect(course).toBeTruthy();
      expect(course.id).toBe(courseId);
    });

    const req = httpTestingController.expectOne(`/api/courses/${courseId}`);
    expect(req.request.method).toBe('GET');
    req.flush(COURSES[courseId]);

  });

  it('should save the course data', () => {

    coursesService.saveCourse(courseId, changes).subscribe(course => {
      expect(course).toBeTruthy();
      expect(course.id).toBe(12);
      expect(course.titles.description).toBeTruthy(changes.titles.description);
    });

    const req = httpTestingController.expectOne(`/api/courses/${courseId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.titles.description).toBe(changes.titles.description);
    req.flush({
      ...COURSES[courseId],
      ...changes
    });

  });

  it('should give an error if saveCourse fails', function () {

    coursesService.saveCourse(courseId, changes)
      .subscribe(() => fail('the saveCourse should have failed'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
        });

    const req = httpTestingController.expectOne(`/api/courses/${courseId}`);
    expect(req.request.method).toBe('PUT');
    req.flush('saveCourse failed',
      {
        status: 500,
        statusText: 'Internal Server Error'
      });

  });

  it('should find list of lessons', () => {

    coursesService.findLessons(courseId).subscribe(lessons => {
      expect(lessons).toBeTruthy();
      expect(lessons.length).toBe(3);
    });

    const testRequest = httpTestingController.expectOne(request => request.url === '/api/lessons');
    expect(testRequest.request.method).toBe('GET');
    expect(testRequest.request.params.get('courseId')).toBe(courseId.toString());
    expect(testRequest.request.params.get('filter')).toBe('');
    expect(testRequest.request.params.get('sortOrder')).toBe('asc');
    expect(testRequest.request.params.get('pageNumber')).toBe('0');
    expect(testRequest.request.params.get('pageSize')).toBe('3');
    testRequest.flush({ payload: findLessonsForCourse(courseId).slice(0, 3) });

  });

  afterEach(() => {
    httpTestingController.verify();
  });

});
