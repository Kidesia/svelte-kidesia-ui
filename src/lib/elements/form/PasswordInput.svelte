<script lang="ts">
	import { getContext } from 'svelte';
	import VisibilityOffIcon from '~icons/material-symbols/visibility-off-outline-rounded';
	import VisibilityIcon from '~icons/material-symbols/visibility-outline-rounded';

	import i18n from '$lib/i18n/index.svelte';

	type Props = {
		id?: string | null;
		value: string | null | undefined;
		autocomplete?: 'new-password' | 'current-password' | 'off';
	};

	let { id, value = $bindable(), autocomplete = 'new-password' }: Props = $props();

	let showPassword = $state(false);

	const labelId: string | undefined = getContext('field-id');
	const actualId = $derived(id !== undefined ? id : labelId);

	function toggleVisibility() {
		showPassword = !showPassword;
	}
</script>

<div class="password-input-wrapper">
	<input
		type={showPassword ? 'text' : 'password'}
		bind:value
		{autocomplete}
		id={actualId}
		name="password-{Math.random().toString(36).substring(7)}"
	/>
	<button
		type="button"
		class="toggle-visibility"
		onclick={toggleVisibility}
		aria-label={showPassword ? i18n.t('common.hidePassword') : i18n.t('common.showPassword')}
	>
		{#if showPassword}
			<VisibilityOffIcon />
		{:else}
			<VisibilityIcon />
		{/if}
	</button>
</div>

<style>
	.password-input-wrapper {
		position: relative;
		display: flex;
		align-items: center;
	}

	.password-input-wrapper input {
		flex: 1;
		padding-right: 2.5rem;
	}

	.toggle-visibility {
		position: absolute;
		right: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.25rem;
		background: none;
		border: none;
		cursor: pointer;
		color: var(--color-text-muted);
		transition: color 0.2s;
	}

	.toggle-visibility:hover {
		color: var(--color-text-primary);
	}
</style>
