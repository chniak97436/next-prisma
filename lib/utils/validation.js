export function validatePassword(password) {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isValidLength = password.length >= 8;
    return hasUppercase && hasLowercase && hasNumber && hasSpecialChar && isValidLength;
}

export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(email);
    return isValidEmail;
}

export function validatePhone(phone) {
    const phoneRegex = /^(?:\+33|0)[67]\d{8}$/;
    const validPhone = phoneRegex.test(phone)
    return validPhone
}
export function validateFrenchAddress(address) {
    const addressRegex = /^(\d+(bis|ter)?\s+)?[^0-9\r\n]*(?<!\s)\s+(\d{5})(?!\d)$/;
    const validAdress = addressRegex.test(address.trim());
    return validAdress
}
