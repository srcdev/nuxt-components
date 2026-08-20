#!/usr/bin/env bash
# PostToolUse hook (Write|Edit) for app/components/*.vue files. Advisory nudges only
# (missing != wrong): skill doc, story, test, CONSUMER-STYLING.md, .vscode snippet,
# legacy tier-folder location, options-style defineProps.

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

# variants/ files are documented under their parent component, not standalone.
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
