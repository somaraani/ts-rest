<script lang="ts">
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  import Posts from './Posts.svelte';
</script>

<QueryClientProvider client={new QueryClient()}>
  <Posts />
</QueryClientProvider>
