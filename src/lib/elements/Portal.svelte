<script lang="ts">
	import { getContext, type Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	let container: HTMLDivElement | undefined = $state();

	const getPortalTarget = getContext<(() => HTMLElement | undefined) | undefined>('portal-target');

	$effect(() => {
		if (container) {
			const target = getPortalTarget?.() ?? document.body;
			target.appendChild(container);

			return () => {
				if (container && target.contains(container)) {
					target.removeChild(container);
				}
			};
		}
		return undefined;
	});
</script>

<div style="display: contents" bind:this={container}>
	{@render children()}
</div>
