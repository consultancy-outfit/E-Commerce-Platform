import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup.string().required("Email is required").email("Enter a valid email"),
  password: yup.string().required("Password is required"),
});

export const signupSchema = yup.object({
  firstName: yup.string().required("First name is required").max(60),
  lastName: yup.string().required("Last name is required").max(60),
  email: yup.string().required("Email is required").email("Enter a valid email"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  agree: yup
    .boolean()
    .default(false)
    .required()
    .oneOf([true], "Please accept the Terms of Service and Privacy Policy"),
});

export type LoginValues = yup.InferType<typeof loginSchema>;
export type SignupValues = yup.InferType<typeof signupSchema>;
