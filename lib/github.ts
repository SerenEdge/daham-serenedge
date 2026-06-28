export interface RepoRef {
  owner: string;
  repo: string;
}

export function parseRepoUrl(url: string): RepoRef {
  let u: URL;
  try {
    u = new URL(url.trim());
  } catch {
    throw new Error(`Invalid URL: ${url}`);
  }
  if (!/(^|\.)github\.com$/.test(u.hostname)) {
    throw new Error(`Not a github.com URL: ${url}`);
  }
  const parts = u.pathname.split("/").filter(Boolean);
  if (parts.length < 2) {
    throw new Error(`URL is missing owner/repo: ${url}`);
  }
  const owner = parts[0];
  const repo = parts[1].replace(/\.git$/, "");
  if (!owner || !repo) {
    throw new Error(`Could not parse owner/repo from: ${url}`);
  }
  return { owner, repo };
}

const README_NAMES = ["README.md", "readme.md", "Readme.md"];
const BRANCHES = ["HEAD", "main", "master"];

export async function fetchReadme(
  url: string,
  fetchImpl: typeof fetch = fetch
): Promise<string> {
  const { owner, repo } = parseRepoUrl(url);
  for (const branch of BRANCHES) {
    for (const name of README_NAMES) {
      const raw = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${name}`;
      try {
        const res = await fetchImpl(raw);
        if (res.ok) {
          const text = await res.text();
          if (text.trim().length > 0) return text;
        }
      } catch {
        // try next candidate
      }
    }
  }
  throw new Error(`README not found for ${owner}/${repo}`);
}
