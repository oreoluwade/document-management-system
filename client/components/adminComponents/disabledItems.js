const disabledRoles = ['admin', 'regular'];
export const disabledUsers = ['admin'];
export const disabledDocuments = ['regular', 'children', 'rated'];

export function addDisabledClass(str, roles = disabledRoles) {
  return (roles.indexOf(str) >= 0) ? 'disabled' : '';
}
