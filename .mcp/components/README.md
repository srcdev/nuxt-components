# MCP Component Documentation Structure

This directory contains individual MCP files for each component, organized by category.

## Structure

```text
.mcp/components/
├── forms/              # Form-related components
│   ├── InputCheckboxRadioCore.json
│   ├── MultipleCheckboxes.json
│   ├── InputError.json
│   └── MultipleRadioButtons.json
├── display/            # Display components
│   ├── DisplayCard.json
│   ├── DisplayBanner.json
│   └── ...
├── layout/             # Layout components
└── interactive/        # Interactive components
```

## Adding New Components

When adding a new component, create a corresponding `.json` file with this structure:

```json
{
  "component": "ComponentName",
  "category": "forms|display|layout|interactive",
  "file_path": "app/components/path/to/Component.vue",
  "description": "Brief description of component purpose",
  "extends": "BaseInterface (if applicable)",
  "props": {
    "propName": {
      "type": "PropType",
      "optional": true|false,
      "description": "What this prop does"
    }
  },
  "model": {
    "type": "ModelType",
    "description": "v-model behavior"
  },
  "usage_examples": [
    {
      "title": "Example Title",
      "code": "<ComponentName prop=\"value\" />"
    }
  ],
  "slots": {
    "slotName": {
      "description": "Slot purpose",
      "default": "Default content"
    }
  },
  "testing": {
    "test_file": "path/to/test.spec.ts",
    "test_count": 0,
    "key_test_cases": ["Test description"]
  }
}
```

## Benefits

- **Scalable**: Each component has its own documentation file
- **Discoverable**: Easy to find specific component info
- **Maintainable**: Update only the relevant component file
- **Structured**: Consistent format across all components
- **Agent-Friendly**: AI agents can easily understand individual components
