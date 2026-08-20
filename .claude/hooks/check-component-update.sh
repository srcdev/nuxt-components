#!/usr/bin/env bash
# PostToolUse hook (Write|Edit) for app/components/*.vue files.
#
# Reminds the agent, via additionalContext, about everything Claude.md's Development
# Workflow expects alongside a component change: the skill doc, a Storybook story, a
# test spec, a CONSUMER-STYLING.md (when the component has a real styling surface), a
# .vscode snippet, and two "this component is stale" signals: living outside the
# 01-05 tier folders, or using the pre-modern options-style defineProps({...}) pattern.
#
# All checks are advisory nudges (missing != wrong) — a component genuinely without
# a token API doesn't need CONSUMER-STYLING.md, and a variant sub-component sharing its
# parent's story/tests isn't broken. Judgement on whether to act still lives with the
# agent (and, where it's a real call, the user) — this just makes sure nothing gets
# silently skipped because nobody looked.
#
# Files inside a variants/ subfolder (e.g. input-text/variants/InputTextWithLabel.vue) get
# skill-doc/CONSUMER-STYLING.md treated as part of their parent component, not as their own
# standalone entries — per-variant skill files are deprecated as noise (2026-08-21).

root="${CLAUDE_PROJECT_DIR:-$(pwd)}"

f=$(jq -r '.tool_input.file_path // empty')

case "$f" in
  */app/components/*.vue) ;;
  *) exit 0 ;;
esac
case "$f" in
  */tests/*|*/stories/*) exit 0 ;;
esac

name=$(basename "$f" .vue)
skill=$(printf '%s' "$name" | sed -E 's/([a-z0-9])([A-Z])/\1-\2/g; s/([A-Z]+)([A-Z][a-z])/\1-\2/g' | tr '[:upper:]' '[:lower:]')
dir=$(dirname "$f")
pdir=$(dirname "$dir")

# A file directly inside a variants/ folder (e.g. input-text/variants/InputTextWithLabel.vue)
# is documented as part of its parent component, not as a standalone entry — per-variant
# skill.md/CONSUMER-STYLING.md files are deprecated as noise. Point the skill-doc reminder at
# the parent instead of the variant's own name, and skip the standalone CONSUMER-STYLING.md
# nudge entirely (it's covered by the parent component's own check when that file is touched).
is_variant=false
if [[ "$(basename "$dir")" == "variants" ]]; then
  is_variant=true
  parent_name=$(basename "$pdir")
fi

if [[ "$is_variant" == true ]]; then
  msg="Component file $f was edited/written. This is a variant of $parent_name — per project convention, document it inside .claude/skills/components/$parent_name.md (e.g. a \"Variants\" section) rather than creating a separate .claude/skills/components/$skill.md for it."
else
  msg="Component file $f was edited/written. Per Claude.md Development Workflow step 7, check whether .claude/skills/components/$skill.md needs updating to reflect this change (props/slots/models/defaults/behaviour)."
fi

shopt -s nullglob
stories=("$dir"/stories/*.stories.ts "$pdir"/stories/*.stories.ts)
tests=("$dir"/tests/*.spec.ts "$pdir"/tests/*.spec.ts)
shopt -u nullglob

if [[ ${#stories[@]} -eq 0 ]]; then
  msg="$msg No Storybook story found for this component (checked $dir/stories and $pdir/stories); create one."
fi

if [[ ${#tests[@]} -eq 0 ]]; then
  msg="$msg No test spec found for this component (checked $dir/tests and $pdir/tests); create one per the Testing Requirements."
fi

if [[ "$is_variant" != true && ! -f "$dir/CONSUMER-STYLING.md" && ! -f "$pdir/CONSUMER-STYLING.md" ]]; then
  msg="$msg No CONSUMER-STYLING.md found for this component; create one if it exposes a real --token API or class override hook (skip it if the component genuinely has neither)."
fi

if [[ ! -f "$root/.vscode/srcdev-component-$skill.code-snippets" ]]; then
  msg="$msg No .vscode/srcdev-component-$skill.code-snippets found; create/update it per Development Workflow step 6."
fi

case "$f" in
  */app/components/01.atoms/*|*/app/components/02.molecules/*|*/app/components/03.organisms/*|*/app/components/04.templates/*|*/app/components/05.forms/*) ;;
  *) msg="$msg This component lives outside the 01-05 tier folders, a legacy location; move it into the matching tier (01.atoms, 02.molecules, 03.organisms, 04.templates, 05.forms) or propose a new tier folder if none fit." ;;
esac

if grep -qE 'defineProps\(\s*\{' "$f" && ! grep -q 'defineProps<' "$f"; then
  msg="$msg This component uses the options-style defineProps({...}) pattern, an outdated-pattern signal; migrate to interface Props + withDefaults(defineProps<Props>(), {...}) per the Props Pattern in Claude.md."
fi

jq -n --arg msg "$msg" '{hookSpecificOutput:{hookEventName:"PostToolUse",additionalContext:$msg}}'
