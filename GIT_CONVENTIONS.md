# Git Conventions and Rules

This document outlines the Git conventions and rules that are automatically enforced in this repository.

## Branch Naming Convention

All branches must follow this format: `module_name/feature_name`

### Examples:
- `frontend-web/fix-bug`
- `backend-node/add-auth`
- `frontend-app/user-profile`
- `backend-python/api-optimization`

### Rules:
- Use lowercase letters, numbers, and hyphens only
- Separate module name and feature name with a forward slash (`/`)
- Be descriptive but concise

## Commit Message Convention

All commit messages must follow this format: `type: description`

### Allowed Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries
- `ci`: Changes to CI configuration files and scripts
- `build`: Changes that affect the build system or external dependencies
- `perf`: A code change that improves performance

### Examples:
- `feat: add user login functionality`
- `fix: resolve database connection issue`
- `docs: update installation guide`
- `refactor: simplify user authentication logic`

### Rules:
- Keep the description under 50 characters for the first line
- Use present tense ("add" not "added")
- Don't capitalize the first letter of the description
- No period at the end

## Main Branch Protection

The `main` branch is protected with the following rules:

### Restrictions:
- **No direct commits** to the main branch
- **No direct pushes** to the main branch
- All changes must go through pull requests

### Workflow:
1. Create a feature branch: `git checkout -b module-name/feature-name`
2. Make your changes and commit with proper commit messages
3. Push your feature branch: `git push origin module-name/feature-name`
4. Create a pull request to merge into main
5. Wait for code review and approval
6. Merge through the pull request interface

## Automatic Enforcement

These rules are automatically enforced through Git hooks:

- **pre-commit**: Validates branch naming convention
- **commit-msg**: Validates commit message format
- **pre-push**: Prevents direct pushes to main branch

## Getting Started

When you clone this repository, the Git hooks are automatically active. You don't need to do any additional setup.

### Creating Your First Branch

```bash
# Clone the repository
git clone <repository-url>
cd git-rule-test-project

# Create a new branch for your work
git checkout -b frontend-web/my-feature

# Make your changes
# ...

# Commit with proper format
git commit -m "feat: add new component"

# Push your branch
git push origin frontend-web/my-feature

# Create pull request through GitHub/GitLab interface
```

## Common Errors and Solutions

### Invalid Branch Name
```
❌ Invalid branch name: 'my-feature'

Branch names must follow this format:
  module_name/feature_name

Examples:
  frontend-web/fix-bug
  backend-node/add-auth
```

**Solution**: Create a branch with the correct format: `git checkout -b module-name/feature-name`

### Invalid Commit Message
```
Invalid commit message format. Please use:
type: description

Types: feat, fix, docs, style, refactor, test, chore, ci, build, perf
```

**Solution**: Use the correct format: `git commit -m "feat: your description"`

### Direct Push to Main
```
❌ Direct pushes to the 'main' branch are not allowed!

Please use the following workflow:
1. Create a feature branch: git checkout -b module-name/feature-name
2. Make your changes and commit
3. Push your feature branch: git push origin module-name/feature-name
4. Create a pull request to merge into main
```

**Solution**: Follow the branching workflow and use pull requests.

## Questions?

If you have questions about these conventions or encounter issues, please:
1. Check this documentation first
2. Ask in the team chat
3. Create an issue in the repository