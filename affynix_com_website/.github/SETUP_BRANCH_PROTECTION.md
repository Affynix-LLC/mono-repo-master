# Branch Protection Setup Guide

## After Upgrading to GitHub Pro

Once you've upgraded to GitHub Pro, follow these steps to set up branch protection:

### 1. Access Branch Protection Settings

1. Go to your repository: https://github.com/0x13omb3r/affynix-platform
2. Click **Settings** (in the repository menu bar)
3. Click **Branches** (in the left sidebar under "Code and automation")

### 2. Set Up Main Branch Protection

1. Click **Add rule** next to "Branch protection rules"
2. In "Branch name pattern", enter: `main`
3. Configure the following settings:

#### ✅ Required Settings:

- [x] **Require a pull request before merging**
  - [x] Require approvals: `2`
  - [x] Dismiss stale PR approvals when new commits are pushed
  - [x] Require review from code owners: `false` (unless you set up CODEOWNERS)

- [x] **Require status checks to pass before merging**
  - [x] Require branches to be up to date before merging
  - [x] Add status checks: `Manual Branch Protection Checks`

- [x] **Require conversation resolution before merging**

- [x] **Restrict pushes that create files**
  - [x] Restrict pushes that create files: `true`

#### ✅ Additional Settings:

- [x] **Require linear history**
- [x] **Require deployments to succeed before merging**
- [x] **Lock branch** (prevents changes to the branch)
- [x] **Do not allow bypassing the above settings**
- [x] **Restrict pushes that create files**

### 3. Set Up Staging Branch Protection

1. Click **Add rule** again
2. Branch name pattern: `staging`
3. Configure similar to main but with:
   - Require approvals: `1` (less strict than main)
   - Same status checks and other protections

### 4. Set Up Development Branch Protection

1. Click **Add rule** again
2. Branch name pattern: `development`
3. Configure similar to staging but with:
   - Require approvals: `1`
   - Same status checks and other protections

### 5. Test the Protection

1. Try to push directly to main:

   ```bash
   git checkout main
   echo "test" >> test.txt
   git add test.txt
   git commit -m "test direct push"
   git push origin main
   ```

   This should be **blocked** ❌

2. Test proper workflow:
   ```bash
   # This should work ✅
   ./scripts/git-workflow.sh start-feature test-protection
   echo "test" >> test.txt
   git add test.txt
   git commit -m "test proper workflow"
   ./scripts/git-workflow.sh finish-feature
   ```

## Alternative: Use GitHub CLI (After Pro Upgrade)

If you prefer command line, you can also set up protection rules using:

```bash
# Main branch protection
gh api repos/0x13omb3r/affynix/branches/main/protection --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["Manual Branch Protection Checks"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":2,"dismiss_stale_reviews":true}' \
  --field restrictions='{"users":[],"teams":[],"apps":[]}' \
  --field allow_force_pushes=false \
  --field allow_deletions=false

# Staging branch protection
gh api repos/0x13omb3r/affynix/branches/staging/protection --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["Manual Branch Protection Checks"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  --field restrictions='{"users":[],"teams":[],"apps":[]}' \
  --field allow_force_pushes=false \
  --field allow_deletions=false

# Development branch protection
gh api repos/0x13omb3r/affynix/branches/development/protection --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["Manual Branch Protection Checks"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  --field restrictions='{"users":[],"teams":[],"apps":[]}' \
  --field allow_force_pushes=false \
  --field allow_deletions=false
```

## Verification

After setting up protection rules, verify they work by:

1. **Check branch protection status**:

   ```bash
   gh api repos/0x13omb3r/affynix/branches/main/protection
   ```

2. **Test the workflow**:

   ```bash
   ./scripts/git-workflow.sh status
   ```

3. **Try to break the rules** (should fail):
   ```bash
   git checkout main
   echo "test" >> test.txt
   git add test.txt
   git commit -m "test"
   git push origin main  # This should be blocked
   ```

## Benefits of GitHub Pro

- 🔒 **Branch Protection**: Enforce code review and testing
- 🔍 **Code Scanning**: Automatic security vulnerability detection
- 📊 **Dependency Insights**: Track and update dependencies
- 🚀 **Advanced Actions**: More CI/CD minutes and features
- 👥 **Team Management**: Better collaboration tools
- 📈 **Insights**: Detailed repository analytics

## Cost Justification

At $4/month ($48/year), GitHub Pro pays for itself by:

- Preventing costly bugs from reaching production
- Ensuring code quality through enforced reviews
- Providing security scanning that could prevent breaches
- Saving time with automated workflows
- Professional development practices

This is a small investment for significant business value!
