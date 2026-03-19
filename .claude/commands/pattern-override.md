---
description: Run before making a change that might conflict with an established Argo pattern. Compares the requested change against STYLE_GUIDE.md and active skills, surfaces any conflicts, and asks how to proceed. Use when something feels like it breaks a rule, or when Lovable or a teammate suggests a different approach.
argument-hint: [describe the change you want to make]
---

# Pattern Override Check

You want to make this change: **$ARGUMENTS**

Before proceeding, check if this conflicts with any established Argo pattern.

## Step 1 — Read the rules
Read these files in full:
- `STYLE_GUIDE.md`
- `.claude/commands/design-review.md`
- `.claude/commands/style-check.md`

## Step 2 — Identify conflicts
Compare the requested change against every rule. List every conflict found:

```
CONFLICT: [Rule name from STYLE_GUIDE.md or skill]
Current rule: [what the rule says]
Requested change: [what this would do differently]
Impact: [what breaks if we allow this]
```

If no conflicts: say "No conflicts found — safe to proceed" and stop.

## Step 3 — Present options for each conflict

For each conflict found, present exactly these three options:

**A — Update the rule**
> "Change STYLE_GUIDE.md and the relevant skill to allow this. The new pattern becomes the standard going forward."
> Impact: [what this means for existing components]

**B — One-off exception**
> "Proceed with this change without updating the rules. This is a deliberate exception, not a new standard."
> Risk: [what drift this might cause]

**C — Change the approach**
> "Find a way to achieve the goal that doesn't conflict with the existing rule."
> Suggestion: [alternative approach that fits the current rules]

## Step 4 — Wait for decision

Do not proceed until the user picks A, B, or C for each conflict.

If A is chosen:
- Update `STYLE_GUIDE.md` with the new rule
- Update the relevant skill (`.claude/commands/design-review.md` or `style-check.md`) to reflect the change
- Note the date of the override as a comment in the skill: `<!-- Updated [DATE]: [reason] -->`
- Then make the change

If B is chosen:
- Add an inline comment in the code: `// Pattern exception: [reason] — approved [DATE]`
- Make the change without touching the skill or style guide

If C is chosen:
- Propose the alternative approach and implement it

---

## Why this matters

Every time a pattern changes without updating the rules, the skills and style guide drift from reality. Over time nobody knows what the real rules are. This skill keeps STYLE_GUIDE.md as the actual source of truth — not just a document that gets ignored.
