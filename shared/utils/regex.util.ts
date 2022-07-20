// source: https://stackoverflow.com/questions/40513352/email-validation-using-form-builder-in-angular-2-latest-version
export const emailRegex = "[A-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-z0-9](?:[A-z0-9-]*[A-z0-9])?\.)+[A-z0-9](?:[A-z0-9-]*[A-z0-9])?";
// source: https://stackoverflow.com/a/19605207
export const passwordRegex = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$";
export const postalCodeRegex = "[0-9]{4}";

export const dateFormat = 'YYYY-MM-DD';
export const visualDateFormat = 'dd DD-MM-YYYY';
export const visualDateTimeFormat = 'dd DD-MM-YYYY HH:mm';
export const mailDateFormat = 'dddd DD-MM-YYYY';
