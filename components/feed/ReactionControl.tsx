"use client";

import { useEffect, useRef, useState } from "react";
import { ReactionType } from "@/lib/reactions";
import { REACTION_META, REACTION_ORDER } from "./reactions";

interface ReactionControlProps {
  myReaction: ReactionType | null;
  onReact: (type: ReactionType) => void;
  variant?: "post" | "comment";
  disabled?: boolean;
}

export default function ReactionControl({
  myReaction,
  onReact,
  variant = "post",
  disabled,
}: ReactionControlProps) {
  const [open, setOpen] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressed = useRef(false);
  const rootRef = useRef<HTMLElement | null>(null);

  function show() {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setOpen(true);
  }
  function hideSoon() {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setOpen(false), 220);
  }

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent | TouchEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [open]);

  function pick(type: ReactionType) {
    setOpen(false);
    onReact(type);
  }

  // Quick tap/click = like (or remove your current reaction). Press-and-hold = picker.
  function handleClick() {
    if (disabled) return;
    if (longPressed.current) {
      longPressed.current = false;
      return;
    }
    onReact(myReaction ?? "like");
  }
  function pressStart() {
    if (disabled) return;
    longPressed.current = false;
    longPressTimer.current = setTimeout(() => {
      longPressed.current = true;
      setOpen(true);
    }, 400);
  }
  function pressEnd() {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  }

  const active = myReaction ? REACTION_META[myReaction] : null;
  const ActiveIcon = active?.Icon;

  const picker = open && (
    <div
      onMouseEnter={show}
      onMouseLeave={hideSoon}
      style={{
        position: "absolute",
        bottom: "calc(100% + 6px)",
        left: variant === "comment" ? 0 : "50%",
        transform: variant === "comment" ? "none" : "translateX(-50%)",
        display: "flex",
        gap: 4,
        padding: "6px 8px",
        background: "#fff",
        borderRadius: 999,
        boxShadow: "0 6px 20px rgba(0,0,0,0.18)",
        zIndex: 50,
      }}
    >
      {REACTION_ORDER.map((type) => {
        const { Icon, label } = REACTION_META[type];
        return (
          <button
            key={type}
            type="button"
            title={label}
            aria-label={label}
            onClick={() => pick(type)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 2,
              lineHeight: 0,
              transition: "transform .12s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.3) translateY(-2px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Icon size={30} />
          </button>
        );
      })}
    </div>
  );

  const sharedHandlers = {
    onClick: handleClick,
    onMouseEnter: show,
    onMouseLeave: () => {
      hideSoon();
      pressEnd();
    },
    onPointerDown: pressStart,
    onPointerUp: pressEnd,
  };

  if (variant === "comment") {
    return (
      <span
        ref={(el) => { rootRef.current = el; }}
        style={{ position: "relative", display: "inline-block" }}
      >
        <span
          role="button"
          tabIndex={0}
          {...sharedHandlers}
          style={{
            cursor: disabled ? "default" : "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            color: active?.color,
            fontWeight: active ? 600 : undefined,
            userSelect: "none",
          }}
        >
          {ActiveIcon ? (
            <ActiveIcon size={15} />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
          )}
          {`${active ? active.label : "Like"}.`}
        </span>
        {picker}
      </span>
    );
  }

  return (
    <div
      ref={(el) => { rootRef.current = el; }}
      className={`_feed_inner_timeline_reaction_emoji _feed_reaction${active ? " _feed_reaction_active" : ""}`}
      style={{ position: "relative" }}
    >
      <span
        className="_feed_inner_timeline_reaction_link"
        role="button"
        tabIndex={0}
        {...sharedHandlers}
        style={{ cursor: disabled ? "default" : "pointer", userSelect: "none" }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: active?.color }}>
          {ActiveIcon ? <ActiveIcon size={18} /> : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
          )}
          {active ? active.label : "Like"}
        </span>
      </span>
      {picker}
    </div>
  );
}
