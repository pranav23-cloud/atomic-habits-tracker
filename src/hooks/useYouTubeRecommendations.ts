import { useQuery } from "@tanstack/react-query";
import { buildYouTubeQuery, searchYouTubeVideos, type YouTubeVideo } from "@/lib/youtube";

export function useYouTubeRecommendations(habitName: string, enabled: boolean) {
  return useQuery<YouTubeVideo[]>({
    queryKey: ["youtube", habitName],
    enabled: enabled && habitName.trim().length > 0,
    queryFn: async () => {
      const q = buildYouTubeQuery(habitName);
      return await searchYouTubeVideos(q, 5);
    },
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
}

