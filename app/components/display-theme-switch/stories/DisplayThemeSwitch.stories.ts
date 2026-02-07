import type { Meta, StoryFn } from "@nuxtjs/storybook";
import StorybookComponent from "../DisplayThemeSwitch.vue";

interface DisplayThemeSwitchStoryArgs {
  styleClassPassthrough: string[];
}

export default {
  title: "Components/Display/DisplayThemeSwitch",
  component: StorybookComponent,
  argTypes: {
    // Styling
    styleClassPassthrough: {
      control: "object",
      description: "Additional CSS classes to pass through",
      table: {
        category: "Styling",
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "A theme switching component that allows users to toggle between system, light, and dark color schemes. This component integrates with the app's color scheme settings and provides a smooth animated toggle interface.",
      },
    },
  },
} as Meta<DisplayThemeSwitchStoryArgs>;

const Template: StoryFn<DisplayThemeSwitchStoryArgs> = (_args, { argTypes }) => ({
  components: { StorybookComponent },
  props: Object.keys(argTypes),
  setup() {
    return { args: _args };
  },
  template: `
    <div style="padding: 2rem;">
      <div style="margin-bottom: 1.5rem;">
        <h3 style="margin: 0 0 0.5rem 0; font-size: 1.8rem;">Theme Selector</h3>
        <p style="margin: 0; color: #666; font-size: 1.4rem;">
          Choose your preferred color scheme. system mode follows your system preference.
        </p>
      </div>

      <StorybookComponent
        :style-class-passthrough="args.styleClassPassthrough"
      />

      <div style="margin-top: 1.5rem; padding: 1rem; background: var(--theme-surface); border-radius: 8px; border: 1px solid var(--theme-border);">
        <h4 style="margin: 0 0 0.5rem 0; font-size: 1.6rem;">Theme Preview</h4>
        <p style="margin: 0 0 1rem 0; color: var(--theme-text-secondary); font-size: 1.6rem;">
          This area demonstrates how the theme affects content appearance:
        </p>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <div style="padding: 0.75rem; background: var(--theme-primary); color: var(--theme-primary-text); border-radius: 4px; font-size: 1.4rem;">
            Primary Color
          </div>
          <div style="padding: 0.75rem; background: var(--theme-secondary); color: var(--theme-secondary-text); border-radius: 4px; font-size: 1.4rem;">
            Secondary Color
          </div>
          <div style="padding: 0.75rem; background: var(--theme-surface-variant); color: var(--theme-text); border-radius: 4px; border: 1px solid var(--theme-border); font-size: 1.4rem;">
            Surface Variant
          </div>
        </div>
      </div>

      <div style="margin-top: 1.5rem; font-size: 1.2rem; color: #666;">
        <strong>Usage:</strong> This component automatically syncs with your app's theme settings. Changes are persisted and applied globally.
      </div>
    </div>
  `,
});

export const Default = Template.bind({});
Default.args = {
  styleClassPassthrough: [],
};
Default.parameters = {
  docs: {
    description: {
      story:
        "The default theme switch with system, light, and dark mode options. The component features smooth animations and integrates with the application's global theme state.",
    },
  },
};

export const WithCustomStyling = Template.bind({});
WithCustomStyling.args = {
  styleClassPassthrough: ["small"],
};
WithCustomStyling.parameters = {
  docs: {
    description: {
      story:
        'Theme switch with custom styling classes applied. The "small" class provides specialized styling for enhanced visual appearance.',
    },
  },
};

export const InNavigation = Template.bind({});
InNavigation.args = {
  styleClassPassthrough: ["small"],
};

// Custom template for navigation context
InNavigation.render = (args, { argTypes }) => ({
  components: { StorybookComponent },
  props: Object.keys(argTypes),
  setup() {
    return { args };
  },
  template: `
    <div style="background: var(--theme-surface); padding: 1rem;">
      <nav style="display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.5rem; background: var(--theme-surface-variant); border-radius: 8px; border: 1px solid var(--theme-border);">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="font-weight: 600; color: var(--theme-text); font-size: 1.125rem;">
            My App
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <a href="#" style="color: var(--theme-text-secondary); text-decoration: none; padding: 0.5rem; border-radius: 4px; font-size: 0.875rem;">Home</a>
            <a href="#" style="color: var(--theme-text-secondary); text-decoration: none; padding: 0.5rem; border-radius: 4px; font-size: 0.875rem;">About</a>
            <a href="#" style="color: var(--theme-text-secondary); text-decoration: none; padding: 0.5rem; border-radius: 4px; font-size: 0.875rem;">Contact</a>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 1rem;">
          <span style="color: var(--theme-text-secondary); font-size: 0.875rem;">Theme:</span>
          <StorybookComponent :style-class-passthrough="args.styleClassPassthrough" />
        </div>
      </nav>

      <div style="margin-top: 1.5rem; padding: 1.5rem; background: var(--theme-surface-variant); border-radius: 8px; border: 1px solid var(--theme-border);">
        <h2 style="margin: 0 0 1rem 0; color: var(--theme-text);">Page Content</h2>
        <p style="margin: 0 0 1rem 0; color: var(--theme-text-secondary); line-height: 1.5;">
          This demonstrates how the theme switch works in a typical navigation context.
          The theme changes are applied immediately across all interface elements.
        </p>
        <div style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; background: var(--theme-primary); color: var(--theme-primary-text); border-radius: 6px; font-size: 0.875rem; font-weight: 500;">
          <span>🎨</span>
          Dynamic Theming Active
        </div>
      </div>
    </div>
  `,
});
InNavigation.parameters = {
  docs: {
    description: {
      story:
        "Example of the theme switch integrated into a navigation bar context, showing how it works alongside other UI elements and how theme changes affect the entire interface.",
    },
  },
};
