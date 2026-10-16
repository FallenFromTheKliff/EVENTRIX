const now = new Date();

export const months = Array.from({ length: 6 }, (_, i) => {
  const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
  return { value: `${date.getFullYear()}-${date.getMonth() + 1}`, label: date.toLocaleString("en-US", { month: "long", year: "numeric" }) };
})