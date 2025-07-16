import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'horarioFormat'
})
export class HorarioFormatPipe implements PipeTransform {
    transform(value: string): string {
        return value?.slice(0, 5); // "08:30:00" -> "08:30"
    }
}
