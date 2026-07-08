<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		text: string;
		children: Snippet;
	};

	const { text, children }: Props = $props();
</script>

<label>
	<span class="label-text">{text}</span>

	{@render children()}
</label>

<style>
	label {
		display: flex;
		flex-direction: row;
		gap: 0.5rem;

		& .label-text {
			user-select: none;
			font-weight: 600;
			color: var(--color-text-muted);
		}
	}
</style>
