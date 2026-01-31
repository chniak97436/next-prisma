/**
 * Vérifie si le rôle de l'utilisateur est 'admin'.
 * @param {string} role - Le rôle de l'utilisateur.
 * @returns {boolean} - True si le rôle est 'admin', sinon false.
 */
export function isAdmin(role) {
    return role === 'admin';
}

/**
 * Vérifie si le rôle de l'utilisateur est 'customer'.
 * @param {string} role - Le rôle de l'utilisateur.
 * @returns {boolean} - True si le rôle est 'customer', sinon false.
 */
export function isCustomer(role) {
    return role === 'customer';
}
