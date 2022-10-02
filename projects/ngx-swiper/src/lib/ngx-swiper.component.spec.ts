import { ChangeDetectionStrategy, SimpleChange } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgxSwiperComponent } from './ngx-swiper.component';
import { BulletPipe } from './pipes/bullet.pipe';

const DEFAULT_ITEMS = ['image1.jpg', 'image2.jpg', 'image3.jpg'];

describe('NgxSwiperComponent', () => {
  let component: NgxSwiperComponent;
  let fixture: ComponentFixture<NgxSwiperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NgxSwiperComponent, BulletPipe],
    })
      .overrideComponent(NgxSwiperComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
      .compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(NgxSwiperComponent);
    component = fixture.componentInstance;
    component.items = DEFAULT_ITEMS;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not have navigation by default', () => {
    const prevButton = fixture.debugElement.query(By.css('.swiper__navigation--prev'));
    const nextButton = fixture.debugElement.query(By.css('.swiper__navigation--next'));

    expect(prevButton).toBeNull();
    expect(nextButton).toBeNull();
  });

  it('should allow navigation', async () => {
    component.navigation = true;
    fixture.detectChanges();

    const prevButton = fixture.debugElement.query(By.css('.swiper__navigation--prev'));
    const nextButton = fixture.debugElement.query(By.css('.swiper__navigation--next'));

    expect(prevButton).not.toBeNull();
    expect(nextButton).not.toBeNull();
  });

  it('should not have pagination by default', () => {
    const pagination = fixture.debugElement.query(By.css('.swiper__pagination'));

    expect(pagination).toBeNull();
  });

  it('should allow pagination', () => {
    component.pagination = true;
    fixture.detectChanges();

    const pagination = fixture.debugElement.query(By.css('.swiper__pagination'));

    expect(pagination).not.toBeNull();
  });

  it('should be infinite by default', () => {
    component.nextSlide();
    expect(component.currentSlide).toBe(1);

    component.nextSlide();
    expect(component.currentSlide).toBe(2);

    component.nextSlide();
    expect(component.currentSlide).toBe(0);

    component.prevSlide();
    expect(component.currentSlide).toBe(2);
  });

  it('should be able to loop over slides automatically', fakeAsync(() => {
    const nextSlideSpy = spyOn(component, 'nextSlide').and.callThrough();

    component.loop = 1000;

    fixture.detectChanges();

    component.ngOnChanges({
      loop: new SimpleChange(undefined, component.loop, true),
      items: new SimpleChange([], [], false),
    });

    expect(component.currentSlide).toBe(0);
    expect(nextSlideSpy).not.toHaveBeenCalled();

    tick(component.loop);
    expect(component.currentSlide).toBe(1);
    expect(nextSlideSpy).toHaveBeenCalledTimes(1);

    tick(component.loop);
    expect(component.currentSlide).toBe(2);
    expect(nextSlideSpy).toHaveBeenCalledTimes(2);

    component['loopSubscription']?.unsubscribe();

    flush();
  }));

  it('should be possible to swipe left', () => {
    const nextSlideSpy = spyOn(component, 'nextSlide').and.callThrough();
    const deltaX = component.threshold + 1;

    component.onPanEnd({ deltaX: -1 * deltaX });

    expect(nextSlideSpy).toHaveBeenCalledTimes(1);
    expect(component.currentSlide).toBe(1);
  });

  it('should be possible to swipe right', () => {
    const prevSlideSpy = spyOn(component, 'prevSlide').and.callThrough();
    const deltaX = component.threshold + 1;

    component.onPanEnd({ deltaX });

    expect(prevSlideSpy).toHaveBeenCalledTimes(1);
    expect(component.currentSlide).toBe(component.items.length - 1);
  });

  it('should not swipe if the user swiped less than the threshold', () => {
    const nextSlideSpy = spyOn(component, 'nextSlide').and.callThrough();
    const prevSlideSpy = spyOn(component, 'prevSlide').and.callThrough();
    const deltaX = component.threshold;

    component.onPanEnd({ deltaX: -1 * deltaX });
    component.onPanEnd({ deltaX });

    expect(nextSlideSpy).not.toHaveBeenCalled();
    expect(prevSlideSpy).not.toHaveBeenCalled();
    expect(component.currentSlide).toBe(0);
  });
});
