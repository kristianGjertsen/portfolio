import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OWNER = "kristianGjertsen";
const PROJECT_CONFIG_PATH = "portfolio/project.json";
const GENERATED_IMAGE_DIR = "public/generated-project-images";
const GENERATED_PROJECTS_PATH =
  "src/Pages/ProjectPage/projects.generated.json";

const repoRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const outputImageDir = path.join(repoRoot, GENERATED_IMAGE_DIR);
const outputProjectsPath = path.join(repoRoot, GENERATED_PROJECTS_PATH);

const githubToken = process.env.GITHUB_TOKEN;

async function githubFetch(url, options = {}) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-project-generator",
    "X-GitHub-Api-Version": "2022-11-28",
    ...options.headers,
  };

  if (githubToken) {
    headers.Authorization = `Bearer ${githubToken}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 403) {
    const rateLimitRemaining = response.headers.get("x-ratelimit-remaining");
    if (rateLimitRemaining === "0") {
      throw new Error(
        "GitHub API rate limit exceeded. Set GITHUB_TOKEN and run the generator again."
      );
    }
  }

  return response;
}

async function listPublicRepos() {
  const repos = [];
  let page = 1;

  console.log(`Listing public repositories for ${OWNER}...`);

  while (true) {
    const url = new URL(`https://api.github.com/users/${OWNER}/repos`);
    url.searchParams.set("type", "public");
    url.searchParams.set("per_page", "100");
    url.searchParams.set("page", String(page));

    const response = await githubFetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to list public repositories: ${response.status} ${response.statusText}`
      );
    }

    const entries = await response.json();
    repos.push(...entries);

    if (entries.length < 100) break;
    page += 1;
  }

  return repos
    .filter((repo) => repo?.owner?.login?.toLowerCase() === OWNER.toLowerCase())
    .sort((a, b) => a.full_name.localeCompare(b.full_name));
}

async function getRepoContent(repo, contentPath) {
  const encodedPath = contentPath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  const url = `https://api.github.com/repos/${repo.full_name}/contents/${encodedPath}?ref=${encodeURIComponent(
    repo.default_branch
  )}`;

  const response = await githubFetch(url);

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(
      `${repo.full_name}: failed to read ${contentPath}: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

function decodeBase64Content(contentEntry, repoName) {
  if (contentEntry.type !== "file" || typeof contentEntry.content !== "string") {
    throw new Error(`${repoName}: ${PROJECT_CONFIG_PATH} is not a readable file`);
  }

  return Buffer.from(contentEntry.content, "base64").toString("utf8");
}

function assertPlainObject(value, context) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${context} must be an object`);
  }
}

function assertString(value, context, { optional = false } = {}) {
  if (optional && value === undefined) return;
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${context} must be a non-empty string`);
  }
}

function assertLocalizedString(value, context, { optional = false } = {}) {
  if (optional && value === undefined) return;
  assertPlainObject(value, context);
  assertString(value.no, `${context}.no`, { optional: true });
  assertString(value.en, `${context}.en`, { optional: true });

  if (value.no === undefined && value.en === undefined) {
    throw new Error(`${context} must define no or en`);
  }
}

function validateProject(project, repoName) {
  assertPlainObject(project, `${repoName}: project config`);

  assertString(project.id, `${repoName}: id`);

  if (!Number.isInteger(project.year)) {
    throw new Error(`${repoName}: year must be an integer`);
  }

  assertString(project.sortDate, `${repoName}: sortDate`, { optional: true });
  if (project.sortDate && Number.isNaN(Date.parse(project.sortDate))) {
    throw new Error(`${repoName}: sortDate must be a valid date string`);
  }

  assertString(project.link, `${repoName}: link`, { optional: true });
  assertString(project.img, `${repoName}: img`);
  assertString(project.imgAlt, `${repoName}: imgAlt`, { optional: true });

  if (
    !Array.isArray(project.languages) ||
    project.languages.length === 0 ||
    project.languages.some(
      (language) => typeof language !== "string" || language.trim() === ""
    )
  ) {
    throw new Error(`${repoName}: languages must be a non-empty string array`);
  }

  assertPlainObject(project.content, `${repoName}: content`);
  for (const locale of ["no", "en"]) {
    assertPlainObject(project.content[locale], `${repoName}: content.${locale}`);
    assertString(project.content[locale].title, `${repoName}: content.${locale}.title`);
    assertString(
      project.content[locale].shortText,
      `${repoName}: content.${locale}.shortText`
    );
    assertString(
      project.content[locale].longText,
      `${repoName}: content.${locale}.longText`
    );
    assertString(project.content[locale].linkLabel, `${repoName}: content.${locale}.linkLabel`, {
      optional: true,
    });
  }

  if (project.buttons !== undefined) {
    if (!Array.isArray(project.buttons)) {
      throw new Error(`${repoName}: buttons must be an array`);
    }

    project.buttons.forEach((button, index) => {
      const context = `${repoName}: buttons[${index}]`;
      assertPlainObject(button, context);
      assertString(button.href, `${context}.href`, { optional: true });
      assertString(button.previewUrl, `${context}.previewUrl`, {
        optional: true,
      });
      assertLocalizedString(button.label, `${context}.label`);
      assertLocalizedString(button.ariaLabel, `${context}.ariaLabel`, {
        optional: true,
      });
    });
  }
}

function getRelativeImagePath(img, repoName) {
  if (img.startsWith("/") || /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(img)) {
    throw new Error(`${repoName}: img must be relative to the portfolio directory`);
  }

  const normalized = path.posix.normalize(img);
  if (normalized === "." || normalized.startsWith("../")) {
    throw new Error(`${repoName}: img must stay inside the portfolio directory`);
  }

  return normalized;
}

function getGeneratedImageName(project, repo, imagePath) {
  const extension = path.extname(imagePath) || ".img";
  const safeRepoName = repo.name.replace(/[^a-zA-Z0-9_-]+/g, "-");
  const safeProjectId = project.id.replace(/[^a-zA-Z0-9_-]+/g, "-");

  return `${safeRepoName}-${safeProjectId}${extension}`.toLowerCase();
}

async function downloadImage(repo, project) {
  const imagePath = getRelativeImagePath(project.img, repo.full_name);
  console.log(`${repo.full_name}: downloading image portfolio/${imagePath}`);
  const contentEntry = await getRepoContent(repo, `portfolio/${imagePath}`);

  if (!contentEntry?.download_url) {
    throw new Error(`${repo.full_name}: missing image portfolio/${imagePath}`);
  }

  const response = await githubFetch(contentEntry.download_url, {
    headers: { Accept: "application/octet-stream" },
  });

  if (!response.ok) {
    throw new Error(
      `${repo.full_name}: failed to download portfolio/${imagePath}: ${response.status} ${response.statusText}`
    );
  }

  const imageBuffer = Buffer.from(await response.arrayBuffer());
  if (imageBuffer.length === 0) {
    throw new Error(`${repo.full_name}: image portfolio/${imagePath} is empty`);
  }

  const generatedImageName = getGeneratedImageName(project, repo, imagePath);
  await writeFile(path.join(outputImageDir, generatedImageName), imageBuffer);

  return `/generated-project-images/${generatedImageName}`;
}

async function readProject(repo) {
  const contentEntry = await getRepoContent(repo, PROJECT_CONFIG_PATH);
  if (!contentEntry) return null;

  let project;
  try {
    project = JSON.parse(decodeBase64Content(contentEntry, repo.full_name));
  } catch (error) {
    throw new Error(`${repo.full_name}: malformed ${PROJECT_CONFIG_PATH}: ${error.message}`);
  }

  validateProject(project, repo.full_name);

  return project;
}

async function main() {
  const repos = await listPublicRepos();
  const projects = [];
  const seenProjectIds = new Map();

  console.log(`Found ${repos.length} public repositories.`);

  await rm(outputImageDir, { recursive: true, force: true });
  await mkdir(outputImageDir, { recursive: true });

  for (const repo of repos) {
    console.log(`${repo.full_name}: checking ${PROJECT_CONFIG_PATH}`);
    const project = await readProject(repo);
    if (!project) {
      console.log(`${repo.full_name}: no project config found, skipping`);
      continue;
    }

    console.log(`${repo.full_name}: found project "${project.id}"`);

    if (seenProjectIds.has(project.id)) {
      throw new Error(
        `Duplicate project id "${project.id}" in ${repo.full_name} and ${seenProjectIds.get(
          project.id
        )}`
      );
    }
    seenProjectIds.set(project.id, repo.full_name);

    const generatedImg = await downloadImage(repo, project);
    projects.push({ ...project, img: generatedImg });
    console.log(`${repo.full_name}: generated project "${project.id}"`);
  }

  await writeFile(outputProjectsPath, `${JSON.stringify(projects, null, 2)}\n`);

  console.log(
    `Generated ${projects.length} projects from ${repos.length} public repositories.`
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
