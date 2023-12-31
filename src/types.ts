import type { OptionalField } from "@camome/utils";

export type Toc = {
  value: string;
  url: string;
  depth: number;
}[];

export type Pagination = {
  currentPage: number;
  totalPages: number;
};

export type LabeledLink = {
  href: string;
  label: string;
};

export type SiteData = {
  title: string;
  subtitle: string;
  description: string;
  url: string;
  ogImage: string;
  defaultAuthor: string;
  defaultBlogThumbImg: string;
  blogPostsPerPage: number;
};

export type Author = {
  name: string;
  avatarImg: string;
  title: string;
};

export type Authors = { [Name: string]: Author };

export type NavItemCategory = {
  id: string;
  label: string;
  href?: string;
  open?: boolean;
  sort?: "asc";
  items: NavItem[];
  type: "section" | "collapsible";
};

export type NavItemLink = {
  id: string;
  label: string;
  href: string;
};

export type NavItem = NavItemCategory | NavItemLink;

export type DocsSidebarItemConfig =
  | NavItemCategory
  | OptionalField<NavItemLink, "href" | "label">;

export type DocsSidebarConfig = {
  items: DocsSidebarItemConfig[];
};
