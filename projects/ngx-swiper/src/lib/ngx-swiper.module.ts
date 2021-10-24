import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { NgxSwiperComponent } from './ngx-swiper.component';
import { BulletPipe } from './pipes/bullet.pipe';

@NgModule({
  declarations: [NgxSwiperComponent, BulletPipe],
  imports: [BrowserModule, HammerModule],
  exports: [NgxSwiperComponent],
})
export class NgxSwiperModule {}
