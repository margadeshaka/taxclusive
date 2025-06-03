import { render, screen, fireEvent } from "@testing-library/react";
import Header from "@/components/header";
import { usePathname } from "next/navigation";
import renderer from "react-test-renderer";

// Mock the Next.js navigation hooks
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

describe("Header", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock the usePathname hook to return '/' by default
    (usePathname as jest.Mock).mockReturnValue("/");

    // Mock window.scrollY
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 0,
    });
  });

  it("renders the logo and navigation links", () => {
    render(<Header />);

    // Check if the logo is rendered
    expect(screen.getByText("Taxclusive")).toBeInTheDocument();

    // Check if navigation links are rendered
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "About Us" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Services" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Expertise" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Insights" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Blogs" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "FAQ" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact" })).toBeInTheDocument();

    // Check if CTA buttons are rendered
    expect(screen.getByRole("link", { name: "Book an Appointment" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Get in Touch" })).toBeInTheDocument();
  });

  it("highlights the active navigation link", () => {
    // Mock the usePathname hook to return '/about'
    (usePathname as jest.Mock).mockReturnValue("/about");

    render(<Header />);

    // Get all navigation links
    const homeLink = screen.getByRole("link", { name: "Home" });
    const aboutLink = screen.getByRole("link", { name: "About Us" });

    // Check if the active link has the correct class
    expect(homeLink.className).not.toContain("text-primary font-bold");
    expect(aboutLink.className).toContain("text-primary font-bold");
  });

  it("toggles the mobile menu when the menu button is clicked", () => {
    render(<Header />);

    // Get the menu button
    const menuButton = screen.getByRole("button", { name: "Open menu" });

    // Mobile menu should not be visible initially
    expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();

    // Click the menu button to open the menu
    fireEvent.click(menuButton);

    // Mobile menu should now be visible
    expect(screen.getByRole("navigation", { name: "Mobile" })).toBeInTheDocument();

    // Menu button should now be labeled "Close menu"
    expect(screen.getByRole("button", { name: "Close menu" })).toBeInTheDocument();

    // Click the menu button again to close the menu
    fireEvent.click(screen.getByRole("button", { name: "Close menu" }));

    // Mobile menu should no longer be visible
    expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();
  });

  it("changes header appearance on scroll", () => {
    render(<Header />);

    // Get the header element
    const header = screen.getByRole("banner");

    // Initially, header should not have the scrolled class
    expect(header.className).not.toContain("backdrop-blur");

    // Simulate scrolling
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 20,
    });

    // Trigger the scroll event
    fireEvent.scroll(window);

    // Header should now have the scrolled class
    expect(header.className).toContain("backdrop-blur");
  });

  it("matches snapshot", () => {
    // Mock the usePathname hook to return '/' for consistent snapshots
    (usePathname as jest.Mock).mockReturnValue("/");

    const tree = renderer.create(<Header />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
