import { env } from "@/lib/env";

export type YouTubeVideo = {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  url: string;
};

function extractKeywords(habitName: string): string {
  const cleaned = habitName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Keep it intentionally simple for MVP.
  return cleaned;
}

export function buildYouTubeQuery(habitName: string): string {
  const keywords = extractKeywords(habitName);
  if (!keywords) return "self improvement habit";
  return `how to ${keywords}`;
}

export async function searchYouTubeVideos(queryText: string, maxResults = 5): Promise<YouTubeVideo[]> {
  const apiKey = env.youtube.apiKey;
  if (!apiKey) return [];

  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("type", "video");
  url.searchParams.set("maxResults", String(maxResults));
  url.searchParams.set("q", queryText);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("safeSearch", "moderate");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`YouTube API error: ${res.status}`);
  const data = (await res.json()) as {
    items?: Array<{
      id?: { videoId?: string };
      snippet?: {
        title?: string;
        channelTitle?: string;
        thumbnails?: { medium?: { url?: string }; high?: { url?: string } };
      };
    }>;
  };

  const items = data.items ?? [];
  return items
    .map((it) => {
      const videoId = it.id?.videoId;
      const title = it.snippet?.title;
      if (!videoId || !title) return null;
      const channel = it.snippet?.channelTitle ?? "YouTube";
      const thumbnail =
        it.snippet?.thumbnails?.medium?.url ??
        it.snippet?.thumbnails?.high?.url ??
        "";

      return {
        id: videoId,
        title,
        channel,
        thumbnail,
        url: `https://www.youtube.com/watch?v=${videoId}`,
      } satisfies YouTubeVideo;
    })
    .filter((v): v is YouTubeVideo => Boolean(v));
}

