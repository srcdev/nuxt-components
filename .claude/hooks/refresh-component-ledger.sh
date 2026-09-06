#!/usr/bin/env bash
# PostToolUse hook (Skill) — fires whenever /create-commit-message runs. If any staged file
# touches app/components/, rebuilds the Component Ledger audit (.claude/component-ledger/) from
# the current repo state and tells Claude to republish it to the stored artifact URL. See
# project_component_compliance_standard.md / feedback_private_token_convention_clarified.md in
# memory for what this ledger tracks and why.

root="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$root" || exit 0

skill=$(jq -r '.tool_input.skill // empty')
[[ "$skill" == "create-commit-message" ]] || exit 0

# Only bother if something staged actually touches a component.
staged_components=$(git diff --cached --name-only -- 'app/components/*' 2>/dev/null)
[[ -n "$staged_components" ]] || exit 0

node "$root/.claude/component-ledger/build.mjs" >/tmp/component-ledger-build.log 2>&1
build_status=$?

url_file="$root/.claude/component-ledger/artifact-url.txt"
url=$(cat "$url_file" 2>/dev/null)

if [[ $build_status -ne 0 ]]; then
  msg="Staged changes touch component(s) (see: $staged_components), but rebuilding the Component Ledger failed — check /tmp/component-ledger-build.log. Fix before republishing."
elif [[ -z "$url" ]]; then
  msg="Staged changes touch component(s) (see: $staged_components). Component Ledger rebuilt at .claude/component-ledger/output.html, but no stored artifact URL was found at $url_file — ask the user for the ledger's URL, save it there, then republish."
else
  msg="Staged changes touch component(s): $(echo "$staged_components" | tr '\n' ' '). Component Ledger data rebuilt at .claude/component-ledger/output.html from the current repo state — republish it now via the Artifact tool with url=\"$url\" so the ledger reflects this change before finishing the commit message."
fi

jq -n --arg msg "$msg" '{hookSpecificOutput:{hookEventName:"PostToolUse",additionalContext:$msg}}'
