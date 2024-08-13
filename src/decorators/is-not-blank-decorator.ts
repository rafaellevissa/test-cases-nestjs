import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsNotBlankConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return String(value).trim().length > 0;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Field $property should not be empty or contain only spaces';
  }
}

export function IsNotBlank(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNotBlankConstraint,
    });
  };
}
