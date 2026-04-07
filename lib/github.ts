import axios from "axios";

export type FileNode = {
    path: string;
    type: "blob" | "tree";
    sha: string;
    size?: number;
    url: string;
};

const BASE_URL = "https://api.github.com";

const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
    },
});

export async function getRepoTree(owner: string, repo: string) {
    const { data: repoData } = await client.get(`/repos/${owner}/${repo}`);
    const branch = repoData.default_branch;

    const { data } = await client.get(
        `/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
    );

    return data.tree as FileNode[];
}

export async function getFileContent(owner: string, repo: string, path: string) {
    const { data } = await client.get(
        `/repos/${owner}/${repo}/contents/${path}`
    );
    
    const content = Buffer.from(data.content, "base64").toString("utf-8");
    return content;
}

export function parseGithubUrl(url : string) : { owner: string; repo: string} {
    const cleaned = url.replace("https://", "").replace("http://", "").replace("www.", "");
    const parts = cleaned.split("/");
    return{
        owner: parts[1],
        repo: parts[2],
    };
}