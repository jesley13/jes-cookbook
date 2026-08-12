const icons = {
  bowl: `<svg viewBox="0 0 24 24"><path d="M4 11h16a8 8 0 0 1-16 0z"></path><path d="M4 11V8h16v3"></path><path d="M12 4v4"></path><path d="M8 5v3"></path><path d="M16 5v3"></path></svg>`,
  pasta: `<svg viewBox="0 0 24 24"><path d="M4 11h16a8 8 0 0 1-16 0z"></path><path d="M8 6v5"></path><path d="M12 4v7"></path><path d="M16 5v6"></path><path d="M19 12l2-2"></path></svg>`,
  bread: `<svg viewBox="0 0 24 24"><path d="M19 14v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-4"></path><path d="M3 14c0-3.5 4-6 9-6s9 2.5 9 6"></path><path d="M8 10v4"></path><path d="M12 9v5"></path><path d="M16 10v4"></path></svg>`,
  soup: `<svg viewBox="0 0 24 24"><path d="M5 12h14a6 6 0 0 1-14 0z"></path><path d="M8 6v3"></path><path d="M12 5v4"></path><path d="M16 7v2"></path><path d="M4 12h16"></path></svg>`,
  default: `<svg viewBox="0 0 24 24"><path d="M4 12h16a8 8 0 0 1-16 0z"></path><path d="M8 8v4"></path><path d="M12 6v6"></path><path d="M16 7v5"></path></svg>`,
};

export function getIconForRecipe(title) {
  const t = title.toLowerCase();
  if (t.includes('pasta') || t.includes('noodles') || t.includes('spaghetti')) return icons.pasta;
  if (t.includes('bread') || t.includes('cake') || t.includes('brownie')) return icons.bread;
  if (t.includes('soup') || t.includes('curry') || t.includes('masala')) return icons.soup;
  if (t.includes('rice') || t.includes('pulao') || t.includes('biryani')) return icons.bowl;
  return icons.default;
}
