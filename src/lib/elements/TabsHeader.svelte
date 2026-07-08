<script lang="ts" generics="T">
	type Props<T> = {
		tabs: Array<{ key: T; title: string; link: string }>;
		activeTab: T | null;
	};
	let { tabs, activeTab = $bindable() }: Props<T> = $props();

	let container: HTMLDivElement | null = $state(null);
	let tabRefs: Array<HTMLAnchorElement | null> = $state([]);

	function scrollIntoView(tabIndex: number, behavior: 'auto' | 'smooth' = 'smooth') {
		if (!container?.offsetWidth || !tabRefs[tabIndex]) return;

		let scrollPos =
			tabRefs[tabIndex]?.offsetLeft -
			container?.offsetWidth / 2 +
			tabRefs[tabIndex]?.offsetWidth / 2;
		container?.scrollTo({ left: scrollPos, behavior });
	}

	$effect(() => {
		const activeIndex = tabs.findIndex(({ key, link }) => key === activeTab || link === activeTab);
		const frame =
			activeIndex < 0
				? null
				: requestAnimationFrame(() => {
						scrollIntoView(activeIndex, 'auto');
					});

		return () => {
			if (frame !== null) {
				cancelAnimationFrame(frame);
			}
		};
	});
</script>

<div class="tabs-header" bind:this={container}>
	{#each tabs as { key, title, link }, i (key)}
		<!-- eslint-disable svelte/no-navigation-without-resolve -->
		<a
			bind:this={tabRefs[i]}
			class:active={key === activeTab || link === activeTab}
			href={link}
			onclick={() => {
				activeTab = key;
				scrollIntoView(i);
			}}>{title}</a
		>
	{/each}
</div>

<style>
	.tabs-header {
		width: 100%;
		max-width: 100%;
		display: flex;
		align-items: center;
		overflow-x: auto;
		overflow-y: hidden;
		gap: 0.25rem;
		border-bottom: 1px solid var(--color-border-primary);
		scrollbar-width: thin;
	}

	.tabs-header > a {
		position: relative;
		padding: 1rem 1rem 0.75rem 1rem;
		white-space: nowrap;
		color: var(--color-text-muted);
		border-radius: 0.5rem 0.5rem 0 0;
		border: 1px solid transparent;
		transition:
			color 0.15s ease,
			background-color 0.15s ease,
			border-color 0.15s ease,
			box-shadow 0.15s ease;
	}

	.tabs-header > a:hover {
		background-color: var(--color-interactive-hover-bg);
		color: var(--color-text-primary);
	}

	.tabs-header > a.active {
		color: var(--color-text-primary);
		font-weight: 600;
	}

	.tabs-header > a.active::after {
		content: '';
		position: absolute;
		display: block;
		bottom: -1px;
		left: 0;
		right: 0;
		height: 2px;
		background: var(--color-primary);
		border-radius: 2px 2px 0 0;
		view-transition-name: active-tab;
	}

	a {
		color: var(--color-on-surface);
		text-decoration: none;
	}

	a:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: -2px;
	}
</style>
