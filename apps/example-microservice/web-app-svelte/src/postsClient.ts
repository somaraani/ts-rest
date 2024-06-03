import { postsApi } from "@ts-rest/example-microservice/util-posts-api";
import { initQueryClient } from "@ts-rest/svelte-query";

export const postsClient = initQueryClient(postsApi, {
    baseHeaders: {},
    baseUrl: 'http://localhost:5003',
  });