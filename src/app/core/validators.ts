import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

export function quantityValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const min = 1;
      const max = 9;
      const invalid = control.value < min || control.value > max;
      return invalid ? {'invalidQuantity': {value: control.value}} : null;
    };
  }

  export const paxTotalCountValidator: ValidatorFn = (fg: FormGroup) => {
    const adults = fg.get('adultCount').value;
    const children = fg.get('childCount').value;
    const paxCount = (adults !== null ? adults : 0) + (children !== null ? children : 0);
    return paxCount >= 10 ? null : { invalidTotalPaxCount: true };
  };
