import process from "node:process";

const targetUrl = process.argv[2] || "https://www.chinacoastcommunity.org.hk";

const checks = [
    {
        label: "browser-like",
        userAgent:
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    },
    {
        label: "ahrefs-bot",
        userAgent: "Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)",
    },
    {
        label: "ahrefs-site-audit",
        userAgent:
            "Mozilla/5.0 (compatible; AhrefsSiteAudit/6.1; +http://ahrefs.com/robot/site-audit)",
    },
];

const paths = ["/robots.txt", "/sitemap.xml"];

const runCheck = async ({ label, userAgent }, endpoint) => {
    const url = new URL(endpoint, targetUrl).toString();
    const response = await fetch(url, {
        headers: { "User-Agent": userAgent },
        redirect: "manual",
    });

    const contentType = response.headers.get("content-type") || "";
    const cacheControl = response.headers.get("cache-control") || "";
    const location = response.headers.get("location") || "";

    return {
        endpoint,
        label,
        status: response.status,
        contentType,
        cacheControl,
        location,
    };
};

const printRow = (row) => {
    const redirect = row.location ? ` -> ${row.location}` : "";
    console.log(
        `${row.endpoint.padEnd(12)} | ${row.label.padEnd(18)} | status=${String(
            row.status
        ).padEnd(3)} | type=${row.contentType || "-"} | cache=${
            row.cacheControl || "-"
        }${redirect}`
    );
};

const main = async () => {
    console.log(`Checking crawler access against ${targetUrl}\n`);
    const results = [];
    for (const endpoint of paths) {
        for (const check of checks) {
            results.push(await runCheck(check, endpoint));
        }
    }

    results.forEach(printRow);

    const failures = results.filter((row) => row.status >= 400);
    if (failures.length > 0) {
        console.error(
            "\nOne or more crawler access checks failed. Review bot blocking, redirects, or edge security settings."
        );
        process.exit(1);
    }

    console.log("\nCrawler access checks passed.");
};

main().catch((error) => {
    console.error("Failed to run crawler access checks:", error);
    process.exit(1);
});
