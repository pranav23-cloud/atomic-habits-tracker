import type { Category } from "@/hooks/useHabits";

export interface VideoRecommendation {
  id: string;
  title: string;
  channel: string;
  duration: string;
  thumbnail: string;
  url: string;
}

const videosByCategory: Record<Category, VideoRecommendation[]> = {
  Mental: [
    { id: "m1", title: "How to Rewire Your Brain for Focus", channel: "Andrew Huberman", duration: "12:34", thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=320&h=180&fit=crop", url: "#" },
    { id: "m2", title: "5-Minute Meditation for Beginners", channel: "Headspace", duration: "5:22", thumbnail: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=320&h=180&fit=crop", url: "#" },
    { id: "m3", title: "The Science of Mindfulness", channel: "TED Talks", duration: "18:45", thumbnail: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=320&h=180&fit=crop", url: "#" },
  ],
  Physical: [
    { id: "p1", title: "30-Min Full Body Workout – No Equipment", channel: "THENX", duration: "31:15", thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=320&h=180&fit=crop", url: "#" },
    { id: "p2", title: "Morning Stretch Routine for Energy", channel: "Yoga With Adriene", duration: "15:08", thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=320&h=180&fit=crop", url: "#" },
    { id: "p3", title: "How to Build a Fitness Habit That Sticks", channel: "Jeff Nippard", duration: "22:40", thumbnail: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=320&h=180&fit=crop", url: "#" },
  ],
  Intelligence: [
    { id: "i1", title: "How to Read More Books This Year", channel: "Ali Abdaal", duration: "14:20", thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=320&h=180&fit=crop", url: "#" },
    { id: "i2", title: "Speed Learning Techniques That Work", channel: "Thomas Frank", duration: "19:55", thumbnail: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=320&h=180&fit=crop", url: "#" },
    { id: "i3", title: "Critical Thinking – Mental Models Explained", channel: "Farnam Street", duration: "16:30", thumbnail: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=320&h=180&fit=crop", url: "#" },
  ],
  Skills: [
    { id: "s1", title: "Learn Any Skill in 20 Hours", channel: "Josh Kaufman", duration: "19:27", thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=320&h=180&fit=crop", url: "#" },
    { id: "s2", title: "Building a Side Project Portfolio", channel: "Fireship", duration: "8:12", thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=320&h=180&fit=crop", url: "#" },
    { id: "s3", title: "Deliberate Practice – The Key to Mastery", channel: "Veritasium", duration: "11:44", thumbnail: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=320&h=180&fit=crop", url: "#" },
  ],
  Habits: [
    { id: "h1", title: "Atomic Habits – Summary & Key Lessons", channel: "James Clear", duration: "20:15", thumbnail: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=320&h=180&fit=crop", url: "#" },
    { id: "h2", title: "How I Built 7 Habits in One Year", channel: "Matt D'Avella", duration: "13:50", thumbnail: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=320&h=180&fit=crop", url: "#" },
    { id: "h3", title: "The 2-Minute Rule That Changed My Life", channel: "Ali Abdaal", duration: "10:32", thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=320&h=180&fit=crop", url: "#" },
  ],
  Communication: [
    { id: "c1", title: "How to Speak So People Want to Listen", channel: "TED Talks", duration: "9:58", thumbnail: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=320&h=180&fit=crop", url: "#" },
    { id: "c2", title: "Active Listening – The Most Important Skill", channel: "Charisma on Command", duration: "11:24", thumbnail: "https://images.unsplash.com/photo-1528901166007-3784c7dd3653?w=320&h=180&fit=crop", url: "#" },
    { id: "c3", title: "Body Language Tips for Confidence", channel: "Science of People", duration: "14:10", thumbnail: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=320&h=180&fit=crop", url: "#" },
  ],
};

export function getRecommendations(category: Category): VideoRecommendation[] {
  return videosByCategory[category] || [];
}
