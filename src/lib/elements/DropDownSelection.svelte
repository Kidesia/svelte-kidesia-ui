<script lang="ts" generics="TKey extends string | number">
	import i18n from '$lib/i18n/index.svelte';

	import DropDown from './DropDown.svelte';

	type DropDownSelectionOption = {
		key: TKey;
		label: string;
	};

	type Props = {
		label?: string;
		values: TKey[];
		options: DropDownSelectionOption[];
		onChange?: (selectedValues: TKey[]) => void;
		stretchTrigger?: boolean;
	};

	let {
		label,
		values = $bindable(),
		options = [],
		onChange,
		stretchTrigger = false
	}: Props = $props();

	const allSelected = $derived(values.length === 0 || values.length === options.length);
	const someSelected = $derived(values.length > 0 && values.length < options.length);

	const selectionText = $derived(
		allSelected
			? i18n.t('common.all')
			: values.length < 3
				? options
						.filter((option) => values.includes(option.key))
						.map((option) => option.label)
						.join(', ')
				: `${values.length}`
	);
</script>

<DropDown
	noPadding
	triggerStyle="filter"
	labelPrefix={label}
	label={selectionText}
	active={!allSelected}
	showCloseButton={false}
	{stretchTrigger}
>
	<div class="drop-down-selection">
		<label class="checkbox-label select-all">
			<input
				type="checkbox"
				checked={values.length === options.length}
				indeterminate={someSelected}
				onchange={() => {
					values = values.length === options.length ? [] : options.map((o) => o.key);
					onChange?.(values);
				}}
			/>
			<span class="checkbox-box"></span>
			<span>{i18n.t('common.selectAll')}</span>
		</label>

		{#each options as option (option.label)}
			<label class="checkbox-label">
				<input
					type="checkbox"
					checked={values.includes(option.key)}
					onchange={() => {
						const newSelection = values.includes(option.key)
							? values.filter((v) => v !== option.key)
							: [...values, option.key];
						values = newSelection;
						onChange?.(newSelection);
					}}
				/>
				<span class="checkbox-box"></span>
				<span>{option.label}</span>
			</label>
		{/each}
	</div>
</DropDown>

<style>
	.drop-down-selection {
		display: flex;
		flex-direction: column;
		min-width: 200px;
		padding: 0.25rem 0;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		cursor: pointer;

		&:not(:first-child) {
			border-top: 1px solid var(--color-border-primary);
		}

		&:hover {
			background-color: var(--color-interactive-active-bg);
		}

		input {
			position: absolute;
			width: 1px;
			height: 1px;
			padding: 0;
			margin: -1px;
			overflow: hidden;
			clip: rect(0, 0, 0, 0);
			border: 0;
		}

		.checkbox-box {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 1.25rem;
			height: 1.25rem;
			border: 1.5px solid var(--color-border-secondary);
			border-radius: 0.25rem;
			background-color: var(--color-bg-surface);
			flex-shrink: 0;
			transition:
				background-color 0.15s ease,
				border-color 0.15s ease;
		}

		.checkbox-box::after {
			content: '';
			display: block;
			width: 0.35rem;
			height: 0.6rem;
			border: solid transparent;
			border-width: 0 2px 2px 0;
			transform: rotate(45deg) translateY(-1px);
			transition: border-color 0.15s ease;
		}

		input:checked + .checkbox-box {
			background-color: var(--color-primary);
			border-color: var(--color-primary);
		}

		input:checked + .checkbox-box::after {
			border-color: var(--color-primary-fg);
		}

		input:indeterminate + .checkbox-box {
			background-color: var(--color-primary);
			border-color: var(--color-primary);
		}

		input:indeterminate + .checkbox-box::after {
			width: 0.6rem;
			height: 0;
			border: solid var(--color-primary-fg);
			border-width: 0 0 2px 0;
			transform: none;
		}

		&:hover .checkbox-box {
			border-color: var(--color-primary);
		}

		input:focus-visible + .checkbox-box {
			outline: 2px solid var(--color-primary);
			outline-offset: 2px;
		}
	}

	.select-all {
		font-weight: 600;
	}
</style>
