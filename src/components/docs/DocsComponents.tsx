"use client";

import Link from "next/link";

export function Section({
  id,
  icon: Icon,
  title,
  children,
}: {
  id: string;
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="size-4 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function SubSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-20 space-y-4 pl-1">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {children}
    </div>
  );
}

export function Step({
  n,
  title,
  desc,
}: {
  n: number;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
        {n}
      </div>
      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

export function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-md bg-accent px-1.5 py-0.5 font-mono text-[13px] text-foreground">
      {children}
    </code>
  );
}

export function ParamRow({
  name,
  type,
  required,
  desc,
}: {
  name: string;
  type: string;
  required?: boolean;
  desc: string;
}) {
  return (
    <tr className="border-b border-border">
      <td className="py-3 pr-4">
        <InlineCode>{name}</InlineCode>
        {required && (
          <span className="ml-2 text-xs text-red-400">*</span>
        )}
      </td>
      <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">
        {type}
      </td>
      <td className="py-3 text-sm text-muted-foreground">{desc}</td>
    </tr>
  );
}

export function ErrorRow({
  code,
  name,
  desc,
}: {
  code: number;
  name: string;
  desc: string;
}) {
  return (
    <tr className="border-b border-border">
      <td className="py-3 pr-4 font-mono text-sm text-foreground">{code}</td>
      <td className="py-3 pr-4 text-sm font-medium text-foreground">{name}</td>
      <td className="py-3 text-sm text-muted-foreground">{desc}</td>
    </tr>
  );
}

export function EndpointHeader({
  method,
  path,
}: {
  method: string;
  path: string;
}) {
  const color = method === "GET" ? "bg-blue-500/20 text-blue-400" : "bg-green-500/20 text-green-400";
  return (
    <div className="flex items-center gap-3 border-b border-border bg-background-secondary px-4 py-3">
      <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${color}`}>
        {method}
      </span>
      <code className="font-mono text-sm text-foreground">{path}</code>
    </div>
  );
}

export function NoteBox({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
      <p className="text-sm font-medium text-amber-400">{title}</p>
      {children}
    </div>
  );
}

export function LinkButton({
  href,
  icon: Icon,
  children,
  variant = "primary",
}: {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const cls =
    variant === "primary"
      ? "bg-primary text-primary-foreground hover:bg-primary/90"
      : "border border-border text-foreground hover:bg-accent";
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${cls}`}
    >
      <Icon className="size-4" />
      {children}
    </Link>
  );
}
