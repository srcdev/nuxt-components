<template>
  <div class="colour-finder">
    <div class="colour-finder__container">
      <div class="colour-finder__content">
        <!-- Header -->
        <div v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0 }" class="colour-finder__header">
          <EyebrowText text-content="Interactive Tool" font-size="large" />
          <p class="colour-finder__label">Interactive Tool</p>
          <h1 class="colour-finder__title">
            Find Your
            <span class="colour-finder__title-highlight">Perfect Colour</span>
          </h1>
          <p class="colour-finder__subtitle">
            Select your hair type, current colour, and dream shade to get personalised recommendations.
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
                v-for="ht in hairTypes"
                :key="ht.id"
                :class="[
                  'colour-finder__option',
                  {
                    'colour-finder__option--selected': hairType === ht.id,
                  },
                ]"
                @click="hairType = ht.id"
              >
                <div class="colour-finder__option-pattern">
                  {{ ht.pattern }}
                </div>
                <span class="colour-finder__option-label">
                  {{ ht.label }}
                </span>
              </button>
            </div>
          </div>

          <!-- Step 1: Natural Colour -->
          <div v-else-if="step === 1" key="step1" class="colour-finder__step">
            <h2 class="colour-finder__step-title">What's your natural hair colour?</h2>
            <div class="colour-finder__options colour-finder__options--natural-colour">
              <button
                v-for="nc in naturalColours"
                :key="nc.id"
                :class="[
                  'colour-finder__option colour-finder__option--colour',
                  {
                    'colour-finder__option--selected': naturalColour === nc.id,
                  },
                ]"
                @click="naturalColour = nc.id"
              >
                <div class="colour-finder__option-swatch" :style="{ backgroundColor: nc.colour }">
                  <NuxtImg
                    v-if="nc.image"
                    :src="nc.image"
                    alt=""
                    class="colour-finder__option-image"
                    :class="{ 'colour-finder__option-image--dark': nc.textDark }"
                  />
                </div>
                <span
                  :class="[
                    'colour-finder__option-label',
                    {
                      'colour-finder__option-label--selected': naturalColour === nc.id,
                    },
                  ]"
                >
                  {{ nc.label }}
                </span>
              </button>
            </div>
          </div>

          <!-- Step 2: Desired Colour -->
          <div v-else-if="step === 2" key="step2" class="colour-finder__step">
            <h2 class="colour-finder__step-title">What colour are you dreaming of?</h2>
            <div class="colour-finder__options colour-finder__options--desired-colour">
              <button
                v-for="dc in desiredColours"
                :key="dc.id"
                :class="[
                  'colour-finder__option colour-finder__option--colour',
                  {
                    'colour-finder__option--selected': desiredColour === dc.id,
                  },
                ]"
                @click="desiredColour = dc.id"
              >
                <div class="colour-finder__option-swatch" :style="{ background: dc.colour }">
                  <NuxtImg
                    v-if="dc.image"
                    :src="dc.image"
                    alt=""
                    class="colour-finder__option-image"
                    :class="{ 'colour-finder__option-image--dark': dc.textDark }"
                  />
                </div>
                <span
                  :class="[
                    'colour-finder__option-label',
                    {
                      'colour-finder__option-label--selected': desiredColour === dc.id,
                    },
                  ]"
                >
                  {{ dc.label }}
                </span>
              </button>
            </div>
          </div>

          <!-- Step 3: Results -->
          <div v-else-if="step === 3 && recommendation" key="step3" class="colour-finder__results">
            <div class="colour-finder__results-header">
              <Icon name="ucide:sparkles" class="colour-finder__results-icon" />
              <h2 class="colour-finder__results-title">Your Personalised Recommendation</h2>
            </div>

            <!-- Suitability Badge -->
            <div :class="['colour-finder__suitability', suitabilityConfig[recommendation.suitability].bg]">
              <Icon
                :name="suitabilityConfig[recommendation.suitability].icon"
                class="colour-finder__suitability-icon"
              />
              <div class="colour-finder__suitability-content">
                <p :class="['colour-finder__suitability-label', suitabilityConfig[recommendation.suitability].colour]">
                  {{ suitabilityConfig[recommendation.suitability].label }}
                </p>
                <p class="colour-finder__suitability-notes">
                  {{ recommendation.notes }}
                </p>
              </div>
            </div>

            <!-- Details Card -->
            <div class="colour-finder__details-card">
              <div class="colour-finder__details-header">
                <span class="colour-finder__details-method-label">Recommended Method</span>
                <span class="colour-finder__details-method-badge">
                  {{ recommendation.method }}
                </span>
              </div>
              <div class="colour-finder__details-list">
                <div
                  v-for="(detail, i) in recommendation.details"
                  :key="i"
                  v-motion
                  :initial="{ opacity: 0, x: -20 }"
                  :enter="{ opacity: 1, x: 0, transition: { delay: i * 100 } }"
                  class="colour-finder__details-item"
                >
                  <div class="colour-finder__details-bullet"></div>
                  <p class="colour-finder__details-text">
                    {{ detail }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Selections Summary -->
            <div class="colour-finder__summary">
              <div
                v-for="item in [
                  {
                    label: 'Hair Type',
                    value: hairTypes.find((h) => h.id === hairType)?.label,
                    swatch: undefined,
                    image: undefined,
                    textDark: false,
                  },
                  {
                    label: 'Natural Colour',
                    value: naturalColours.find((n) => n.id === naturalColour)?.label,
                    swatch: naturalColours.find((n) => n.id === naturalColour)?.colour,
                    image: naturalColours.find((n) => n.id === naturalColour)?.image,
                    textDark: naturalColours.find((n) => n.id === naturalColour)?.textDark,
                  },
                  {
                    label: 'Dream Colour',
                    value: desiredColours.find((d) => d.id === desiredColour)?.label,
                    swatch: desiredColours.find((d) => d.id === desiredColour)?.colour,
                    image: desiredColours.find((d) => d.id === desiredColour)?.image,
                    textDark: desiredColours.find((d) => d.id === desiredColour)?.textDark,
                  },
                ]"
                :key="item.label"
                class="colour-finder__summary-item"
              >
                <p class="colour-finder__summary-label">
                  {{ item.label }}
                </p>
                <div v-if="item.swatch" class="colour-finder__summary-swatch" :style="{ background: item.swatch }">
                  <NuxtImg
                    v-if="item.image"
                    :src="item.image"
                    alt=""
                    class="colour-finder__summary-image"
                    :class="{ 'colour-finder__summary-image--dark': item.textDark }"
                  />
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
                <button class="colour-finder__button colour-finder__button--secondary" @click="reset">Try Again</button>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Navigation Buttons -->
        <div v-if="step < 3" class="colour-finder__navigation">
          <button v-if="step > 0" class="colour-finder__nav-button colour-finder__nav-button--back" @click="back">
            <Icon name="lucide:arrow-left" class="colour-finder__nav-icon" />
            Back
          </button>
          <button
            :disabled="!canProceed"
            :class="[
              'colour-finder__nav-button colour-finder__nav-button--next',
              {
                'colour-finder__nav-button--disabled': !canProceed,
              },
            ]"
            @click="next"
          >
            Next
            <Icon name="lucide:arrow-right" class="colour-finder__nav-icon" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

// ─── Types ────────────────────────────────────────────────────────────────────
type HairType = "straight" | "wavy" | "curly" | "coily";
type NaturalColour = "light-blonde" | "dark-blonde" | "light-brown" | "dark-brown" | "red" | "black" | "grey-white";
type DesiredColour = "blonde" | "brown" | "red" | "black" | "vivid" | "balayage";
type Suitability = "great" | "possible" | "difficult" | "not-recommended";

interface Recommendation {
  suitability: Suitability;
  method: string;
  notes: string;
  details: string[];
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

const desiredColours: { id: DesiredColour; label: string; colour: string; image?: string; textDark?: boolean }[] = [
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

const STEPS = ["Hair Type", "Your Colour", "Dream Colour", "Results"];

// ─── Recommendation Matrix ────────────────────────────────────────────────────
function getRecommendation(natural: NaturalColour, desired: DesiredColour, hairType: HairType): Recommendation {
  const matrix: Record<NaturalColour, Record<DesiredColour, Recommendation>> = {
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
      vivid: {
        suitability: "possible",
        method: "Semi-Permanent",
        notes: "Pastel vivid shades work well on your light base, but fade fast.",
        details: [
          "Pastels like lilac, rose, and mint are ideal",
          "No bleaching needed — a rare advantage",
          "Colours fade within 4-8 washes typically",
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

// ─── State ────────────────────────────────────────────────────────────────────
const step = ref(0);
const hairType = ref<HairType | null>(null);
const naturalColour = ref<NaturalColour | null>(null);
const desiredColour = ref<DesiredColour | null>(null);

const recommendation = computed<Recommendation | null>(() => {
  if (hairType.value && naturalColour.value && desiredColour.value) {
    return getRecommendation(naturalColour.value, desiredColour.value, hairType.value);
  }
  return null;
});

const canProceed = computed(
  () =>
    (step.value === 0 && !!hairType.value) ||
    (step.value === 1 && !!naturalColour.value) ||
    (step.value === 2 && !!desiredColour.value) ||
    step.value === 3
);

function next() {
  if (canProceed.value && step.value < 3) step.value++;
}
function back() {
  if (step.value > 0) step.value--;
}
function reset() {
  step.value = 0;
  hairType.value = null;
  naturalColour.value = null;
  desiredColour.value = null;
}

// ─── Suitability config ───────────────────────────────────────────────────────
const suitabilityConfig: Record<Suitability, { icon: string; label: string; colour: string; bg: string }> = {
  great: {
    icon: "lucide:check",
    label: "Great Match",
    colour: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/30",
  },
  possible: {
    icon: "lucide:alert-triangle",
    label: "Possible with Care",
    colour: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/30",
  },
  difficult: {
    icon: "lucide:triangle-alert",
    label: "Challenging",
    colour: "text-orange-400",
    bg: "bg-orange-400/10 border-orange-400/30",
  },
  "not-recommended": {
    icon: "lucide:x",
    label: "Not Recommended",
    colour: "text-red-400",
    bg: "bg-red-400/10 border-red-400/30",
  },
};
</script>

<style lan="css">
/* CSS Custom Properties */
.colour-finder {
  --_primary-color: hsl(var(--colour-finder-primary-colour));
  --_primary-foreground: hsl(var(--primary-foreground));
  --_background: hsl(var(--background));
  --_foreground: hsl(var(--foreground));
  --_muted: hsl(var(--muted));
  --_muted-foreground: hsl(var(--muted-foreground));
  --_emerald-400: hsl(160 84% 39%);
  --_amber-400: hsl(43 96% 56%);
  --_orange-400: hsl(25 95% 53%);
  --_red-400: hsl(0 84% 60%);
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

/* Main Container */
.colour-finder {
  background-color: var(--_background);
  color: var(--_foreground);

  &.colour-finder__container {
    padding-block-start: 7rem;
    padding-block-end: 5rem;
    padding-inline: var(--_spacing-lg);

    @container (min-width: 1024px) {
      padding-inline: var(--_spacing-2xl);
    }
  }

  .colour-finder__content {
    /* max-inline-size: 64rem; */
    margin-inline: auto;
  }
}

/* Header Styles */
.colour-finder__header {
  text-align: center;
  margin-block-end: var(--_spacing-3xl);

  .colour-finder__label {
    /* font-size: 0.75rem; */
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
    max-inline-size: 28rem;
    margin-inline: auto;
  }
}

/* Progress Steps */
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
    gap: 1rem;
    padding: 0.8rem 1.2rem;
    /* font-size: 0.75rem; */
    /* letter-spacing: 0.15em; */
    text-transform: uppercase;
    border: 1px solid var(--colour-finder-border-colour);
    background: transparent;
    color: var(--_muted-foreground);
    transition: all var(--_transition-duration) ease;
    cursor: pointer;

    &--active {
      border-color: var(--_primary-color);
      color: var(--_primary-color);
    }

    &--completed {
      border-color: color-mix(in srgb, var(--_primary-color) 30%, transparent);
      color: color-mix(in srgb, var(--_primary-color) 60%, transparent);
    }

    &--inactive {
      border-color: var(--colour-finder-border-colour);
      color: var(--_muted-foreground);
    }
  }

  .colour-finder__progress-indicator {
    inline-size: 1.25rem;
    block-size: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    /* font-size: 0.625rem; */
    font-weight: 500;
    border-radius: 50%;

    &--completed {
      background-color: var(--_primary-color);
      color: var(--_primary-foreground);
    }

    &--active {
      border: 1px solid var(--_primary-color);
      color: var(--_primary-color);
    }

    &--inactive {
      border: 1px solid var(--_muted-foreground);
      color: var(--_muted-foreground);
    }
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

    &--completed {
      background-color: var(--_primary-color);
    }
  }
}

/* Steps */
.colour-finder__step {
  .colour-finder__step-title {
    font-family: var(--_font-display);
    /* font-size: 1.5rem; */
    text-align: center;
    margin-block-end: var(--_spacing-xl);
  }
}

/* Options Grid */
.colour-finder__options {
  display: grid;
  gap: var(--_spacing-md);
  margin-inline: auto;

  &.colour-finder__options--hair-type {
    grid-template-columns: repeat(2, 1fr);
    /* max-inline-size: 32rem; */

    @media (min-width: 768px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  &.colour-finder__options--natural-colour {
    grid-template-columns: repeat(2, 1fr);
    /* max-inline-size: 48rem; */

    @media (min-width: 640px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  &.colour-finder__options--desired-colour {
    grid-template-columns: repeat(2, 1fr);
    /* max-inline-size: 48rem; */

    @media (min-width: 640px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}

.colour-finder__option {
  padding: var(--_spacing-lg);
  border: 1px solid var(--colour-finder-border-colour);
  background: transparent;
  text-align: center;
  cursor: pointer;
  transition: all var(--_transition-duration) ease;
  border-radius: var(--_border-radius);

  &:hover {
    border-color: color-mix(in srgb, var(--_primary-color) 50%, transparent);
  }

  &--selected {
    border-color: var(--_primary-color);
    background-color: color-mix(in srgb, var(--_primary-color) 5%, transparent);
    box-shadow: 0 4px 20px color-mix(in srgb, var(--_primary-color) 20%, transparent);
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
    border-radius: 50%;
    margin-inline: auto;
    margin-block-end: 0.75rem;
    border: 1px solid color-mix(in srgb, var(--_foreground) 10%, transparent);

    .colour-finder__option-image {
      inline-size: 100%;
      block-size: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
  }

  .colour-finder__option-label {
    /* font-size: 0.75rem; */
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--_muted-foreground);
    transition: color var(--_transition-duration) ease;

    &--selected {
      color: var(--_primary-color);
    }
  }

  &:hover .colour-finder__option-label {
    color: var(--_foreground);
  }
}

/* Results Section */
.colour-finder__results {
  /* max-inline-size: 32rem; */
  margin-inline: auto;

  .colour-finder__results-header {
    text-align: center;
    margin-block-end: 2.5rem;

    .colour-finder__results-icon {
      inline-size: 2rem;
      block-size: 2rem;
      color: var(--_primary-color);
      margin-inline: auto;
      margin-block-end: var(--_spacing-md);
    }

    .colour-finder__results-title {
      font-family: var(--_font-display);
      /* font-size: 1.5rem; */
      margin-block-end: var(--_spacing-sm);
    }
  }
}

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
  }

  .colour-finder__suitability-label {
    font-family: var(--_font-display);
    /* font-size: 1.125rem; */
  }

  .colour-finder__suitability-notes {
    color: var(--_muted-foreground);
    /* font-size: 0.875rem; */
    font-weight: 300;
  }
}

.colour-finder__details-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid color-mix(in srgb, var(--_foreground) 10%, transparent);
  border-radius: var(--_border-radius);
  padding: var(--_spacing-xl);
  margin-block-end: var(--_spacing-xl);

  .colour-finder__details-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-block-end: var(--_spacing-lg);

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
      /* font-size: 0.875rem; */
      border: 1px solid color-mix(in srgb, var(--_primary-color) 20%, transparent);
      border-radius: var(--_border-radius);
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
      /* font-size: 0.875rem; */
      /* line-height: 1.6; */
    }
  }
}

.colour-finder__summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--_spacing-md);
  margin-block-end: 2.5rem;

  .colour-finder__summary-item {
    text-align: center;
    padding: var(--_spacing-md);
    border: 1px solid var(--colour-finder-border-colour);
    border-radius: var(--_border-radius);

    .colour-finder__summary-label {
      /* font-size: 0.625rem; */
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--_muted-foreground);
      margin-block-end: var(--_spacing-sm);
    }

    .colour-finder__summary-swatch {
      aspect-ratio: 1 / 1;
      block-size: 6rem;
      border-radius: 50%;
      margin-inline: auto;
      margin-block-end: var(--_spacing-sm);
      border: 1px solid color-mix(in srgb, var(--_foreground) 10%, transparent);
      overflow: hidden;

      .colour-finder__summary-image {
        inline-size: 100%;
        block-size: 100%;
        /* border-radius: 50%; */
        object-fit: cover;

        &--dark {
          filter: brightness(0.8) contrast(1.1);
        }
      }
    }

    .colour-finder__summary-value {
      /* font-size: 0.875rem; */
      color: var(--_foreground);
    }
  }
}

.colour-finder__cta {
  text-align: center;

  .colour-finder__cta-disclaimer {
    color: var(--_muted-foreground);
    /* font-size: 0.875rem; */
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
  /* font-size: 0.875rem; */
  letter-spacing: 0.15em;
  text-transform: uppercase;
  text-decoration: none;
  transition: all var(--_transition-duration) ease;
  border-radius: var(--_border-radius);
  cursor: pointer;
  border: 1px solid transparent;

  &--primary {
    background-color: var(--_primary-color);
    color: var(--_primary-foreground);
    box-shadow: 0 4px 20px color-mix(in srgb, var(--_primary-color) 20%, transparent);

    &:hover {
      background-color: color-mix(in srgb, var(--_primary-color) 90%, transparent);
    }
  }

  &--secondary {
    border-color: color-mix(in srgb, var(--_foreground) 20%, transparent);
    color: var(--_foreground);

    &:hover {
      border-color: var(--_primary-color);
      color: var(--_primary-color);
    }
  }
}

/* Navigation */
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
    /* font-size: 0.875rem; */
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

    &--back {
      color: var(--_muted-foreground);

      &:hover {
        color: var(--_foreground);
      }
    }

    &--next {
      padding: 0.75rem var(--_spacing-xl);
      background-color: var(--_primary-color);
      color: var(--_primary-foreground);
      box-shadow: 0 4px 20px color-mix(in srgb, var(--_primary-color) 20%, transparent);

      &:hover {
        background-color: color-mix(in srgb, var(--_primary-color) 90%, transparent);
      }

      &--disabled {
        background-color: var(--_muted);
        color: var(--_muted-foreground);
        cursor: not-allowed;
        box-shadow: none;

        &:hover {
          background-color: var(--_muted);
        }
      }
    }
  }
}

/* Slide transition — replaces framer-motion AnimatePresence */
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

/* Suitability specific styles that reference the suitability config */
.colour-finder__suitability {
  &.bg-emerald-400\/10 {
    background-color: color-mix(in srgb, var(--_emerald-400) 10%, transparent);
    border-color: color-mix(in srgb, var(--_emerald-400) 30%, transparent);
  }

  &.bg-amber-400\/10 {
    background-color: color-mix(in srgb, var(--_amber-400) 10%, transparent);
    border-color: color-mix(in srgb, var(--_amber-400) 30%, transparent);
  }

  &.bg-orange-400\/10 {
    background-color: color-mix(in srgb, var(--_orange-400) 10%, transparent);
    border-color: color-mix(in srgb, var(--_orange-400) 30%, transparent);
  }

  &.bg-red-400\/10 {
    background-color: color-mix(in srgb, var(--_red-400) 10%, transparent);
    border-color: color-mix(in srgb, var(--_red-400) 30%, transparent);
  }
}

.text-emerald-400 {
  color: var(--_emerald-400);
}

.text-amber-400 {
  color: var(--_amber-400);
}

.text-orange-400 {
  color: var(--_orange-400);
}

.text-red-400 {
  color: var(--_red-400);
}
</style>
