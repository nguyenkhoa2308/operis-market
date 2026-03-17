import Image from "next/image";
import Link from "next/link";
import type { Model } from "@/types/market";

interface ModelCardProps {
  model: Model;
}

export default function ModelCard({ model }: ModelCardProps) {
  return (
    <Link
      href={`/${model.slug}`}
      className="group relative flex aspect-[4/3] overflow-hidden rounded-xl transition-transform duration-200 hover:scale-[1.02]"
    >
      {/* Background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${model.gradient}`}
      >
        {model.image && (
          <Image
            src={model.image}
            alt={model.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        )}
      </div>

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Badge */}
      {model.isNew && (
        <span className="absolute right-3 top-3 rounded-md bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
          Mới
        </span>
      )}
      {model.isPopular && !model.isNew && (
        <span className="absolute right-3 top-3 rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
          Phổ biến
        </span>
      )}

      {/* Content overlay — bottom */}
      <div className="relative mt-auto w-full p-4">
        <span className="text-xs font-medium text-white/70">
          {model.provider}
        </span>
        <h3 className="mt-0.5 text-sm font-bold text-white">
          {model.name}
        </h3>

        {/* Task Tags */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {model.taskTags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-white/15 px-2 py-0.5 text-[11px] font-medium capitalize text-white/90 backdrop-blur-sm"
            >
              {tag.replace(/-/g, " ")}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
