export class MenuItem {
  label: string;
  icon: string | null;
  route: string;
  group: string | null;
  style: string | null;
  separator?: boolean | null;

  children?: MenuItem[]| null;

  constructor(
    label: string,
    icon: string| null,
    route: string,
    group: string| null,
    style: string| null,
    separator: boolean| null,
    children?: MenuItem[]| null) {
    this.label = label;
    this.icon = icon ?? null;
    this.route = route;
    this.group = group ?? null;
    this.style = style ?? null;
    this.separator = separator ?? null;
    this.children = children ?? null;
  }
}
