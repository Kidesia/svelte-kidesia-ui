<script module lang="ts">
	export type FilterSection = {
		id: string;
		label: string;
		options: { id: string; label: string }[];
	};

	export type FilterValue = Record<string, string[]>;
</script>

<script lang="ts">
	import i18n from '$lib/i18n/index.svelte';

	import Chip from './Chip.svelte';
	import DropDown from './DropDown.svelte';

	type Props = {
		sections: FilterSection[];
		value: FilterValue;
		onChange: (value: FilterValue) => void;
	};

	const { sections, value, onChange }: Props = $props();

	const activeEntries = $derived(
		sections.flatMap((section) =>
			(value[section.id] ?? []).flatMap((optionId) => {
				const option = section.options.find((sectionOption) => sectionOption.id === optionId);
				return option ? [{ section, option }] : [];
			})
		)
	);

	function isChecked(sectionId: string, optionId: string): boolean {
		return (value[sectionId] ?? []).includes(optionId);
	}

	function toggle(sectionId: string, optionId: string) {
		const current = new Set(value[sectionId] ?? []);
		if (current.has(optionId)) {
			current.delete(optionId);
		} else {
			current.add(optionId);
		}
		onChange({ ...value, [sectionId]: [...current] });
	}

	function clearAll() {
		onChange({});
	}
</script>

<div class="filter-control">
	<DropDown
		active={activeEntries.length > 0}
		triggerStyle="filter"
		labelPrefix={i18n.t('list.filter')}
		label={activeEntries.length > 0 ? String(activeEntries.length) : i18n.t('list.all')}
		ariaLabel={i18n.t('list.filter')}
		showCloseButton={false}
	>
		{#each sections as section (section.id)}
			<div class="section">
				<span class="section-label">{section.label}</span>
				<div class="chips">
					{#each section.options as option (option.id)}
						<Chip
							label={option.label}
							checked={isChecked(section.id, option.id)}
							onChange={() => {
								toggle(section.id, option.id);
							}}
						/>
					{/each}
				</div>
			</div>
		{/each}

		{#if activeEntries.length > 0}
			<div>
				<button class="clear-all" onclick={clearAll}>
					{i18n.t('list.clearFilters')}
				</button>
			</div>
		{/if}
	</DropDown>

	{#each activeEntries as entry (`${entry.section.id}:${entry.option.id}`)}
		<Chip
			label={`${entry.section.label}: ${entry.option.label}`}
			checked={true}
			onChange={() => {
				toggle(entry.section.id, entry.option.id);
			}}
		/>
	{/each}
</div>

<style>
	.filter-control {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
		min-width: 0;
	}

	.section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		min-width: 14rem;
	}

	.section-label {
		font-size: 0.6875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-secondary);
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
	}

	.clear-all {
		align-self: flex-start;
		background: none;
		border: none;
		padding: 0;
		font: inherit;
		font-size: 0.875rem;
		color: var(--color-interactive);
		cursor: pointer;
		text-decoration: underline;

		&:hover {
			color: var(--color-text-primary);
		}
	}
</style>
