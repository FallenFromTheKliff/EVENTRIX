export const sectionsss = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "support", label: "Support" },
  { id: "questions", label: "FAQs" }
]

export const rolesss = {
  USER: [
    { to: "/events", label: "View Events" },
    { to: "/bookings", label: "My Bookings" },
    { to: "/cart", label: "Cart" },
    { to: "/support", label: "Support FAQs" }
  ],
  ADMIN: [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/events", label: "Manage Events" },
    { to: "/transactions", label: "Transaction Logs" }
  ]
}