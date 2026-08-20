export default function validateOtp(values) {
  const errors = {};

  if (!values.otp) {
    errors.otp = "Enter the 6-digit code.";
  } else if (!/^\d{6}$/.test(values.otp)) {
    errors.otp = "Code must be exactly 6 digits.";
  }

  return errors;
}