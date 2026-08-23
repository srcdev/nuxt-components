#!/usr/bin/env bash
# PostToolUse hook (Write|Edit) for app/components/*.vue files. Advisory nudges only
# (missing != wrong): skill doc, story, test, CONSUMER-STYLING.md, .vscode snippet,
# legacy tier-folder location, options-style defineProps, single-use private CSS tokens,
# leftover app/pages/ demo pages (this library is Storybook-only, see Claude.md).

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

# Private --_x CSS tokens that appear only twice in the file (once declared, once consumed) are
# likely pure indirection with no reuse/computation/state to justify them — see the "Public
# token pattern" rule in Claude.md's Styling Methodology and pitfall #20 (ServicesCard).
private_vars=$(grep -oE -- '--_[a-zA-Z0-9-]+' "$f" | sort -u)
if [[ -n "$private_vars" ]]; then
  single_use=""
  while IFS= read -r var; do
    [[ -z "$var" ]] && continue
    count=$(grep -oE -- "\\${var}\\b" "$f" | wc -l | tr -d ' ')
    if [[ "$count" -le 2 ]]; then
      single_use="$single_use $var"
    fi
  done <<< "$private_vars"
  if [[ -n "$single_use" ]]; then
    msg="$msg This component declares private CSS token(s) ($(echo "$single_use" | xargs)) that appear to be used only once — check whether each is genuinely reused across multiple declarations/selectors, composed from a v-bind() value, or swapped by a state (:hover, data-theme). If not, inline the public var(--token, default) directly at its point of use instead, per the Public token pattern rule in Claude.md's Styling Methodology (see pitfall #20 for the ServicesCard precedent), and update CONSUMER-STYLING.md/the skill doc if the token's public name or default changes."
  fi
fi

# This library ships no demo pages — Storybook stories are the only demo surface (see Claude.md's
# "Storybook is the only demo surface"). Flag any app/pages/ file that mentions this component,
# whether a pre-existing leftover or a newly (re)added one.
if [[ -d "$root/app/pages" ]]; then
  demo_pages=$(grep -rlE "\\b${name}\\b" "$root/app/pages" 2>/dev/null | xargs)
  if [[ -n "$demo_pages" ]]; then
    msg="$msg Found file(s) under app/pages/ referencing $name ($demo_pages); this library has no demo pages (Storybook only) — delete them and move any demo-worthy content into the Storybook story instead."
  fi
fi

jq -n --arg msg "$msg" '{hookSpecificOutput:{hookEventName:"PostToolUse",additionalContext:$msg}}'
