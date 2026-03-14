import ContactSection from "../tests/ContactSection.vue";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

const meta: Meta<typeof ContactSection> = {
  title: "Molecules/ContactSection",
  component: ContactSection,
  argTypes: {
    tag: {
      control: { type: "select" },
      options: ["div", "section", "article", "main"],
      description: "HTML element to render as the root",
    },
    stepperIndicatorSize: {
      control: "text",
      description: "Size of the StepperList indicator bubble (any valid CSS length)",
    },
    styleClassPassthrough: {
      control: "object",
      description: "Additional CSS classes applied to the root element",
    },
  },
  args: {
    tag: "div",
    stepperIndicatorSize: "3rem",
    styleClassPassthrough: [],
  },
};

export default meta;
type Story = StoryObj<typeof ContactSection>;

// ─── Stories ─────────────────────────────────────────────────────────────────

/** Default — three info items with default slot fallback content and no form. */
export const Default: Story = {
  render: (args) => ({
    components: { ContactSection },
    setup() {
      return { args };
    },
    template: `<ContactSection v-bind="args" />`,
  }),
};

/** With form — a contact form in the form slot alongside the info items. */
export const WithForm: Story = {
  name: "With Contact Form",
  render: (args) => ({
    components: { ContactSection },
    setup() {
      return { args };
    },
    template: `
      <ContactSection v-bind="args">
        <template #item-0>
          <div>
            <strong>Get in touch</strong>
            <p class="page-body-normal">We'd love to hear from you. Fill in the form and we'll get back to you within one business day.</p>
          </div>
        </template>
        <template #item-1>
          <div>
            <strong>Email us</strong>
            <p class="page-body-normal"><a href="mailto:hello@example.com">hello@example.com</a></p>
          </div>
        </template>
        <template #item-2>
          <div>
            <strong>Call us</strong>
            <p class="page-body-normal"><a href="tel:+441234567890">+44 1234 567 890</a> — Monday to Friday, 9am–5pm</p>
          </div>
        </template>
        <template #form>
          <form style="display:flex;flex-direction:column;gap:1rem;">
            <div style="display:flex;flex-direction:column;gap:0.25rem;">
              <label for="name">Name</label>
              <input id="name" type="text" placeholder="Your name" style="padding:0.5rem;border:1px solid #ccc;border-radius:0.25rem;" />
            </div>
            <div style="display:flex;flex-direction:column;gap:0.25rem;">
              <label for="email">Email</label>
              <input id="email" type="email" placeholder="your@email.com" style="padding:0.5rem;border:1px solid #ccc;border-radius:0.25rem;" />
            </div>
            <div style="display:flex;flex-direction:column;gap:0.25rem;">
              <label for="message">Message</label>
              <textarea id="message" rows="5" placeholder="How can we help?" style="padding:0.5rem;border:1px solid #ccc;border-radius:0.25rem;resize:vertical;"></textarea>
            </div>
            <button type="submit" style="padding:0.75rem 1.5rem;background:#111;color:#fff;border:none;border-radius:0.25rem;cursor:pointer;">Send message</button>
          </form>
        </template>
      </ContactSection>
    `,
  }),
};

/** With custom indicators — icons alongside each info item. */
export const WithCustomIndicators: Story = {
  name: "With Custom Indicators",
  render: (args) => ({
    components: { ContactSection },
    setup() {
      return { args };
    },
    template: `
      <ContactSection v-bind="args">
        <template #indicator-0>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
        </template>
        <template #item-0>
          <div>
            <strong>Location</strong>
            <p class="page-body-normal">123 High Street, Bath, BA1 1AA</p>
          </div>
        </template>
        <template #indicator-1>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.26h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 15.92z"/>
          </svg>
        </template>
        <template #item-1>
          <div>
            <strong>Phone</strong>
            <p class="page-body-normal"><a href="tel:+441234567890">+44 1234 567 890</a></p>
          </div>
        </template>
        <template #indicator-2>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
          </svg>
        </template>
        <template #item-2>
          <div>
            <strong>Email</strong>
            <p class="page-body-normal"><a href="mailto:hello@example.com">hello@example.com</a></p>
          </div>
        </template>
        <template #form>
          <form style="display:flex;flex-direction:column;gap:1rem;">
            <div style="display:flex;flex-direction:column;gap:0.25rem;">
              <label for="name2">Name</label>
              <input id="name2" type="text" placeholder="Your name" style="padding:0.5rem;border:1px solid #ccc;border-radius:0.25rem;" />
            </div>
            <div style="display:flex;flex-direction:column;gap:0.25rem;">
              <label for="message2">Message</label>
              <textarea id="message2" rows="5" placeholder="How can we help?" style="padding:0.5rem;border:1px solid #ccc;border-radius:0.25rem;resize:vertical;"></textarea>
            </div>
            <button type="submit" style="padding:0.75rem 1.5rem;background:#111;color:#fff;border:none;border-radius:0.25rem;cursor:pointer;">Send message</button>
          </form>
        </template>
      </ContactSection>
    `,
  }),
};

/** As section tag — renders the root as a semantic section element. */
export const AsSectionTag: Story = {
  name: "As section Tag",
  args: {
    tag: "section",
  },
  render: (args) => ({
    components: { ContactSection },
    setup() {
      return { args };
    },
    template: `
      <ContactSection v-bind="args">
        <template #item-0>
          <p class="page-body-normal">Contact info item one.</p>
        </template>
        <template #item-1>
          <p class="page-body-normal">Contact info item two.</p>
        </template>
        <template #item-2>
          <p class="page-body-normal">Contact info item three.</p>
        </template>
      </ContactSection>
    `,
  }),
};

/** With styleClassPassthrough — demonstrates custom classes on the root element. */
export const WithStyleClassPassthrough: Story = {
  name: "With styleClassPassthrough",
  args: {
    styleClassPassthrough: ["custom-class", "another-class"],
  },
  render: (args) => ({
    components: { ContactSection },
    setup() {
      return { args };
    },
    template: `
      <ContactSection v-bind="args">
        <template #item-0><p class="page-body-normal">Item one</p></template>
        <template #item-1><p class="page-body-normal">Item two</p></template>
        <template #item-2><p class="page-body-normal">Item three</p></template>
      </ContactSection>
    `,
  }),
};
