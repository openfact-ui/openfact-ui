import { FormControl } from '@angular/forms';

export class OfValidators {

    public static minValue(minValue: number): any {
        return (control: FormControl): { [key: string]: any } => {
            const v: number = control.value;
            // tslint:disable-next-line:max-line-length
            return v < minValue ? { 'minValue': { 'requiredMinValue': minValue, 'actualValue': v } } : null;
        };
    }

    public static maxValue(maxValue: number): any {
        return (control: FormControl): { [key: string]: any } => {
            const v: number = control.value;
            // tslint:disable-next-line:max-line-length
            return v > maxValue ? { 'maxValue': { 'maxValuePermited': maxValue, 'actualValue': v } } : null;
        };
    }

    public static email(): any {
        return (control: FormControl): { [key: string]: any } => {
            const v: string = control.value;
            return v === undefined
                || v === null
                || v.trim().length <= 0
                || v.trim().indexOf('@') === -1 ? { 'valid': false } : null;
        };
    }

    public static url(): any {
        return (control: FormControl): { [key: string]: any } => {
            const v: string = control.value;
            return v === undefined
                || v === null
                || v.trim().length <= 0
                || v.trim().indexOf('@') === -1 ? { 'valid': false } : null;
        };
    }

}