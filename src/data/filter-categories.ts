import type { FilterCategory } from "@/types/market";

export const taskCategories: FilterCategory[] = [
  {
    id: "video-generation",
    label: "Video Generation",
    options: [
      { id: "text-to-video", label: "Text to Video" },
      { id: "image-to-video", label: "Image to Video" },
      { id: "video-to-video", label: "Video to Video" },
      { id: "video-editing", label: "Video Editing" },
      { id: "speech-to-video", label: "Speech to Video" },
      { id: "lip-sync", label: "Lip Sync" },
    ],
  },
  {
    id: "image-generation",
    label: "Image Generation",
    options: [
      { id: "text-to-image", label: "Text to Image" },
      { id: "image-to-image", label: "Image to Image" },
      { id: "image-editing", label: "Image Editing" },
    ],
  },
  {
    id: "music-generation",
    label: "Music Generation",
    options: [
      { id: "text-to-music", label: "Text to Music" },
      { id: "speech-to-text", label: "Speech to Text" },
      { id: "text-to-speech", label: "Text to Speech" },
      { id: "audio-to-audio", label: "Audio to Audio" },
    ],
  },
  {
    id: "chat",
    label: "Chat",
    options: [
      { id: "chat", label: "Chat" },
    ],
  },
];
