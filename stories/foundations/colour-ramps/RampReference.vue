<template>
  <section class="ramp-reference">
    <header class="ramp-reference-header">
      <h2 class="ramp-reference-title">{{ displayName }}</h2>
      <dl class="ramp-reference-params">
        <div>
          <dt>Hue</dt>
          <dd>{{ config.hue }}°</dd>
        </div>
        <div>
          <dt>Max chroma</dt>
          <dd>{{ config.chroma }}</dd>
        </div>
        <div v-if="config.drift">
          <dt>Hue drift</dt>
          <dd>{{ config.drift }}° across the ramp</dd>
        </div>
        <div>
          <dt>Used as theme</dt>
          <dd>{{ themes.length ? themes.join("; ") : "Not a theme palette (named steps only)" }}</dd>
        </div>
      </dl>
    </header>

    <ol class="ramp-reference-swatches">
      <li v-for="step in steps" :key="step.token" class="ramp-reference-swatch">
        <div class="ramp-reference-chip" :style="{ background: `var(${step.token})`, color: bestText(step).colour }">
          <span class="ramp-reference-chip-step">{{ step.step }}</span>
          <span class="ramp-reference-chip-contrast">{{ bestText(step).ratio }}:1</span>
        </div>
        <code class="ramp-reference-token">{{ step.token }}</code>
        <code class="ramp-reference-value">{{ step.oklch }}</code>
        <code class="ramp-reference-value">
          {{ step.hex }}
          <span v-if="!step.inGamut" class="ramp-reference-flag" title="Outside sRGB: the hex is clipped">P3</span>
        </code>
      </li>
    </ol>

    <div class="ramp-reference-table-wrap">
      <table class="ramp-reference-table">
        <caption>
          Usage by step. Theme roles come from the theming CSS; component references are
          literal <code>{{ `--${name}-NN` }}</code> uses found in the library source.
        </caption>
        <thead>
          <tr>
            <th scope="col">Step</th>
            <th scope="col">Contrast</th>
            <th scope="col">Theme roles</th>
            <th scope="col">Referenced by name in</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="step in steps" :key="step.token">
            <th scope="row">
              <span class="ramp-reference-dot" :style="{ background: `var(${step.token})` }"></span>
              <code>{{ step.token }}</code>
            </th>
            <td class="ramp-reference-contrast">
              <span>White text {{ step.contrastOnWhite }}:1 <b :class="gradeClass(step.contrastOnWhite)">{{ grade(step.contrastOnWhite) }}</b></span>
              <span>Black text {{ step.contrastOnBlack }}:1 <b :class="gradeClass(step.contrastOnBlack)">{{ grade(step.contrastOnBlack) }}</b></span>
            </td>
            <td>
              <ul v-if="step.themeRoles.length" class="ramp-reference-list">
                <li v-for="role in step.themeRoles" :key="role.theme + role.token">
                  <code>{{ role.token }}</code>
                  <span class="ramp-reference-mode" :data-mode="role.mode">{{ modeLabel(role.mode) }}</span>
                  <span class="ramp-reference-muted">{{ role.theme }}<template v-if="role.role">: {{ role.role }}</template></span>
                </li>
              </ul>
              <span v-else class="ramp-reference-muted">None</span>
            </td>
            <td>
              <ul v-if="step.usedBy.length" class="ramp-reference-tags">
                <li v-for="source in step.usedBy" :key="source">{{ source }}</li>
              </ul>
              <span v-else class="ramp-reference-muted">Not referenced directly</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { buildRamp, rampConfigs, themesForPalette, type RampStep, type ThemeRole } from "./ramp-data";

interface Props {
  name: string;
}

const props = defineProps<Props>();

const config = computed(() => rampConfigs[props.name] ?? { hue: 0, chroma: 0 });
const steps = computed(() => buildRamp(props.name));
const themes = computed(() => themesForPalette(props.name));
const displayName = computed(() => props.name.charAt(0).toUpperCase() + props.name.slice(1));

const bestText = (step: RampStep) =>
  step.contrastOnWhite >= step.contrastOnBlack
    ? { colour: "#fff", ratio: step.contrastOnWhite }
    : { colour: "#000", ratio: step.contrastOnBlack };

const grade = (ratio: number) => (ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : ratio >= 3 ? "AA large" : "Fail");
const gradeClass = (ratio: number) => (ratio >= 4.5 ? "pass" : ratio >= 3 ? "partial" : "fail");
const modeLabel = (mode: ThemeRole["mode"]) => (mode === "both" ? "light + dark" : mode);
</script>

<style>
.ramp-reference {
  --_ink: var(--colour-text-default, CanvasText);
  --_muted: color-mix(in oklab, var(--_ink) 60%, transparent);
  --_rule: color-mix(in oklab, var(--_ink) 15%, transparent);

  display: grid;
  gap: 2.4rem;
  color: var(--_ink);
  font-family: system-ui, sans-serif;
  font-size: 1.4rem;
  line-height: 1.5;

  code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 1.2rem;
  }

  .ramp-reference-header {
    display: grid;
    gap: 0.8rem;
  }

  .ramp-reference-title {
    margin: 0;
    font-size: 2.4rem;
  }

  .ramp-reference-params {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem 2.4rem;
    margin: 0;

    div {
      display: flex;
      gap: 0.6rem;
    }

    dt {
      color: var(--_muted);
    }

    dd {
      margin: 0;
      font-weight: 600;
    }
  }

  .ramp-reference-swatches {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
    gap: 1.2rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .ramp-reference-swatch {
    display: grid;
    gap: 0.4rem;
    min-width: 0;
  }

  .ramp-reference-chip {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    aspect-ratio: 4 / 3;
    padding: 0.8rem;
    border-radius: 0.8rem;
    box-shadow: inset 0 0 0 0.1rem var(--_rule);
    font-weight: 600;
  }

  .ramp-reference-chip-step {
    font-size: 1.8rem;
  }

  .ramp-reference-chip-contrast {
    font-size: 1.2rem;
  }

  .ramp-reference-token {
    font-weight: 600;
  }

  .ramp-reference-value {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    color: var(--_muted);
    overflow-wrap: anywhere;
  }

  .ramp-reference-flag {
    padding: 0 0.4rem;
    border: 0.1rem solid currentColor;
    border-radius: 0.3rem;
    font-size: 1rem;
    cursor: help;
  }

  .ramp-reference-table-wrap {
    overflow-x: auto;
  }

  .ramp-reference-table {
    width: 100%;
    border-collapse: collapse;
    text-align: start;

    caption {
      margin-block-end: 0.8rem;
      color: var(--_muted);
      text-align: start;
    }

    th,
    td {
      padding: 0.8rem 1.2rem 0.8rem 0;
      border-block-end: 0.1rem solid var(--_rule);
      text-align: start;
      vertical-align: top;
    }

    thead th {
      color: var(--_muted);
      font-weight: 600;
    }

    tbody th {
      white-space: nowrap;
    }
  }

  .ramp-reference-dot {
    display: inline-block;
    width: 1.4rem;
    height: 1.4rem;
    margin-inline-end: 0.6rem;
    border-radius: 50%;
    box-shadow: inset 0 0 0 0.1rem var(--_rule);
    vertical-align: middle;
  }

  .ramp-reference-contrast {
    display: grid;
    gap: 0.2rem;
    white-space: nowrap;

    b {
      margin-inline-start: 0.4rem;
      font-size: 1.1rem;
    }

    .pass {
      color: var(--green-07);
    }

    .partial {
      color: var(--amber-07);
    }

    .fail {
      color: var(--red-07);
    }
  }

  .ramp-reference-list {
    display: grid;
    gap: 0.4rem;
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 0.2rem 0.6rem;
    }
  }

  .ramp-reference-mode {
    padding: 0 0.6rem;
    border-radius: 99rem;
    background: var(--_rule);
    font-size: 1.1rem;
  }

  .ramp-reference-muted {
    color: var(--_muted);
  }

  .ramp-reference-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      padding: 0.1rem 0.8rem;
      border: 0.1rem solid var(--_rule);
      border-radius: 99rem;
      font-size: 1.2rem;
    }
  }
}
</style>
