export const GOAL = { title: "Improve the product experience", color: "#14b8a6" };

export interface ChangeRowProps {
  kind: "task" | "journal";
  title: string;
  day?: string;
}

export const CHANGES: Array<ChangeRowProps> = [
  { kind: "task", title: "Prepare a usability test", day: "Wed" },
  { kind: "task", title: "Review feedback", day: "Thu" },
  { kind: "journal", title: "Prioritizing user validation before expanding the redesign." },
];
