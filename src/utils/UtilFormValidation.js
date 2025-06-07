export class UtilFormValidation {
  static isEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = regex.test(email);
    return {
      isValid,
      error: isValid ? '' : 'El correo no tiene un formato válido',
    };
  }

  static isStrongPassword(password) {
    const validations = {
      hasUppercase: {
        isValid: /[A-Z]/.test(password),
        error: 'La contraseña debe contener al menos una letra mayúscula',
      },
      hasLowercase: {
        isValid: /[a-z]/.test(password),
        error: 'La contraseña debe contener al menos una letra minúscula',
      },
      hasMinLength: {
        isValid: password.length >= 6,
        error: 'La contraseña debe tener al menos 6 caracteres',
      },
    };
    for (const key in validations) {
      if (!validations[key].isValid) {
        return {
          isValid: false,
          error: validations[key].error,
        };
      }
    }
    return {
      isValid: true,
      error: '',
    };
  }

  static passwordsMatch(p1, p2) {
    const isValid = p1 === p2;
    return {
      isValid,
      error: isValid ? '' : 'Las contraseñas no coinciden',
    };
  }

  static isValidBirthdate(dateStr) {
    const birthdate = new Date(dateStr);
    const today = new Date();
    const isValid =
      !isNaN(birthdate) &&
      birthdate < today &&
      today.getFullYear() - birthdate.getFullYear() >= 18;

    return {
      isValid,
      error: isValid ? '' : 'La fecha es invalida o no tienes más de 18 años',
    };
  }

  static isValidPhone(phone) {
    const regex = /^[0-9]{11}$/;
    const isValid = regex.test(phone);
    return {
      isValid,
      error: isValid
        ? ''
        : 'El teléfono debe tener 11 dígitos numéricos, el código de país y el numero sin espacios. Ex.: 50433960188',
    };
  }
}
