<script lang="ts">
	import Card from './Card.svelte';

	type Props = {
		title: string;
		value: string | number;
		valueDescription?: string;
		valueColor?: 'default' | 'positive' | 'negative';
		secondaryValue?: string | number;
		secondaryValueDescription?: string;
		href?: string;
		active?: boolean;
	};

	const {
		title,
		value,
		valueDescription,
		valueColor = 'default',
		secondaryValue,
		secondaryValueDescription,
		href,
		active
	}: Props = $props();
</script>

<Card {href} {active}>
	<div class="kpi">
		<div class="kpi-label">{title}</div>
		{#if secondaryValue !== undefined}
			<div class="kpi-contents">
				<div>
					<div
						class="kpi-value"
						class:positive={valueColor === 'positive'}
						class:negative={valueColor === 'negative'}
					>
						{value}
					</div>
					{#if valueDescription}
						<div class="kpi-description">{valueDescription}</div>
					{/if}
				</div>
				<div>
					<div class="kpi-value">{secondaryValue}</div>
					{#if secondaryValueDescription}
						<div class="kpi-description">{secondaryValueDescription}</div>
					{/if}
				</div>
			</div>
		{:else}
			<div
				class="kpi-value"
				class:positive={valueColor === 'positive'}
				class:negative={valueColor === 'negative'}
			>
				{value}
			</div>
			{#if valueDescription}
				<div class="kpi-description">{valueDescription}</div>
			{/if}
		{/if}
	</div>
</Card>

<style>
	.kpi-label {
		font-weight: 500;
		color: var(--color-text-secondary);
	}

	.kpi-value {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--color-text-primary);
		font-variant-numeric: tabular-nums;

		&.negative {
			color: var(--color-error-emphasis);
		}

		&.positive {
			color: var(--color-success);
		}
	}

	.kpi-description {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		font-weight: 400;
	}

	.kpi-contents {
		display: flex;
		justify-content: space-between;
		align-items: end;
		gap: 1rem;
	}

	.kpi-contents > :last-child {
		text-align: right;
	}

	.kpi-contents > :last-child .kpi-value {
		color: var(--color-text-secondary);
	}
</style>
