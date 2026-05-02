/**
 * @desc    Validate password strength (NFR: 8+ chars, upper, lower, number, special)
 */
exports.isPasswordStrong = (password) => {
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongRegex.test(password);
};
