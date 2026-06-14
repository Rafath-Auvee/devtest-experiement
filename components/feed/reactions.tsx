import { ReactionType, REACTION_TYPES } from "@/lib/reactions";
import { Reaction } from "./types";

interface IconProps {
  size?: number;
}

/** Default inline SVG icons for each reaction (no external assets needed). */
function LikeIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#2078F4" aria-hidden>
      <path d="M2 21h3V10H2v11zm20-10.3c0-1-.8-1.8-1.8-1.8h-5.4l.8-3.9v-.2c0-.4-.2-.8-.4-1.1L14 2.5 7.6 8.9c-.4.4-.6.9-.6 1.4v8.5c0 1 .8 1.8 1.8 1.8h8.1c.7 0 1.4-.4 1.7-1.1l2.6-6.1c.1-.2.1-.5.1-.7v-2z" />
    </svg>
  );
}

function LoveIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#F33E58" aria-hidden>
      <path d="M12 21s-7.2-4.7-9.7-9.2C.6 8.4 2.3 4.8 5.9 4.8c2 0 3.3 1.2 4.1 2.4.8-1.2 2.1-2.4 4.1-2.4 3.6 0 5.3 3.6 3.6 7C19.2 16.3 12 21 12 21z" />
    </svg>
  );
}

function WowIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="#FFD93B" />
      <circle cx="8.4" cy="9.4" r="1.7" fill="#5A3B00" />
      <circle cx="15.6" cy="9.4" r="1.7" fill="#5A3B00" />
      <ellipse cx="12" cy="16" rx="2.6" ry="3.3" fill="#5A3B00" />
    </svg>
  );
}

function CryIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="#FFD93B" />
      <circle cx="8.3" cy="10" r="1.5" fill="#5A3B00" />
      <circle cx="15.7" cy="10" r="1.5" fill="#5A3B00" />
      <path d="M8 17c1.2-1.6 6.8-1.6 8 0" stroke="#5A3B00" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M6.6 11.5c0 1.8 1.1 3.4 1.1 3.4s1.1-1.6 1.1-3.4a1.1 1.1 0 0 0-2.2 0z" fill="#4AA8FF" />
    </svg>
  );
}

function AngryIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="#F0820F" />
      <path d="M6 8.5l4 1.8M18 8.5l-4 1.8" stroke="#5A3B00" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8.6" cy="11.4" r="1.5" fill="#5A3B00" />
      <circle cx="15.4" cy="11.4" r="1.5" fill="#5A3B00" />
      <path d="M8 17c1.2-1.6 6.8-1.6 8 0" stroke="#5A3B00" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export const REACTION_META: Record<
  ReactionType,
  { label: string; color: string; Icon: (p: IconProps) => React.JSX.Element }
> = {
  like: { label: "Like", color: "#2078F4", Icon: LikeIcon },
  love: { label: "Love", color: "#F33E58", Icon: LoveIcon },
  wow: { label: "Wow", color: "#F7B125", Icon: WowIcon },
  cry: { label: "Sad", color: "#F7B125", Icon: CryIcon },
  angry: { label: "Angry", color: "#F0820F", Icon: AngryIcon },
};

export const REACTION_ORDER = REACTION_TYPES;

interface ReactionSummaryProps {
  reactions: Reaction[];
  title?: string;
  size?: number;
  className?: string;
  countClassName?: string;
}

/** Stacked reaction icons + total count. */
export function ReactionSummary({
  reactions,
  title,
  size = 20,
  className = "_feed_inner_timeline_total_reacts_image",
  countClassName = "_feed_inner_timeline_total_reacts_para",
}: ReactionSummaryProps) {
  if (reactions.length === 0) return null;

  // Distinct reaction types present, most-common first.
  const counts = new Map<ReactionType, number>();
  for (const r of reactions) counts.set(r.type, (counts.get(r.type) ?? 0) + 1);
  const types = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);

  return (
    <div className={className} title={title} style={{ display: "flex", alignItems: "center" }}>
      {types.map((t, i) => {
        const Icon = REACTION_META[t].Icon;
        return (
          <span
            key={t}
            style={{
              display: "inline-flex",
              marginLeft: i === 0 ? 0 : -6,
              border: "2px solid #fff",
              borderRadius: "50%",
              background: "#fff",
              zIndex: types.length - i,
            }}
          >
            <Icon size={size} />
          </span>
        );
      })}
      <p className={countClassName} style={{ marginLeft: 6 }}>
        {reactions.length}
      </p>
    </div>
  );
}
