# useDialogControls Composable

## Overview

`useDialogControls` manages open/closed state for one or more named dialogs with optional
confirm/cancel callbacks. Pass all dialog IDs and their callbacks in a single config object
at call time — no separate initialisation or registration step needed.

**This composable ships inside the `srcdev-nuxt-components` layer** (`app/composables/useDialogControls.ts`).
It is auto-imported via the Nuxt layer — **do not create a local copy** in the consuming app.

## Usage

### 1. Set up dialog controls

Call `useDialogControls` with a config object whose keys are dialog IDs:

```ts
const { dialogsConfig, openDialog, closeDialog } = useDialogControls({
  confirmDelete: {
    onConfirm: () => deleteItem(),
    onCancel: () => console.log("Cancelled"),
  },
  editProfile: {
    onConfirm: () => saveProfile(),
  },
})
```

Each key gets a reactive boolean in `dialogsConfig` (initially `false` = closed).
Callbacks are optional — omit either or both.

### 2. Bind to a dialog component

Use `v-if` + `v-model` with `dialogsConfig[id]`:

```vue
<DisplayDialog
  v-if="dialogsConfig['confirmDelete']"
  v-model="dialogsConfig['confirmDelete']"
  variant="confirm"
  data-dialog-id="confirmDelete"
>
  <template #dialogTitle>
    <p>Confirm delete?</p>
  </template>
  <template #dialogContent>
    <p>This action cannot be undone.</p>
  </template>
  <template #actionButtonLeft>
    <button @click="closeDialog('confirmDelete', 'cancel')">Cancel</button>
  </template>
  <template #actionButtonRight>
    <button @click="closeDialog('confirmDelete', 'confirm')">Delete</button>
  </template>
</DisplayDialog>
```

### 3. Open and close dialogs

```ts
// Open
openDialog("confirmDelete")

// Close without firing a callback
closeDialog("confirmDelete")

// Close and fire onConfirm
closeDialog("confirmDelete", "confirm")

// Close and fire onCancel
closeDialog("confirmDelete", "cancel")
```

## API reference

| Return value | Type | Description |
|---|---|---|
| `dialogsConfig` | `Record<string, boolean>` | Reactive map of dialog ID → open state. Bind to `v-model` and `v-if`. |
| `openDialog(name)` | `(name: string) => void` | Sets `dialogsConfig[name]` to `true`. |
| `closeDialog(name, action?)` | `(name: string, action?: 'confirm' \| 'cancel') => void` | Sets `dialogsConfig[name]` to `false`. If `action` is provided, fires the registered callback first. |

## Notes

- State is scoped to the component instance — each component that calls `useDialogControls` gets
  its own `dialogsConfig`. It is not a global store.
- `v-if="dialogsConfig['id']"` on the dialog component ensures it only mounts when open, which
  triggers `onMounted` body-lock logic inside `DisplayDialog`.
- Callbacks fire before the dialog closes — useful for async operations that need to run while
  the dialog is still visible.
