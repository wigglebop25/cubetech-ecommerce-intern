export function validateRequired(value, fieldName) {
  if (!value || value.toString().trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
}

export function validateEmail(email) {
  if (!email || email.trim() === '') return 'Email is required';
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(email)) return 'Invalid email format';
  return null;
}

export function validatePhone(phone) {
  if (!phone || phone.trim() === '') return 'Phone number is required';
  const pattern = /^[0-9]{10,11}$/;
  if (!pattern.test(phone.replace(/\s/g, ''))) return 'Invalid phone number';
  return null;
}
