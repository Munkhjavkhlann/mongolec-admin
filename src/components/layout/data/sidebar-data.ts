import {
  LayoutDashboard,
  ListTodo,
  Package,
  Users,
  MessagesSquare,
  Newspaper,
  ShoppingBag,
  Settings,
  UserCog,
  Wrench,
  Palette,
  Bell,
  Monitor,
  HelpCircle,
  ShieldCheck,
  Command,
  GalleryVerticalEnd,
  AudioWaveform,
} from "lucide-react";
import { type SidebarData } from "../types";

export const sidebarData: SidebarData = {
  user: {
    name: "Admin User",
    email: "admin@mongolec.com",
    avatar: "/avatars/user.jpg",
  },
  teams: [
    {
      name: "Mongolec CMS",
      logo: Command,
      plan: "Admin Dashboard",
    },
    {
      name: "Content Management",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "News Portal",
      logo: AudioWaveform,
      plan: "Publishing",
    },
  ],
  navGroups: [
    {
      title: "Main",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: LayoutDashboard,
        },
        {
          title: "News",
          url: "/news",
          icon: Newspaper,
        },
        {
          title: "Merchandise",
          url: "/merch",
          icon: ShoppingBag,
        },
        {
          title: "Users",
          url: "/users",
          icon: Users,
        },
        {
          title: "Tasks",
          url: "/tasks",
          icon: ListTodo,
        },
        {
          title: "Apps",
          url: "/apps",
          icon: Package,
        },
        {
          title: "Chats",
          url: "/chats",
          badge: "3",
          icon: MessagesSquare,
        },
      ],
    },
    {
      title: "Administration",
      items: [
        {
          title: "Settings",
          icon: Settings,
          items: [
            {
              title: "Profile",
              url: "/settings",
              icon: UserCog,
            },
            {
              title: "Account",
              url: "/settings/account",
              icon: Wrench,
            },
            {
              title: "Appearance",
              url: "/settings/appearance",
              icon: Palette,
            },
            {
              title: "Notifications",
              url: "/settings/notifications",
              icon: Bell,
            },
            {
              title: "Display",
              url: "/settings/display",
              icon: Monitor,
            },
          ],
        },
        {
          title: "Authentication",
          icon: ShieldCheck,
          items: [
            {
              title: "Sign In",
              url: "/sign-in",
            },
            {
              title: "Sign Up",
              url: "/sign-up",
            },
          ],
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          title: "Help Center",
          url: "/help-center",
          icon: HelpCircle,
        },
      ],
    },
  ],
};
