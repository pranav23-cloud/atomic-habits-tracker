import { motion } from "framer-motion";
import { Play } from "lucide-react";
import type { VideoRecommendation } from "@/lib/recommendations";

const VideoCard = ({ video, index }: { video: VideoRecommendation; index: number }) => (
  <motion.a
    href={video.url}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08 }}
    className="group flex gap-3 p-2 rounded-lg hover:bg-muted/60 transition-colors cursor-pointer"
  >
    <div className="relative flex-shrink-0 w-28 h-16 rounded-md overflow-hidden bg-muted">
      <img
        src={video.thumbnail}
        alt={video.title}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 group-hover:bg-foreground/20 transition-colors">
        <Play className="w-5 h-5 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
      </div>
      <span className="absolute bottom-1 right-1 bg-foreground/80 text-primary-foreground text-[10px] font-mono px-1 rounded">
        {video.duration}
      </span>
    </div>
    <div className="flex flex-col justify-center min-w-0">
      <p className="text-sm font-medium text-foreground line-clamp-2 leading-tight">
        {video.title}
      </p>
      <p className="text-xs text-muted-foreground mt-0.5">{video.channel}</p>
    </div>
  </motion.a>
);

export default VideoCard;
