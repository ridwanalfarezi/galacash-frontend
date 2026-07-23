# Agent Memory Manifest

This directory stores durable, source-grounded memory for the GalaCash
frontend. It deliberately separates four kinds of knowledge so an agent can
retrieve the right context without treating old notes as truth.

## Files

| File | Memory type | Read when |
| --- | --- | --- |
| `.ai/AGENTS.md` | operating policy | starting any implementation or review |
| `.ai/CONTEXT.md` | semantic facts and relationships | understanding architecture, domain, contracts, and blast radius |
| `.ai/DECISIONS.md` | rationale, constraints, and known mismatches | changing architecture or resolving contradictory guidance |
| `.ai/SKILLS.md` | procedural playbooks | performing a common task |

The repository-root `AGENTS.md` is the discovery hook that tells compatible
agents to load this directory.

## Memory rules

- Executable source and configuration outrank memory.
- A fact belongs in `.ai/CONTEXT.md` only when it is durable and
  evidence-backed.
- A decision belongs in `.ai/DECISIONS.md` with status and consequences.
- A procedure belongs in `.ai/SKILLS.md`; do not duplicate it as a fact.
- Work-in-progress, session notes, task status, and implementation history do
  not belong in semantic memory.
- Never copy secret values or personal data into memory.
- Use repository-relative paths as evidence.
- Keep memory project-independent: every cited file/folder must exist in this
  repository. Describe integrations through local contracts and adapters.
- Mark an uncertainty as `Open question`; never fill a gap with an assumption.

## Retrieval guide

| Task | Load |
| --- | --- |
| UI-only component change | `.ai/AGENTS.md`, relevant `.ai/CONTEXT.md` component/domain sections |
| route or role change | `.ai/AGENTS.md`, `.ai/CONTEXT.md` roles/auth/route map, `.ai/DECISIONS.md` |
| query/cache bug | `.ai/CONTEXT.md` data model, `.ai/SKILLS.md` stale-data playbook |
| API integration | `.ai/CONTEXT.md` API contract, `.ai/SKILLS.md` API-field playbook |
| financial workflow | all four files |
| new dependency or architecture | all four files |

## Source priority

```text
current code/config
  > tests
  > local generated API declaration
  > .ai semantic memory
  > README and historical notes
```

If a task reveals stale memory, repair the smallest relevant entry in the same
change.
