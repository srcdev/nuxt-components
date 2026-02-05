import type { Meta, StoryFn } from "@nuxtjs/storybook";
import ContainerGlowCoreComponent from "../ContainerGlowCore.vue";

// Define the args interface
interface ContainerGlowCoreArgs {
  itemCount: number;
  tag: string;
  styleClassPassthrough: string[];
  config: {
    proximity: number;
    spread: number;
    blur: number;
    gap: number;
    vertical: boolean;
    opacity: number;
  };
}

export default {
  title: "Components/Effects/ContainerGlowCore",
  component: ContainerGlowCoreComponent,
  argTypes: {
    // Core Properties
    itemCount: {
      control: { type: "range", min: 1, max: 6, step: 1 },
      description: "Number of glowing containers to render",
      table: {
        category: "Core",
      },
    },
    tag: {
      control: { type: "text" },
      description: "HTML tag for each container",
      table: {
        category: "Semantic",
      },
    },
    // Config Object
    config: {
      control: { type: "object" },
      description: "Configuration object for glow effects",
      table: {
        category: "Configuration",
      },
    },
    // Individual config controls
    "config.proximity": {
      control: { type: "range", min: 10, max: 200, step: 10 },
      description: "Mouse proximity distance to trigger glow effect (px)",
      table: {
        category: "Glow Settings",
      },
    },
    "config.spread": {
      control: { type: "range", min: 20, max: 180, step: 10 },
      description: "Angular spread of the glow effect (degrees)",
      table: {
        category: "Glow Settings",
      },
    },
    "config.blur": {
      control: { type: "range", min: 0, max: 50, step: 2 },
      description: "Blur amount for the glow effect (px)",
      table: {
        category: "Glow Settings",
      },
    },
    "config.gap": {
      control: { type: "range", min: 8, max: 64, step: 4 },
      description: "Gap between containers (px)",
      table: {
        category: "Layout",
      },
    },
    "config.vertical": {
      control: { type: "boolean" },
      description: "Arrange containers vertically instead of horizontally",
      table: {
        category: "Layout",
      },
    },
    "config.opacity": {
      control: { type: "range", min: 0.05, max: 1, step: 0.05 },
      description: "Opacity of the glow effect when not hovering",
      table: {
        category: "Glow Settings",
      },
    },
    // Hide complex props
    styleClassPassthrough: {
      table: {
        disable: true,
      },
    },
  },
  args: {
    itemCount: 3,
    tag: "div",
    styleClassPassthrough: [],
    config: {
      proximity: 40,
      spread: 80,
      blur: 20,
      gap: 32,
      vertical: false,
      opacity: 0.15,
    },
  },
  parameters: {
    docs: {
      description: {
        component: "An interactive glow effect component that creates multiple containers with animated gradient borders that respond to mouse movement. Each container glows more intensely when the cursor is nearby, with customizable proximity detection, blur effects, and gradient animations.",
      },
    },
  },
} as Meta<ContainerGlowCoreArgs>;

const Template: StoryFn<ContainerGlowCoreArgs> = (args) => ({
  components: { ContainerGlowCoreComponent },
  setup() {
    return { args };
  },
  template: `
    <div style="background: radial-gradient(ellipse at center, #0f0f23 0%, #020024 100%); padding: 60px 40px; min-height: 80vh; display: flex; align-items: center; justify-content: center;">
      <div style="text-align: center; width: 100%;">
        <div style="margin-bottom: 40px;">
          <h2 style="color: white; margin: 0 0 16px 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);">
            ✨ Interactive Glow Effects
          </h2>
          <p style="color: rgba(255, 255, 255, 0.8); margin: 0 0 8px 0; font-size: 16px;">
            Move your mouse over the containers to see the glow effect
          </p>
          <p style="color: rgba(255, 255, 255, 0.6); margin: 0; font-size: 14px;">
            {{ args.itemCount }} container{{ args.itemCount > 1 ? 's' : '' }} • {{ args.config.vertical ? 'Vertical' : 'Horizontal' }} layout
          </p>
        </div>
        
        <ContainerGlowCoreComponent
          :item-count="args.itemCount"
          :tag="args.tag"
          :style-class-passthrough="args.styleClassPassthrough"
          :config="args.config"
        >
          <template v-for="n in args.itemCount" :key="n" v-slot:['container-glow-' + (n - 1)]>
            <div style="height: 100%; display: flex; flex-direction: column;">
              <div style="text-align: center; margin-bottom: 16px;">
                <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; margin: 0 auto 12px auto; display: flex; align-items: center; justify-content: center; font-size: 20px; color: white; font-weight: bold;">
                  {{ n }}
                </div>
                <h3 style="margin: 0 0 8px 0; color: #374151; font-size: 18px; font-weight: 600;">
                  Container {{ n }}
                </h3>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">
                  Interactive glow card
                </p>
              </div>
              
              <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; text-align: center; padding: 16px 0;">
                <div style="padding: 16px; background: rgba(0, 0, 0, 0.02); border-radius: 8px; margin-bottom: 16px;">
                  <h4 style="margin: 0 0 8px 0; color: #4b5563; font-size: 14px; font-weight: 600;">Effect Settings</h4>
                  <div style="font-family: monospace; font-size: 11px; color: #6b7280; line-height: 1.4;">
                    <div>Proximity: {{ args.config.proximity }}px</div>
                    <div>Spread: {{ args.config.spread }}°</div>
                    <div>Blur: {{ args.config.blur }}px</div>
                  </div>
                </div>
                
                <div style="padding: 12px; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 6px; border-left: 3px solid #3b82f6;">
                  <p style="margin: 0; color: #1e40af; font-size: 12px; line-height: 1.4; font-weight: 500;">
                    💡 Hover to activate the glow effect with mouse tracking
                  </p>
                </div>
              </div>
            </div>
          </template>
        </ContainerGlowCoreComponent>
      </div>
    </div>
  `,
});

// ===== BASIC STORIES =====

export const Default = Template.bind({});
Default.args = {};

// ===== CONTAINER COUNT STORIES =====

export const SingleContainer = Template.bind({});
SingleContainer.args = {
  itemCount: 1,
};
SingleContainer.parameters = {
  docs: {
    description: {
      story: "Single container with glow effects - perfect for highlighting individual elements or call-to-action cards.",
    },
  },
};

export const TwoContainers = Template.bind({});
TwoContainers.args = {
  itemCount: 2,
};

export const FourContainers = Template.bind({});
FourContainers.args = {
  itemCount: 4,
};
FourContainers.parameters = {
  docs: {
    description: {
      story: "Four containers showing how the glow effect scales with multiple elements - ideal for feature grids or product showcases.",
    },
  },
};

// ===== CONFIGURATION STORIES =====

export const HighIntensityGlow: StoryFn<ContainerGlowCoreArgs> = (args) => ({
  components: { ContainerGlowCoreComponent },
  setup() {
    return { args };
  },
  template: `
    <div style="background: #000000; padding: 60px 40px; min-height: 80vh; display: flex; align-items: center; justify-content: center;">
      <div style="text-align: center; width: 100%;">
        <div style="margin-bottom: 40px;">
          <h2 style="color: white; margin: 0 0 16px 0; font-size: 28px; font-weight: 700; text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);">
            🔥 High Intensity Glow
          </h2>
          <p style="color: rgba(255, 255, 255, 0.8); margin: 0 0 8px 0; font-size: 16px;">
            Maximum glow settings for dramatic effects
          </p>
          <div style="display: inline-flex; gap: 16px; font-family: monospace; font-size: 12px; color: #10b981;">
            <span>Proximity: {{ args.config.proximity }}px</span>
            <span>Spread: {{ args.config.spread }}°</span>
            <span>Blur: {{ args.config.blur }}px</span>
            <span>Opacity: {{ args.config.opacity }}</span>
          </div>
        </div>
        
        <ContainerGlowCoreComponent
          :item-count="args.itemCount"
          :tag="args.tag"
          :style-class-passthrough="args.styleClassPassthrough"
          :config="args.config"
        >
          <template v-for="n in args.itemCount" :key="n" v-slot:['container-glow-' + (n - 1)]>
            <div style="height: 100%; display: flex; flex-direction: column; text-align: center;">
              <div style="margin-bottom: 20px;">
                <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #ff6b6b, #ffd93d, #6bcf7f, #4d79ff); border-radius: 16px; margin: 0 auto 16px auto; display: flex; align-items: center; justify-content: center; font-size: 24px; color: white; font-weight: bold; box-shadow: 0 0 20px rgba(255, 107, 107, 0.4);">
                  🌟
                </div>
                <h3 style="margin: 0 0 8px 0; color: white; font-size: 18px; font-weight: 700; text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);">
                  Intense {{ n }}
                </h3>
                <p style="margin: 0; color: rgba(255, 255, 255, 0.7); font-size: 14px;">
                  High-impact glow effect
                </p>
              </div>
              
              <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 16px;">
                <div style="padding: 20px; background: rgba(255, 255, 255, 0.05); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
                  <h4 style="margin: 0 0 12px 0; color: #f59e0b; font-size: 14px; font-weight: 600;">⚡ Power Settings</h4>
                  <div style="display: grid; gap: 8px; font-family: monospace; font-size: 10px; color: rgba(255, 255, 255, 0.8);">
                    <div style="display: flex; justify-content: space-between;">
                      <span>Range:</span>
                      <span style="color: #10b981;">{{ args.config.proximity }}px</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                      <span>Intensity:</span>
                      <span style="color: #f59e0b;">{{ Math.round(args.config.opacity * 100) }}%</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                      <span>Blur:</span>
                      <span style="color: #8b5cf6;">{{ args.config.blur }}px</span>
                    </div>
                  </div>
                </div>
                
                <div style="padding: 16px; background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(139, 92, 246, 0.1)); border-radius: 8px; border: 1px solid rgba(255, 107, 107, 0.2);">
                  <p style="margin: 0; color: #ff6b6b; font-size: 11px; line-height: 1.4; font-weight: 500;">
                    🎯 Move cursor close for maximum glow intensity
                  </p>
                </div>
              </div>
            </div>
          </template>
        </ContainerGlowCoreComponent>
      </div>
    </div>
  `,
});
HighIntensityGlow.args = {
  itemCount: 3,
  config: {
    proximity: 100,
    spread: 120,
    blur: 40,
    gap: 48,
    vertical: false,
    opacity: 0.6,
  },
};
HighIntensityGlow.parameters = {
  docs: {
    description: {
      story: "High-intensity glow configuration with increased proximity range, spread, blur, and opacity for dramatic visual effects.",
    },
  },
};

export const SubtleGlow = Template.bind({});
SubtleGlow.args = {
  itemCount: 4,
  config: {
    proximity: 30,
    spread: 40,
    blur: 10,
    gap: 20,
    vertical: false,
    opacity: 0.08,
  },
};
SubtleGlow.parameters = {
  docs: {
    description: {
      story: "Subtle glow configuration with reduced intensity, tighter proximity, and minimal blur for elegant, understated effects.",
    },
  },
};