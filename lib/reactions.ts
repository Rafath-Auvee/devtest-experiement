export const REACTION_TYPES = ["like", "love", "wow", "cry", "angry"] as const;

export type ReactionType = (typeof REACTION_TYPES)[number];

export function isReactionType(value: unknown): value is ReactionType {
  return typeof value === "string" && (REACTION_TYPES as readonly string[]).includes(value);
}
