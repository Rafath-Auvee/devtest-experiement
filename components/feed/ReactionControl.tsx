"use client";

import { useRef, useState } from "react";
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
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function show() {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  }
  function hideSoon() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), 220);
  }

  function pick(type: ReactionType) {
    setOpen(false);
    onReact(type);
  }
  function handleMainClick() {
    // Tap toggles your current reaction off, or adds a default "like".
    onReact(myReaction ?? "like");
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

  if (variant === "comment") {
    return (
      <span
        style={{ position: "relative", display: "inline-block" }}
        onMouseEnter={show}
        onMouseLeave={hideSoon}
      >
        <span
          onClick={disabled ? undefined : handleMainClick}
          style={{ cursor: disabled ? "default" : "pointer", color: active?.color }}
        >
          {active ? active.label : "Like"}.
        </span>
        {picker}
      </span>
    );
  }

  return (
    <div
      onMouseEnter={show}
      onMouseLeave={hideSoon}
      className={`_feed_inner_timeline_reaction_emoji _feed_reaction${active ? " _feed_reaction_active" : ""}`}
      style={{ position: "relative" }}
    >
      <span
        className="_feed_inner_timeline_reaction_link"
        role="button"
        tabIndex={0}
        onClick={disabled ? undefined : handleMainClick}
        style={{ cursor: disabled ? "default" : "pointer" }}
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
