import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeFirst',
  standalone: true
})
export class CapitalizeFirstPipe implements PipeTransform {

  transform(value: String): String {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

}
