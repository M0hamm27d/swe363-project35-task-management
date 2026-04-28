function daysFromNow(n, hour = 9) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(hour, 0, 0, 0);
  // Manual formatting to ensure local time representation without UTC shift
  const pad = (num) => String(num).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`;
}

const mockTasks = [
  {
    id: 1,
    title: "Design the homepage layout",
    description: "Create wireframes and high-fidelity mockups for the main landing page. Cover desktop, tablet, and mobile breakpoints.",
    tag: { name: "UI Design", color: "#3a90c8" },
    status: "green",
    startDate: daysFromNow(-5),
    deadline: daysFromNow(-2),
    estimatedFinish: { days: 0, hours: 3, minutes: 30 },
    progress: 80,
    completed: false,
    isVisible: true,
    workspaceId: "personal",
  },
  {
    id: 2,
    title: "Fix navigation routing bug",
    description: "Investigate the broken deep-link routes on the /workspace page and patch the React Router config.",
    tag: { name: "Dev", color: "#3da85e" },
    status: "orange",
    startDate: daysFromNow(-2),
    deadline: "2026-04-14T14:30",
    estimatedFinish: { days: 1, hours: 2, minutes: 0 },
    progress: 45,
    completed: false,
    isVisible: true,
    workspaceId: "personal",
  },
  {
    id: 3,
    title: "Write the project final report",
    description: "Document all implemented features, design decisions, and lessons learned for the semester submission.",
    tag: { name: "Docs", color: "#c9a83c" },
    status: "red",
    startDate: daysFromNow(-1),
    deadline: daysFromNow(3),
    estimatedFinish: { days: 5, hours: 0, minutes: 0 },
    progress: 20,
    completed: false,
    isVisible: true,
    workspaceId: "personal",
  },
  {
    id: 4,
    title: "Review pull requests",
    description: "Go through open PRs on the main repo, leave review comments, and approve or request changes.",
    tag: { name: 'Design', color: '#a5d6ff' },
    status: "green",
    startDate: daysFromNow(0),
    deadline: daysFromNow(0),
    estimatedFinish: { days: 0, hours: 0, minutes: 45 },
    progress: 100,
    completed: false,
    isVisible: true,
    workspaceId: "personal",
  },
  {
    id: 5,
    title: "Update the database schema",
    description: "Add new columns for user preferences and migrate existing rows. Write a rollback script.",
    tag: { name: "Backend", color: "#8a4fd4" },
    status: "orange",
    startDate: daysFromNow(0),
    deadline: daysFromNow(4),
    estimatedFinish: { days: 3, hours: 0, minutes: 0 },
    progress: 0,
    completed: false,
    isVisible: true,
    workspaceId: "marketing",
  },
  {
    id: 6,
    title: "Test user authentication flow",
    description: "Run end-to-end tests for sign-up, login, password reset, and OAuth. Document any edge-case failures.",
    tag: { name: "Dev", color: "#3da85e" },
    status: "green",
    startDate: daysFromNow(-4),
    deadline: daysFromNow(-1),
    estimatedFinish: { days: 0, hours: 5, minutes: 0 },
    progress: 90,
    completed: false,
    isVisible: true,
    workspaceId: "dev",
  },
  {
    id: 7,
    title: "Create API docs",
    description: "Write comprehensive OpenAPI/Swagger docs for all REST endpoints including request/response examples.",
    tag: { name: "Docs", color: "#c9a83c" },
    status: "orange",
    startDate: daysFromNow(0),
    deadline: daysFromNow(14),
    estimatedFinish: { days: 7, hours: 0, minutes: 0 },
    progress: 30,
    completed: false,
    isVisible: true,
    workspaceId: "dev",
  },
  {
    id: 8,
    title: "Setup CI/CD pipeline",
    description: "Configure GitHub Actions to run lint, tests, and deploy to staging on every pull request merge.",
    tag: { name: "Backend", color: "#8a4fd4" },
    status: "red",
    startDate: daysFromNow(-1),
    deadline: daysFromNow(0),
    estimatedFinish: { days: 1, hours: 6, minutes: 30 },
    progress: 10,
    completed: false,
    isVisible: true,
    workspaceId: "marketing",
  },
];

export const mockWorkspaces = [
  {
    id: "personal",
    name: "Personal Space",
    color: "#1e4db7",
    description: "Your private planning environment. Only you have access to these tasks.",
    members: ["You", "Mohammed Alzaid", "Elyas Alamri", "Rayan Alotaibi", "Faris Alqahtani", "Noura Alshaikh"],
  },
  {
    id: "marketing",
    name: "Marketing Team",
    color: "#8a4fd4",
    description: "Launch campaigns, SEO tasks, and content schedules.",
    members: ["Sarah Jenkins", "Mark Johnson", "Emma Davis", "Chloe Smith", "Tom Hank"],
  },
  {
    id: "dev",
    name: "Dev Team",
    color: "#3da85e",
    description: "Sprint tasks, core infrastructure, and bug tracking.",
    members: ["Alex Chen", "You", "David Miller", "Rachel Zane", "Harvey Specter", "Mike Ross"],
  },
  {
    id: "uiux",
    name: "UI / UX Design",
    color: "#3a90c8",
    description: "Figma handoffs, user testing, and interactive prototypes.",
    members: ["Maria Garcia", "You", "Liam Neeson"],
  },
  {
    id: "alpha",
    name: "Alpha Project Leads",
    color: "#d94a4a",
    description: "High-level strategic planning and cross-team coordination.",
    members: ["David Miller", "Sarah Jenkins", "Alex Chen"],
  }
];

export const mockInvites = [
  {
    id: "ws-invite-1",
    name: "Design System V2",
    color: "#e63946",
    leader: "Chris Evans",
    memberCount: 4,
  },
  {
    id: "ws-invite-2",
    name: "Q3 Marketing Launch",
    color: "#f4a261",
    leader: "Anna Williams",
    memberCount: 12,
  }
];

export default mockTasks;
