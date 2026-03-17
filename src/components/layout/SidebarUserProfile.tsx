import Image from "next/image";

interface SidebarUserProfileProps {
  collapsed?: boolean;
  user: { name: string; email: string; avatarUrl?: string | null };
}

export default function SidebarUserProfile({ collapsed, user }: SidebarUserProfileProps) {
  const avatarSrc = user.avatarUrl
    || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff&size=80&bold=true`;

  const avatar = (
    <Image
      src={avatarSrc}
      alt={user.name}
      width={40}
      height={40}
      className="size-10 rounded-full object-cover"
    />
  );

  if (collapsed) {
    return (
      <div className="flex justify-center px-3 py-4">
        {avatar}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-5 pb-4">
      <div className="shrink-0">{avatar}</div>
      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-foreground">{user.name}</div>
        <div className="truncate text-xs text-muted-foreground">{user.email}</div>
      </div>
    </div>
  );
}
