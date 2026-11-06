import { IconCalendarEvent, IconCalendarPlus, IconHelpCircle, IconHome, IconLayoutDashboard, IconReceipt, IconSettings, IconTicket, IconUser, IconMessageStar } from "@tabler/icons-react";

export const sectionsss = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "support", label: "Support" },
  { id: "questions", label: "FAQs" }
]

export const rolesss = {
  USER: [
    {
      category: "Main",
      links: [
        { to: "/home", label: "Home", icon: IconHome },
        { to: "/events", label: "Events", icon: IconCalendarEvent },
        { to: "/support", label: "Support", icon: IconHelpCircle }
      ]
    },
    {
      category: "Events",
      links: [
        { to: "/bookings", label: "My Bookings", icon: IconTicket },
        { to: "/reviews", label: "My Reviews", icon: IconMessageStar }
      ]
    }
  ],
  ADMIN: [
    {
      category: "Main",
      links: [
        { to: "/dashboard", label: "Dashboard", icon: IconLayoutDashboard },
        { to: "/reception", label: "Reception", icon: IconMessageStar },
        { to: "/transactions", label: "Transactions", icon: IconReceipt }
      ]
    },
    {
      category: "Events",
      links: [
        { to: "/add-event", label: "Add Event", icon: IconCalendarPlus },
        { to: "/events", label: "Manage Events", icon: IconCalendarEvent }
      ]
    }
  ]
}

export const menusss = [
  { to: "/profile", label: "Profile", icon: IconUser },
  { to: "/settings", label: "Settings", icon: IconSettings }
]