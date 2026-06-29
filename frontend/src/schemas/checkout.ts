import * as yup from "yup";

export const checkoutSchema = yup.object({
  email: yup.string().required("Email is required").email("Enter a valid email"),
  firstName: yup.string().required("First name is required").max(60),
  lastName: yup.string().required("Last name is required").max(60),
  line1: yup.string().required("Address is required").max(200),
  city: yup.string().required("City is required").max(100),
  postcode: yup.string().required("Postcode is required").max(20),
});

export type CheckoutValues = yup.InferType<typeof checkoutSchema>;
