ALTER TABLE "pomodoro_sessions" ADD COLUMN "metadata" JSONB;

-- Add missing defaults for existing companies without replacing custom reference data.
INSERT INTO "task_statuses" ("id", "company_id", "name", "color", "order")
SELECT md5(c.id || ':task-status:' || defaults.name)::uuid::text,
       c.id, defaults.name, defaults.color, defaults.sort_order
FROM "companies" c
CROSS JOIN (VALUES
  ('Pending', '#64748b', 0),
  ('In Progress', '#3b82f6', 1),
  ('Completed', '#22c55e', 2)
) AS defaults(name, color, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM "task_statuses" s
  WHERE s.company_id = c.id AND lower(s.name) = lower(defaults.name)
);

INSERT INTO "task_priorities" ("id", "company_id", "name", "color", "level")
SELECT md5(c.id || ':task-priority:' || defaults.name)::uuid::text,
       c.id, defaults.name, defaults.color, defaults.level
FROM "companies" c
CROSS JOIN (VALUES
  ('Low', '#64748b', 1),
  ('Normal', '#3b82f6', 2),
  ('High', '#f59e0b', 3),
  ('Urgent', '#ef4444', 4)
) AS defaults(name, color, level)
WHERE NOT EXISTS (
  SELECT 1 FROM "task_priorities" p
  WHERE p.company_id = c.id AND lower(p.name) = lower(defaults.name)
);

INSERT INTO "employment_types" ("id", "company_id", "name")
SELECT md5(c.id || ':employment-type:' || defaults.name)::uuid::text, c.id, defaults.name
FROM "companies" c
CROSS JOIN (VALUES ('Full-time'), ('Part-time'), ('Contract')) AS defaults(name)
WHERE NOT EXISTS (
  SELECT 1 FROM "employment_types" e
  WHERE e.company_id = c.id AND lower(e.name) = lower(defaults.name)
);
