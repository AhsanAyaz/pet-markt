import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutFailureComponent } from './checkout-failure.component';

describe('CheckoutFailureComponent', () => {
  let component: CheckoutFailureComponent;
  let fixture: ComponentFixture<CheckoutFailureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutFailureComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutFailureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
