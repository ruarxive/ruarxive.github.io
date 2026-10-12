export const ISSUES_REPO = 'https://github.com/ruarxive/ruarxive.github.io';
export const ARCHIVE_REQUEST_TEMPLATE = 'archive-request.yml';

/** Strips scheme, "www." and path: "https://www.Example.ru/a" → "example.ru". */
export function normalizeDomain(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^[a-z]+:\/\//, '')
    .replace(/^www\./, '')
    .split(/[/?#]/)[0];
}

/**
 * Link to a new GitHub issue from .github/ISSUE_TEMPLATE/archive-request.yml.
 * Query keys other than template/title must match field ids in that template.
 */
export function archiveRequestUrl({ url = '', reason = '' }: { url?: string; reason?: string }): string {
  const params = new URLSearchParams({ template: ARCHIVE_REQUEST_TEMPLATE });
  const domain = normalizeDomain(url);
  params.set('title', domain ? `[Архивация] ${domain}` : '[Архивация] ');
  if (url.trim()) params.set('url', url.trim());
  if (reason.trim()) params.set('reason', reason.trim());
  return `${ISSUES_REPO}/issues/new?${params.toString()}`;
}
