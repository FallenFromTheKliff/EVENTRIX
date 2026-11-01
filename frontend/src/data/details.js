import { IconGenderBigender, IconGenderFemale, IconGenderMale } from "@tabler/icons-react";

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
].map((name, i) => ({ value: String(i + 1).padStart(2, "0"), label: name }));

export const genders = [
  { value: "Male", label: "Male", icon: IconGenderMale },
  { value: "Female", label: "Female", icon: IconGenderFemale },
  { value: "Other", label: "Other", icon: IconGenderBigender }
];

export const cities = [
  "Antipolo",
  "Bacolod",
  "Baguio",
  "Batangas City",
  "Butuan",
  "Cagayan de Oro",
  "Caloocan",
  "Cebu City",
  "Davao City",
  "Dumaguete",
  "Iloilo City",
  "Lapu-Lapu",
  "Las Piñas",
  "Legazpi",
  "Makati",
  "Malabon",
  "Mandaluyong",
  "Manila",
  "Muntinlupa",
  "Parañaque",
  "Pasay",
  "Pasig",
  "Quezon City",
  "San Fernando",
  "San Juan",
  "Taguig",
  "Zamboanga City"
].map((name) => ({ value: name, label: name }));

export const categories = ["Concert", "Festival"].map((name) => ({ value: name, label: name }));

export const traits = {
  Positive: ["Unforgettable", "Great Vibes", "Well Organized"],
  Negative: ["Overpriced", "Overcrowded", "Disorganized", "Underwhelming"]
};