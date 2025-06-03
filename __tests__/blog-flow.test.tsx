import { render, screen, waitFor } from "@testing-library/react";
import { SWRConfig } from "swr";
import { BlogList } from "@/app/blogs/components/blog-list";
import { BlogDetail } from "@/app/blogs/components/blog-detail";
import * as strapiApi from "@/lib/strapi";

// Mock the strapi API functions
jest.mock("@/lib/strapi", () => ({
  fetchBlogs: jest.fn(),
  fetchBlogById: jest.fn(),
}));

// Mock the next/image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => <img {...props} alt={props.alt} />,
}));

// Mock data for testing
const mockBlogs = [
  {
    id: 1,
    title: "Test Blog 1",
    description: "This is a test blog post 1",
    publishedAt: "2023-01-01T00:00:00.000Z",
    cover: { url: "/test-image-1.jpg" },
    blocks: [
      {
        __component: "shared.rich-text",
        body: "<p>This is the content of test blog post 1</p>",
      },
    ],
  },
  {
    id: 2,
    title: "Test Blog 2",
    description: "This is a test blog post 2",
    publishedAt: "2023-01-02T00:00:00.000Z",
    cover: { url: "/test-image-2.jpg" },
    blocks: [
      {
        __component: "shared.rich-text",
        body: "<p>This is the content of test blog post 2</p>",
      },
    ],
  },
];

// Create a wrapper component with SWR config for testing
const Wrapper = ({ children }) => (
  <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
);

describe("Blog Flow Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("handles API errors when fetching blogs", async () => {
    // Mock the fetchBlogs function to throw an error
    const error = new Error("Failed to fetch blogs");
    (strapiApi.fetchBlogs as jest.Mock).mockRejectedValue(error);

    // Render the BlogList component
    render(<BlogList />, { wrapper: Wrapper });

    // Initially should show loading state
    expect(screen.getByText("Loading blogs...")).toBeInTheDocument();

    // Wait for the error state to be displayed
    await waitFor(() => {
      expect(screen.getByText("Error loading blogs")).toBeInTheDocument();
    });

    // Check if the error message is rendered
    expect(screen.getByText("Error loading blogs")).toBeInTheDocument();
    expect(
      screen.getByText("Please try again later or contact support if the problem persists.")
    ).toBeInTheDocument();

    // Verify that the API was called correctly
    expect(strapiApi.fetchBlogs).toHaveBeenCalledTimes(1);
  });

  it("handles empty blog list", async () => {
    // Mock the fetchBlogs function to return an empty array
    (strapiApi.fetchBlogs as jest.Mock).mockResolvedValue([]);

    // Render the BlogList component
    render(<BlogList />, { wrapper: Wrapper });

    // Initially should show loading state
    expect(screen.getByText("Loading blogs...")).toBeInTheDocument();

    // Wait for the empty state to be displayed
    await waitFor(() => {
      expect(screen.getByText("No blogs found")).toBeInTheDocument();
    });

    // Check if the empty state message is rendered
    expect(screen.getByText("No blogs found")).toBeInTheDocument();
    expect(screen.getByText("Check back later for new content.")).toBeInTheDocument();

    // Verify that the API was called correctly
    expect(strapiApi.fetchBlogs).toHaveBeenCalledTimes(1);
  });

  it("handles API errors when displaying a blog", async () => {
    // Mock the fetchBlogs function to throw an error
    const error = new Error("Failed to fetch blogs");
    (strapiApi.fetchBlogs as jest.Mock).mockRejectedValue(error);

    // Render the BlogDetail component
    render(<BlogDetail id="1" />, { wrapper: Wrapper });

    // Initially should show loading state
    expect(screen.getByText("Loading blog...")).toBeInTheDocument();

    // Wait for the error state to be displayed
    await waitFor(() => {
      expect(screen.getByText("Error loading blog")).toBeInTheDocument();
    });

    // Check if the error message is rendered
    expect(screen.getByText("Error loading blog")).toBeInTheDocument();
    expect(
      screen.getByText("Please try again later or contact support if the problem persists.")
    ).toBeInTheDocument();

    // Verify that the API was called correctly
    expect(strapiApi.fetchBlogs).toHaveBeenCalledTimes(1);
  });

  it("displays a list of blogs", async () => {
    // Mock the fetchBlogs function to return test data
    (strapiApi.fetchBlogs as jest.Mock).mockResolvedValue(mockBlogs);

    // Render the BlogList component
    render(<BlogList />, { wrapper: Wrapper });

    // Initially should show loading state
    expect(screen.getByText("Loading blogs...")).toBeInTheDocument();

    // Wait for the blogs to load
    await waitFor(() => {
      expect(screen.getByText("Test Blog 1")).toBeInTheDocument();
    });

    // Check if both blog posts are rendered
    expect(screen.getByText("Test Blog 1")).toBeInTheDocument();
    expect(screen.getByText("Test Blog 2")).toBeInTheDocument();

    // Check if descriptions are rendered
    expect(screen.getByText("This is a test blog post 1")).toBeInTheDocument();
    expect(screen.getByText("This is a test blog post 2")).toBeInTheDocument();

    // Check if dates are rendered
    expect(screen.getByText("January 1, 2023")).toBeInTheDocument();
    expect(screen.getByText("January 2, 2023")).toBeInTheDocument();

    // Verify that the API was called correctly
    expect(strapiApi.fetchBlogs).toHaveBeenCalledTimes(1);
  });

  it("displays a single blog post", async () => {
    // Mock the fetchBlogs function to return test data
    (strapiApi.fetchBlogs as jest.Mock).mockResolvedValue(mockBlogs);

    // Render the BlogDetail component with an ID
    render(<BlogDetail id="1" />, { wrapper: Wrapper });

    // Initially should show loading state
    expect(screen.getByText("Loading blog...")).toBeInTheDocument();

    // Wait for the blog to load
    await waitFor(() => {
      expect(screen.getByText("Test Blog 1")).toBeInTheDocument();
    });

    // Check if the blog post details are rendered
    expect(screen.getByText("Test Blog 1")).toBeInTheDocument();
    expect(screen.getByText("This is a test blog post 1")).toBeInTheDocument();
    expect(screen.getByText("January 1, 2023")).toBeInTheDocument();

    // Check if the content is rendered
    expect(screen.getByText("This is the content of test blog post 1")).toBeInTheDocument();

    // Verify that the API was called correctly
    expect(strapiApi.fetchBlogs).toHaveBeenCalledTimes(1);
  });

  it("handles blog not found", async () => {
    // Mock the fetchBlogs function to return test data
    (strapiApi.fetchBlogs as jest.Mock).mockResolvedValue(mockBlogs);

    // Render the BlogDetail component with a non-existent ID
    render(<BlogDetail id="999" />, { wrapper: Wrapper });

    // Initially should show loading state
    expect(screen.getByText("Loading blog...")).toBeInTheDocument();

    // Wait for the blog to load
    await waitFor(() => {
      expect(screen.getByText("Blog not found")).toBeInTheDocument();
    });

    // Check if the not found message is rendered
    expect(screen.getByText("Blog not found")).toBeInTheDocument();
    expect(
      screen.getByText("The blog you're looking for doesn't exist or has been removed.")
    ).toBeInTheDocument();
    expect(screen.getByText("Back to Blogs")).toBeInTheDocument();

    // Verify that the API was called correctly
    expect(strapiApi.fetchBlogs).toHaveBeenCalledTimes(1);
  });
});
