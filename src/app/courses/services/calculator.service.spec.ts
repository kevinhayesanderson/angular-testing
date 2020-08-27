import {CalculatorService} from './calculator.service';
import {LoggerService} from './logger.service';
import {TestBed} from '@angular/core/testing';

describe('CalculatorService', () => {

  let calculatorService: CalculatorService, loggerSpy: any;

  beforeEach(() => {
    console.log('calling beforeEach');
    loggerSpy = jasmine.createSpyObj('LoggerService', ['log']);
    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        {provide: LoggerService, useValue: loggerSpy}
      ]
    });
    calculatorService = TestBed.inject(CalculatorService);
  });

  it('should add two numbers', () => {
    console.log('calling add test');
    const result = calculatorService.add(1, 8);
    expect(result).toBe(9);
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });

  it('should subtract two numbers', () => {
    console.log('calling subtract test');
    const result = calculatorService.subtract(9, 8);
    expect(result).toBe(1, 'unexpected subtraction output');
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });
});
