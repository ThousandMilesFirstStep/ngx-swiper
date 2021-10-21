import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'ngx-swiper',
  templateUrl: './ngx-swiper.component.html',
  styleUrls: ['./ngx-swiper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxSwiperComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() images!: string[];

  @Input() navigation = false;
  @Input() pagination = false;
  @Input() infinite = true;
  @Input() loop?: number;

  @Input() navigationButtonTemplate?: TemplateRef<any>;
  @Input() paginationTemplate?: TemplateRef<any>;

  @Input() transitionDuration = 400;
  @Input() threshold = 30;

  @ViewChild('swiper') swiperRef!: ElementRef<HTMLDivElement>;
  @ViewChild('swiperContainer') swiperContainerRef!: ElementRef<HTMLDivElement>;
  @ViewChildren('swiperSlide') swiperSlidesRef!: QueryList<
    ElementRef<HTMLDivElement>
  >;

  private slideWidth!: number;
  private currentSlide = 0;

  private loopSubscription?: Subscription;

  constructor() {}

  ngOnInit(): void {
    if (this.loop) {
      this.loopSubscription = timer(0, this.loop).subscribe(() => {
        this.nextSlide();
      });
    }
  }

  ngAfterViewInit(): void {
    this.slideWidth = this.swiperRef.nativeElement.clientWidth;

    // Set the width of the slides
    this.swiperSlidesRef.forEach((slide) => {
      slide.nativeElement.style.width = this.slideWidth + 'px';
    });

    this.setContainerTranslation(-1 * this.slideWidth);
  }

  ngOnDestroy(): void {
    if (this.loopSubscription) {
      this.loopSubscription.unsubscribe();
    }
  }

  nextSlide(): void {
    if (this.currentSlide === this.images.length) {
      this.nextSlideOnLastElement();

      return;
    }

    this.currentSlide++;

    this.translateContainer(this.getCurrentTranslation());
  }

  prevSlide(): void {
    if (this.currentSlide === -1) {
      this.prevSlideOnFirstElement();

      return;
    }

    this.currentSlide--;

    this.translateContainer(this.getCurrentTranslation());
  }

  onPanEnd(event: any): void {
    if (event.deltaX < -1 * this.threshold) {
      this.nextSlide();
    } else if (event.deltaX > this.threshold) {
      this.prevSlide();
    } else {
      this.translateContainer(this.getCurrentTranslation());
    }
  }

  onPanLeft(event: any): void {
    const originalPosition = this.getCurrentTranslation();

    this.setContainerTranslation(originalPosition + event.deltaX);
  }

  onPanRight(event: any): void {
    const originalPosition = this.getCurrentTranslation();

    this.setContainerTranslation(originalPosition + event.deltaX);
  }

  private getCurrentTranslation(): number {
    return -1 * this.slideWidth * (this.currentSlide + 1);
  }

  private nextSlideOnLastElement(): void {
    if (!this.infinite) {
      return;
    }

    this.currentSlide = 1;

    this.setContainerTranslation(-1 * this.slideWidth);

    setTimeout(() => {
      this.translateContainer(this.getCurrentTranslation());
    }, 0);
  }

  private prevSlideOnFirstElement(): void {
    if (!this.infinite) {
      return;
    }

    this.currentSlide = this.images.length - 2;

    this.setContainerTranslation(-1 * this.slideWidth * this.images.length);

    setTimeout(() => {
      this.translateContainer(this.getCurrentTranslation());
    }, 0);
  }

  private translateContainer(translation: number): void {
    const style = this.swiperContainerRef.nativeElement.style;

    style.transitionProperty = 'transform';
    style.transitionDuration = `${this.transitionDuration}ms`;

    this.setContainerTranslation(translation);

    setTimeout(() => {
      style.transitionProperty = '';
      style.transitionDuration = '';
    }, this.transitionDuration);
  }

  private setContainerTranslation(translation: number): void {
    this.swiperContainerRef.nativeElement.style.transform = `translate3d(${translation}px, 0, 0)`;
  }
}
