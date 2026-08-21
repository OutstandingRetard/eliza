import { describe, expect, it } from "vitest";
import { policyProvenance } from "./owner-policy-writes.ts";

describe("owner-policy-writes surrogate truncation", () => {
  it("truncates provenance note without splitting surrogate pairs", () => {
    const note = `${"x".repeat(198)}🦊extra`;
    const provenance = policyProvenance(note);
    expect(provenance.note).toBeDefined();
    expect(provenance.note!.length).toBeLessThanOrEqual(200);
    const isWellFormed = (value: string) =>
      (value as unknown as { isWellFormed(): boolean }).isWellFormed?.() ?? true;
    expect(isWellFormed(provenance.note!)).toBe(true);
  });
});
