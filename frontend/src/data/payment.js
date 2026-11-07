import PaymentGCash from "../assets/images/Payment-GCash.png";
import PaymentPayPal from "../assets/images/Payment-PayPal.png";

export const paymentMethods = [
  { label: "GCASH", image: PaymentGCash, field: "Mobile No.:", placeholder: "Must be 11 digits", pattern: /^[0-9]{11}$/, maxLength: 11 },
  { label: "PAYPAL", image: PaymentPayPal, field: "Email:", placeholder: "Enter your PayPal email", pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
];