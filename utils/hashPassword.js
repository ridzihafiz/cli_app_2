import bcrypt from "bcryptjs";

/**
 *
 * @param {string} password
 * @returns
 */
export function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  const saltPassword = bcrypt.hashSync(password, salt);
  return saltPassword;
}

// compare password
/**
 * compare password
 * @param {string} inputPassword
 * @param {string} dbPassword
 * @returns {boolean}
 */
export function comparePassword(inputPassword, dbPassword) {
  return bcrypt.compareSync(inputPassword, dbPassword);
}
