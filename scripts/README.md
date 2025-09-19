# Scripts Directory

This directory contains utility scripts for the AeroPredict project.

## Git Hooks Setup

### Quick Start
```bash
./scripts/setup-hooks.sh
```

### What it does
The `setup-hooks.sh` script installs Git hooks that enforce code quality and commit conventions:

- **pre-commit**: Runs before each commit to validate code
- **commit-msg**: Validates commit message format
- **pre-push**: Runs checks before pushing to remote repository

### For New Team Members
After cloning the repository, run:
```bash
./scripts/setup-hooks.sh
```

This ensures you follow the same code quality standards as the rest of the team.

### Hook Files
The actual hook files are stored in `scripts/hooks/` and are version-controlled, ensuring all team members use identical validation rules.