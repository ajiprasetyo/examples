import { LoginInput, RegisterInput } from '../../../../types';
import { VALIDATION_MESSAGES } from '../../../../constants';

export const validateRegisterInput = (input: RegisterInput): Record<string, string> => {
  const errors: Record<string, string> = {};
  const { email, password, name } = input;

  // Validate email
  if (!email) {
    errors.email = VALIDATION_MESSAGES.EMAIL_REQUIRED;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = VALIDATION_MESSAGES.EMAIL_INVALID;
  }

  // Validate password
  if (!password) {
    errors.password = VALIDATION_MESSAGES.PASSWORD_REQUIRED;
  } else if (password.length < 8) {
    errors.password = VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH;
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
    errors.password = VALIDATION_MESSAGES.PASSWORD_PATTERN;
  }

  // Validate name
  if (!name) {
    errors.name = VALIDATION_MESSAGES.NAME_REQUIRED;
  } else if (name.length < 2) {
    errors.name = VALIDATION_MESSAGES.NAME_MIN_LENGTH;
  }

  return errors;
};

export const validateLoginInput = (input: LoginInput): Record<string, string> => {
  const errors: Record<string, string> = {};
  const { email, password } = input;

  // Validate email
  if (!email) {
    errors.email = VALIDATION_MESSAGES.EMAIL_REQUIRED;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = VALIDATION_MESSAGES.EMAIL_INVALID;
  }

  // Validate password
  if (!password) {
    errors.password = VALIDATION_MESSAGES.PASSWORD_REQUIRED;
  }

  return errors;
};

