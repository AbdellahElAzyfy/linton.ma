"use client";

import { useEffect, useRef, useState } from "react";

export function Reveal({ as: Tag = "div", className = "", delay, children, ...props }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setVisible(true);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.08 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const classes = ["reveal", visible && "is-visible", className].filter(Boolean).join(" ");
  const style = delay ? { transitionDelay: `${delay}ms` } : undefined;

  return (
    <Tag ref={ref} className={classes} style={style} {...props}>
      {children}
    </Tag>
  );
}
