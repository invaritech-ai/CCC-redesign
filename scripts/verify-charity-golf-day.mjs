import { readFileSync } from "node:fs";

const checks = [
    {
        file: "src/components/RedevelopmentBanner.tsx",
        values: [
            "Join us for the CCC Charity Golf Day",
            "Friday 27 November 2026",
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
