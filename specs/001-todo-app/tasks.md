# Tasks: In-Memory Console Todo Application

**Input**: Design documents from `/specs/001-todo-app/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓

**Tests**: Not explicitly requested in spec. Manual testing via quickstart.md.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, etc.)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root (per plan.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

**Mapped Requirements**: FR-012 (in-memory storage)

- [x] T001 Create project directory structure: src/, src/models/, src/services/, src/cli/, tests/
- [x] T002 [P] Create package markers: src/__init__.py, src/models/__init__.py, src/services/__init__.py, src/cli/__init__.py
- [x] T003 [P] Create entry point src/__main__.py with minimal main() stub

**Checkpoint**: Project structure ready for implementation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core components that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

**Mapped Requirements**: FR-002, FR-003, FR-012, FR-013, FR-014

- [x] T004 Create Task dataclass in src/models/task.py with fields: id (int), title (str), description (str), completed (bool)
- [x] T005 Create TaskService class in src/services/task_service.py with _tasks list and _next_id counter
- [x] T006 Implement TaskService._get_task_by_id() helper method in src/services/task_service.py
- [x] T007 Create display module src/cli/display.py with format_task() and format_task_list() functions
- [x] T008 Create CLI app skeleton src/cli/app.py with main loop, prompt, and command routing structure
- [x] T009 Implement input parsing with shlex.split() in src/cli/app.py for quoted string handling
- [x] T010 Implement ID validation helper in src/cli/commands.py (positive integer check)
- [x] T011 Implement title validation helper in src/cli/commands.py (non-empty, strip whitespace)

**Checkpoint**: Foundation ready - user story implementation can begin

---

## Phase 3: User Story 1 - Add a New Task (Priority: P1) 🎯 MVP

**Goal**: Users can add tasks with title and optional description

**Independent Test**: Launch app → `add "Test task"` → `list` → verify task appears with ID 1

**Mapped Requirements**: FR-001, FR-002, FR-003, FR-014

### Implementation for User Story 1

- [x] T012 [US1] Implement TaskService.add_task(title, description="") in src/services/task_service.py
- [x] T013 [US1] Add title validation (strip, non-empty check) in TaskService.add_task()
- [x] T014 [US1] Implement add command handler in src/cli/commands.py calling TaskService.add_task()
- [x] T015 [US1] Wire 'add' command to handler in src/cli/app.py command routing
- [x] T016 [US1] Display success message "Task {id} created: {title}" after add in src/cli/commands.py
- [x] T017 [US1] Display error "Error: Title cannot be empty" for empty/whitespace title

**Checkpoint**: US1 complete - can add tasks and see confirmation

---

## Phase 4: User Story 2 - View Task List (Priority: P1) 🎯 MVP

**Goal**: Users can see all tasks with ID, title, and status

**Independent Test**: Add 2-3 tasks → `list` → verify all shown with correct format

**Mapped Requirements**: FR-004, FR-010

### Implementation for User Story 2

- [x] T018 [US2] Implement TaskService.list_tasks() returning list[Task] sorted by ID in src/services/task_service.py
- [x] T019 [US2] Implement list command handler in src/cli/commands.py calling TaskService.list_tasks()
- [x] T020 [US2] Wire 'list' command to handler in src/cli/app.py command routing
- [x] T021 [US2] Format task list with columns: ID, Status ([x]/[ ]), Title in src/cli/display.py
- [x] T022 [US2] Display "No tasks yet. Add one to get started!" when list is empty

**Checkpoint**: US2 complete - can view all tasks in formatted list

---

## Phase 5: User Story 3 - Mark Task Complete/Incomplete (Priority: P2)

**Goal**: Users can toggle task completion status

**Independent Test**: Add task → `done 1` → `list` → verify [x] status → `undone 1` → verify [ ] status

**Mapped Requirements**: FR-005, FR-006, FR-010, FR-013

### Implementation for User Story 3

- [x] T023 [US3] Implement TaskService.mark_complete(task_id) in src/services/task_service.py
- [x] T024 [US3] Implement TaskService.mark_incomplete(task_id) in src/services/task_service.py
- [x] T025 [US3] Implement done command handler in src/cli/commands.py with ID validation
- [x] T026 [US3] Implement undone command handler in src/cli/commands.py with ID validation
- [x] T027 [US3] Wire 'done' and 'undone' commands to handlers in src/cli/app.py
- [x] T028 [US3] Display "Task {id} marked complete/incomplete" confirmation
- [x] T029 [US3] Display "Error: Task {id} not found" when ID doesn't exist

**Checkpoint**: US3 complete - can toggle task status

---

## Phase 6: User Story 4 - Update Task Details (Priority: P3)

**Goal**: Users can modify task title and description

**Independent Test**: Add task → `update 1 "New title" "New desc"` → `list` → verify changes

**Mapped Requirements**: FR-007, FR-008, FR-010, FR-013, FR-014

### Implementation for User Story 4

- [x] T030 [US4] Implement TaskService.update_task(task_id, title, description=None) in src/services/task_service.py
- [x] T031 [US4] Add title validation in TaskService.update_task() (non-empty required)
- [x] T032 [US4] Implement update command handler in src/cli/commands.py with ID and title validation
- [x] T033 [US4] Wire 'update' command to handler in src/cli/app.py
- [x] T034 [US4] Display "Task {id} updated" confirmation
- [x] T035 [US4] Display appropriate error for not found or empty title

**Checkpoint**: US4 complete - can update task details

---

## Phase 7: User Story 5 - Delete Task (Priority: P3)

**Goal**: Users can remove tasks from the list

**Independent Test**: Add 3 tasks → `delete 2` → `list` → verify only tasks 1, 3 remain → add new → verify gets ID 4

**Mapped Requirements**: FR-009, FR-003, FR-010, FR-013

### Implementation for User Story 5

- [x] T036 [US5] Implement TaskService.delete_task(task_id) returning bool in src/services/task_service.py
- [x] T037 [US5] Ensure _next_id is NOT decremented after delete (ID never reused)
- [x] T038 [US5] Implement delete command handler in src/cli/commands.py with ID validation
- [x] T039 [US5] Wire 'delete' command to handler in src/cli/app.py
- [x] T040 [US5] Display "Task {id} deleted" confirmation
- [x] T041 [US5] Display "Error: Task {id} not found" when ID doesn't exist

**Checkpoint**: US5 complete - can delete tasks, IDs never reused

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Help system, exit handling, final integration

**Mapped Requirements**: FR-011, FR-015, FR-010

- [x] T042 Implement help command showing all available commands in src/cli/commands.py
- [x] T043 Wire 'help' command to handler in src/cli/app.py
- [x] T044 Implement exit/quit command to gracefully terminate in src/cli/app.py
- [x] T045 Display "Goodbye!" message on exit
- [x] T046 Handle unknown commands with "Error: Unknown command. Type 'help' for available commands."
- [x] T047 Handle empty input (re-prompt without error)
- [x] T048 Make commands case-insensitive in src/cli/app.py
- [x] T049 Add welcome message on application start
- [x] T050 Validate all error messages match spec edge cases
- [x] T051 Run quickstart.md scenarios manually to verify all features work

**Checkpoint**: All features complete and validated

---

## Dependencies & Execution Order

### Phase Dependencies

```text
Phase 1 (Setup) ──► Phase 2 (Foundational) ──┬──► Phase 3 (US1: Add)
                                              │
                                              ├──► Phase 4 (US2: List)
                                              │
                                              └──► [US1+US2 = MVP]
                                                        │
                                                        ▼
                                              Phase 5 (US3: Complete/Incomplete)
                                                        │
                                                        ▼
                                              Phase 6 (US4: Update)
                                                        │
                                                        ▼
                                              Phase 7 (US5: Delete)
                                                        │
                                                        ▼
                                              Phase 8 (Polish)
```

### User Story Dependencies

| Story | Depends On | Can Parallel With |
|-------|------------|-------------------|
| US1 (Add) | Phase 2 only | US2 (shared model) |
| US2 (List) | Phase 2 only | US1 (shared model) |
| US3 (Complete) | US1, US2 (need tasks to mark) | - |
| US4 (Update) | US1, US2 (need tasks to update) | US3, US5 |
| US5 (Delete) | US1, US2 (need tasks to delete) | US3, US4 |

### Within Each User Story

1. Service method implementation first
2. CLI command handler second
3. Wire to app routing third
4. Success/error messages last

---

## Implementation Strategy

### MVP First (US1 + US2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: US1 (Add Task)
4. Complete Phase 4: US2 (View List)
5. **STOP and VALIDATE**: Can add tasks and view them
6. Demo MVP if needed

### Full Delivery

1. MVP (above)
2. Phase 5: US3 (Mark Complete/Incomplete)
3. Phase 6: US4 (Update Task)
4. Phase 7: US5 (Delete Task)
5. Phase 8: Polish (Help, Exit, Edge Cases)
6. Final validation with quickstart.md

---

## Task Summary

| Phase | Story | Tasks | Parallel Opportunities |
|-------|-------|-------|------------------------|
| 1 | Setup | T001-T003 | T002, T003 can parallel |
| 2 | Foundational | T004-T011 | None (sequential deps) |
| 3 | US1 (Add) | T012-T017 | None (sequential) |
| 4 | US2 (List) | T018-T022 | None (sequential) |
| 5 | US3 (Complete) | T023-T029 | T023, T024 can parallel |
| 6 | US4 (Update) | T030-T035 | None (sequential) |
| 7 | US5 (Delete) | T036-T041 | None (sequential) |
| 8 | Polish | T042-T051 | T042-T049 mostly parallel |

**Total Tasks**: 51
**MVP Tasks**: T001-T022 (22 tasks)
**Full Implementation**: All 51 tasks

---

## Requirement Traceability

| Requirement | Tasks |
|-------------|-------|
| FR-001 (Add task) | T012-T017 |
| FR-002 (Sequential ID) | T004, T005, T012 |
| FR-003 (No ID reuse) | T005, T037 |
| FR-004 (Display tasks) | T018-T022 |
| FR-005 (Mark complete) | T023, T025 |
| FR-006 (Mark incomplete) | T024, T026 |
| FR-007 (Update title) | T030-T035 |
| FR-008 (Update description) | T030-T035 |
| FR-009 (Delete task) | T036-T041 |
| FR-010 (Error messages) | T017, T022, T029, T035, T041, T046 |
| FR-011 (Exit) | T044, T045 |
| FR-012 (In-memory) | T001, T005 |
| FR-013 (ID validation) | T010, T025, T026, T032, T038 |
| FR-014 (Title validation) | T011, T013, T031 |
| FR-015 (Help) | T042, T043 |

---

## Notes

- All tasks trace to spec requirements (see traceability table)
- No external dependencies (stdlib only per constitution)
- No persistence (in-memory per Phase I scope)
- Each story independently testable after its phase completes
- Commit after each phase completion recommended
