import validator from "validator";

export const validate = (value: string) => {
  if (!validator.isEmail(value)) {
    throw new Error('Invalid Email Format');
  }
}