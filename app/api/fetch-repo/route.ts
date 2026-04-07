import { getRepoTree, parseGithubUrl }  from "@/lib/github";

export async function POST(request: Request) {
    try{
        const body = await request.json();
        const { url} = body;

        if(!url) {
            return Response.json(
                {error: "GitHub URL is require"},
                {status: 400}
            );
        }

        const {owner, repo} = parseGithubUrl(url);
        const tree = await getRepoTree(owner, repo);

        const files = tree.filter((node) => node.type === "blob");
        return Response.json({owner, repo, files});
    } catch(error){
        console.error("Error fetching repo:", error);
        return Response.json(
            {error: "Failed to fetch repository"},
            {status: 500}
        );
    }
}