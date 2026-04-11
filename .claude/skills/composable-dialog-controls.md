# useDialogControls Composable

## Overview

`useDialogControls` manages open/closed state for one or more named dialogs (modals, confirmation panels, etc.) with optional confirm/cancel callbacks. It is the standard pattern for dialog orchestration in consuming apps.

**This composable ships inside the `srcdev-nuxt-components` layer** (`app/composables/useDialogControls.ts`). It is auto-imported via the Nuxt layer — **do not create a local copy** in the consuming app.

## Usage

### 1. Initialise named dialogs

Call `initialiseDialogs` with an array of string IDs — one per dialog you need to control:

```ts
const { dialogsConfig, controlDialogs, initialiseDialogs, registerDialogCallbacks } = useDialogControls()

initialiseDialogs(["confirmDelete", "editProfile"])
```

Each ID gets a reactive boolean in `dialogsConfig` (initially `false` = closed).

### 2. Bind to a dialog component

Use `dialogsConfig[id]` as the `v-model` or `:open` prop on your dialog:

```vue
<ExpandingPanel v-model="dialogsConfig.confirmDelete">
  <template #summary>Confirm delete</template>
  <template #content>
    <p>Are you sure?</p>
    <button @click="controlDialogs('confirmDelete', false, 'confirm')">Yes, delete</button>
    <button @click="controlDialogs('confirmDelete', false, 'cancel')">Cancel</button>
  </template>
</ExpandingPanel>
```

### 3. Open and close dialogs

```ts
// Open
controlDialogs("confirmDelete", true)

// Close without action
controlDialogs("confirmDelete", false)

// Close and fire a callback
controlDialogs("confirmDelete", false, "confirm") // fires onConfirm if registered
controlDialogs("confirmDelete", false, "cancel")  // fires onCancel if registered
```

### 4. Register callbacks (optional)

Register confirm/cancel callbacks before the dialog is opened:

```ts
registerDialogCallbacks("confirmDelete", {
  onConfirm: () => deleteItem(),
  onCancel: () => console.log("Cancelled"),
})
```

Callbacks fire when `controlDialogs` is called with a matching action string.

## API reference

| Return value | Description |
|---|---|
| `dialogsConfig` | Reactive object — `{ [id]: boolean }`. Bind to dialog `v-model` or `:open`. |
| `initialiseDialogs(ids)` | Seeds `dialogsConfig` with `false` for each ID. Call once in `<script setup>`. |
| `controlDialogs(name, state, action?)` | Set `dialogsConfig[name]` to `state`. If `state` is `false` and `action` is provided, fires the registered callback before closing. |
| `registerDialogCallbacks(id, { onConfirm?, onCancel? })` | Register lifecycle callbacks for a dialog ID. |

## Notes

- `useDialogControls` is scoped to the component instance — each component that calls it gets its own `dialogsConfig`. It is not a global store; do not expect state to persist across components.
- For a single dialog, `initialiseDialogs(["myDialog"])` is still required — omitting it means `dialogsConfig.myDialog` is `undefined` and reactivity won't work.
- `controlDialogs` checks for the callback before setting state, so the callback always runs before the dialog closes.
