import axios from "axios";

const BASE_URL = "https://api.github.com";

const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
    },
});