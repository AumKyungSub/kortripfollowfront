import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import mongoose from "mongoose";

const SITE_URL = "https://kortripfollow.com";
const DB_NAME = "kortripfollow";
const MAX_ITEMS = 50;
const outputPath = process.argv[2] || path.resolve("public", "rss.xml");

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
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function cleanText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function objectIdDate(value) {
  if (!value) return null;
  try {
    return new mongoose.Types.ObjectId(value).getTimestamp();
  } catch {
    return null;
  }
}

function publishedDate(value) {
  const match = String(value || "").match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/);
  if (!match) return null;
  // Store the editorial date as midnight in Korea, then serialize as RFC 2822/GMT.
  return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), -9));
}

function validDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.valueOf()) ? null : date;
}

function fallbackDate(document) {
  return validDate(document.updatedAt)
    || validDate(document.createdAt)
    || objectIdDate(document._id)
    || new Date(0);
}

function koreanTitle(document, fallback) {
  return cleanText(document.location?.name?.ko
    || document.name?.ko
    || document.name
    || document.title?.ko
    || document.title
    || fallback);
}

function koreanDescription(document) {
  return cleanText(document.description?.short?.ko
    || document.description?.slide?.ko
    || document.description?.title?.ko
    || document.description?.content?.ko
    || document.description?.ko
    || document.description);
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
      { projection: { typeTable: 1, otherID: 1, date: 1 } },
    ).toArray();
    const blogDates = new Map();
    for (const blog of blogs) {
      const date = publishedDate(blog.date?.ko) || publishedDate(blog.date?.en);
      if (date) blogDates.set(`${blog.typeTable}:${blog.otherID}`, date);
    }

    const items = [];
    for (const [collection, toPath] of Object.entries(contentTypes)) {
      const documents = await db.collection(collection).find(
        { visibility: { $ne: false }, id: { $exists: true } },
        { projection: { _id: 1, id: 1, location: 1, name: 1, title: 1, description: 1, updatedAt: 1, createdAt: 1 } },
      ).toArray();

      for (const document of documents) {
        const pathname = toPath(document.id);
        items.push({
          title: koreanTitle(document, `국트따라 여행 콘텐츠 #${document.id}`),
          description: koreanDescription(document),
          link: `${SITE_URL}${pathname}`,
          date: blogDates.get(`${collection}:${document.id}`) || fallbackDate(document),
        });
      }
    }

    const collections = await db.collection("collections").find(
      { visibility: { $ne: false }, id: { $exists: true } },
      { projection: { _id: 1, id: 1, name: 1, title: 1, description: 1, updatedAt: 1, createdAt: 1 } },
    ).toArray();
    for (const document of collections) {
      items.push({
        title: collectionTitle(document),
        description: koreanDescription(document),
        link: `${SITE_URL}/collection/${document.id}`,
        date: fallbackDate(document),
      });
    }

    const itineraries = await db.collection("itineraries").find(
      { visibility: "public" },
      { projection: { _id: 1, title: 1, description: 1, updatedAt: 1, createdAt: 1 } },
    ).toArray();
    for (const document of itineraries) {
      items.push({
        title: cleanText(document.title || "공개 여행 코스"),
        description: cleanText(document.description || "국트따라 사용자가 공개한 여행 코스입니다."),
        link: `${SITE_URL}/itineraries/${document._id}`,
        date: fallbackDate(document),
      });
    }

    const recentItems = items
      .sort((a, b) => b.date.valueOf() - a.date.valueOf())
      .slice(0, MAX_ITEMS);
    const lastBuildDate = new Date().toUTCString();
    const itemXml = recentItems.map((item) => [
      "    <item>",
      `      <title>${escapeXml(item.title)}</title>`,
      `      <link>${escapeXml(item.link)}</link>`,
      `      <description>${escapeXml(item.description)}</description>`,
      `      <guid isPermaLink="true">${escapeXml(item.link)}</guid>`,
      `      <pubDate>${item.date.toUTCString()}</pubDate>`,
      "    </item>",
    ].join("\n")).join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>국트따라</title>\n    <link>${SITE_URL}/</link>\n    <description>직접 보고 기록한 국내 여행지와 새로운 여행 코스를 소개합니다.</description>\n    <language>ko-KR</language>\n    <lastBuildDate>${lastBuildDate}</lastBuildDate>\n    <ttl>1440</ttl>\n${itemXml}\n  </channel>\n</rss>\n`;

    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, xml, "utf8");
    console.log(`Generated ${recentItems.length} RSS items at ${outputPath}`);
  } finally {
    await mongoose.disconnect();
  }
}

function collectionTitle(document) {
  return cleanText(document.title?.ko
    || document.title
    || document.description?.title?.ko
    || document.name?.ko
    || document.name
    || `국트따라 컬렉션 #${document.id}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
