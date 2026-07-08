<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import MoreVertical from '~icons/material-symbols/more-vert';

	import iconsRegistry from '$lib/utils/icons-registry';

	import DropDown from './DropDown.svelte';

	type MenuItem = {
		icon?: Component | keyof typeof iconsRegistry;
		label: string;
		onClick: () => void;
	};

	type Props = {
		label?: string;
		items: (MenuItem | false)[];
		icon?: Component | keyof typeof iconsRegistry;
		trigger?: Snippet<[isOpen: boolean]>;
		triggerStyle?: 'button' | 'filter';
		ariaLabel?: string;
	};

	const { label, items, icon, trigger, triggerStyle = 'button', ariaLabel }: Props = $props();

	const actualIcon = $derived(trigger ? undefined : (icon ?? (!label ? MoreVertical : undefined)));
	const actualItems = $derived(items.filter((item): item is MenuItem => Boolean(item)));
</script>

<!-- TODO: disable if there are no actualItems? (DropDown would need disabled option) -->
<DropDown
	noPadding
	{label}
	icon={actualIcon}
	{trigger}
	{triggerStyle}
	{ariaLabel}
	showCloseButton={false}
>
	<div class="menu-items">
		{#each actualItems as item (item.label)}
			<button
				class="menu-item"
				onclick={() => {
					item.onClick();
				}}
			>
				{#if item.icon}
					{@const Icon =
						typeof item.icon === 'string' ? iconsRegistry[item.icon].outline : item.icon}
					<Icon />
				{/if}
				{item.label}
			</button>
		{/each}
	</div>
</DropDown>

<style>
	.menu-items {
		display: flex;
		flex-direction: column;
		min-width: 150px;
	}

	.menu-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 8px 16px;
		width: 100%;
		cursor: pointer;

		&:not(:last-child) {
			border-bottom: 1px solid var(--color-border-primary);
		}

		&:hover {
			/* TODO: extract this color (and maybe even add a more subtle variation) */
			background-color: oklch(0.95 0.05 58);
		}
	}
</style>
