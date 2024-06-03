<script lang="ts">
  import { postsClient } from './postsClient';

  const query = postsClient.getPosts.createQuery(['posts']);
  const mutation = postsClient.updatePostThumbnail.createMutation();

  $: posts = $query.data?.body || [];

  let file: File | null = null;

  const onFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      file = target.files[0];
    }
  };

  const onClick = async () => {
    if (file) {
      $mutation.mutate({
        body: {
          thumbnail: file,
          data: 'Hey There!',
        },
        params: {
          id: '1',
        },
      });
    }
  };
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
        {#if $mutation.isPending}
          Uploading...
        {:else if $mutation.isSuccess}
          Uploaded!
        {:else if $mutation.isError}
          Error: {$mutation.error.body}
        {:else}
          <input type="file" on:change={onFileChange} />
          <button on:click={onClick}>Upload</button>
        {/if}
      </div>
    {/each}
  {/if}
</div>
