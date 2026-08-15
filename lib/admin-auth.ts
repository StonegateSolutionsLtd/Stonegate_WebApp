// Closed allowlist of owner emails allowed into /admin. Kept separate from "is
// logged in" because this Supabase project's Auth is not exclusive to owners
// (e.g. leftover/unrelated accounts can exist) - authentication alone isn't authorization here.
export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return getAdminEmails().includes(email.trim().toLowerCase())
}
