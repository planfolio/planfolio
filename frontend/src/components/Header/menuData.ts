export interface MenuItem {
  name: string;
  href: string;
}

export const NAV_ITEMS: MenuItem[] = [
  { name: "캘린더", href: "/calendar" },
  { name: "공모전", href: "/contests" },
  { name: "자격증", href: "/certificates" },
  { name: "코딩테스트", href: "/coding-tests" },
  { name: "친구 목록", href: "/friends" }, 
];