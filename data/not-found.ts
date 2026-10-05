export const NOT_FOUND_CONTENT = {
  code: "404",
  title: "Looks like this shot went out of bounds.",
  lines: [
    "The page you’re looking for isn’t on the course.",
    "Head back to the arena and get back in the game.",
  ],
  action: { label: "Back to the Arena", href: "/" },
} as const;
