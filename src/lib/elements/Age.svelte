<script lang="ts">
	import i18n from '$lib/i18n/index.svelte';
	import { getAgeInMonths } from '$lib/utils/age';

	type Props = {
		birthdate: Date;
		truncate?: boolean;
		display?: 'compact' | 'full';
	};

	const { birthdate, truncate = false, display = 'compact' }: Props = $props();

	const ageInMonths = $derived(getAgeInMonths(birthdate));
	const years = $derived(Math.floor(ageInMonths / 12));
	const months = $derived(ageInMonths % 12);
</script>

{#snippet monthsPart(count: number)}
	{#if display === 'compact'}
		{i18n.t('children.monthsShort', { count })}
	{:else}
		{i18n.t('children.months', { count })}
	{/if}
{/snippet}

<div class="age" class:truncate>
	{#if years > 0}
		<span>
			{#if display === 'compact'}
				{i18n.t('children.yearsShort', { count: years })}
			{:else}
				{i18n.t('children.years', { count: years })}
			{/if}
		</span>
		{#if years < 3}
			<span class="aside">
				{@render monthsPart(months)}
			</span>
		{/if}
	{:else}
		<span>{@render monthsPart(months)}</span>
	{/if}
</div>

<style>
	.age {
		span {
			color: var(--color-text-primary);

			&.aside {
				color: var(--color-text-tertiary);
			}
		}

		&.truncate {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
</style>
