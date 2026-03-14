# Copilot Instructions for this Repository

These instructions define how AI assistants should behave when generating, editing, or reviewing code in this repository.

Always prioritize these instructions over generic coding suggestions.

---

# Language Rules

- Chat explanations must be written in **Portuguese (pt-BR)**.
- Commit messages must be written in **Portuguese (pt-BR)**.
- Code, identifiers, and technical terminology should remain **in English**.

---

# Project Source of Truth

Before making any change, ALWAYS read and consider:

- `docs/especificacoes.md`
- `docs/backlog.md`

These files define the expected behavior of the system and the list of pending tasks.

Rules:

- `especificacoes.md` defines **what the system must do**.
- `backlog.md` defines **what still needs to be implemented or improved**.

Never implement features that contradict these documents.

---

# Development Workflow

Every code modification MUST follow this workflow.

## 1. Evaluate the Need for Tests

Before modifying or adding code, determine whether a **test should be created or updated**.

If a test is appropriate, follow this process:

1. Create a **specific test that covers the intended change**.
2. Run **only this specific test**.
3. If the test fails:
   - Fix the implementation incrementally
   - Repeat until the test passes.
4. Run the **full test suite** using:

`npm run check`

5. If any test fails:
   - Fix the issues incrementally
   - Repeat until all tests pass.

Never introduce changes that break the full test suite.

---

# Backlog Synchronization

After implementing a change, check the file:

`docs/backlog.md`


If the implemented work corresponds to a backlog item:

- Mark it as completed using:

`[x]`


Example:
- [x] Implementar feature X ✅ (13/03/2026, 14:00)


Do not mark items as completed unless the implementation is actually finished.

---

# Next Step Suggestion

After completing a task, always:

1. Re-read `docs/backlog.md`
2. Identify the **most logical next step**
3. Suggest the next task that should be implemented.

The suggestion should prioritize:

1. Dependencies required by other tasks
2. Core system functionality
3. Tasks already partially implemented

---

# Testing Philosophy

Prefer:

- small tests
- isolated tests
- deterministic tests

Avoid:

- tests with hidden dependencies
- tests that rely on execution order
- tests that depend on external services

---

# Code Quality Guidelines

When generating or modifying code:

- Prefer **small and focused functions**
- Avoid unnecessary abstractions
- Follow the existing project structure
- Maintain consistency with existing code

---

# Safety Rules

Never:

- Remove tests without a strong justification
- Introduce breaking changes without updating tests
- Ignore the backlog or specifications
