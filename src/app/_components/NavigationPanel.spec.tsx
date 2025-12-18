import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NavigationPanel from "./NavigationPanel";
import { useRouter } from "next/navigation";

describe("NavigationPanel (Unit Test)", () => {
  it("renders the brand name", () => {
    render(<NavigationPanel />);
    expect(screen.getByText("Flatiron School")).toBeInTheDocument();
  });

  it("renders navigation links with correct hrefs", () => {
    render(<NavigationPanel />);

    const dashboardLink = screen.getByTestId("navigation-link-dashboard");
    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink).toHaveAttribute("href", "/");

    const managePersonasLink = screen.getByTestId(
      "navigation-link-manage-personas"
    );
    expect(managePersonasLink).toBeInTheDocument();
    expect(managePersonasLink).toHaveAttribute("href", "/personas");
  });

  it("renders the user profile with correct name", () => {
    render(<NavigationPanel />);
    const account = screen.getByTestId("account");
    expect(account).toBeInTheDocument();
    expect(account).toHaveTextContent("Kylon Tyner");
  });

  it("navigates to profile page when user profile is clicked", async () => {
    const user = userEvent.setup();
    const mockPush = vi.fn();
    const mockRouter = useRouter();
    mockRouter.push = mockPush;

    render(<NavigationPanel />);
    const accountButton = screen.getByTestId("account");

    await user.click(accountButton);

    expect(mockPush).toHaveBeenCalledWith("/account");
  });

  it("toggles mobile menu when NavbarMenuToggle is clicked", async () => {
    const user = userEvent.setup();
    render(<NavigationPanel />);

    const toggleButton = screen.getByRole("button", {
      name: /open menu/i,
    });
    expect(toggleButton).toBeInTheDocument();

    await user.click(toggleButton);
    expect(
      screen.getByRole("button", { name: /close menu/i })
    ).toBeInTheDocument();
  });

  it("renders mobile navigation links when menu is open", async () => {
    const user = userEvent.setup();
    render(<NavigationPanel />);

    const toggleButton = screen.getByRole("button", {
      name: /open menu/i,
    });

    await user.click(toggleButton);

    const settingsLink = await screen.findByTestId(
      "mobile-navigation-link-settings"
    );
    expect(settingsLink).toBeInTheDocument();
    expect(settingsLink).toHaveAttribute("href", "/account");

    const logoutLink = await screen.findByTestId(
      "mobile-navigation-link-logout"
    );
    expect(logoutLink).toBeInTheDocument();
    expect(logoutLink).toHaveAttribute("href", "#");
  });
});
