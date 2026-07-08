<script lang="ts">
	import { scale } from 'svelte/transition';

	type Props = {
		count?: number;
	};

	const { count }: Props = $props();
</script>

{#if count != null && count > 0}
	<div class="status-badge" transition:scale>
		{count > 99 ? '99+' : count}
	</div>
{:else}
	<div class="status-dot" transition:scale></div>
{/if}

<style>
	.status-dot {
		min-width: 0.7rem;
		min-height: 0.7rem;
		background-color: var(--color-primary);
		border-radius: 50%;
	}

	.status-badge {
		min-width: 1.15rem;
		height: 1.15rem;
		padding: 0 0.25rem;
		background-color: var(--color-primary);
		border-radius: 1rem;
		color: white;
		font-size: 0.65rem;
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
	}
</style>
