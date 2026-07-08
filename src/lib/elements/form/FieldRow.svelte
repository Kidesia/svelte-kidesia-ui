<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};

	const { children }: Props = $props();
</script>

<div class="field-row">
	{@render children()}
</div>

<style>
	.field-row {
		display: flex;
		gap: 1rem;

		:global(> *) {
			flex: 1;
		}
	}
</style>
