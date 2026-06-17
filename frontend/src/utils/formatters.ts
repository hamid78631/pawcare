export function getInitials(firstName?: string, lastName?: string): string {
  if (!firstName || !lastName) return '?';
  const strip = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();
  return strip(firstName)[0] + strip(lastName)[0];
}

export function getInitialsFromProfile(profile: { user?: { firstName?: string; lastName?: string } }): string {
  const clean = (s?: string) =>
    s ? s.normalize('NFD').replace(/[̀-ͯ]/g, '')[0]?.toUpperCase() ?? '' : '';
  return (clean(profile.user?.firstName) + clean(profile.user?.lastName)) || '?';
}

export function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}
