<script lang="ts">
	import { getContext } from 'svelte';

	import i18n from '$lib/i18n/index.svelte';

	import Input from './Input.svelte';

	type Props = {
		minutes: number | null;
		stretch?: boolean;
	};

	let { minutes = $bindable(), stretch = false }: Props = $props();

	let hours = $derived(Math.floor((minutes ?? 0) / 60));
	let mins = $derived(Math.abs((minutes ?? 0) % 60));

	function updateMinutes(newHours: number, newMins: number): void {
		minutes = Math.max(0, newHours * 60 + newMins);
	}

	const labelId: string | undefined = getContext('field-id');
</script>

<div class="duration-container" class:stretch>
	<div>
		<Input
			id={labelId}
			type="number"
			min="0"
			value={hours}
			onchange={(e) => {
				updateMinutes(Number(e.currentTarget.value), mins);
			}}
		/>

		{i18n.t('common.hoursShort')}
	</div>

	<div>
		<Input
			id={null}
			type="number"
			value={mins}
			onchange={(e) => {
				updateMinutes(hours, Number(e.currentTarget.value));
			}}
		/>

		{i18n.t('common.minutesShort')}
	</div>
</div>

<style>
	.duration-container {
		display: flex;
		align-items: center;
		gap: 0.5rem;

		> div {
			display: flex;
			align-items: center;
			gap: 0.5rem;
		}

		:global(input) {
			width: 5rem;
		}
	}

	.duration-container.stretch {
		width: 100%;

		> div {
			flex: 1;
			width: 50%;
		}

		:global(input) {
			width: 100%;
			flex: 1;
		}
	}
</style>
