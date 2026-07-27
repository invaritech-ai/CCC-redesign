import { createClient } from "@sanity/client";
import dotenv from "dotenv";

const env = {};
dotenv.config({ path: ".env.local", processEnv: env, quiet: true });
dotenv.config({ path: ".env", processEnv: env, override: false, quiet: true });

const args = process.argv.slice(2);

function readArgument(name, fallback) {
    const index = args.indexOf(name);
    return index === -1 ? fallback : args[index + 1];
}

function isoDate(value, name) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? "")) {
        throw new Error(`${name} must use YYYY-MM-DD format`);
    }

    return `${value}T00:00:00.000Z`;
}

const now = new Date();
const defaultFrom = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 2, 1))
    .toISOString()
    .slice(0, 10);
const defaultTo = new Date(Date.UTC(now.getUTCFullYear() + 1, now.getUTCMonth() + 1, 1))
    .toISOString()
    .slice(0, 10);

const from = readArgument("--from", defaultFrom);
const to = readArgument("--to", defaultTo);
const projectId = env.VITE_SANITY_PROJECT_ID || env.SANITY_PROJECT_ID;
const dataset = env.VITE_SANITY_DATASET || env.SANITY_DATASET || "production";
const apiVersion =
    env.VITE_SANITY_API_VERSION || env.SANITY_API_VERSION || "2024-01-01";

if (!projectId) {
    throw new Error("Sanity project ID is not configured in .env.local or .env");
}

const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
});

const result = await client.fetch(
    `{
        "totalDocuments": count(*),
        "eventCount": count(*[_type == "event"]),
        "galleryCount": count(*[_type == "gallery"]),
        "events": *[
            _type == "event" &&
            date >= $from &&
            date < $to
        ] | order(date asc) {
            _id,
            title,
            date,
            time,
            description,
            location,
            registrationLink,
            organizer,
            "slug": slug.current,
            "hasImage": defined(image.asset)
        }
    }`,
    {
        from: isoDate(from, "--from"),
        to: isoDate(to, "--to"),
    },
);

console.log(
    JSON.stringify(
        {
            readSucceeded: true,
            dataset,
            range: { from, toExclusive: to },
            ...result,
        },
        null,
        2,
    ),
);
