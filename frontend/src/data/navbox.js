import { IconCalendarEvent, IconCalendarPlus, IconHelpCircle, IconHome, IconLayoutDashboard, IconReceipt, IconSettings, IconTicket, IconUser, IconMessageStar, IconMessage } from "@tabler/icons-react";

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
        { to: "/reviews", label: "My Reviews", icon: IconMessageStar },
        { to: "/support", label: "Support", icon: IconHelpCircle }
      ]
    },
    {
      category: "Events",
      links: [
        { to: "/events", label: "View Events", icon: IconCalendarEvent },
        { to: "/bookings", label: "My Bookings", icon: IconTicket }
      ]
    }
  ],
  ADMIN: [
    {
      category: "Main",
      links: [
        { to: "/dashboard", label: "Dashboard", icon: IconLayoutDashboard },
        { to: "/feedback", label: "Feedback", icon: IconMessage },
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