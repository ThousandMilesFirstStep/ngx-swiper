import { isPlatformServer } from '@angular/common';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  QueryList,
  SimpleChanges,
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
export class NgxSwiperComponent implements OnChanges, OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  @Input() items!: unknown[];

  @Input() navigation = false;
  @Input() pagination = false;
  @Input() infinite = true;
  @Input() loop?: number;

  @Input() slideTemplate?: TemplateRef<any>;
  @Input() navigationButtonTemplate?: TemplateRef<any>;
  @Input() paginationTemplate?: TemplateRef<any>;

  @Input() transitionDuration = 400;
  @Input() threshold = 30;

  @ViewChild('swiper') swiperRef!: ElementRef<HTMLDivElement>;
  @ViewChild('swiperContainer') swiperContainerRef!: ElementRef<HTMLDivElement>;
  @ViewChildren('swiperSlide') swiperSlidesRef!: QueryList<ElementRef<HTMLDivElement>>;

  currentSlide = 0;

  private slideWidth!: number;

  private itemsChanged = false;

  private loopSubscription?: Subscription;
  private resizeObserver?: ResizeObserver;

  constructor(@Inject(PLATFORM_ID) private platformId: string) {}

  ngOnChanges(changes: SimpleChanges): void {
    const previousItems = changes.items.previousValue;
    const currentItems = changes.items.currentValue;

    if (currentItems.length !== previousItems?.length && this.swiperRef) {
      this.itemsChanged = true;
    }
  }

  ngOnInit(): void {
    if (this.loop) {
      this.loopSubscription = timer(0, this.loop).subscribe(() => {
        this.nextSlide();
      });
    }
  }

  ngAfterViewInit(): void {
    this.setSwiperElementsWidth();
    this.watchResize();
  }

  ngAfterViewChecked(): void {
    if (this.itemsChanged) {
      this.setSwiperElementsWidth();

      this.itemsChanged = false;
    }
  }

  ngOnDestroy(): void {
    if (this.loopSubscription) {
      this.loopSubscription.unsubscribe();
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  /**
   * Navigate to the next slide
   */
  nextSlide(): void {
    if (this.currentSlide === this.items.length - 1) {
      this.nextSlideOnLastElement();

      return;
    }

    this.currentSlide++;

    this.translateContainer(this.getCurrentTranslation());
  }

  /**
   * Navigate to the previous slide
   */
  prevSlide(): void {
    if (this.currentSlide === 0) {
      this.prevSlideOnFirstElement();

      return;
    }

    this.currentSlide--;

    this.translateContainer(this.getCurrentTranslation());
  }

  /**
   * Event handler when a user stop swiping
   */
  onPanEnd(event: any): void {
    if (event.deltaX < -1 * this.threshold) {
      this.nextSlide();
    } else if (event.deltaX > this.threshold) {
      this.prevSlide();
    } else {
      this.translateContainer(this.getCurrentTranslation());
    }
  }

  /**
   * Event handler on a user left swipe
   */
  onPanLeft(event: any): void {
    const originalPosition = this.getCurrentTranslation();

    this.setContainerTranslation(originalPosition + event.deltaX);
  }

  /**
   * Event handler on a user right swipe
   */
  onPanRight(event: any): void {
    const originalPosition = this.getCurrentTranslation();

    this.setContainerTranslation(originalPosition + event.deltaX);
  }

  /**
   * Set the widths of the different slides and the container translation
   */
  private setSwiperElementsWidth(): void {
    this.slideWidth = this.swiperRef.nativeElement.clientWidth;

    // Set the width of the slides
    this.swiperSlidesRef.forEach((slide) => {
      slide.nativeElement.style.width = this.slideWidth + 'px';
    });

    this.setContainerTranslation(this.getCurrentTranslation());
  }

  /**
   * Watch for the resize of the Swiper to recompute the different
   * things needed at the initialization of the swiper
   */
  private watchResize(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.resizeObserver = new ResizeObserver(() => {
      this.setSwiperElementsWidth();
    });

    this.resizeObserver.observe(this.swiperRef.nativeElement);
  }

  /**
   * Return the value of the translation for the current slide
   */
  private getCurrentTranslation(): number {
    return -1 * this.slideWidth * (this.currentSlide + 1);
  }

  /**
   * Handle the transition to the next element when
   * the current slide is already the last one
   */
  private nextSlideOnLastElement(): void {
    if (!this.infinite) {
      return;
    }

    this.translateContainer(-1 * this.slideWidth * (this.items.length + 1));

    this.currentSlide = 0;

    setTimeout(() => {
      this.setContainerTranslation(this.getCurrentTranslation());
    }, this.transitionDuration);
  }

  /**
   * Handle the transition to the previous element when
   * the current slide is already the first one
   */
  private prevSlideOnFirstElement(): void {
    if (!this.infinite) {
      return;
    }

    this.translateContainer(0);

    this.currentSlide = this.items.length - 1;

    setTimeout(() => {
      this.setContainerTranslation(this.getCurrentTranslation());
    }, this.transitionDuration);
  }

  /**
   * Set the translation of the container with an animation whose
   * duration is specified by the property `transitionDuration`
   */
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

  /**
   * Set the translation of the container to the value passed in parameter
   */
  private setContainerTranslation(translation: number): void {
    this.swiperContainerRef.nativeElement.style.transform = `translate3d(${translation}px, 0, 0)`;
  }
}
