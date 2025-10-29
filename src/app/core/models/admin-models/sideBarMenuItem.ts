
export interface SidebarMenuItem {
  label: string;
  icon: string;
  color?: string;
  route?: string;
  children?: SidebarMenuItem[];
}