<template>
  <div class="colour-finder">
    <div class="colour-finder__container">
      <div class="colour-finder__content">
        <!-- Header -->
        <div v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0 }" class="colour-finder__header">
          <EyebrowText text-content="Interactive Tool" font-size="large" />
          <h1 class="colour-finder__title">
            Find Your
            <span class="colour-finder__title-highlight">Perfect Look</span>
          </h1>
          <p class="colour-finder__subtitle">
            Select your hair type, current colour, dream shade, and any treatments to get personalised recommendations.
          </p>
        </div>

        <!-- Progress Steps -->
        <div class="colour-finder__progress">
          <template v-for="(s, i) in STEPS" :key="s">
            <div class="colour-finder__progress-step">
              <button
                :class="[
                  'colour-finder__progress-button',
                  {
                    'colour-finder__progress-button--active': i === step,
                    'colour-finder__progress-button--completed': i < step,
                    'colour-finder__progress-button--inactive': i > step,
                  },
                ]"
                @click="
                  () => {
                    if (i < step) step = i;
                  }
                "
              >
                <span
                  :class="[
                    'colour-finder__progress-indicator',
                    {
                      'colour-finder__progress-indicator--completed': i < step,
                      'colour-finder__progress-indicator--active': i === step,
                      'colour-finder__progress-indicator--inactive': i > step,
                    },
                  ]"
                >
                  {{ i < step ? "✓" : i + 1 }}
                </span>
                <span class="colour-finder__progress-label">{{ s }}</span>
              </button>
              <div
                v-if="i < STEPS.length - 1"
                :class="[
                  'colour-finder__progress-connector',
                  { 'colour-finder__progress-connector--completed': i < step },
                ]"
              ></div>
            </div>
          </template>
        </div>

        <!-- Step Content -->
        <Transition name="slide" mode="out-in">
          <!-- Step 0: Hair Type -->
          <div v-if="step === 0" key="step0" class="colour-finder__step">
            <h2 class="colour-finder__step-title">What's your hair type?</h2>
            <div class="colour-finder__options colour-finder__options--hair-type">
              <button
                v-for="(ht, index) in hairTypes"
                :key="index"
                :class="['colour-finder__option', { 'colour-finder__option--selected': hairType === ht.id }]"
                @click="selectHairType(ht.id)"
              >
                <span v-if="hairType === ht.id" class="colour-finder__option-check">
                  <Icon name="lucide:check" class="colour-finder__option-check-icon" />
                </span>
                <div class="colour-finder__option-pattern">{{ ht.pattern }}</div>
                <span class="colour-finder__option-label">{{ ht.label }}</span>
              </button>
            </div>
          </div>

          <!-- Step 1: Natural Colour -->
          <div v-else-if="step === 1" key="step1" class="colour-finder__step">
            <h2 class="colour-finder__step-title">What's your natural hair colour?</h2>
            <div class="colour-finder__options colour-finder__options--natural-colour">
              <button
                v-for="(nc, index) in naturalColours"
                :key="index"
                :class="[
                  'colour-finder__option colour-finder__option--colour',
                  { 'colour-finder__option--selected': naturalColour === nc.id },
                ]"
                @click="selectNaturalColour(nc.id)"
              >
                <span v-if="naturalColour === nc.id" class="colour-finder__option-check">
                  <Icon name="lucide:check" class="colour-finder__option-check-icon" />
                </span>
                <div class="colour-finder__option-swatch" :style="{ backgroundColor: nc.colour }">
                  <NuxtImg
                    v-if="nc.image"
                    :src="nc.image"
                    width="128"
                    height="128"
                    alt=""
                    class="colour-finder__option-image"
                    :class="{ 'colour-finder__option-image--dark': nc.textDark }"
                  />
                </div>
                <span
                  :class="[
                    'colour-finder__option-label',
                    { 'colour-finder__option-label--selected': naturalColour === nc.id },
                  ]"
                >
                  {{ nc.label }}
                </span>
              </button>
            </div>
          </div>

          <!-- Step 2: Dream Colour -->
          <div v-else-if="step === 2" key="step2" class="colour-finder__step">
            <h2 class="colour-finder__step-title">What colour are you dreaming of?</h2>
            <div class="colour-finder__options colour-finder__options--desired-colour">
              <button
                v-for="(dc, index) in desiredColours"
                :key="index"
                :class="[
                  'colour-finder__option',
                  dc.id === 'none' ? 'colour-finder__option--no-change' : 'colour-finder__option--colour',
                  { 'colour-finder__option--selected': desiredColour === dc.id },
                ]"
                @click="selectDesiredColour(dc.id)"
              >
                <span v-if="desiredColour === dc.id" class="colour-finder__option-check">
                  <Icon name="lucide:check" class="colour-finder__option-check-icon" />
                </span>
                <template v-if="dc.id === 'none'">
                  <div class="colour-finder__option-none-icon">
                    <Icon name="lucide:minus-circle" class="colour-finder__option-none-icon-svg" />
                  </div>
                </template>
                <template v-else>
                  <div class="colour-finder__option-swatch" :style="{ background: dc.colour }">
                    <NuxtImg
                      v-if="dc.image"
                      :src="dc.image"
                      alt=""
                      width="128"
                      height="128"
                      class="colour-finder__option-image"
                    />
                  </div>
                </template>
                <span
                  :class="[
                    'colour-finder__option-label',
                    { 'colour-finder__option-label--selected': desiredColour === dc.id },
                  ]"
                >
                  {{ dc.label }}
                </span>
                <span v-if="dc.id === 'none'" class="colour-finder__option-sublabel">
                  Skip to style &amp; treatments
                </span>
              </button>
            </div>
          </div>

          <!-- Step 3: Style & Treatments -->
          <div v-else-if="step === 3" key="step3" class="colour-finder__step">
            <h2 class="colour-finder__step-title">Any style or treatments?</h2>
            <p class="colour-finder__step-subtitle">
              Select all that apply, or choose none to go straight to your results.
            </p>
            <div class="colour-finder__options colour-finder__options--treatments">
              <!-- "No treatments" — full-width, outside the subgrid -->
              <button
                :class="[
                  'colour-finder__option colour-finder__option--treatment colour-finder__option--no-change',
                  { 'colour-finder__option--selected': selectedTreatments.includes('none') },
                ]"
                @click="toggleTreatment('none')"
              >
                <span v-if="selectedTreatments.includes('none')" class="colour-finder__option-check">
                  <Icon name="lucide:check" class="colour-finder__option-check-icon" />
                </span>
                <Icon name="lucide:minus-circle" class="colour-finder__option-treatment-icon" />
                <span class="colour-finder__option-label">I don't want any treatments</span>
                <span class="colour-finder__option-sublabel">Go straight to your results</span>
              </button>

              <!-- Treatment options grid -->
              <div class="colour-finder__treatments-grid">
                <button
                  v-for="(tr, index) in treatments.filter((t) => t.id !== 'none')"
                  :key="index"
                  :class="[
                    'colour-finder__option colour-finder__option--treatment',
                    { 'colour-finder__option--selected': selectedTreatments.includes(tr.id) },
                    { 'colour-finder__option--excluded': allowMultipleTreatments && excludedTreatmentIds.has(tr.id) },
                  ]"
                  @click="toggleTreatment(tr.id)"
                >
                  <span v-if="selectedTreatments.includes(tr.id)" class="colour-finder__option-check">
                    <Icon name="lucide:check" class="colour-finder__option-check-icon" />
                  </span>
                  <Icon
                    v-if="allowMultipleTreatments && excludedTreatmentIds.has(tr.id)"
                    name="lucide:ban"
                    class="colour-finder__option-excluded-icon"
                  />
                  <Icon :name="tr.icon" class="colour-finder__option-treatment-icon" />
                  <span class="colour-finder__option-label">{{ tr.label }}</span>
                  <span
                    v-if="allowMultipleTreatments && excludedTreatmentIds.has(tr.id)"
                    class="colour-finder__option-conflict"
                  >
                    Conflicts with {{ getConflictingLabel(tr.id) }}
                  </span>
                  <span v-else class="colour-finder__option-sublabel">{{ tr.description }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Step 4: Results -->
          <div v-else-if="step === 4 && canShowResults" key="step4" class="colour-finder__results">
            <div class="colour-finder__results-header">
              <Icon name="lucide:sparkles" class="colour-finder__results-icon" />
              <h2 class="colour-finder__results-title">Your Personalised Recommendation</h2>
            </div>

            <!-- Colour Recommendation -->
            <h3 class="colour-finder__results-section-title">
              <Icon name="lucide:palette" class="colour-finder__results-section-icon" />
              Colour
            </h3>

            <template v-if="colourRecommendation">
              <div
                :class="[
                  'colour-finder__suitability',
                  `colour-finder__suitability--${colourRecommendation.suitability}`,
                ]"
              >
                <Icon
                  :name="suitabilityConfig[colourRecommendation.suitability].icon"
                  :class="[
                    'colour-finder__suitability-icon',
                    `colour-finder__suitability-icon--${colourRecommendation.suitability}`,
                  ]"
                />
                <div class="colour-finder__suitability-content">
                  <p
                    :class="[
                      'colour-finder__suitability-label',
                      `colour-finder__suitability-label--${colourRecommendation.suitability}`,
                    ]"
                  >
                    {{ suitabilityConfig[colourRecommendation.suitability].label }}
                  </p>
                  <p class="colour-finder__suitability-notes">{{ colourRecommendation.notes }}</p>
                </div>
              </div>
              <div class="colour-finder__details-card">
                <div class="colour-finder__details-header">
                  <span class="colour-finder__details-method-label">Processes Required</span>
                  <span class="colour-finder__details-method-badge">{{ colourRecommendation.method }}</span>
                </div>
                <div class="colour-finder__details-list">
                  <div
                    v-for="(detail, i) in colourRecommendation.details"
                    :key="i"
                    v-motion="`color-detail-${i}`"
                    :initial="{ opacity: 0, x: -20 }"
                    :enter="{ opacity: 1, x: 0, transition: { delay: i * 100 } }"
                    class="colour-finder__details-item"
                  >
                    <div class="colour-finder__details-bullet"></div>
                    <p class="colour-finder__details-text">{{ detail }}</p>
                  </div>
                </div>
              </div>
            </template>

            <!-- No colour treatment chosen -->
            <template v-else>
              <div class="colour-finder__suitability colour-finder__suitability--none">
                <Icon
                  name="lucide:minus-circle"
                  class="colour-finder__suitability-icon colour-finder__suitability-icon--none"
                />
                <div class="colour-finder__suitability-content">
                  <p class="colour-finder__suitability-label colour-finder__suitability-label--none">
                    No Colour Treatment
                  </p>
                  <p class="colour-finder__suitability-notes">
                    You've chosen to skip colour — a great way to maintain hair health.
                  </p>
                </div>
              </div>
            </template>

            <!-- Style & Treatments Recommendation -->
            <h3 class="colour-finder__results-section-title colour-finder__results-section-title--spaced">
              <Icon name="lucide:wand-2" class="colour-finder__results-section-icon" />
              Style &amp; Treatments
            </h3>

            <template v-if="hasActiveTreatments">
              <div
                v-for="(tr, i) in chosenTreatments"
                :key="i"
                class="colour-finder__details-card colour-finder__details-card--treatment"
              >
                <div class="colour-finder__details-header">
                  <Icon :name="tr.icon" class="colour-finder__treatment-icon" />
                  <span class="colour-finder__details-method-label">{{ tr.label }}</span>
                  <span
                    v-if="tr.compatibility && desiredColour !== 'none'"
                    :class="['colour-finder__compat-badge', `colour-finder__compat-badge--${getCompatibility(tr.id)}`]"
                  >
                    {{ getCompatibilityLabel(tr.id) }}
                  </span>
                </div>
                <div class="colour-finder__details-list">
                  <div
                    v-for="(note, j) in tr.notes"
                    :key="j"
                    v-motion="`treatment-note-${i}-${j}`"
                    :initial="{ opacity: 0, x: -20 }"
                    :enter="{ opacity: 1, x: 0, transition: { delay: (i + j) * 80 } }"
                    class="colour-finder__details-item"
                  >
                    <div class="colour-finder__details-bullet"></div>
                    <p class="colour-finder__details-text">{{ note }}</p>
                  </div>
                </div>
              </div>
            </template>

            <!-- No treatments chosen -->
            <template v-else>
              <div class="colour-finder__suitability colour-finder__suitability--none">
                <Icon
                  name="lucide:minus-circle"
                  class="colour-finder__suitability-icon colour-finder__suitability-icon--none"
                />
                <div class="colour-finder__suitability-content">
                  <p class="colour-finder__suitability-label colour-finder__suitability-label--none">
                    No Treatment Selected
                  </p>
                  <p class="colour-finder__suitability-notes">
                    You've chosen no additional style or treatments this visit.
                  </p>
                </div>
              </div>
            </template>

            <!-- Selections Summary -->
            <div class="colour-finder__summary">
              <div v-for="item in summaryItems" :key="item.label" class="colour-finder__summary-item">
                <p class="colour-finder__summary-label">{{ item.label }}</p>
                <div class="colour-finder__summary-visual">
                  <div v-if="item.swatch" class="colour-finder__summary-swatch" :style="{ background: item.swatch }">
                    <NuxtImg
                      v-if="item.image"
                      :src="item.image"
                      width="96"
                      height="96"
                      alt=""
                      class="colour-finder__summary-image"
                      :class="{ 'colour-finder__summary-image--dark': item.textDark }"
                    />
                  </div>
                  <Icon v-else-if="item.icon" :name="item.icon" class="colour-finder__summary-none-icon" />
                </div>
                <p class="colour-finder__summary-value">{{ item.value }}</p>
              </div>
            </div>

            <!-- CTA -->
            <div class="colour-finder__cta">
              <p class="colour-finder__cta-disclaimer">
                This is a guide — every head of hair is unique. Book a consultation for tailored advice.
              </p>
              <div class="colour-finder__cta-buttons">
                <a href="/#contact" class="colour-finder__button colour-finder__button--primary">Book Consultation</a>
                <button class="colour-finder__button colour-finder__button--secondary" @click="reset">
                  Start Again
                </button>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Navigation Buttons -->
        <div v-if="step < 4 && (step > 0 || !autoAdvance)" class="colour-finder__navigation">
          <button v-if="step > 0" class="colour-finder__nav-button colour-finder__nav-button--back" @click="back">
            <Icon name="lucide:arrow-left" class="colour-finder__nav-icon" />
            Back
          </button>
          <button
            v-if="!autoAdvance || (step === 3 && allowMultipleTreatments)"
            :disabled="!canProceed"
            :class="[
              'colour-finder__nav-button colour-finder__nav-button--next',
              { 'colour-finder__nav-button--disabled': !canProceed },
            ]"
            @click="next"
          >
            {{ autoAdvance && step === 3 && allowMultipleTreatments ? "View Results" : "Next" }}
            <Icon name="lucide:arrow-right" class="colour-finder__nav-icon" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  autoAdvance?: boolean;
  allowMultipleTreatments?: boolean;
  styleClassPassthrough?: string | string[];
}
const props = withDefaults(defineProps<Props>(), {
  autoAdvance: false,
  allowMultipleTreatments: false,
  styleClassPassthrough: () => [],
});

// ─── Types ────────────────────────────────────────────────────────────────────
type HairType = "straight" | "wavy" | "curly" | "coily";
type NaturalColour = "light-blonde" | "dark-blonde" | "light-brown" | "dark-brown" | "red" | "black" | "grey-white";
type DesiredColour = "none" | "blonde" | "brown" | "red" | "black" | "grey-silver" | "vivid" | "balayage";
type TreatmentId =
  | "none"
  | "keratin-smoothing"
  | "brazilian-blowout"
  | "perm"
  | "relaxer"
  | "japanese-straightening"
  | "deep-conditioning"
  | "bond-repair"
  | "gloss"
  | "scalp-treatment"
  | "blowdry";
type Suitability = "great" | "possible" | "difficult" | "not-recommended";

interface Recommendation {
  suitability: Suitability;
  method: string;
  notes: string;
  details: string[];
}

interface Treatment {
  id: TreatmentId;
  label: string;
  icon: string;
  description?: string;
  notes: string[];
  compatibility?: boolean;
  excludes?: TreatmentId[];
}

// ─── Static Data ──────────────────────────────────────────────────────────────
const hairTypes: { id: HairType; label: string; pattern: string }[] = [
  { id: "straight", label: "Straight", pattern: "|||" },
  { id: "wavy", label: "Wavy", pattern: "∿∿∿" },
  { id: "curly", label: "Curly", pattern: "⌇⌇⌇" },
  { id: "coily", label: "Coily", pattern: "⌀⌀⌀" },
];

const naturalColours: { id: NaturalColour; label: string; colour: string; image: string; textDark?: boolean }[] = [
  {
    id: "light-blonde",
    label: "Light Blonde",
    colour: "#F5DEB3",
    image: "/images/colour-finder/swatch-light-blonde.jpeg",
    textDark: true,
  },
  {
    id: "dark-blonde",
    label: "Dark Blonde",
    colour: "#C8A951",
    image: "/images/colour-finder/swatch-dark-blonde.jpeg",
    textDark: true,
  },
  {
    id: "light-brown",
    label: "Light Brown",
    colour: "#8B6914",
    image: "/images/colour-finder/swatch-light-brown.jpeg",
  },
  { id: "dark-brown", label: "Dark Brown", colour: "#4A2912", image: "/images/colour-finder/swatch-dark-brown.jpeg" },
  { id: "red", label: "Natural Red", colour: "#A0522D", image: "/images/colour-finder/swatch-red.jpeg" },
  { id: "black", label: "Black", colour: "#1a1a1a", image: "/images/colour-finder/swatch-black.jpeg" },
  {
    id: "grey-white",
    label: "Grey / White",
    colour: "#C0C0C0",
    image: "/images/colour-finder/swatch-grey-white.jpeg",
    textDark: true,
  },
];

// 'none' first as requested
const desiredColours: { id: DesiredColour; label: string; colour?: string; image?: string; textDark?: boolean }[] = [
  { id: "none", label: "I don't want a colour change" },
  {
    id: "blonde",
    label: "Blonde",
    colour: "#F5DEB3",
    image: "/images/colour-finder/swatch-dream-blonde.jpeg",
    textDark: true,
  },
  { id: "brown", label: "Brown", colour: "#6B3A2A", image: "/images/colour-finder/swatch-dream-brown.jpeg" },
  { id: "red", label: "Red", colour: "#B22222", image: "/images/colour-finder/swatch-dream-red.jpeg" },
  { id: "black", label: "Black", colour: "#1a1a1a", image: "/images/colour-finder/swatch-dream-black.jpeg" },
  {
    id: "grey-silver",
    label: "Grey / Silver",
    colour: "linear-gradient(135deg, #E8E8E8, #9E9E9E, #616161)",
    image: "/images/colour-finder/swatch-dream-grey-silver.jpeg",
    textDark: true,
  },
  {
    id: "vivid",
    label: "Vivid / Fashion",
    colour: "linear-gradient(135deg, #FF69B4, #8A2BE2, #00CED1)",
    image: "/images/colour-finder/swatch-dream-vivid.jpeg",
  },
  {
    id: "balayage",
    label: "Balayage",
    colour: "linear-gradient(135deg, #8B6914, #F5DEB3)",
    image: "/images/colour-finder/swatch-dream-balayage.jpeg",
  },
];

const treatments: Treatment[] = [
  {
    id: "none",
    label: "I don't want any treatments",
    icon: "lucide:minus-circle",
    description: "Go straight to your results",
    notes: [],
  },
  {
    id: "keratin-smoothing",
    label: "Keratin Smoothing",
    icon: "lucide:wind",
    description: "Frizz-free smoothness for months",
    notes: [
      "Reduces frizz and adds mirror-like shine",
      "Results last 3–6 months depending on hair type",
      "Not recommended immediately after colour — wait 2 weeks",
    ],
    compatibility: true,
    excludes: ["perm", "japanese-straightening", "relaxer"],
  },
  {
    id: "brazilian-blowout",
    label: "Brazilian Blowout",
    icon: "lucide:zap",
    description: "Smoothing with colour-safe formula",
    notes: [
      "Can be done same-day as colour in most cases",
      "Softens and smooths without fully straightening",
      "Great for frizz control in humid climates",
    ],
    compatibility: true,
    excludes: ["perm", "japanese-straightening", "relaxer"],
  },
  {
    id: "perm",
    label: "Permanent Wave",
    icon: "lucide:waves",
    description: "Long-lasting curls or waves",
    notes: [
      "Creates curls or waves that last 3–6 months",
      "Should not be done on the same day as colour",
      "Particularly beautiful on straight or slightly wavy hair",
    ],
    compatibility: true,
    excludes: ["japanese-straightening", "relaxer", "keratin-smoothing", "brazilian-blowout"],
  },
  {
    id: "relaxer",
    label: "Relaxer",
    icon: "lucide:arrow-right",
    description: "Permanent chemical straightening",
    notes: [
      "Permanently relaxes curly or coily texture",
      "Should not be combined with colour on the same visit",
      "Requires regular maintenance every 6–8 weeks",
    ],
    compatibility: true,
    excludes: ["perm", "japanese-straightening", "keratin-smoothing", "brazilian-blowout"],
  },
  {
    id: "japanese-straightening",
    label: "Japanese Straightening",
    icon: "lucide:minus",
    description: "Permanently silky-straight results",
    notes: [
      "Most permanent straightening method available",
      "Not compatible with colour on the same day",
      "Results last until new growth comes through",
    ],
    compatibility: true,
    excludes: ["perm", "relaxer", "keratin-smoothing", "brazilian-blowout"],
  },
  {
    id: "deep-conditioning",
    label: "Deep Conditioning",
    icon: "lucide:droplets",
    description: "Intense hydration &amp; moisture",
    notes: [
      "Ideal add-on for colour-treated or dry hair",
      "Restores moisture, softness, and shine",
      "Suitable for all hair types and textures",
    ],
  },
  {
    id: "bond-repair",
    label: "Protein / Bond Repair",
    icon: "lucide:shield",
    description: "e.g. Olaplex — rebuilds damaged hair",
    notes: [
      "Repairs broken bonds caused by colour or heat",
      "Can be done alongside colour as an add-on",
      "Recommended for frequently processed or damaged hair",
    ],
  },
  {
    id: "gloss",
    label: "Gloss / Glossing",
    icon: "lucide:gem",
    description: "Adds shine and enhances colour",
    notes: [
      "Boosts vibrancy and adds a glassy finish",
      "Excellent follow-up to colour treatments",
      "Semi-permanent — fades naturally over 4–6 weeks",
    ],
  },
  {
    id: "scalp-treatment",
    label: "Scalp Treatment",
    icon: "lucide:brain",
    description: "Head spa — scalp health &amp; growth",
    notes: [
      "Detoxifies and balances the scalp",
      "Promotes healthier hair growth over time",
      "A relaxing, spa-like experience — highly recommended",
    ],
  },
  {
    id: "blowdry",
    label: "Blow Dry / Blowout",
    icon: "lucide:sparkles",
    description: "Professional finish and styling",
    notes: [
      "Includes tension blowdry for a smooth, voluminous finish",
      "Can be customised — sleek, bouncy, or textured",
      "The perfect way to finish any salon visit",
    ],
  },
];

const STEPS = ["Hair Type", "Your Colour", "Dream Colour", "Style & Treatments", "Results"];

// ─── Recommendation Matrix ────────────────────────────────────────────────────
function getColourRecommendation(natural: NaturalColour, desired: DesiredColour, hairType: HairType): Recommendation {
  const matrix: Record<NaturalColour, Partial<Record<DesiredColour, Recommendation>>> = {
    "light-blonde": {
      blonde: {
        suitability: "great",
        method: "Semi-Permanent",
        notes: "Your light base is perfect for any blonde shade.",
        details: [
          "Ash, warm, or platinum tones all work beautifully",
          "Semi-permanent colour recommended to maintain condition",
          "Low maintenance — your natural base does the heavy lifting",
        ],
      },
      brown: {
        suitability: "great",
        method: "Semi-Permanent",
        notes: "Light to medium browns will take beautifully.",
        details: [
          "Great for adding depth and richness",
          "Semi-permanent gives a natural fade",
          "Warm chocolate and caramel tones look stunning",
        ],
      },
      red: {
        suitability: "possible",
        method: "Semi-Permanent",
        notes: "Strawberry and copper tones work, but fade quickly on light hair.",
        details: [
          "Strawberry blonde is the most natural-looking option",
          "Copper tones are achievable but fade fast",
          "Regular top-ups needed to maintain vibrancy",
        ],
      },
      black: {
        suitability: "not-recommended",
        method: "N/A",
        notes: "Too harsh a contrast — can look unnatural and is very hard to reverse.",
        details: [
          "Extreme colour change can damage light hair",
          "Very difficult to go back to blonde afterwards",
          "Consider a dark brown instead for depth",
        ],
      },
      "grey-silver": {
        suitability: "great",
        method: "Toner / Semi-Permanent",
        notes: "Your light base is ideal for silver and grey toning.",
        details: [
          "Ash or silver toners work beautifully on blonde hair",
          "No bleaching needed — a huge advantage",
          "A trendy, low-maintenance result",
        ],
      },
      vivid: {
        suitability: "possible",
        method: "Semi-Permanent",
        notes: "Pastel vivid shades work well on your light base, but fade fast.",
        details: [
          "Pastels like lilac, rose, and mint are ideal",
          "No bleaching needed — a rare advantage",
          "Colours fade within 4–8 washes typically",
        ],
      },
      balayage: {
        suitability: "great",
        method: "Freehand",
        notes: "Beautiful sun-kissed dimension with minimal effort.",
        details: [
          "Platinum or warm honey tones work perfectly",
          "Natural-looking grow-out",
          "Low maintenance colour option",
        ],
      },
    },
    "dark-blonde": {
      blonde: {
        suitability: "great",
        method: "Semi or Permanent",
        notes: "Golden and honey shades are your perfect match.",
        details: [
          "Warm golden tones complement your base beautifully",
          "Honey blonde gives a natural, sunkissed finish",
          "Can be achieved with gentle lightening",
        ],
      },
      brown: {
        suitability: "great",
        method: "Semi or Permanent",
        notes: "All brown shades work wonderfully on your base.",
        details: [
          "Versatile base for any brown shade",
          "Rich chocolate and chestnut tones are gorgeous",
          "Natural-looking results every time",
        ],
      },
      red: {
        suitability: "great",
        method: "Semi or Permanent",
        notes: "Strawberry and copper tones look stunning.",
        details: [
          "Warm copper and strawberry blonde are ideal",
          "Rich auburn is easily achievable",
          "Beautiful warm results on your base",
        ],
      },
      black: {
        suitability: "possible",
        method: "Permanent",
        notes: "Blue-black can look harsh. Consider a deep espresso instead.",
        details: [
          "Jet black may look too flat",
          "Deep chocolate or espresso is more flattering",
          "Permanent colour needed for lasting results",
        ],
      },
      "grey-silver": {
        suitability: "possible",
        method: "Bleach + Toner",
        notes: "Achievable but needs careful lightening first.",
        details: [
          "Pre-lightening required to lift warmth",
          "Toner applied to achieve silver or ash result",
          "May need 2 sessions for even coverage",
        ],
      },
      vivid: {
        suitability: "great",
        method: "Semi-Permanent",
        notes: "Pink, teal, and other vivid shades work brilliantly.",
        details: [
          "May need slight lightening for true vibrancy",
          "Pink and teal are particularly stunning",
          "Great base for fashion colours",
        ],
      },
      balayage: {
        suitability: "great",
        method: "Freehand",
        notes: "The ideal base for beautiful balayage dimension.",
        details: [
          "Honey and caramel tones create gorgeous contrast",
          "Natural-looking grow-out and low maintenance",
          "Works beautifully with warm or cool tones",
        ],
      },
    },
    "light-brown": {
      blonde: {
        suitability: "possible",
        method: "Permanent + Lightening",
        notes: "Needs careful lightening. Risk of brassiness without a toner.",
        details: [
          "Professional lightening recommended",
          "Toner essential to counteract brassiness",
          "Multiple sessions may be needed for platinum",
        ],
      },
      brown: {
        suitability: "great",
        method: "Semi or Permanent",
        notes: "All brown shades are your sweet spot.",
        details: [
          "Enhance your natural colour with deeper tones",
          "Rich mahogany and chestnut are stunning",
          "Easy to maintain and refresh",
        ],
      },
      red: {
        suitability: "great",
        method: "Semi or Permanent",
        notes: "Auburn and mahogany shades look incredible.",
        details: [
          "Your base is ideal for rich red tones",
          "Auburn and copper create beautiful warmth",
          "Mahogany adds luxury and depth",
        ],
      },
      black: {
        suitability: "possible",
        method: "Permanent",
        notes: "Can result in flat tones. Consider depth-adding techniques.",
        details: [
          "Risk of looking too uniform and flat",
          "Consider adding dimension with lowlights",
          "Very dark brown may be more flattering",
        ],
      },
      "grey-silver": {
        suitability: "difficult",
        method: "Bleach + Toner",
        notes: "Requires significant lightening — best done in stages.",
        details: [
          "Multiple bleaching sessions likely needed",
          "High risk of brassiness without careful toning",
          "Consider silver highlights as a gentler alternative",
        ],
      },
      vivid: {
        suitability: "great",
        method: "Requires Lightening",
        notes: "Teal and purple work well but need pre-lightening.",
        details: [
          "Pre-lightening needed for true vibrancy",
          "Teal and purple are particularly beautiful",
          "Semi-permanent for easy experimentation",
        ],
      },
      balayage: {
        suitability: "great",
        method: "Freehand",
        notes: "Perfect base for dimensional balayage.",
        details: [
          "Caramel and honey ends create gorgeous contrast",
          "Natural root area means low maintenance",
          "Sun-kissed finish looks effortlessly beautiful",
        ],
      },
    },
    "dark-brown": {
      blonde: {
        suitability: "not-recommended",
        method: "Bleach Required",
        notes: "Requires heavy bleaching which can damage hair significantly.",
        details: [
          "Multiple bleaching sessions needed",
          "High risk of damage and breakage",
          "Consider highlights instead for blonde effect",
        ],
      },
      brown: {
        suitability: "great",
        method: "Semi or Permanent",
        notes: "Enhance your natural shade — all but ash tones work.",
        details: [
          "Add warmth with chestnut or chocolate",
          "Golden brown adds beautiful dimension",
          "Easy to enrich and deepen your colour",
        ],
      },
      red: {
        suitability: "great",
        method: "Permanent",
        notes: "Mahogany and red-violet are stunning on your dark base.",
        details: [
          "Mahogany and burgundy are effortlessly achievable",
          "Red-violet adds luxurious dimension",
          "Rich, head-turning colour with minimal lift",
        ],
      },
      black: {
        suitability: "great",
        method: "Semi-Permanent",
        notes: "Enhancing black gloss works beautifully.",
        details: [
          "Blue-black gloss adds gorgeous shine",
          "Minimal processing needed",
          "Semi-permanent for easy maintenance",
        ],
      },
      "grey-silver": {
        suitability: "not-recommended",
        method: "Heavy Bleach Required",
        notes: "Very challenging — extensive lifting required over multiple sessions.",
        details: [
          "Dark brown to silver is a multi-session journey",
          "High risk of damage without professional guidance",
          "Consider silver highlights or a gradual grow-out approach instead",
        ],
      },
      vivid: {
        suitability: "difficult",
        method: "Bleach Required",
        notes: "Vivid colours need significant lightening first.",
        details: [
          "Heavy bleaching required — multiple sessions",
          "High maintenance with frequent touch-ups",
          "Consider peek-a-boo panels for less damage",
        ],
      },
      balayage: {
        suitability: "great",
        method: "Freehand + Lightening",
        notes: "Gorgeous contrast between dark root and lighter ends.",
        details: [
          "Caramel and honey balayage is incredibly popular",
          "Natural grow-out means lower maintenance",
          "Can be subtle or dramatic — your choice",
        ],
      },
    },
    red: {
      blonde: {
        suitability: "difficult",
        method: "Bleach Required",
        notes: "Risk of clash and unwanted orange tones. Very challenging.",
        details: [
          "Red pigment is extremely stubborn to remove",
          "High risk of orange and brassy tones",
          "Multiple sessions with colour correction needed",
        ],
      },
      brown: {
        suitability: "great",
        method: "Semi or Permanent",
        notes: "Golden and chestnut browns complement red undertones.",
        details: [
          "Warm browns work harmoniously with red base",
          "Chestnut and golden browns are gorgeous",
          "Natural-looking transition from red",
        ],
      },
      red: {
        suitability: "great",
        method: "Semi or Permanent",
        notes: "Deepen or brighten your natural red — stunning results.",
        details: [
          "Enhance your natural colour beautifully",
          "Brighten to vivid copper or deepen to auburn",
          "The easiest and most rewarding option",
        ],
      },
      black: {
        suitability: "not-recommended",
        method: "Permanent",
        notes: "Can dull your beautiful natural vibrancy.",
        details: [
          "Black will mute your natural warmth",
          "Very difficult to return to red afterwards",
          "Consider deep burgundy as an alternative",
        ],
      },
      "grey-silver": {
        suitability: "difficult",
        method: "Colour Correction + Bleach",
        notes: "Red pigment makes silver very hard to achieve.",
        details: [
          "Red is one of the hardest pigments to remove",
          "Colour correction required before any lightening",
          "Expect multiple sessions and a patient journey",
        ],
      },
      vivid: {
        suitability: "possible",
        method: "Semi-Permanent",
        notes: "Some vivids may look muddy. Choose carefully.",
        details: [
          "Vivid red and orange work with your base",
          "Blue and green tones may go muddy",
          "Pink can look beautiful on lighter red hair",
        ],
      },
      balayage: {
        suitability: "great",
        method: "Freehand",
        notes: "Copper and rose-gold balayage on red hair is breathtaking.",
        details: [
          "Rose gold tips on red base are stunning",
          "Copper highlights add gorgeous dimension",
          "Low maintenance with natural-looking grow-out",
        ],
      },
    },
    black: {
      blonde: {
        suitability: "not-recommended",
        method: "Heavy Bleach Required",
        notes: "Requires extensive bleaching — high damage risk.",
        details: [
          "Multiple bleaching sessions over months",
          "Severe damage risk to hair integrity",
          "Consider face-framing highlights instead",
        ],
      },
      brown: {
        suitability: "possible",
        method: "Permanent + Lightening",
        notes: "Needs warm undertones. Can look flat without dimension.",
        details: [
          "Warm-toned browns work better than cool",
          "May need multiple sessions for even coverage",
          "Adding highlights creates better dimension",
        ],
      },
      red: {
        suitability: "possible",
        method: "Permanent",
        notes: "Red can pull burgundy on black hair. Rich results though.",
        details: [
          "Expect burgundy/wine rather than true red",
          "Very rich and luxurious results",
          "Works best as all-over colour or highlights",
        ],
      },
      black: {
        suitability: "great",
        method: "Gloss Treatment",
        notes: "Glosses add incredible shine and depth to black hair.",
        details: [
          "Blue-black or violet-black glosses are stunning",
          "Adds mirror-like shine",
          "Gentle treatment with no damage",
        ],
      },
      "grey-silver": {
        suitability: "not-recommended",
        method: "Heavy Bleach Required",
        notes: "Achieving silver from black is a long, high-risk journey.",
        details: [
          "Many bleaching sessions required over months",
          "Severe risk of damage and breakage",
          "A gradual grow-out or silver highlights are far safer alternatives",
        ],
      },
      vivid: {
        suitability: "not-recommended",
        method: "Heavy Bleach Required",
        notes: "Needs heavy lifting for any vivid colour. Very damaging.",
        details: [
          "Extensive bleaching required",
          "Consider peek-a-boo panels or underlights",
          "Temporary colour sprays for events instead",
        ],
      },
      balayage: {
        suitability: "possible",
        method: "Lightening + Freehand",
        notes: "Subtle caramel balayage on black hair is gorgeous when done right.",
        details: [
          "Caramel and toffee tones create beautiful contrast",
          "Requires careful lightening",
          "Low-maintenance once established",
        ],
      },
    },
    "grey-white": {
      blonde: {
        suitability: "great",
        method: "Semi-Permanent",
        notes: "All blonde shades work beautifully — your base is ideal.",
        details: [
          "Champagne and platinum look incredibly natural",
          "Porous hair absorbs colour easily",
          "Semi-permanent for gentle, buildable colour",
        ],
      },
      brown: {
        suitability: "great",
        method: "Semi-Permanent",
        notes: "Soft browns add warmth and youthfulness.",
        details: [
          "Soft brown gives a natural, youthful look",
          "Porous grey absorbs colour beautifully",
          "Demi-permanent for gradual coverage",
        ],
      },
      red: {
        suitability: "great",
        method: "Semi-Permanent",
        notes: "Rose gold and peach tones are absolutely stunning on grey.",
        details: [
          "Rose gold is on-trend and gorgeous",
          "Peach and copper tones add warmth",
          "Fashionable and youthful finish",
        ],
      },
      black: {
        suitability: "great",
        method: "Semi-Permanent",
        notes: "Adds depth and can look very striking.",
        details: [
          "Salt-and-pepper look is very distinguished",
          "Semi-permanent for gradual blending",
          "Adds depth while keeping natural movement",
        ],
      },
      "grey-silver": {
        suitability: "great",
        method: "Toner / Silver Gloss",
        notes: "You're already there — a silver gloss will make it sing.",
        details: [
          "A purple or silver toner neutralises any yellow tones",
          "Adds incredible brightness and shine",
          "Low maintenance and beautifully on-trend",
        ],
      },
      vivid: {
        suitability: "great",
        method: "Semi-Permanent",
        notes: "High vibrancy — grey is the perfect canvas for vivid colours!",
        details: [
          "Grey/white is the ultimate canvas for vivid colours",
          "No bleaching needed whatsoever",
          "Colours appear vibrant and true to tone",
        ],
      },
      balayage: {
        suitability: "great",
        method: "Semi-Permanent",
        notes: "Silver-to-colour gradients look absolutely breathtaking.",
        details: [
          "Reverse balayage with colour at ends is trending",
          "Silver root with coloured tips is stunning",
          "Low maintenance and incredibly fashionable",
        ],
      },
    },
  };

  const rec = matrix[natural]?.[desired];
  if (!rec) {
    return {
      suitability: "possible",
      method: "Consultation Needed",
      notes: "Book a consultation for personalised advice.",
      details: [],
    };
  }

  const typeNote =
    hairType === "curly" || hairType === "coily"
      ? "Textured hair may need extra conditioning treatment during the colour process."
      : "";

  return { ...rec, details: typeNote ? [...rec.details, typeNote] : rec.details };
}

// ─── Treatment / Colour Compatibility ────────────────────────────────────────
const clashingTreatments: TreatmentId[] = ["keratin-smoothing", "perm", "relaxer", "japanese-straightening"];

function getCompatibility(treatmentId: TreatmentId): "ok" | "warning" {
  return clashingTreatments.includes(treatmentId) ? "warning" : "ok";
}

function getCompatibilityLabel(treatmentId: TreatmentId): string {
  return getCompatibility(treatmentId) === "warning" ? "Not same-day as colour" : "Compatible with colour";
}

// ─── State ────────────────────────────────────────────────────────────────────
const step = ref(0);
const hairType = ref<HairType | null>(null);
const naturalColour = ref<NaturalColour | null>(null);
const desiredColour = ref<DesiredColour | null>(null);
const selectedTreatments = ref<TreatmentId[]>([]);

const excludedTreatmentIds = computed<Set<TreatmentId>>(() => {
  const excluded = new Set<TreatmentId>();
  for (const id of selectedTreatments.value) {
    const treatment = treatments.find((t) => t.id === id);
    treatment?.excludes?.forEach((e) => excluded.add(e));
  }
  return excluded;
});

function getConflictingLabel(id: TreatmentId): string | null {
  for (const selectedId of selectedTreatments.value) {
    const t = treatments.find((tr) => tr.id === selectedId);
    if (t?.excludes?.includes(id)) return t.label;
  }
  return null;
}

function toggleTreatment(id: TreatmentId) {
  if (id === "none") {
    selectedTreatments.value = selectedTreatments.value.includes("none") ? [] : ["none"];
    if (props.autoAdvance) next();
    return;
  }
  if (!props.allowMultipleTreatments) {
    selectedTreatments.value = selectedTreatments.value.includes(id) ? [] : [id];
    if (props.autoAdvance) next();
    return;
  }
  const idx = selectedTreatments.value.indexOf(id);
  if (idx > -1) {
    selectedTreatments.value.splice(idx, 1);
  } else {
    const treatment = treatments.find((t) => t.id === id);
    selectedTreatments.value = selectedTreatments.value
      .filter((t) => t !== "none")
      .filter((t) => !treatment?.excludes?.includes(t));
    selectedTreatments.value.push(id);
  }
}

// ─── Computed ─────────────────────────────────────────────────────────────────
const colourRecommendation = computed<Recommendation | null>(() => {
  if (hairType.value && naturalColour.value && desiredColour.value && desiredColour.value !== "none") {
    return getColourRecommendation(naturalColour.value, desiredColour.value, hairType.value);
  }
  return null;
});

const hasActiveTreatments = computed(
  () => selectedTreatments.value.length > 0 && !selectedTreatments.value.includes("none")
);

const chosenTreatments = computed(() =>
  treatments.filter((t) => selectedTreatments.value.includes(t.id) && t.id !== "none")
);

const canShowResults = computed(() => !!hairType.value && !!naturalColour.value && !!desiredColour.value);

const canProceed = computed(() => {
  if (step.value === 0) return !!hairType.value;
  if (step.value === 1) return !!naturalColour.value;
  if (step.value === 2) return !!desiredColour.value;
  if (step.value === 3) return true; // optional — always passable
  return step.value === 4;
});

function next() {
  if (canProceed.value && step.value < 4) step.value++;
}
function back() {
  if (step.value > 0) step.value--;
}
function reset() {
  step.value = 0;
  hairType.value = null;
  naturalColour.value = null;
  desiredColour.value = null;
  selectedTreatments.value = [];
}

function selectHairType(id: HairType) {
  hairType.value = id;
  if (props.autoAdvance) next();
}

function selectNaturalColour(id: NaturalColour) {
  naturalColour.value = id;
  if (props.autoAdvance) next();
}

function selectDesiredColour(id: DesiredColour) {
  desiredColour.value = id;
  if (props.autoAdvance) next();
}

// ─── Summary Items ────────────────────────────────────────────────────────────
const summaryItems = computed(() => {
  const nc = naturalColours.find((n) => n.id === naturalColour.value);
  const dc = desiredColours.find((d) => d.id === desiredColour.value);
  const treatmentLabel = hasActiveTreatments.value ? chosenTreatments.value.map((t) => t.label).join(", ") : "None";

  return [
    {
      label: "Hair Type",
      value: hairTypes.find((h) => h.id === hairType.value)?.label ?? "",
      swatch: undefined,
      image: undefined,
      icon: "lucide:scissors",
      textDark: false,
    },
    {
      label: "Natural Colour",
      value: nc?.label ?? "",
      swatch: nc?.colour,
      image: nc?.image,
      icon: undefined,
      textDark: nc?.textDark ?? false,
    },
    {
      label: "Dream Colour",
      value: dc?.label ?? "",
      swatch: dc?.id !== "none" ? dc?.colour : undefined,
      image: dc?.id !== "none" ? dc?.image : undefined,
      icon: dc?.id === "none" ? "lucide:minus-circle" : undefined,
      textDark: dc?.textDark ?? false,
    },
    {
      label: "Treatments",
      value: treatmentLabel,
      swatch: undefined,
      image: undefined,
      icon: hasActiveTreatments.value ? undefined : "lucide:minus-circle",
      textDark: false,
    },
  ];
});

// ─── Suitability Config ───────────────────────────────────────────────────────
const suitabilityConfig: Record<Suitability, { icon: string; label: string }> = {
  great: { icon: "lucide:check", label: "Great Match" },
  possible: { icon: "lucide:triangle-alert", label: "Possible with Care" },
  difficult: { icon: "lucide:triangle-alert", label: "Challenging" },
  "not-recommended": { icon: "lucide:x", label: "Not Recommended" },
};
</script>

<style lang="css">
/* ─── CSS Custom Properties ────────────────────────────────────────────────── */
.colour-finder {
  --_primary-color: hsl(var(--colour-finder-primary-colour));
  --_primary-foreground: hsl(var(--primary-foreground));
  --_background: hsl(var(--background));
  --_foreground: hsl(var(--foreground));
  --_muted: hsl(var(--muted));
  --_muted-foreground: hsl(var(--muted-foreground));
  --_emerald: hsl(160 84% 39%);
  --_amber: hsl(43 96% 56%);
  --_orange: hsl(25 95% 53%);
  --_red: hsl(0 84% 60%);
  --_transition-duration: 300ms;
  --_border-radius: 0.5rem;
  --_spacing-xs: 0.25rem;
  --_spacing-sm: 0.5rem;
  --_spacing-md: 1rem;
  --_spacing-lg: 1.5rem;
  --_spacing-xl: 2rem;
  --_spacing-2xl: 3rem;
  --_spacing-3xl: 4rem;
  --_font-display: var(--font-display);
}

/* ─── Main Container ───────────────────────────────────────────────────────── */
.colour-finder {
  background-color: var(--_background);
  color: var(--_foreground);

  .colour-finder__container {
    padding-inline: var(--_spacing-lg);

    @container (min-width: 1024px) {
      padding-inline: var(--_spacing-2xl);
    }
  }

  .colour-finder__content {
    margin-inline: auto;
  }
}

/* ─── Header ───────────────────────────────────────────────────────────────── */
.colour-finder__header {
  text-align: center;
  margin-block-end: var(--_spacing-3xl);

  .colour-finder__label {
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: var(--_primary-color);
    margin-block-end: var(--_spacing-md);
  }

  .colour-finder__title {
    font-family: var(--_font-display);
    font-size: clamp(2.25rem, 5vw, 3.75rem);
    margin-block-end: var(--_spacing-md);

    @media (min-width: 768px) {
      font-size: clamp(3.75rem, 8vw, 6rem);
    }

    .colour-finder__title-highlight {
      font-style: italic;
      background: linear-gradient(135deg, #d4af37, #ffd700, #ffed4e);
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
    }
  }

  .colour-finder__subtitle {
    color: var(--_muted-foreground);
    font-weight: 300;
    max-inline-size: 34rem;
    margin-inline: auto;
  }
}

/* ─── Progress Steps ───────────────────────────────────────────────────────── */
.colour-finder__progress {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--_spacing-sm);
  margin-block-end: var(--_spacing-3xl);

  .colour-finder__progress-step {
    display: flex;
    align-items: center;
    gap: var(--_spacing-sm);
  }

  .colour-finder__progress-button {
    display: flex;
    align-items: center;
    gap: var(--_spacing-sm);
    padding: 0.8rem 1.2rem;
    text-transform: uppercase;
    border: 1px solid var(--colour-finder-border-colour);
    background: transparent;
    color: var(--_muted-foreground);
    transition: all var(--_transition-duration) ease;
    cursor: pointer;
  }

  .colour-finder__progress-button--active {
    border-color: var(--_primary-color);
    color: var(--_primary-color);
  }
  .colour-finder__progress-button--completed {
    border-color: color-mix(in srgb, var(--_primary-color) 30%, transparent);
    color: color-mix(in srgb, var(--_primary-color) 60%, transparent);
  }
  .colour-finder__progress-button--inactive {
    border-color: var(--colour-finder-border-colour);
    color: var(--_muted-foreground);
  }

  .colour-finder__progress-indicator {
    inline-size: 1.25rem;
    block-size: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    border-radius: 50%;
  }

  .colour-finder__progress-indicator--completed {
    background-color: var(--_primary-color);
    color: var(--_primary-foreground);
  }
  .colour-finder__progress-indicator--active {
    border: 1px solid var(--_primary-color);
    color: var(--_primary-color);
  }
  .colour-finder__progress-indicator--inactive {
    border: 1px solid var(--_muted-foreground);
    color: var(--_muted-foreground);
  }

  .colour-finder__progress-label {
    display: none;
    @media (min-width: 640px) {
      display: inline;
    }
  }

  .colour-finder__progress-connector {
    inline-size: 2rem;
    block-size: 1px;
    background-color: var(--colour-finder-border-colour);
  }
  .colour-finder__progress-connector--completed {
    background-color: var(--_primary-color);
  }
}

/* ─── Step ─────────────────────────────────────────────────────────────────── */
.colour-finder__step {
  .colour-finder__step-title {
    font-family: var(--_font-display);
    text-align: center;
    margin-block-end: var(--_spacing-sm);
  }

  .colour-finder__step-subtitle {
    text-align: center;
    color: var(--_muted-foreground);
    font-weight: 300;
    margin-block-end: var(--_spacing-xl);
  }
}

/* ─── Options Grid ─────────────────────────────────────────────────────────── */
.colour-finder__options {
  display: grid;
  gap: var(--_spacing-md);
  margin-inline: auto;

  &.colour-finder__options--hair-type {
    grid-template-columns: repeat(2, 1fr);
    @media (min-width: 768px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  &.colour-finder__options--natural-colour {
    grid-template-columns: repeat(2, 1fr);
    @media (min-width: 640px) {
      grid-template-columns: repeat(3, 1fr);
    }
    @media (min-width: 1024px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  &.colour-finder__options--desired-colour {
    grid-template-columns: repeat(2, 1fr);
    @media (min-width: 640px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &.colour-finder__options--treatments {
    display: flex;
    flex-direction: column;
  }
}

.colour-finder__treatments-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--_spacing-md);

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }

  .colour-finder__option--treatment {
    display: grid;
    grid-row: span 3;
    grid-template-rows: subgrid;
    justify-items: center;
    align-items: center;

    .colour-finder__option-treatment-icon {
      align-self: center;
    }

    .colour-finder__option-label {
      align-self: end;
    }

    .colour-finder__option-sublabel,
    .colour-finder__option-conflict {
      align-self: start;
    }
  }
}

.colour-finder__option {
  position: relative;
  padding: var(--_spacing-lg);
  border: 1px solid var(--colour-finder-border-colour);
  background: transparent;
  text-align: center;
  cursor: pointer;
  transition: all var(--_transition-duration) ease;
  border-radius: var(--_border-radius);
  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    border-color: color-mix(in srgb, var(--_primary-color) 50%, transparent);
  }

  .colour-finder__option-pattern {
    /* font-size: 1.875rem; */
    font-weight: 300;
    letter-spacing: 0.1em;
    color: var(--_foreground);
    margin-block-end: 0.75rem;
  }

  .colour-finder__option-swatch {
    aspect-ratio: 1 / 1;
    block-size: 8rem;
    inline-size: 8rem;
    border-radius: 50%;
    margin-block-end: 0.75rem;
    border: 1px solid color-mix(in srgb, var(--_foreground) 10%, transparent);
    overflow: hidden;

    .colour-finder__option-image {
      inline-size: 100%;
      block-size: 100%;
      object-fit: cover;
    }
  }

  .colour-finder__option-none-icon {
    inline-size: 3.5rem;
    block-size: 3.5rem;
    border-radius: 50%;
    border: 1px dashed color-mix(in srgb, var(--_muted-foreground) 50%, transparent);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    .colour-finder__option-none-icon-svg {
      inline-size: 1.25rem;
      block-size: 1.25rem;
      color: var(--_muted-foreground);
    }
  }

  .colour-finder__option-treatment-icon {
    inline-size: 1.5rem;
    block-size: 1.5rem;
    color: var(--_muted-foreground);
    margin-block-end: var(--_spacing-sm);
    transition: color var(--_transition-duration) ease;
    flex-shrink: 0;
  }

  .colour-finder__option-label {
    display: block;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--_muted-foreground);
    transition: color var(--_transition-duration) ease;
  }

  .colour-finder__option-sublabel {
    display: block;
    /* font-size: 0.7rem; */
    letter-spacing: 0.05em;
    color: var(--_muted-foreground);
    font-weight: 300;
    margin-block-start: 0.2rem;
    opacity: 0.7;
  }

  &:hover .colour-finder__option-label {
    color: var(--_foreground);
  }
}

.colour-finder__option--selected {
  border-color: var(--colour-finder-checked-stroke-colour);
  background-color: color-mix(in srgb, var(--colour-finder-checked-surface-colour) 20%, transparent);
  box-shadow: 0 4px 20px color-mix(in srgb, var(--colour-finder-checked-surface-colour) 20%, transparent);
}

.colour-finder__option--excluded {
  opacity: 0.45;
  cursor: pointer;

  .colour-finder__option-conflict {
    display: block;
    /* font-size: 0.65rem; */
    letter-spacing: 0.04em;
    color: var(--_muted-foreground);
    font-weight: 400;
    margin-block-start: 0.2rem;
    font-style: italic;
  }

  .colour-finder__option-excluded-icon {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    inline-size: 1.75rem;
    block-size: 1.75rem;
    color: var(--colour-finder-conflict-stroke-colour);
    opacity: 0.6;
  }
}

.colour-finder__option-check {
  position: absolute;
  top: 1rem;
  right: 1rem;
  inline-size: 2.25rem;
  block-size: 2.25rem;
  border-radius: 100vw;
  background-color: var(--colour-finder-checked-surface-colour);
  border: 1px solid var(--colour-finder-checked-stroke-colour);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;

  .colour-finder__option-check-icon {
    inline-size: 1.55rem;
    block-size: 1.55rem;
    color: var(--colour-finder-checked-stroke-colour);
  }
}

/* No-change / No-treatment — spans full width */
.colour-finder__option--no-change {
  grid-column: 1 / -1;
  flex-direction: row;
  justify-content: center;
  gap: var(--_spacing-md);
  padding: var(--_spacing-md) var(--_spacing-xl);
  border-style: dashed;

  .colour-finder__option-label,
  .colour-finder__option-sublabel {
    text-align: left;
  }
}

.colour-finder__option--selected .colour-finder__option-treatment-icon {
  color: var(--_primary-color);
}

.colour-finder__option-label--selected {
  color: var(--_primary-color);
}

/* ─── Results ──────────────────────────────────────────────────────────────── */
.colour-finder__results {
  margin-inline: auto;

  .colour-finder__results-header {
    text-align: center;
    margin-block-end: var(--_spacing-xl);

    .colour-finder__results-icon {
      inline-size: 2rem;
      block-size: 2rem;
      color: var(--_primary-color);
      margin-inline: auto;
      margin-block-end: var(--_spacing-md);
    }

    .colour-finder__results-title {
      font-family: var(--_font-display);
    }
  }
}

.colour-finder__results-section-title {
  display: flex;
  align-items: center;
  gap: var(--_spacing-sm);
  font-family: var(--_font-display);
  /* font-size: 0.875rem; */
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--_muted-foreground);
  margin-block-end: var(--_spacing-md);

  .colour-finder__results-section-icon {
    inline-size: 1rem;
    block-size: 1rem;
    color: var(--_primary-color);
  }
}

.colour-finder__results-section-title--spaced {
  margin-block-start: var(--_spacing-2xl);
}

/* ─── Suitability Badge ────────────────────────────────────────────────────── */
.colour-finder__suitability {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem;
  border: 1px solid;
  margin-block-end: var(--_spacing-xl);
  border-radius: var(--_border-radius);

  .colour-finder__suitability-icon {
    inline-size: 1.5rem;
    block-size: 1.5rem;
    flex-shrink: 0;
  }
  .colour-finder__suitability-icon--great {
    color: var(--_emerald);
  }
  .colour-finder__suitability-icon--possible {
    color: var(--_amber);
  }
  .colour-finder__suitability-icon--difficult {
    color: var(--_orange);
  }
  .colour-finder__suitability-icon--not-recommended {
    color: var(--_red);
  }
  .colour-finder__suitability-icon--none {
    color: var(--_muted-foreground);
  }

  .colour-finder__suitability-label {
    font-family: var(--_font-display);
  }
  .colour-finder__suitability-label--great {
    color: var(--_emerald);
  }
  .colour-finder__suitability-label--possible {
    color: var(--_amber);
  }
  .colour-finder__suitability-label--difficult {
    color: var(--_orange);
  }
  .colour-finder__suitability-label--not-recommended {
    color: var(--_red);
  }
  .colour-finder__suitability-label--none {
    color: var(--_muted-foreground);
  }

  .colour-finder__suitability-notes {
    color: var(--_muted-foreground);
    font-weight: 300;
  }
}

/* Suitability colour variants — driven by modifier class from computed */
.colour-finder__suitability--great {
  background-color: color-mix(in srgb, var(--_emerald) 10%, transparent);
  border-color: color-mix(in srgb, var(--_emerald) 30%, transparent);
}
.colour-finder__suitability--possible {
  background-color: color-mix(in srgb, var(--_amber) 10%, transparent);
  border-color: color-mix(in srgb, var(--_amber) 30%, transparent);
}
.colour-finder__suitability--difficult {
  background-color: color-mix(in srgb, var(--_orange) 10%, transparent);
  border-color: color-mix(in srgb, var(--_orange) 30%, transparent);
}
.colour-finder__suitability--not-recommended {
  background-color: color-mix(in srgb, var(--_red) 10%, transparent);
  border-color: color-mix(in srgb, var(--_red) 30%, transparent);
}
.colour-finder__suitability--none {
  background-color: color-mix(in srgb, var(--_muted-foreground) 8%, transparent);
  border-color: color-mix(in srgb, var(--_muted-foreground) 20%, transparent);
  border-style: dashed;
}

/* ─── Details Card ─────────────────────────────────────────────────────────── */
.colour-finder__details-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid color-mix(in srgb, var(--_foreground) 10%, transparent);
  border-radius: var(--_border-radius);
  padding: var(--_spacing-xl);
  margin-block-end: var(--_spacing-md);

  .colour-finder__details-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-block-end: var(--_spacing-lg);
    flex-wrap: wrap;

    .colour-finder__details-method-label {
      /* font-size: 0.75rem; */
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--_primary-color);
    }

    .colour-finder__details-method-badge {
      padding: var(--_spacing-xs) 0.75rem;
      background-color: color-mix(in srgb, var(--_primary-color) 10%, transparent);
      color: var(--_primary-color);
      border: 1px solid color-mix(in srgb, var(--_primary-color) 20%, transparent);
      border-radius: var(--_border-radius);
    }

    .colour-finder__treatment-icon {
      inline-size: 1rem;
      block-size: 1rem;
      color: var(--_primary-color);
    }
  }

  .colour-finder__details-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .colour-finder__details-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;

    .colour-finder__details-bullet {
      inline-size: 0.25rem;
      block-size: 0.25rem;
      border-radius: 50%;
      background-color: var(--_primary-color);
      margin-block-start: 0.5rem;
      flex-shrink: 0;
    }

    .colour-finder__details-text {
      color: color-mix(in srgb, var(--_foreground) 80%, transparent);
      font-weight: 300;
      line-height: 1;
      margin-block: 1rem;
    }
  }
}

.colour-finder__details-card--treatment {
  margin-block-end: var(--_spacing-sm);
}

/* ─── Compatibility Badge ──────────────────────────────────────────────────── */
.colour-finder__compat-badge {
  margin-inline-start: auto;
  padding: var(--_spacing-xs) var(--_spacing-sm);
  border-radius: var(--_border-radius);
  /* font-size: 0.65rem; */
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 500;
}

.colour-finder__compat-badge--ok {
  background-color: color-mix(in srgb, var(--_emerald) 10%, transparent);
  color: var(--_emerald);
  border: 1px solid color-mix(in srgb, var(--_emerald) 30%, transparent);
}
.colour-finder__compat-badge--warning {
  background-color: color-mix(in srgb, var(--_amber) 10%, transparent);
  color: var(--_amber);
  border: 1px solid color-mix(in srgb, var(--_amber) 30%, transparent);
}

/* ─── Summary ──────────────────────────────────────────────────────────────── */
.colour-finder__summary {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(6, auto);
  gap: var(--_spacing-md);
  margin-block: var(--_spacing-2xl);

  @media (min-width: 640px) {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, auto);
  }

  .colour-finder__summary-item {
    display: grid;
    grid-row: span 3;
    grid-template-rows: subgrid;
    align-items: center;
    justify-items: center;
    text-align: center;
    padding: var(--_spacing-md);
    border: 1px solid var(--colour-finder-border-colour);
    border-radius: var(--_border-radius);

    .colour-finder__summary-label {
      align-self: end;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--_muted-foreground);
    }

    .colour-finder__summary-visual {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .colour-finder__summary-swatch {
      aspect-ratio: 1 / 1;
      block-size: 8rem;
      border-radius: 100vw;
      border: 1px solid color-mix(in srgb, var(--_foreground) 10%, transparent);
      overflow: hidden;

      .colour-finder__summary-image {
        inline-size: 100%;
        block-size: 100%;
        object-fit: cover;
      }
    }

    .colour-finder__summary-none-icon {
      inline-size: 1.5rem;
      block-size: 1.5rem;
      color: var(--_muted-foreground);
      opacity: 0.5;
    }

    .colour-finder__summary-value {
      align-self: start;
      color: var(--_foreground);
    }
  }
}

.colour-finder__summary-image--dark {
  filter: brightness(0.8) contrast(1.1);
}

/* ─── CTA ──────────────────────────────────────────────────────────────────── */
.colour-finder__cta {
  text-align: center;

  .colour-finder__cta-disclaimer {
    color: var(--_muted-foreground);
    margin-block-end: var(--_spacing-lg);
    font-weight: 300;
  }

  .colour-finder__cta-buttons {
    display: flex;
    flex-direction: column;
    gap: var(--_spacing-md);
    justify-content: center;

    @media (min-width: 640px) {
      flex-direction: row;
    }
  }
}

.colour-finder__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--_spacing-md) var(--_spacing-xl);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  text-decoration: none;
  transition: all var(--_transition-duration) ease;
  border-radius: var(--_border-radius);
  cursor: pointer;
  border: 1px solid transparent;
}

.colour-finder__button--primary {
  background-color: var(--_primary-color);
  color: var(--_primary-foreground);
  box-shadow: 0 4px 20px color-mix(in srgb, var(--_primary-color) 20%, transparent);
  &:hover {
    background-color: color-mix(in srgb, var(--_primary-color) 90%, transparent);
  }
}

.colour-finder__button--secondary {
  border-color: color-mix(in srgb, var(--_foreground) 20%, transparent);
  color: var(--_foreground);
  &:hover {
    border-color: var(--_primary-color);
    color: var(--_primary-color);
  }
}

/* ─── Navigation ───────────────────────────────────────────────────────────── */
.colour-finder__navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--_spacing-md);
  margin-block-start: var(--_spacing-2xl);

  .colour-finder__nav-button {
    display: flex;
    align-items: center;
    gap: var(--_spacing-sm);
    padding: 0.75rem var(--_spacing-lg);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    background: transparent;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all var(--_transition-duration) ease;
    border-radius: var(--_border-radius);

    .colour-finder__nav-icon {
      inline-size: 1rem;
      block-size: 1rem;
    }
  }
}

.colour-finder__nav-button--back {
  color: var(--_muted-foreground);
  &:hover {
    color: var(--_foreground);
  }
}

.colour-finder__nav-button--next {
  padding: 0.75rem var(--_spacing-xl);
  background-color: var(--_primary-color);
  color: var(--_primary-foreground);
  box-shadow: 0 4px 20px color-mix(in srgb, var(--_primary-color) 20%, transparent);
  &:hover {
    background-color: color-mix(in srgb, var(--_primary-color) 90%, transparent);
  }
}

.colour-finder__nav-button--disabled {
  background-color: var(--_muted);
  color: var(--_muted-foreground);
  cursor: not-allowed;
  box-shadow: none;
  &:hover {
    background-color: var(--_muted);
  }
}

/* ─── Slide Transition ─────────────────────────────────────────────────────── */
.slide-enter-active,
.slide-leave-active {
  transition:
    opacity var(--_transition-duration) ease,
    transform var(--_transition-duration) ease;
}
.slide-enter-from {
  opacity: 0;
  transform: translateX(50px);
}
.slide-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}
</style>
