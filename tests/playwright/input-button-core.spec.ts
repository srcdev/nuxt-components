import { test, expect } from "@playwright/test";

test.describe("InputButtonCore", () => {
  test("should match visual snapshot", async ({ page }) => {
    await page.goto("http://127.0.0.1:6006/?path=/story/components-forms-input-button-inputbuttoncore--default");
    const frame = page.frameLocator("#storybook-preview-iframe");
    const button = frame.getByRole("button");
    await button.waitFor({ state: "visible", timeout: 10000 });
    expect(await button.isVisible()).toBe(true);
    expect(await button.isEnabled()).toBe(true);
    expect(await button.screenshot()).toMatchSnapshot("input-button-core.png");
  });
});
