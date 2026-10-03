import { computed, ref } from "vue";
import GoogleReviews from "../GoogleReviews.vue";
import CanvasSwitcher from "../../../01.atoms/canvas-switcher/CanvasSwitcher.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";
import type { GoogleReview, GoogleReviewsData, MediaCanvas } from "~/types/components";

type LineClamp = "none" | "1" | "2" | "3" | "4" | "5" | "6" | "8";

type StoryArgs = InstanceType<typeof GoogleReviews>["$props"] & {
  authorLineClamp: LineClamp;
  textLineClamp: LineClamp;
};

const lineClampOptions: LineClamp[] = ["none", "1", "2", "3", "4", "5", "6", "8"];

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const review = (n: number, rating: number, text: string, photo = true): GoogleReview => ({
  authorName: ["Priya Shah", "Tom Ellis", "Grace Okafor", "Liam Byrne", "Mei Chen"][n - 1] ?? `Reviewer ${n}`,
  authorUri: `https://www.google.com/maps/contrib/${n}`,
  authorPhotoUri: photo ? `https://picsum.photos/seed/reviewer-${n}/96/96` : undefined,
  rating,
  text,
  relativeTime: `${n} weeks ago`,
  publishTime: "2026-09-18T10:00:00Z",
  reviewUri: `https://www.google.com/maps/review/${n}`,
});

const fiveReviews: GoogleReview[] = [
  review(1, 5, "Friendly, professional and really listened to what I wanted. Couldn't be happier with the result."),
  review(2, 5, "Booked last minute and they still fitted me in. Great atmosphere and a brilliant finish."),
  review(3, 4, "Lovely salon and a great cut. Parking nearby is a bit tricky, but worth it."),
  review(4, 5, "Third visit now and every one has been spot on. Highly recommend."),
  review(5, 3, "Good service overall, though my appointment started twenty minutes late."),
];

const baseData: GoogleReviewsData = {
  placeName: "Example Salon",
  rating: 4.6,
  totalReviews: 214,
  mapsUri: "https://www.google.com/maps?cid=1",
  reviews: fiveReviews,
};

const longText =
  "I've been coming here for a couple of years now and wanted to finally write something.\n\nFrom the moment you walk in it's clear they care: the consultation is thorough, nobody rushes you, and they explain exactly what they're doing and why. My hair has never been in better condition, and the aftercare advice has made a real difference between visits. The team are warm and welcoming, the space is calm, and it genuinely feels like a treat rather than a chore. Can't recommend them highly enough.";

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<StoryArgs> = {
  title: "Organisms/Google Reviews",
  component: GoogleReviews,
  argTypes: {
    authorLineClamp: {
      control: "select",
      options: lineClampOptions,
      description: "Story control for --google-reviews-author-line-clamp (1 = single-line ellipsis)",
      table: { category: "CSS tokens" },
    },
    textLineClamp: {
      control: "select",
      options: lineClampOptions,
      description: "Story control for --google-reviews-text-line-clamp",
      table: { category: "CSS tokens" },
    },
    data: { control: "object", description: "GoogleReviewsData, usually from useGoogleReviews()" },
    minRating: { control: { type: "range", min: 0, max: 5, step: 1 }, description: "Hide reviews below this rating; shows the filter notice" },
    showSummary: { control: "boolean", description: "Overall rating, stars and total count" },
    tag: { control: "select", options: ["section", "div"] },
    ariaLabel: { control: "text" },
    prevLabel: { control: "text" },
    nextLabel: { control: "text" },
    ratingLabel: { control: "text", description: "{rating} is replaced" },
    totalLabel: { control: "text", description: "{count} is replaced" },
    readMoreLabel: { control: "text" },
    filterNotice: { control: "text", description: "{rating} is replaced" },
    attributionText: { control: "text", description: "Must keep the words \"Google Maps\"" },
  },
  args: {
    data: baseData,
    minRating: 0,
    showSummary: true,
    tag: "section",
    authorLineClamp: "2",
    textLineClamp: "5",
  },
  decorators: [
    (story, context) => ({
      components: { story, CanvasSwitcher },
      setup() {
        const canvasName = ref<MediaCanvas>(context.parameters.initialCanvas ?? "fullWidthCanvas");
        return { canvasName };
      },
      template: `
        <div style="padding: 1.2rem 1.6rem; border-block-end: 1px solid currentColor;">
          <CanvasSwitcher v-model:canvas-name="canvasName" />
        </div>
        <div :class="canvasName" style="margin-inline: auto; padding: 2rem; outline: 1px dashed currentColor;">
          <story />
        </div>
      `,
    }),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Google reviews for one place, shown as a single horizontally scrolling row with prev/next buttons. Data comes from the layer's `/api/google-reviews` route via `useGoogleReviews()`; these stories use mock data.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

function useStorySetup(args: StoryArgs) {
  const componentArgs = computed(() => {
    const { authorLineClamp: _authorLineClamp, textLineClamp: _textLineClamp, ...rest } = args;
    return rest;
  });
  const tokenStyles = computed(() => ({
    "--google-reviews-author-line-clamp": args.authorLineClamp,
    "--google-reviews-text-line-clamp": args.textLineClamp,
  }));
  return { args, componentArgs, tokenStyles };
}

const render = (args: StoryArgs) => ({
  components: { GoogleReviews },
  setup() {
    return useStorySetup(args);
  },
  template: `<div :style="tokenStyles"><GoogleReviews v-bind="componentArgs" /></div>`,
});

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render,
  parameters: {
    docs: { description: { story: "Five reviews (Google's maximum). Use the canvas switcher above to try narrower widths." } },
  },
};

export const FewReviews: Story = {
  name: "Few Reviews (All Fit)",
  args: { data: { ...baseData, reviews: fiveReviews.slice(0, 2) } },
  render,
  parameters: {
    docs: { description: { story: "When every card fits, the prev/next buttons are hidden." } },
  },
};

export const NarrowContainer: Story = {
  render,
  parameters: {
    initialCanvas: "mobileCanvas",
    docs: {
      description: {
        story:
          "Phone-width container: the row stays a single row and scrolls with snapping. Check keyboard scrolling (focus the row, use the arrow keys) and that the buttons disable at each end.",
      },
    },
  },
};

export const LongText: Story = {
  args: { data: { ...baseData, reviews: [review(1, 5, longText), ...fiveReviews.slice(1)] } },
  render,
  parameters: {
    docs: { description: { story: "Long reviews are clamped (`--google-reviews-text-line-clamp`, default 5 lines) with a link to read the rest on Google." } },
  },
};

export const NoAvatars: Story = {
  args: { data: { ...baseData, reviews: fiveReviews.map((r) => ({ ...r, authorPhotoUri: undefined })) } },
  render,
  parameters: {
    docs: { description: { story: "Reviewers without a photo show their initials." } },
  },
};

export const Filtered: Story = {
  args: { minRating: 4 },
  render,
  parameters: {
    docs: { description: { story: "`minRating` hides lower-rated reviews and shows the filter notice Google's terms require." } },
  },
};

export const WithHeading: Story = {
  render: (args: StoryArgs) => ({
    components: { GoogleReviews },
    setup() {
      return useStorySetup(args);
    },
    template: `
      <div :style="tokenStyles">
        <GoogleReviews v-bind="componentArgs">
          <template #heading="{ headingId }">
            <h2 :id="headingId" style="margin:0">What clients say</h2>
          </template>
        </GoogleReviews>
      </div>
    `,
  }),
  parameters: {
    docs: { description: { story: "The `heading` slot receives `headingId`; binding it labels the section by the heading instead of `ariaLabel`." } },
  },
};

export const Themed: Story = {
  args: { textLineClamp: "3" },
  render: (args: StoryArgs) => ({
    components: { GoogleReviews },
    setup() {
      return useStorySetup(args);
    },
    template: `
      <div
        :style="[tokenStyles, {
          '--google-reviews-card-width': 'min(26rem, 80%)',
          '--google-reviews-card-surface': 'var(--amber-01)',
          '--google-reviews-card-text-colour': 'var(--amber-10)',
          '--google-reviews-card-border-colour': 'var(--amber-03)',
          '--google-reviews-card-border-radius': '2rem',
          '--google-reviews-star-colour': 'var(--amber-07)',
        }]"
      >
        <GoogleReviews v-bind="componentArgs" />
      </div>
    `,
  }),
  parameters: {
    docs: { description: { story: "Card width, colours, radius, star colour and line clamp set through public tokens on a wrapper." } },
  },
};

// ─── Stress test ──────────────────────────────────────────────────────────────

const stressReviews: GoogleReview[] = [
  {
    authorName: "Bartholomew Maximilian Montgomery-Fitzgerald-Worthington-Smythe the Third of Little Snoring",
    authorUri: "https://www.google.com/maps/contrib/1",
    authorPhotoUri: "https://picsum.photos/seed/reviewer-1/96/96",
    rating: 5,
    text: `${"Absolutely wonderful. ".repeat(60)}\n\n\n\nStill going after four blank lines.`,
    relativeTime: "11 years, 4 months and 3 days ago (edited)",
    publishTime: "2015-06-01T10:00:00Z",
    reviewUri: "https://www.google.com/maps/review/1",
  },
  {
    authorName: "Pneumonoultramicroscopicsilicovolcanoconiosisfanaccountnospaces",
    rating: 1,
    text: `Sooooooo${"o".repeat(200)} good. See https://example.com/a/very/long/path/that/never/breaks/${"segment".repeat(20)}`,
    relativeTime: "a week ago",
    publishTime: "",
  },
  {
    authorName: "🌸✨ Rosa 🌸",
    authorPhotoUri: "https://example.invalid/expired-photo.jpg",
    rating: 4.95,
    text: "Emoji everywhere 💇‍♀️💅🏽🔥🔥🔥 and <script>alert('xss')</script> rendered as text, plus &amp; entities.",
    relativeTime: "yesterday",
    publishTime: "2026-10-02T10:00:00Z",
    reviewUri: "https://www.google.com/maps/review/3",
  },
  {
    authorName: "مريم الحسيني",
    rating: 3,
    text: "خدمة رائعة وفريق ودود جداً. سأعود بالتأكيد! Mixed with English mid-sentence.",
    relativeTime: "منذ أسبوعين",
    publishTime: "2026-09-18T10:00:00Z",
    reviewUri: "https://www.google.com/maps/review/4",
  },
  {
    authorName: "X",
    rating: 0,
    text: "",
    relativeTime: "",
    publishTime: "",
  },
  {
    authorName: "",
    rating: 7,
    text: ".",
    relativeTime: "just now",
    publishTime: "2026-10-03T10:00:00Z",
    reviewUri: "https://www.google.com/maps/review/6",
  },
];

export const StressTest: Story = {
  name: "Stress Test (Worst-Case Data)",
  args: {
    data: {
      placeName: "A Place Name That Goes On And On ".repeat(5),
      rating: 4.95,
      totalReviews: 123456789,
      mapsUri: "https://www.google.com/maps?cid=1",
      reviews: stressReviews,
    },
    ratingLabel: "Durchschnittliche Bewertung von {rating} von insgesamt fünf möglichen Sternen",
    totalLabel: "{count} Rezensionen auf Google ansehen und weitere Bewertungen unserer Kundschaft lesen",
    readMoreLabel: "Vollständige Rezension auf Google Maps weiterlesen",
    attributionText: "Rezensionen bereitgestellt von Google Maps, Inhalte von Dritten, ohne Gewähr für Richtigkeit",
  },
  render,
  parameters: {
    docs: {
      description: {
        story:
          "Deliberately hostile data to find breakage: very long and unbroken author names and text, " +
          "blank lines, an unbroken URL (reviewer names are clamped to 2 lines, review text to 5), emoji (including in initials), HTML-like text (must render as text), " +
          "right-to-left Arabic, empty name/text/date, a broken photo URL, out-of-range ratings (0, 4.95, 7), " +
          "a nine-digit total and long German copy for every label. Check at every canvas width: nothing " +
          "should overflow its card, cards stay one row, and the footer wraps cleanly.",
      },
    },
  },
};
