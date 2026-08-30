import { describe, expect, it } from "vitest";
import { describeUserReference, userReferenceLogView, completeUserReferenceView } from "./reference-echo";

describe("describeUserReference", () => {
	it("quotes name-shaped references", () => {
		expect(describeUserReference("Alice", "target")).toBe('"Alice"');
		expect(describeUserReference("hello world", "target")).toBe('"hello world"');
	});

	it("returns fallback for empty references", () => {
		expect(describeUserReference("", "target")).toBe("target");
		expect(describeUserReference("   ", "target")).toBe("target");
	});

	it("returns fallback for multi-line references", () => {
		expect(describeUserReference("line1\nline2", "target")).toBe("target");
		expect(describeUserReference("line1\rline2", "target")).toBe("target");
	});

	it("returns fallback for references exceeding 64 chars", () => {
		const longRef = "a".repeat(65);
		expect(describeUserReference(longRef, "target")).toBe("target");
	});

	it("accepts references at exactly 64 chars", () => {
		const ref = "a".repeat(64);
		expect(describeUserReference(ref, "target")).toBe(`"${ref}"`);
	});

	it("trims whitespace before checking", () => {
		expect(describeUserReference("  Alice  ", "target")).toBe('"Alice"');
	});

	it("uses default fallback when fallback is not a string", () => {
		expect(describeUserReference("Alice", undefined as unknown as string)).toBe('"Alice"');
		expect(describeUserReference("", undefined as unknown as string)).toBe("target");
	});

	it("handles non-string references", () => {
		expect(describeUserReference(null as unknown as string, "target")).toBe("target");
		expect(describeUserReference(undefined as unknown as string, "target")).toBe("target");
		expect(describeUserReference(42 as unknown as string, "target")).toBe("target");
	});
});

describe("userReferenceLogView", () => {
	it("returns collapsed reference when within 120 chars", () => {
		expect(userReferenceLogView("Alice")).toBe("Alice");
		expect(userReferenceLogView("hello   world")).toBe("hello world");
	});

	it("truncates references exceeding 120 chars", () => {
		const longRef = "a".repeat(150);
		const result = userReferenceLogView(longRef);
		expect(result.endsWith("…")).toBe(true);
	});

	it("collapses whitespace", () => {
		expect(userReferenceLogView("hello\t\nworld")).toBe("hello world");
		expect(userReferenceLogView("  hello  ")).toBe("hello");
	});

	it("handles empty string", () => {
		expect(userReferenceLogView("")).toBe("");
	});

	it("handles non-string references", () => {
		expect(userReferenceLogView(null as unknown as string)).toBe("");
		expect(userReferenceLogView(undefined as unknown as string)).toBe("");
	});
});

describe("completeUserReferenceView", () => {
	it("normalizes whitespace", () => {
		expect(completeUserReferenceView("hello\t\nworld")).toBe("hello world");
		expect(completeUserReferenceView("  hello  ")).toBe("hello");
	});

	it("handles empty string", () => {
		expect(completeUserReferenceView("")).toBe("");
	});

	it("handles non-string references", () => {
		expect(completeUserReferenceView(null as unknown as string)).toBe("");
		expect(completeUserReferenceView(undefined as unknown as string)).toBe("");
	});

	it("does not truncate", () => {
		const longRef = "a".repeat(200);
		expect(completeUserReferenceView(longRef)).toBe(longRef);
	});
});
