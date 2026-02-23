jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    blog: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    tag: {
      upsert: jest.fn(),
    },
  },
}));

import { GET, POST } from "@/app/api/admin/blogs/route";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";

const prismaMock = prisma as unknown as {
  blog: {
    findMany: jest.Mock;
    findUnique: jest.Mock;
    create: jest.Mock;
  };
  tag: {
    upsert: jest.Mock;
  };
};

type MockRequest = {
  json: () => Promise<unknown>;
};

function createRequest(body: unknown): MockRequest {
  return {
    json: async () => body,
  };
}

describe("/api/admin/blogs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 for unauthenticated GET", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const response = await GET();
    expect(response.status).toBe(401);
  });

  it("returns blogs for authorized users", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "user-1", role: "ADMIN" },
    });
    prismaMock.blog.findMany.mockResolvedValue([
      {
        id: "blog-1",
        title: "Test Blog",
        slug: "test-blog",
      },
    ]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(1);
    expect(prismaMock.blog.findMany).toHaveBeenCalledTimes(1);
  });

  it("returns 401 for unauthenticated POST", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const response = await POST(createRequest({ title: "T", content: "C" }) as any);
    expect(response.status).toBe(401);
  });

  it("returns 400 when title/content are missing", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "user-1", role: "EDITOR" },
    });

    const response = await POST(createRequest({ title: "", content: "" }) as any);
    expect(response.status).toBe(400);
  });

  it("creates blog with generated slug and author", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "user-1", role: "EDITOR" },
    });

    prismaMock.blog.findUnique.mockResolvedValue(null);
    prismaMock.tag.upsert.mockResolvedValue({ id: "tag-1", name: "Tax", slug: "tax" });
    prismaMock.blog.create.mockResolvedValue({
      id: "blog-1",
      title: "New Blog Post",
      slug: "new-blog-post",
      content: "Hello world",
      authorId: "user-1",
      author: { name: "Editor", email: "editor@example.com" },
      tags: [{ id: "tag-1", name: "Tax", slug: "tax" }],
    });

    const response = await POST(
      createRequest({
        title: "New Blog Post",
        content: "Hello world",
        tags: ["Tax"],
        status: "PUBLISHED",
      }) as any
    );
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.slug).toBe("new-blog-post");
    expect(prismaMock.blog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          authorId: "user-1",
          slug: "new-blog-post",
          title: "New Blog Post",
        }),
      })
    );
  });

  it("adds numeric suffix when slug is already taken", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "admin-1", role: "ADMIN" },
    });

    prismaMock.blog.findUnique
      .mockResolvedValueOnce({ id: "existing", slug: "duplicate-title" })
      .mockResolvedValueOnce(null);
    prismaMock.blog.create.mockResolvedValue({
      id: "blog-2",
      title: "Duplicate Title",
      slug: "duplicate-title-1",
      content: "Body",
      authorId: "admin-1",
      author: { name: "Admin", email: "admin@example.com" },
      tags: [],
    });

    const response = await POST(
      createRequest({
        title: "Duplicate Title",
        content: "Body",
      }) as any
    );
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.slug).toBe("duplicate-title-1");
  });
});
