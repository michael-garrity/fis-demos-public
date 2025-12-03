"use client";

import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  User,
} from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import NavigationLink from "@/app/_components/NavigationLink";
import { useState } from "react";

interface MobileMenuItem {
  label: string;
  href: string;
  color?:
    | "danger"
    | "primary"
    | "foreground"
    | "secondary"
    | "success"
    | "warning";
}

export default function NavigationPanel() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  function closeMenu() {
    setIsMenuOpen(false);
  }

  const menuItems: Array<MobileMenuItem> = [
    { label: "Dashboard", href: "/" },
    { label: "Manage Personas", href: "/personas" },
  ];

  const mobileMenuItems: Array<MobileMenuItem> = [
    ...menuItems,
    { label: "Settings", href: "/profile" },
    { label: "Logout", href: "#", color: "danger" },
  ];

  return (
    <Navbar isBordered className="bg-background" isMenuOpen={isMenuOpen}>
      <NavbarMenuToggle
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className="sm:hidden cursor-pointer"
        onChange={(isOpen) => setIsMenuOpen(isOpen)}
      />
      <NavbarBrand>
        <h1 className="text-3xl">Flatiron School</h1>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4">
        {menuItems.map(({ label, href }, index) => (
          <NavigationLink key={`${label}-${index}`} title={label} href={href} />
        ))}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <User
            data-testid="user-profile"
            isFocusable
            avatarProps={{
              src: "https://avatars.githubusercontent.com/u/30373425?v=4",
            }}
            name="Kylon Tyner"
            className="cursor-pointer p-2 hover:bg-gray-200 transition-background"
            onClick={() => router.push("/profile")}
          />
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu>
        {mobileMenuItems.map(({ label, href, color }, index) => (
          <NavbarMenuItem
            key={`${label}-${index}`}
            isActive={pathname === href}
          >
            <Link
              data-testid={`mobile-navigation-link-${label
                .split(" ")
                .join("-")
                .toLowerCase()}`}
              className="w-full"
              color={color ?? (pathname === href ? "primary" : "foreground")}
              href={href}
              size="lg"
              onClick={closeMenu}
            >
              {label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
