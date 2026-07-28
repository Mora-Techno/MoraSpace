# ROLE & OBJECTIVE

You are an Principal Frontend Engineer and UI/UX Architect specializing in high-performance B2B SaaS applications.
Your task is to build a visually stunning, responsive, and interactive "Owner Dashboard" (Company Command Center) for "Spaces"—an enterprise workspace and productivity platform.

# TECH STACK & LIBRARIES

1. Framework: Next.js (App Router) / React with TypeScript.
2. UI Component Library: shadcn/ui (using Tailwind CSS for styling).
3. Icons: Lucide React.
4. Charts & Analytics: Recharts.
5. Smooth Scrolling: Studio Freight Lenis (`@studio-freight/react-lenis` or `@studio-freight/lenis`).
6. Animations: GSAP (GreenSock Animation Platform) using `@gsap/react` hook (`useGSAP`) for memory-safe timeline animations.
7. Tailwind Variabel & Theme Provinder

# DESIGN SYSTEM & AESTHETICS

- Vibe: Executive, sleek, modern, clean, and highly professional (think Linear, Vercel, or Stripe dashboards).
- Layout: Asymmetrical Bento Grid layout to maximize information density without feeling cluttered.
- Visual Polish: Subtle glassmorphism, refined border grids (`border-border/40`), glowing accents for AI features, and clean typography.
- UI Language: Indonesian (for dashboard labels, titles, and mock data content).

# REQUIRED WIDGETS & FEATURES

Please build the dashboard with realistic, rich mock data featuring these exact 6 modules:

1. Executive KPI Summary Cards (Top Row)
   - 4 Stats Cards:
     a. Seat Utilization (e.g., "32 / 40 Seats", with a shadcn Progress bar).
     b. Company Productivity Rate (e.g., "88.4%", badge "+5.2% dari minggu lalu").
     c. Task Health Overview (e.g., "142 Active, 12 Overdue").
     d. Total Deep Work / Pomodoro Hours (e.g., "420 Jam minggu ini").

2. AI Executive Insights Banner (High-Priority Widget)
   - A distinct, visually highlighted callout card with subtle glowing borders or gradient background representing an AI Assistant briefing.
   - Content: Automated business insight (e.g., "🤖 AI Briefing: Tim Engineering mencapai efisiensi 92%, namun Tim Marketing mengalami bottleneck pada 3 campaign utama. Disarankan meninjau ulang beban meeting mingguan.").

3. Team & Department Analytics (Recharts Section)
   - Widget A (Bar/Area Chart): "Produktivitas per Divisi" comparing tasks completed vs. pending across Engineering, Product, Marketing, HR, and Finance.
   - Widget B (Donut/Pie Chart): "Distribusi Status Tugas" (Completed, In Progress, Review, Blocked) with a clean custom tooltip and legend.
   - Must use `<ResponsiveContainer width="100%" height={300}>` for Recharts to ensure responsiveness.

4. Financial & Subscription Status (Billing Widget)
   - Display: Current Plan ("Pro Tier - Yearly"), Renewal Date, Total Monthly Spend, and an action button `<Button variant="outline">Upgrade Plan</Button>`.

5. Actionable Governance / Pending Approvals
   - An interactive list of pending requests requiring the Owner's approval (e.g., Cuti bulanan, WFH request, Budget approval, Member invitation).
   - Include quick-action buttons: "Approve" (primary/green accent) and "Reject" (destructive/outline).

6. Live Company Activity Feed
   - A scrollable, timeline-style list of system and user audit logs (e.g., "Budi menyelesaikan milestone Fluxo App", "Siti mengundang 2 engineer baru").

# TECHNICAL & ANIMATION REQUIREMENTS (GSAP + LENIS)

1. Lenis Setup: Wrap the dashboard view or main container with Lenis to ensure ultra-smooth inertia scrolling across the executive dashboard.
2. GSAP Entrance Animations:
   - Use the `useGSAP` hook from `@gsap/react`.
   - Create a timeline (`gsap.timeline()`) that animates the layout on initial load.
   - The KPI cards and Bento Grid items must enter using a `stagger` effect (e.g., `from({ opacity: 0, y: 30, scale: 0.98 })` to `to({ opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" })`).
   - Assign a specific ref or class selector (e.g., `.gsap-widget`) to all card containers for clean staggering.
3. Memory Management: Ensure all GSAP animations are properly scoped within `useGSAP` to prevent React re-render memory leaks.
4. Component Structure: Write clean, modular code. Implement proper TypeScript interfaces for all mock data structures. Use standard shadcn components (`Card`, `CardHeader`, `CardTitle`, `CardContent`, `Button`, `Badge`, `Avatar`, `Progress`, `Separator`).

# OUTPUT EXPECTATION

Generate the complete, functional, and clean TypeScript React code for this Owner Dashboard page. The code should be ready to paste and render immediately with mock data included.
