import Confirmation from "../components/Confirmation";

function EmailVerifiedConfirmation() {
  return (
    <Confirmation
      title="Email Verified"
      message="Your account is pending admin approval. You'll be notified once it's approved and ready to use."
      buttonLabel="Go to Login"
      buttonTo="/login"
      icon="✓"
    />
  );
}

export default EmailVerifiedConfirmation;