interface FilterTagProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export default function FilterTag({ label, isActive, onClick }: FilterTagProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
        isActive
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground hover:bg-muted-hover hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}
