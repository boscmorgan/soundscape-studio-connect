import { describe, it, expect } from "vitest"

import { mailtoLink } from "./utils"

describe("mailtoLink", () => {
  it("returns mailto link with encoded subject containing spaces", () => {
    const subject = "General Inquiry About Services"

    const result = mailtoLink(subject)

    expect(result).toBe(`mailto:loe@loelashmusic.com?subject=${encodeURIComponent(subject)}`)
  })

  it("encodes special characters in the subject", () => {
    const subject = "Collaboration & Support?"

    const result = mailtoLink(subject)

    expect(result).toBe(`mailto:loe@loelashmusic.com?subject=${encodeURIComponent(subject)}`)
    expect(result).toContain("%26")
    expect(result).toContain("%3F")
  })
})
