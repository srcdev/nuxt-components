# DisplayDialog

## Overview

`DisplayDialog` is a native `<dialog>`-based overlay with header, scrollable content, and footer
action slots. Five variants cover the common dialog patterns. Pair with `useDialogControls` for
open/close state management.

**Location**: `app/components/01.atoms/display-dialog/DisplayDialog.vue`

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `dataDialogId` | `string` | — | **Required.** Unique identifier rendered as `data-dialog-id` attribute. |
| `variant` | `'dialog' \| 'modal' \| 'confirm' \| 'alert' \| 'fullscreen'` | `'dialog'` | Controls panel sizing and ARIA role. |
| `theme` | `SemanticTheme` | `undefined` | Optional header accent — `data-theme` on `.header` only; adds a coloured bottom border and tints the close icon. |
| `v-model` | `boolean` | — | Controls open/closed state. |
| `allowContentScroll` | `boolean` | `false` | Enables independent scroll on `.dialog-content`. |
| `lockViewport` | `boolean` | `true` | Adds/removes `lock` class on `<body>` on mount/close. |
| `justifyDialog` | `'start' \| 'center' \| 'end'` | `'center'` | Horizontal position of panel within overlay. |
| `alignDialog` | `'start' \| 'center' \| 'end'` | `'center'` | Vertical position of panel within overlay. |
| `styleClassPassthrough` | `string \| string[]` | `[]` | Extra classes applied to the root `<dialog>` element. |

## Slots

| Slot | Renders in |
|---|---|
| `#dialogTitle` | `.col-left` in the header (hidden when slot is empty) |
| `#dialogContent` | `.dialog-content` (hidden when slot is empty) |
| `#actionButtonLeft` | Left side of `.footer` |
| `#actionButtonRight` | Right side of `.footer` |

`.footer` is omitted entirely when neither action button slot is provided.

## Variants

| Variant | Panel size | ARIA role | Dismiss on Escape/outside-click |
|---|---|---|---|
| `dialog` | `70dvh × min(75%, 72rem)` | `dialog` | Yes |
| `modal` | Content-sized | `dialog` | Yes |
| `confirm` | Content-sized | `dialog` | Yes |
| `alert` | `min(90%, 48rem)` | `alertdialog` | **No** — requires explicit action |
| `fullscreen` | `100% × 100%` | `dialog` | Yes |

## Basic usage

```vue
<script setup lang="ts">
const { dialogsConfig, openDialog, closeDialog } = useDialogControls({
  logout: {
    onConfirm: () => performLogout(),
    onCancel: () => {},
  },
})
</script>

<template>
  <button @click="openDialog('logout')">Log out</button>

  <DisplayDialog
    v-if="dialogsConfig['logout']"
    v-model="dialogsConfig['logout']"
    variant="confirm"
    data-dialog-id="logout"
  >
    <template #dialogTitle>
      <p>Confirm logout?</p>
    </template>
    <template #dialogContent>
      <p>Are you sure you wish to log out?</p>
    </template>
    <template #actionButtonLeft>
      <button @click="closeDialog('logout', 'cancel')">Cancel</button>
    </template>
    <template #actionButtonRight>
      <button @click="closeDialog('logout', 'confirm')">Log out</button>
    </template>
  </DisplayDialog>
</template>
```

## Alert variant

Use `variant="alert"` for destructive or attention-critical actions. Escape and outside-click
are both disabled — the user must act via the footer buttons.

```vue
<DisplayDialog
  v-if="dialogsConfig['deleteAccount']"
  v-model="dialogsConfig['deleteAccount']"
  variant="alert"
  data-dialog-id="deleteAccount"
>
  <template #dialogTitle><p>Delete account?</p></template>
  <template #dialogContent>
    <p>This action is permanent and cannot be undone.</p>
  </template>
  <template #actionButtonLeft>
    <button @click="closeDialog('deleteAccount', 'cancel')">Cancel</button>
  </template>
  <template #actionButtonRight>
    <button @click="closeDialog('deleteAccount', 'confirm')">Delete account</button>
  </template>
</DisplayDialog>
```

## CSS token API

See `CONSUMER-STYLING.md` in the component folder for the full token reference. Prefer global
CSS over per-instance overrides — dialogs are site-wide UI:

```css
/* assets/styles/setup/07.components/display-dialog.css */
:root {
  --display-dialog-inner-border-radius: 1.2rem;
  --display-dialog-inner-background: var(--brand-surface);
  --display-dialog-inner-border: 0.1rem solid var(--brand-border);
  --display-dialog-transition-duration: 250ms;
}
```

## Nested dialogs

When a dialog needs to launch its own sub-dialog (e.g. "Discard changes?" before closing an edit
form), the cleanest approach is to call `useDialogControls` **inside the dialog component itself**.
The sub-dialog is entirely self-contained — the parent page doesn't need to know about it.

```vue
<!-- EditProfileDialog.vue -->
<script setup lang="ts">
const emit = defineEmits<{ close: [] }>();

const { dialogsConfig, openDialog, closeDialog } = useDialogControls({
  confirmDiscard: {
    onConfirm: () => emit("close"),
    onCancel: () => {},
  },
});

const handleClose = () => {
  if (hasUnsavedChanges.value) {
    openDialog("confirmDiscard");
  } else {
    emit("close");
  }
};
</script>

<template>
  <!-- main dialog content, close button calls handleClose() -->

  <!-- sub-dialog rendered inside the same component -->
  <DisplayDialog
    v-if="dialogsConfig['confirmDiscard']"
    v-model="dialogsConfig['confirmDiscard']"
    variant="confirm"
    theme="warning"
    data-dialog-id="confirmDiscard"
  >
    <template #dialogTitle><p>Discard changes?</p></template>
    <template #dialogContent><p>Your unsaved changes will be lost.</p></template>
    <template #actionButtonLeft>
      <button @click="closeDialog('confirmDiscard', 'cancel')">Keep editing</button>
    </template>
    <template #actionButtonRight>
      <button @click="closeDialog('confirmDiscard', 'confirm')">Discard</button>
    </template>
  </DisplayDialog>
</template>
```

Both dialogs are open simultaneously — native `<dialog>` stacking order ensures the confirm
renders on top. The confirm resolves first; its `onConfirm` callback triggers the parent close.

**Avoid** registering the sub-dialog on the page level — that couples the page to the dialog's
internal concern and leaks implementation detail upward.

## Notes

- Always use `v-if="dialogsConfig['id']"` (not `v-show`) — `DisplayDialog` runs body-lock logic
  in `onMounted`, which must only fire when the dialog actually opens.
- `dataDialogId` is required; it is used as the `data-dialog-id` DOM attribute and as the key
  for `useDialogControls`.
- Related: `composable-dialog-controls.md`
