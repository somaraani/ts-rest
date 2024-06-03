<script lang="ts">
  import { postsClient } from './postsClient';

  const query = postsClient.getPosts.createQuery(['posts']);

  $: posts = $query.data?.body || [];
</script>

<div>
  <h1>Posts</h1>
  {#if $query.isFetching}
    <p>Loading...</p>
  {:else if $query.isError}
    <p>Error: {$query.error.body}</p>
  {:else}
    {#each posts as post}
      <div>
        <h2>{post.title}</h2>
        <p>{post.content}</p>
      </div>
    {/each}
  {/if}
</div>
