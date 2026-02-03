# MCP Context Files for SRCDEV Nuxt Components

This directory contains Model Context Protocol (MCP) files that help AI agents understand the structure, patterns, and conventions of this Nuxt component library.

## Structure Overview

```txt
.mcp/
├── project-context.json         # High-level project info & architecture
├── component-patterns.json      # Development patterns & conventions
├── component-reference.json     # TypeScript interfaces & examples
├── components/                  # Individual component documentation
│   ├── forms/                   # Form components
│   ├── display/                 # Display components
│   ├── layout/                  # Layout components
│   └── interactive/             # Interactive components
└── generate-component-mcp.md    # Guide for adding new components
```

## Core Files

- **project-context.json** - Project architecture, framework info, and directory structure
- **component-patterns.json** - Styling system, composables, and development workflows
- **component-reference.json** - TypeScript interfaces, testing patterns, and examples

## Component Documentation

Each component has its own detailed MCP file in `/components/[category]/[ComponentName].json` containing:

- Usage examples and code snippets
- Props, slots, and model binding details
- CSS custom properties and styling info
- Testing information and patterns
- Accessibility features

## Usage for AI Agents

When working with this codebase, agents should reference these files to understand:

1. **Project Structure** - How components are organized and named
2. **Development Patterns** - Consistent approaches to styling, testing, and composables
3. **Component Architecture** - Base interfaces, prop patterns, and v-model usage
4. **Individual Components** - Specific usage, props, and implementation details

## Adding New Components

1. Create a new `.json` file in the appropriate category directory
2. Follow the template structure in `/components/README.md`
3. Include usage examples, props, and testing information
4. Update this README if introducing new patterns

## How to Use with AI Agents

### For GitHub Copilot (VS Code)

Add this to your VS Code `settings.json`:

```json
{
  "github.copilot.chat.localeOverride": "en",
  "github.copilot.chat.welcomeMessage": "always",
  "files.associations": {
    "*.mcp.json": "json"
  }
}
```

Then reference the MCP files in your prompts:

```text
"Please review the MCP files in .mcp/ directory before working with components"
```

### For Claude (via MCP Protocol)

If using Claude with MCP support, configure your MCP client:

```json
{
  "mcpServers": {
    "nuxt-components": {
      "command": "node",
      "args": ["mcp-server.js"],
      "env": {
        "MCP_PROJECT_PATH": "/path/to/nuxt-components/.mcp"
      }
    }
  }
}
```

### For Projects Extending This Layer

When using `srcdev-nuxt-components` as a layer in your own project, use this **single URL** for automatic discovery:

#### 🎯 **Single Reference URL** (Recommended)

```text
https://raw.githubusercontent.com/srcdev/nuxt-components/main/.mcp/index.json
```

This index file contains:

- ✅ Links to all core MCP files
- ✅ Complete component documentation catalog
- ✅ Automatically updated when new components are added
- ✅ No need to track individual component URLs

#### Usage with AI Agents

Tell your agent:

```text
"This project extends srcdev-nuxt-components layer. Please fetch and review the MCP index:
https://raw.githubusercontent.com/srcdev/nuxt-components/main/.mcp/index.json

Then reference specific files as needed for the components I'm working with."
```

#### Manual Reference URLs (if needed)

- **Project Context**: `https://raw.githubusercontent.com/srcdev/nuxt-components/main/.mcp/project-context.json`
- **Component Patterns**: `https://raw.githubusercontent.com/srcdev/nuxt-components/main/.mcp/component-patterns.json`
- **Component Reference**: `https://raw.githubusercontent.com/srcdev/nuxt-components/main/.mcp/component-reference.json`

#### Individual Component URLs

- **Forms Components**:
  - `https://raw.githubusercontent.com/srcdev/nuxt-components/main/.mcp/components/forms/InputCheckboxRadioCore.json`
  - `https://raw.githubusercontent.com/srcdev/nuxt-components/main/.mcp/components/forms/MultipleCheckboxes.json`
  - `https://raw.githubusercontent.com/srcdev/nuxt-components/main/.mcp/components/forms/InputError.json`

#### Usage in Extended Projects

Tell your agent:

```text
"This project extends srcdev-nuxt-components. Please review these MCP files before working with components:
- Core patterns: https://raw.githubusercontent.com/srcdev/nuxt-components/main/.mcp/project-context.json
- Specific component: https://raw.githubusercontent.com/srcdev/nuxt-components/main/.mcp/components/forms/[ComponentName].json"
```

### For Any Agent (Manual Reference)

**Local Development:**

- Point your agent to the `.mcp/` directory in your project
- Reference specific component files: `.mcp/components/forms/ComponentName.json`

**Remote Access:**

- Host the `.mcp/` folder on GitHub: `https://raw.githubusercontent.com/srcdev/nuxt-components/main/.mcp/project-context.json`
- Direct agents to specific files via URL

### Usage Examples

**Starting a new component:**

```text
"Before creating this component, please review:
1. .mcp/project-context.json for project conventions
2. .mcp/component-patterns.json for development patterns
3. .mcp/components/forms/ for similar component examples"
```

**Debugging existing component:**

```text
"Please check .mcp/components/forms/InputCheckboxRadioCore.json for context about this component before helping"
```

### Supported Agents

- ✅ **GitHub Copilot** - Manual reference in prompts
- ✅ **Claude** - MCP protocol support
- ✅ **ChatGPT** - Manual file upload or reference
- ✅ **Cursor** - Direct file access in workspace
- ✅ **Any Agent** - Copy/paste relevant MCP content

## Key Conventions

- Components use **PascalCase** with descriptive prefixes (Input*, Display*, etc.)
- Composables start with **use** and provide reusable logic
- All components support **theme-based styling** via CSS custom properties
- **TypeScript-first** approach with comprehensive interfaces
- **Accessibility-focused** with proper ARIA attributes
