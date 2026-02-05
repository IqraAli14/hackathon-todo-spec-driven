<!--
  Sync Impact Report
  ===================
  Version change: 0.0.0 → 1.0.0 (MAJOR - initial constitution)

  Added Principles:
  - I. Spec-Driven Development Only
  - II. No Manual Code Writing
  - III. Python Best Practices
  - IV. Simplicity Over Cleverness
  - V. CLI Usability
  - VI. Clear Acceptance Criteria
  - VII. Incremental Task IDs
  - VIII. Phase I Scope Enforcement
  - IX. Hackathon II Compliance

  Added Sections:
  - Core Principles (9 principles)
  - Technical Constraints
  - Development Workflow
  - Governance

  Removed Sections: N/A (initial creation)

  Templates Status:
  - .specify/templates/plan-template.md ✅ Compatible (Constitution Check section exists)
  - .specify/templates/spec-template.md ✅ Compatible (acceptance criteria aligned)
  - .specify/templates/tasks-template.md ✅ Compatible (phase structure compatible)
  - .specify/templates/phr-template.prompt.md ✅ Compatible (no constitution dependencies)

  Follow-up TODOs: None
-->

# Hackathon II Todo Application Constitution

## Core Principles

### I. Spec-Driven Development Only

All implementation MUST originate from approved specifications. Code generation is ONLY permitted via the `/sp.implement` command after specs pass review.

- Features MUST be defined in `specs/<feature>/spec.md` before any implementation
- Implementation plans MUST exist in `specs/<feature>/plan.md` before task generation
- Tasks MUST be generated via `/sp.tasks` before execution
- Direct code writing without spec approval is PROHIBITED

**Rationale**: Ensures traceability, prevents scope creep, and maintains hackathon compliance.

### II. No Manual Code Writing

Code MUST be generated exclusively through the SpecKitPlus workflow. Manual coding bypasses quality gates and violates hackathon rules.

- All code changes MUST trace back to a task in `tasks.md`
- Code MUST be generated via `/sp.implement` command execution
- Ad-hoc fixes MUST go through spec amendment first
- Copy-paste from external sources MUST be documented in spec

**Rationale**: Hackathon grading requires demonstrable spec-driven process; manual code is non-compliant.

### III. Python Best Practices

All generated code MUST follow Python community standards and idioms.

- Python 3.13+ features MUST be used where beneficial
- PEP 8 style guidelines MUST be followed
- Type hints SHOULD be included for function signatures
- Docstrings MUST follow Google or NumPy style
- Imports MUST be organized: stdlib, third-party, local

**Rationale**: Ensures maintainable, readable code that follows industry standards.

### IV. Simplicity Over Cleverness

Choose the straightforward solution over the elegant but complex one.

- YAGNI (You Aren't Gonna Need It) MUST be enforced
- No premature optimization
- No unnecessary abstractions for single-use cases
- Flat is better than nested
- Explicit is better than implicit

**Rationale**: Phase I is a foundation; complexity increases maintenance burden and risk.

### V. CLI Usability

The command-line interface MUST be intuitive and user-friendly.

- Commands MUST have clear, memorable names
- Output MUST be human-readable with consistent formatting
- Error messages MUST be actionable and helpful
- Help text MUST be available for all commands
- Input validation MUST provide immediate feedback

**Rationale**: User experience is critical for a console application's success.

### VI. Clear Acceptance Criteria

Every feature and task MUST have testable acceptance criteria.

- User stories MUST follow Given-When-Then format
- Success criteria MUST be measurable
- Edge cases MUST be explicitly documented
- Error scenarios MUST be specified
- Acceptance tests MUST be executable

**Rationale**: Enables objective completion verification and prevents ambiguous requirements.

### VII. Incremental Task IDs

Task identifiers MUST be positive integers assigned sequentially.

- IDs MUST start at 1 and increment by 1
- IDs MUST NOT be reused after deletion
- IDs MUST be unique within the application lifetime
- ID generation MUST be deterministic and predictable

**Rationale**: Provides simple, user-friendly task references for CLI interaction.

### VIII. Phase I Scope Enforcement

Implementation MUST be strictly limited to Phase I boundaries.

**ALLOWED**:
- Python 3.13+ standard library only
- Console/CLI interface
- In-memory data structures (list, dict, dataclass)
- Single-user operation
- Basic CRUD operations
- Status toggling (complete/incomplete)

**PROHIBITED**:
- Database integration
- File persistence
- Web frameworks or APIs
- AI/ML features
- Multi-user support
- External dependencies beyond stdlib
- Network operations

**Rationale**: Phase I establishes a clean foundation; scope creep risks hackathon timeline.

### IX. Hackathon II Compliance

All artifacts and processes MUST comply with Hackathon II grading criteria.

- Spec-driven workflow MUST be demonstrable
- PHR (Prompt History Records) MUST be created for all interactions
- Git commits MUST reference tasks
- Documentation MUST be current
- Process MUST be auditable end-to-end

**Rationale**: Compliance is mandatory for hackathon success and grading.

## Technical Constraints

### Stack Requirements

| Component | Requirement |
|-----------|-------------|
| Language | Python 3.13+ |
| Interface | Console/CLI (stdin/stdout) |
| Storage | In-memory only |
| Dependencies | Standard library only |
| Users | Single user |
| Platform | Cross-platform (Linux/macOS/Windows) |

### Data Model Constraints

- Tasks stored in Python data structures (list/dict/dataclass)
- No persistence between application runs
- Task schema: id (int), title (str), description (str, optional), completed (bool)
- ID counter maintained as module-level or class state

### CLI Requirements

- Menu-driven or command-based interaction
- Clear prompts for user input
- Formatted output for task lists
- Graceful handling of invalid input
- Exit command available

## Development Workflow

### Required Sequence

1. **Constitution** → `/sp.constitution` (this document)
2. **Specification** → `/sp.specify` (feature requirements)
3. **Clarification** → `/sp.clarify` (if ambiguities exist)
4. **Planning** → `/sp.plan` (architecture decisions)
5. **Task Generation** → `/sp.tasks` (implementation tasks)
6. **Implementation** → `/sp.implement` (code generation)
7. **Commit** → `/sp.git.commit_pr` (version control)

### Quality Gates

- [ ] Constitution ratified before spec creation
- [ ] Spec approved before planning
- [ ] Plan approved before task generation
- [ ] Tasks approved before implementation
- [ ] All acceptance criteria met before commit
- [ ] PHR created for each significant interaction

### Prohibited Actions

- Writing code before `/sp.implement`
- Skipping workflow steps
- Implementing features not in spec
- Adding scope during implementation
- Committing without task reference

## Governance

### Amendment Process

1. Propose change with rationale
2. Assess impact on existing artifacts
3. Update constitution version per semantic versioning
4. Propagate changes to dependent templates
5. Document in PHR

### Version Policy

- **MAJOR**: Breaking changes to principles or workflow
- **MINOR**: New principles or expanded guidance
- **PATCH**: Clarifications and typo fixes

### Compliance Review

- All PRs MUST verify constitution compliance
- Violations MUST be corrected before merge
- Exceptions require documented justification
- Constitution supersedes all other guidance

**Version**: 1.0.0 | **Ratified**: 2026-02-04 | **Last Amended**: 2026-02-04
