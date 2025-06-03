import { cn } from "@/lib/utils";

describe("cn utility function", () => {
  it("merges class names correctly", () => {
    // Test with simple strings
    expect(cn("class1", "class2")).toBe("class1 class2");

    // Test with conditional classes
    expect(cn("class1", true && "class2", false && "class3")).toBe("class1 class2");

    // Test with null/undefined values
    expect(cn("class1", null, undefined, "class2")).toBe("class1 class2");

    // Test with object notation
    expect(cn("class1", { class2: true, class3: false })).toBe("class1 class2");

    // Test with array notation
    expect(cn("class1", ["class2", "class3"])).toBe("class1 class2 class3");

    // Test with Tailwind conflicting classes (tailwind-merge functionality)
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    expect(cn("bg-red-500 text-white", "bg-blue-500")).toBe("text-white bg-blue-500");
  });

  it("handles empty inputs", () => {
    expect(cn()).toBe("");
    expect(cn("")).toBe("");
    expect(cn("", "")).toBe("");
  });

  it("filters out falsy values", () => {
    expect(cn("class1", false, "class2", 0, null, undefined, "")).toBe("class1 class2");
  });
});
