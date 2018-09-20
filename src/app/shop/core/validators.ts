
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Constants } from '../constants';

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


class Validator {

  static validateEqualPasswords(password: string, confirmPassword: string): boolean {
    if (!password || password.length < Constants.minPasswordLength) {
      return false;
    }
    return password === confirmPassword;
  }

}
