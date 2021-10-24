import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bullet',
})
export class BulletPipe implements PipeTransform {
  transform(items: unknown[]): number[] {
    return items.map((_, i) => i);
  }
}
