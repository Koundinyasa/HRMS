export interface MenuButton {
  label: string;
  send: string;
  hrOnly?: boolean;
  employeeOnly?: boolean;
}
export interface Menu {
  title: string;
  buttons: MenuButton[];
}
