"use client";

import { useRef, useEffect, useState, useCallback } from "react";

interface CountUpProps {
  value: string;
  duration?: number;
  delay?: number;
}

function parseValue(value: string) {
  const match = value.match(/^([^\d]*)([\d.]+)([^\d]*)$/);
  if (!match) return null;
  return { prefix: match[1], number: parseFloat(match[2]), suffix: match[3] };
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function CountUp({ value, duration = 1800, delay = 0 }: CountUpProps) {
  const parsed = parseValue(value);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);
  const [display, setDisplay] = useState(parsed ? `${parsed.prefix}0${parsed.suffix}` : value);

  const animate = useCallback(() => {
    if (!parsed) return;
    const decimals = parsed.number.toString().split(".")[1]?.length ?? 0;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = eased * parsed.number;

      setDisplay(`${parsed.prefix}${current.toFixed(decimals)}${parsed.suffix}`);

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }, [parsed, duration]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !parsed) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [parsed, started]);

  useEffect(() => {
    if (!started) return;
    const timer = setTimeout(animate, delay);
    return () => clearTimeout(timer);
  }, [started, animate, delay]);

  return <span ref={ref}>{parsed ? display : value}</span>;
}
