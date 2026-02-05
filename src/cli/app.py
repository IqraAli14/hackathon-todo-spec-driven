"""Main CLI application loop."""

import shlex

from src.services.task_service import TaskService
from src.cli import commands


COMMAND_HANDLERS = {
    "add": commands.cmd_add,
    "list": commands.cmd_list,
    "done": commands.cmd_done,
    "undone": commands.cmd_undone,
    "update": commands.cmd_update,
    "delete": commands.cmd_delete,
    "help": commands.cmd_help,
}


def parse_input(user_input: str) -> list[str]:
    """Parse user input handling quoted strings."""
    try:
        return shlex.split(user_input)
    except ValueError:
        # Handle unclosed quotes gracefully
        return user_input.split()


def main() -> None:
    """Run the main CLI loop."""
    service = TaskService()

    print("Welcome to Todo Application!")
    print("Type 'help' for available commands.\n")

    while True:
        try:
            user_input = input("> ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nGoodbye!")
            break

        if not user_input:
            continue

        parts = parse_input(user_input)
        if not parts:
            continue

        command = parts[0].lower()
        args = parts[1:]

        if command in ("exit", "quit"):
            print("Goodbye!")
            break

        handler = COMMAND_HANDLERS.get(command)
        if handler:
            result = handler(service, args)
            print(result)
        else:
            print(f"Error: Unknown command '{command}'. Type 'help' for available commands.")


if __name__ == "__main__":
    main()
