jest.mock("@/lib/email", () => ({
  sendEmail: jest.fn(),
  formatContactEmail: jest.fn(),
}));

jest.mock("@/lib/recaptcha", () => ({
  verifyRecaptcha: jest.fn(),
}));

import { POST } from "@/app/api/contact/route";
import { formatContactEmail, sendEmail } from "@/lib/email";
import { verifyRecaptcha } from "@/lib/recaptcha";

type MockRequest = {
  json: () => Promise<unknown>;
};

function createRequest(body: unknown): MockRequest {
  return {
    json: async () => body,
  };
}

describe("/api/contact", () => {
  const validContactData = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    subject: "Tax Planning Help",
    message: "Need help with tax planning.",
    recaptchaToken: "valid-token",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (verifyRecaptcha as jest.Mock).mockResolvedValue({ success: true });
    (formatContactEmail as jest.Mock).mockReturnValue({
      subject: "Formatted Subject",
      text: "Formatted text body",
      html: "<p>Formatted text body</p>",
      replyTo: "john.doe@example.com",
    });
    (sendEmail as jest.Mock).mockResolvedValue(undefined);
  });

  it("returns success for a valid submission", async () => {
    const response = await POST(createRequest(validContactData) as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(formatContactEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
      })
    );
    expect(sendEmail).toHaveBeenCalledTimes(1);
  });

  it("rejects when reCAPTCHA verification fails", async () => {
    (verifyRecaptcha as jest.Mock).mockResolvedValue({
      success: false,
      error: "Invalid token",
    });

    const response = await POST(createRequest(validContactData) as any);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
    expect(data.errors).toHaveProperty("recaptcha");
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("validates required fields", async () => {
    const response = await POST(
      createRequest({
        firstName: "John",
        recaptchaToken: "valid-token",
      }) as any
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.errors).toHaveProperty("lastName");
    expect(data.errors).toHaveProperty("email");
    expect(data.errors).toHaveProperty("subject");
    expect(data.errors).toHaveProperty("message");
  });

  it("validates email format", async () => {
    const response = await POST(
      createRequest({
        ...validContactData,
        email: "invalid-email",
      }) as any
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.errors).toHaveProperty("email");
  });

  it("returns 500 when email service fails", async () => {
    (sendEmail as jest.Mock).mockRejectedValue(new Error("SES unavailable"));

    const response = await POST(createRequest(validContactData) as any);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.errors).toHaveProperty("server");
  });
});
