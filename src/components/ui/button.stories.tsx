import { Button } from "./button"

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          "Demonstrates how a custom className can augment an existing variant without losing the variant styling.",
      },
    },
  },
}

export default meta

export const SecondaryWithCustomRing = {
  args: {
    variant: "secondary",
    className: "ring-2 ring-primary",
    children: "Secondary with custom ring",
  },
}
