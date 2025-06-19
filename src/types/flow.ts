export type ComponentType =
  | "TextInput"
  | "PasswordInput"
  | "Button"
  | "Link"
  | "Checkbox"
  | "Text"
  | "Heading"
  | "Paragraph"
  | "Card"
  | "StatBlock"
  | "ProgressBar"
  | "Toast"
  | "Image"
  | "Spacer"
  | "Divider"
  | "TabBar"
  | "TopNav"
  | "DrawerNav"
  | "LinkToScreen"
  | "Modal"
  | "BottomNav"
  | "Section"
  | "Row"
  | "CardGroup"
  | "Column";

export type ComponentData = {
  type: ComponentType;
  label: string;
  variant?: "primary" | "secondary";
  children?: ComponentData[];
};

export type ScreenData = {
  screen: string;
  layout: "vertical" | "horizontal";
  components: ComponentData[];
};
