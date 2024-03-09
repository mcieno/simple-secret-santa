import { expect, test } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page).toHaveTitle("Simple Secret Santa");
});

test("invalid code", async ({ page }, testinfo) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await testinfo.attach("initial.png", {
    body: await page.screenshot(),
    contentType: "image/png",
  });

  const inputs = page.getByRole("textbox");

  const code = "000001";
  for (let i = 0; i < code.length; i++) {
    await inputs.nth(i).fill(code[i]);
  }
  await testinfo.attach("after-code.png", {
    body: await page.screenshot(),
    contentType: "image/png",
  });

  await expect(page.getByRole("heading")).toContainText("code?");
  await expect(page.getByRole("button", { name: /who/i })).toBeHidden();
  await expect(page.getByRole("button", { name: /back/i })).toBeHidden();
});

test("valid code go back", async ({ page }, testinfo) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await testinfo.attach("initial.png", {
    body: await page.screenshot(),
    contentType: "image/png",
  });

  const inputs = page.getByRole("textbox");

  const code = "000000";
  for (let i = 0; i < code.length; i++) {
    await inputs.nth(i).fill(code[i]);
  }
  await testinfo.attach("after-code.png", {
    body: await page.screenshot(),
    contentType: "image/png",
  });

  await expect(page.getByRole("heading")).toContainText("Sallie");
  await expect(page.getByRole("button", { name: /who/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /back/i })).toBeVisible();

  await page.getByRole("button", { name: /back/i }).click();
  await testinfo.attach("after-click.png", {
    body: await page.screenshot(),
    contentType: "image/png",
  });

  await expect(page.getByRole("heading")).toContainText("code?");
  await expect(page.getByRole("button", { name: /who/i })).toBeHidden();
  await expect(page.getByRole("button", { name: /back/i })).toBeHidden();
});

test("valid code go forward", async ({ page }, testinfo) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await testinfo.attach("initial.png", {
    body: await page.screenshot(),
    contentType: "image/png",
  });

  const inputs = page.getByRole("textbox");

  const code = "000000";
  for (let i = 0; i < code.length; i++) {
    await inputs.nth(i).fill(code[i]);
  }
  await testinfo.attach("after-code.png", {
    body: await page.screenshot(),
    contentType: "image/png",
  });

  await expect(page.getByRole("heading")).toContainText("Sallie");
  await expect(page.getByRole("button", { name: /who/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /back/i })).toBeVisible();

  await page.getByRole("button", { name: /who/i }).click();
  await testinfo.attach("after-click.png", {
    body: await page.screenshot(),
    contentType: "image/png",
  });

  await expect(
    page.getByRole("heading", { name: /make a present/i }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: /Waleed/ })).toBeVisible();
});
