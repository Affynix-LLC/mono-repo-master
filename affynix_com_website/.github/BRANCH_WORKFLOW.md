# Branch Workflow Guide

## Branch Structure

This repository follows a Git Flow branching strategy with the following structure:

```zsh
main                    → Production deployments only
├── staging             → Pre-production testing
├── development         → Active development work
└── feature/*           → Feature branches (merged to development)
```

## Branch Descriptions

### `main` Branch

- **Purpose**: Production-ready code only
- **Protection**: Requires pull request reviews and CI/CD checks
- **Deployment**: Automatically deploys to production
- **Merges**: Only from `staging` branch via pull request

### `staging` Branch

- **Purpose**: Pre-production testing and QA
- **Protection**: Requires pull request reviews
- **Deployment**: Deploys to staging environment
- **Merges**: Only from `development` branch via pull request

### `development` Branch

- **Purpose**: Active development integration
- **Protection**: Requires pull request reviews
- **Deployment**: Deploys to development environment
- **Merges**: From feature branches and to `staging`

### `feature/*` Branches

- **Purpose**: Individual feature development
- **Naming**: `feature/description-of-feature`
- **Merges**: Into `development` branch via pull request
- **Lifecycle**: Deleted after merge

## Workflow Process

### 1. Starting New Work

```bash
# Always start from development
git checkout development
git pull origin development
git checkout -b feature/your-feature-name
```

### 2. Development Process

- Work on your feature branch
- Commit frequently with descriptive messages
- Push regularly to backup your work
- Keep your branch up to date with development

### 3. Completing Features

```bash
# Update your branch with latest development
git checkout development
git pull origin development
git checkout feature/your-feature-name
git merge development

# Push and create pull request
git push origin feature/your-feature-name
```

### 4. Merging to Development

- Create pull request from `feature/*` to `development`
- Request code review
- Address feedback
- Merge after approval

### 5. Promoting to Staging

- Create pull request from `development` to `staging`
- Deploy to staging environment for testing
- Perform QA and testing

### 6. Production Release

- Create pull request from `staging` to `main`
- Deploy to production
- Tag the release

## Branch Protection Rules

### Main Branch

- Require pull request reviews (2 reviewers)
- Require status checks to pass
- Require branches to be up to date
- Restrict pushes to main branch
- Require linear history

### Staging Branch

- Require pull request reviews (1 reviewer)
- Require status checks to pass
- Restrict pushes to staging branch

### Development Branch

- Require pull request reviews (1 reviewer)
- Require status checks to pass
- Restrict pushes to development branch

## Best Practices

1. **Never push directly to main, staging, or development**
2. **Always create feature branches from development**
3. **Keep feature branches small and focused**
4. **Write descriptive commit messages**
5. **Update your branch before creating pull requests**
6. **Delete feature branches after merging**
7. **Use conventional commit messages**

## Emergency Hotfixes

For critical production issues:

```bash
# Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-issue-description

# Make minimal fix and test
# Create pull request to main
# After merge, also merge to development and staging
```

## Environment Deployments

- **Development**: Auto-deploys from `development` branch
- **Staging**: Auto-deploys from `staging` branch
- **Production**: Auto-deploys from `main` branch

## Getting Help

If you have questions about the workflow:

1. Check this documentation
2. Ask in the team chat
3. Create an issue for workflow improvements
