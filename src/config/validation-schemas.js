import { object, string, mixed, ref, array, bool, number, boolean } from "yup";
// import {
//   emailRegexp,
//   digitRegexp,
//   lowercaseRegexp,
//   uppercaseRegexp,
//   symbolRegexp,
// } from "@/config/regexp.js";

export const emailRegexp =
  /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export const loginForm = object({
  email: string()
    .required("This field is required")
    .matches(emailRegexp, "Please enter a valid email: e.g. email@domain.com"),
  password: string().required("This field is required"),
});

export const signUpForm = object({
  first_name: string().required("This field is required"),
  last_name: string().required("This field is required"),
  email: string()
    .required("This field is required")
    .matches(emailRegexp, "Please enter a valid email: e.g. email@domain.com"),
  password: string().required("This field is required").min(8, "Password must have minimum 8 characters"),
  password_confirmation: string()
    .required("This field is required")
    .oneOf([ref("password")], "The passwords do not match"),
  // role ???
});

export const resetPasswordForm = object({
  email: string()
    .required("This field is required")
    .matches(emailRegexp, "Please enter a valid email: e.g. email@domain.com"),
})

export const updatePasswordForm = object({
  password: string().required("This field is required").min(8, "Password must have minimum 8 characters"),
  password_confirmation: string()
    .required("This field is required")
    .oneOf([ref("password")], "The passwords do not match"),
})

export const profileForm = object({
  first_name: string().required("This field is required"),
  last_name: string().required("This field is required"),
})

export const profilePasswordForm = object({
  current_password: string().required("This field is required"),
  password: string().required("This field is required").min(8, "Password must have minimum 8 characters"),
  password_confirmation: string()
    .required("This field is required")
    .oneOf([ref("password")], "The passwords do not match"),
})