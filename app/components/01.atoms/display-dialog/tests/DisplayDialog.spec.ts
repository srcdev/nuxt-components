import { describe, it, expect, vi, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import DisplayDialog from "../DisplayDialog.vue";

vi.mock("focus-trap-vue", () => ({
  FocusTrap: {
    name: "FocusTrap",
    props: ["active", "escapeDeactivates", "clickOutsideDeactivates"],
    emits: ["update:active", "deactivate"],
    template: "<slot />",
  },
}));

describe("DisplayDialog", () => {
  afterEach(() => {
    document.body.classList.remove("lock");
    delete document.body.dataset.lockCount;
  });

  // ─── Mount ────────────────────────────────────────────────────────────────

  it("mounts without error", async () => {
    const wrapper = await mountSuspended(DisplayDialog, {
      props: { dataDialogId: "test" },
    });
    expect(wrapper.vm).toBeTruthy();
  });

  // ─── Snapshot ─────────────────────────────────────────────────────────────

  it("renders correct HTML structure with all slots", async () => {
    const wrapper = await mountSuspended(DisplayDialog, {
      props: { dataDialogId: "test", modelValue: true },
      slots: {
        dialogTitle: "<p>Title</p>",
        dialogContent: "<p>Content</p>",
        actionButtonLeft: "<button>Cancel</button>",
        actionButtonRight: "<button>Confirm</button>",
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  // ─── Root element ─────────────────────────────────────────────────────────

  it("renders as <dialog>", async () => {
    const wrapper = await mountSuspended(DisplayDialog, {
      props: { dataDialogId: "test" },
    });
    expect(wrapper.element.tagName).toBe("DIALOG");
  });

  it("always has the display-dialog class", async () => {
    const wrapper = await mountSuspended(DisplayDialog, {
      props: { dataDialogId: "test" },
    });
    expect(wrapper.classes()).toContain("display-dialog");
  });

  // ─── data-dialog-id ───────────────────────────────────────────────────────

  it("sets data-dialog-id attribute from prop", async () => {
    const wrapper = await mountSuspended(DisplayDialog, {
      props: { dataDialogId: "my-dialog" },
    });
    expect(wrapper.attributes("data-dialog-id")).toBe("my-dialog");
  });

  // ─── open attribute ───────────────────────────────────────────────────────

  it("sets [open] attribute when modelValue is true", async () => {
    const wrapper = await mountSuspended(DisplayDialog, {
      props: { dataDialogId: "test", modelValue: true },
    });
    expect(wrapper.attributes("open")).toBeDefined();
  });

  it("omits [open] attribute when modelValue is false", async () => {
    const wrapper = await mountSuspended(DisplayDialog, {
      props: { dataDialogId: "test", modelValue: false },
    });
    expect(wrapper.attributes("open")).toBeUndefined();
  });

  // ─── role ─────────────────────────────────────────────────────────────────

  it("has no explicit role by default — implicit from <dialog> element", async () => {
    const wrapper = await mountSuspended(DisplayDialog, {
      props: { dataDialogId: "test" },
    });
    expect(wrapper.attributes("role")).toBeUndefined();
  });

  it.each(["dialog", "modal", "confirm", "fullscreen"] as const)(
    "has no explicit role for variant='%s' — implicit from <dialog> element",
    async (variant) => {
      const wrapper = await mountSuspended(DisplayDialog, {
        props: { dataDialogId: "test", variant },
      });
      expect(wrapper.attributes("role")).toBeUndefined();
    }
  );

  it("has role='alertdialog' for variant='alert'", async () => {
    const wrapper = await mountSuspended(DisplayDialog, {
      props: { dataDialogId: "test", variant: "alert" },
    });
    expect(wrapper.attributes("role")).toBe("alertdialog");
  });

  // ─── Variant class on .inner ──────────────────────────────────────────────

  it("applies 'dialog' class to .inner by default", async () => {
    const wrapper = await mountSuspended(DisplayDialog, {
      props: { dataDialogId: "test" },
    });
    expect(wrapper.find(".inner").classes()).toContain("dialog");
  });

  it.each(["dialog", "modal", "confirm", "alert", "fullscreen"] as const)(
    "applies '%s' class to .inner",
    async (variant) => {
      const wrapper = await mountSuspended(DisplayDialog, {
        props: { dataDialogId: "test", variant },
      });
      expect(wrapper.find(".inner").classes()).toContain(variant);
    }
  );

  // ─── Slots ────────────────────────────────────────────────────────────────

  it("renders dialogTitle slot in .col-left", async () => {
    const wrapper = await mountSuspended(DisplayDialog, {
      props: { dataDialogId: "test" },
      slots: { dialogTitle: "<p>My Title</p>" },
    });
    expect(wrapper.find(".col-left").text()).toBe("My Title");
  });

  it("omits .col-left when dialogTitle slot is not provided", async () => {
    const wrapper = await mountSuspended(DisplayDialog, {
      props: { dataDialogId: "test" },
    });
    expect(wrapper.find(".col-left").exists()).toBe(false);
  });

  it("renders dialogContent slot in .dialog-content", async () => {
    const wrapper = await mountSuspended(DisplayDialog, {
      props: { dataDialogId: "test" },
      slots: { dialogContent: "<p>Content</p>" },
    });
    expect(wrapper.find(".dialog-content").text()).toBe("Content");
  });

  it("omits .dialog-content when dialogContent slot is not provided", async () => {
    const wrapper = await mountSuspended(DisplayDialog, {
      props: { dataDialogId: "test" },
    });
    expect(wrapper.find(".dialog-content").exists()).toBe(false);
  });

  it("renders .footer when actionButtonLeft slot is provided", async () => {
    const wrapper = await mountSuspended(DisplayDialog, {
      props: { dataDialogId: "test" },
      slots: { actionButtonLeft: "<button>Cancel</button>" },
    });
    expect(wrapper.find(".footer").exists()).toBe(true);
  });

  it("renders .footer when actionButtonRight slot is provided", async () => {
    const wrapper = await mountSuspended(DisplayDialog, {
      props: { dataDialogId: "test" },
      slots: { actionButtonRight: "<button>Confirm</button>" },
    });
    expect(wrapper.find(".footer").exists()).toBe(true);
  });

  it("omits .footer when neither action button slot is provided", async () => {
    const wrapper = await mountSuspended(DisplayDialog, {
      props: { dataDialogId: "test" },
    });
    expect(wrapper.find(".footer").exists()).toBe(false);
  });

  it("renders both action button slots inside .footer", async () => {
    const wrapper = await mountSuspended(DisplayDialog, {
      props: { dataDialogId: "test" },
      slots: {
        actionButtonLeft: "<button>Cancel</button>",
        actionButtonRight: "<button>Confirm</button>",
      },
    });
    expect(wrapper.find(".footer").text()).toContain("Cancel");
    expect(wrapper.find(".footer").text()).toContain("Confirm");
  });

  // ─── allowContentScroll ───────────────────────────────────────────────────

  it("does not apply allow-content-scroll class by default", async () => {
    const wrapper = await mountSuspended(DisplayDialog, {
      props: { dataDialogId: "test" },
      slots: { dialogContent: "<p>Content</p>" },
    });
    expect(wrapper.find(".dialog-content").classes()).not.toContain("allow-content-scroll");
  });

  it("applies allow-content-scroll class when allowContentScroll=true", async () => {
    const wrapper = await mountSuspended(DisplayDialog, {
      props: { dataDialogId: "test", allowContentScroll: true },
      slots: { dialogContent: "<p>Content</p>" },
    });
    expect(wrapper.find(".dialog-content").classes()).toContain("allow-content-scroll");
  });

  // ─── Close button ─────────────────────────────────────────────────────────

  it("close button emits update:modelValue=false", async () => {
    const wrapper = await mountSuspended(DisplayDialog, {
      props: { dataDialogId: "test", modelValue: true },
    });
    await wrapper.find('[data-test-id="display-dialog-header-close"]').trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([false]);
  });

  // ─── styleClassPassthrough ────────────────────────────────────────────────

  it("applies a styleClassPassthrough string", async () => {
    const wrapper = await mountSuspended(DisplayDialog, {
      props: { dataDialogId: "test", styleClassPassthrough: "my-class" },
    });
    expect(wrapper.classes()).toContain("my-class");
  });

  it("applies multiple styleClassPassthrough classes from an array", async () => {
    const wrapper = await mountSuspended(DisplayDialog, {
      props: { dataDialogId: "test", styleClassPassthrough: ["class-a", "class-b"] },
    });
    expect(wrapper.classes()).toContain("class-a");
    expect(wrapper.classes()).toContain("class-b");
  });

  // ─── Body viewport lock ───────────────────────────────────────────────────

  it("adds lock class to body on mount when lockViewport=true", async () => {
    const wrapper = await mountSuspended(DisplayDialog, {
      props: { dataDialogId: "test", lockViewport: true },
    });
    expect(document.body.classList.contains("lock")).toBe(true);
    wrapper.unmount();
  });

  it("does not add lock class to body when lockViewport=false", async () => {
    await mountSuspended(DisplayDialog, {
      props: { dataDialogId: "test", lockViewport: false },
    });
    expect(document.body.classList.contains("lock")).toBe(false);
  });

  it("removes lock class from body on unmount when lockViewport=true", async () => {
    const wrapper = await mountSuspended(DisplayDialog, {
      props: { dataDialogId: "test", lockViewport: true },
    });
    expect(document.body.classList.contains("lock")).toBe(true);
    wrapper.unmount();
    expect(document.body.classList.contains("lock")).toBe(false);
  });

  it("does not remove lock when a second locking dialog is still open", async () => {
    const wrapper1 = await mountSuspended(DisplayDialog, {
      props: { dataDialogId: "a", lockViewport: true },
    });
    const wrapper2 = await mountSuspended(DisplayDialog, {
      props: { dataDialogId: "b", lockViewport: true },
    });
    expect(document.body.classList.contains("lock")).toBe(true);
    wrapper2.unmount();
    expect(document.body.classList.contains("lock")).toBe(true);
    wrapper1.unmount();
    expect(document.body.classList.contains("lock")).toBe(false);
  });
});
