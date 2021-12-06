export PROJECT_NAMESPACE="1a7b16"
export GIT_URI="https://github.com/bcgov/court-interpreter-scheduling.git"
export GIT_REF="dev"

# The templates that should not have their GIT referances(uri and ref) over-ridden
# Templates NOT in this list will have they GIT referances over-ridden
# with the values of GIT_URI and GIT_REF
export skip_git_overrides="backup-build.yaml"