import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HammerModule } from '@angular/platform-browser';
import { NgxSwiperComponent } from './ngx-swiper.component';
import { BulletPipe } from './pipes/bullet.pipe';

@NgModule({
  declarations: [NgxSwiperComponent, BulletPipe],
  imports: [CommonModule, HammerModule],
  exports: [NgxSwiperComponent],
})
export class NgxSwiperModule {}
