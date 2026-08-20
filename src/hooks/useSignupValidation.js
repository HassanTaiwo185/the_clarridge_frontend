export default function validateSignup(values) {
  const errors = {};

  if (!values.first_name?.trim()) {
    errors.first_name = "First name is required.";
  }

  if (!values.last_name?.trim()) {
    errors.last_name = "Last name is required.";
  }

  if (!values.email?.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  if (!values.confirm_password) {
    errors.confirm_password = "Please confirm your password.";
  } else if (values.password !== values.confirm_password) {
    errors.confirm_password = "Passwords do not match.";
  }

  if (!values.phone_number?.trim()) {
    errors.phone_number = "Phone number is required.";
  } else if (!/^\+?[0-9]{7,15}$/.test(values.phone_number)) {
    errors.phone_number = "Enter a valid phone number.";
  }

  if (!values.date_of_birth) {
    errors.date_of_birth = "Date of birth is required.";
  }

  return errors;
}