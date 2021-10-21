import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { NgxSwiperComponent } from './ngx-swiper.component';

@NgModule({
  declarations: [NgxSwiperComponent],
  imports: [BrowserModule, HammerModule],
  exports: [NgxSwiperComponent],
})
export class NgxSwiperModule {}
