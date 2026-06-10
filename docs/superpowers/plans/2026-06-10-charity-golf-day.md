# Charity Golf Day 2026 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a homepage Charity Golf Day announcement strip and a Get Involved navigation item linking to SparkRaise.

**Architecture:** Extend the existing static React components instead of introducing new routing or CMS data. `RedevelopmentBanner` owns the homepage announcement stack, while `Navigation` owns desktop and mobile menu rendering.

**Tech Stack:** Vite, React, TypeScript, React Router, Tailwind CSS, lucide-react.

---

### Task 1: Regression Check

**Files:**
- Create: `scripts/verify-charity-golf-day.mjs`

- [ ] **Step 1: Add a source-level verification script**

```js
import { readFileSync } from "node:fs";

const checks = [
  {
    file: "src/components/RedevelopmentBanner.tsx",
    values: [
      "Join us for the CCC Charity Golf Day",
      "Friday 27 November",
      "Shek O Country Club",
      "https://cccgolfday.sparkraise.com/",
    ],
  },
  {
    file: "src/components/Navigation.tsx",
    values: [
      "Golf Day 2026",
      "https://cccgolfday.sparkraise.com/",
      "external: true",
    ],
  },
];

let failed = false;

for (const check of checks) {
  const source = readFileSync(check.file, "utf8");
  for (const value of check.values) {
    if (!source.includes(value)) {
      console.error(`${check.file} is missing: ${value}`);
      failed = true;
    }
  }
}

if (failed) {
  process.exit(1);
}

console.log("Charity Golf Day source checks passed.");
```

- [ ] **Step 2: Run it before implementation**

Run: `node scripts/verify-charity-golf-day.mjs`

Expected: FAIL because the Golf Day copy and nav item are not implemented yet.

### Task 2: Homepage Banner

**Files:**
- Modify: `src/components/RedevelopmentBanner.tsx`

- [ ] **Step 1: Add the Golf Day strip below the redevelopment notice**

Add a second row with the campaign copy, SparkRaise URL, external-link attributes, and compact responsive styling.

- [ ] **Step 2: Run the source check**

Run: `node scripts/verify-charity-golf-day.mjs`

Expected: Still FAIL until the navigation item is added.

### Task 3: Navigation Item

**Files:**
- Modify: `src/components/Navigation.tsx`

- [ ] **Step 1: Add external link support**

Extend `NavItem` with `external?: boolean`, then render external anchors in desktop, dropdown, and mobile navigation paths.

- [ ] **Step 2: Add "Golf Day 2026"**

Add `{ label: "Golf Day 2026", href: "https://cccgolfday.sparkraise.com/", external: true }` under "Get Involved", after "Donate".

- [ ] **Step 3: Verify**

Run:

```bash
node scripts/verify-charity-golf-day.mjs
pnpm lint
pnpm build
```

Expected: All commands pass.
