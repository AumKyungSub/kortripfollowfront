import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import mongoose from "mongoose";

const SITE_URL = "https://kortripfollow.com";
const DB_NAME = "kortripfollow";
const outputPath = process.argv[2] || path.resolve("public", "sitemap.xml");

const staticPages = [
  ["/", "2026-09-08"],
  ["/region", "2026-09-08"],
  ["/theme", "2026-09-08"],
  ["/collection", "2026-09-08"],
  ["/courses", "2026-08-25"],
  ["/about", "2025-11-05"],
  ["/privacy", "2026-09-08"],
  ["/terms", "2026-09-08"],
];

const contentTypes = {
  rankings: (id) => `/location/${id}`,
  cafes: (id) => `/theme/cafe/${id}`,
  restaurants: (id) => `/theme/restaurant/${id}`,
  lodgings: (id) => `/theme/lodging/${id}`,
  foods: (id) => `/theme/food/${id}`,
  markets: (id) => `/theme/market/${id}`,
  oceans: (id) => `/theme/ocean/${id}`,
  parks: (id) => `/theme/park/${id}`,
  drives: (id) => `/theme/drive/${id}`,
};

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function objectIdDate(value) {
  if (!value) return null;
  try {
    return new mongoose.Types.ObjectId(value).getTimestamp();
  } catch {
    return null;
  }
}

function blogDate(value) {
  const match = String(value || "").match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/);
  if (!match) return null;
  return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
}

function isoDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.valueOf()) ? null : date.toISOString().slice(0, 10);
}

function newestDate(...values) {
  return values.filter(Boolean).sort((a, b) => b.valueOf() - a.valueOf())[0] || null;
}

async function main() {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is required");

  await mongoose.connect(process.env.MONGO_URI, {
    dbName: DB_NAME,
    serverSelectionTimeoutMS: 10_000,
  });

  try {
    const db = mongoose.connection.db;
    const blogs = await db.collection("blogs").find(
      { visibility: { $ne: false } },
      { projection: { typeTable: 1, otherID: 1, date: 1, updatedAt: 1, createdAt: 1 } },
    ).toArray();

    const blogDates = new Map();
    for (const blog of blogs) {
      const key = `${blog.typeTable}:${blog.otherID}`;
      const date = newestDate(
        blogDate(blog.date?.ko),
        blogDate(blog.date?.en),
        blog.updatedAt && new Date(blog.updatedAt),
        blog.createdAt && new Date(blog.createdAt),
      );
      if (date && (!blogDates.has(key) || date > blogDates.get(key))) blogDates.set(key, date);
    }

    const urls = staticPages.map(([pathname, lastmod]) => ({ pathname, lastmod }));

    for (const [collection, toPath] of Object.entries(contentTypes)) {
      const documents = await db.collection(collection).find(
        { visibility: { $ne: false }, id: { $exists: true } },
        { projection: { _id: 1, id: 1, updatedAt: 1, createdAt: 1 } },
      ).sort({ id: 1 }).toArray();

      for (const document of documents) {
        const lastmod = isoDate(newestDate(
          blogDates.get(`${collection}:${document.id}`),
          document.updatedAt && new Date(document.updatedAt),
          document.createdAt && new Date(document.createdAt),
          objectIdDate(document._id),
        ));
        urls.push({ pathname: toPath(document.id), lastmod });
      }
    }

    const collections = await db.collection("collections").find(
      { visibility: { $ne: false }, id: { $exists: true } },
      { projection: { _id: 1, id: 1, updatedAt: 1, createdAt: 1 } },
    ).sort({ id: 1 }).toArray();
    for (const document of collections) {
      urls.push({
        pathname: `/collection/${document.id}`,
        lastmod: isoDate(newestDate(
          document.updatedAt && new Date(document.updatedAt),
          document.createdAt && new Date(document.createdAt),
          objectIdDate(document._id),
        )),
      });
    }

    const itineraries = await db.collection("itineraries").find(
      { visibility: "public" },
      { projection: { _id: 1, updatedAt: 1, createdAt: 1 } },
    ).sort({ updatedAt: -1 }).toArray();
    for (const document of itineraries) {
      urls.push({
        pathname: `/itineraries/${document._id}`,
        lastmod: isoDate(newestDate(
          document.updatedAt && new Date(document.updatedAt),
          document.createdAt && new Date(document.createdAt),
          objectIdDate(document._id),
        )),
      });
    }

    const body = urls.map(({ pathname, lastmod }) => [
      "  <url>",
      `    <loc>${escapeXml(`${SITE_URL}${pathname}`)}</loc>`,
      ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
      "  </url>",
    ].join("\n")).join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, xml, "utf8");
    console.log(`Generated ${urls.length} URLs at ${outputPath}`);
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
