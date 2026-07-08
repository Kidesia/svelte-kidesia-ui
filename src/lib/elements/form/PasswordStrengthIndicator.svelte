<script lang="ts">
	import i18n from '$lib/i18n/index.svelte';

	type Props = {
		password: string | null | undefined;
	};

	const { password }: Props = $props();

	type Strength = 0 | 1 | 2 | 3;

	function getStrength(pw: string | null | undefined): Strength {
		if (!pw || pw.length === 0) return 0;
		if (pw.length < 8) return 0;

		// NIST SP 800-63B: length is the primary driver of password strength.
		// A long passphrase is always strong, regardless of character variety.
		if (pw.length >= 20) return 3;

		// For shorter passwords, complexity adds a small boost.
		let complexity = 0;
		if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) complexity++; // mixed case
		if (/[0-9]/.test(pw)) complexity++; // digits
		if (/[^a-zA-Z0-9]/.test(pw)) complexity++; // special chars or spaces

		if (pw.length >= 14) {
			// 14–19 chars: good by default, strong with solid complexity
			return complexity >= 2 ? 3 : 2;
		}

		// 8–13 chars: fair by default, complexity can lift it to good
		return complexity >= 2 ? 2 : 1;
	}

	const strength = $derived(getStrength(password));
	const show = $derived(!!password && password.length > 0);

	const labels: Record<Strength, () => string> = {
		0: () => i18n.t('common.passwordWeak'),
		1: () => i18n.t('common.passwordFair'),
		2: () => i18n.t('common.passwordGood'),
		3: () => i18n.t('common.passwordStrong')
	};

	const colors: Record<Strength, string> = {
		0: 'var(--strength-weak)',
		1: 'var(--strength-fair)',
		2: 'var(--strength-good)',
		3: 'var(--strength-strong)'
	};
</script>

{#if show}
	<div class="password-strength">
		<div class="bars">
			{#each [0, 1, 2, 3] as i (i)}
				<div
					class="bar"
					class:active={i <= strength}
					style="background-color: {i <= strength
						? colors[strength]
						: 'var(--color-border-primary)'}"
				></div>
			{/each}
		</div>
		<span class="label" style="color: {colors[strength]}">
			{labels[strength]()}
		</span>
	</div>
{/if}

<style>
	.password-strength {
		--strength-weak: var(--color-strength-weak);
		--strength-fair: var(--color-strength-fair);
		--strength-good: var(--color-strength-good);
		--strength-strong: var(--color-strength-strong);

		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.25rem;
	}

	.bars {
		display: flex;
		gap: 0.25rem;
		flex: 1;
	}

	.bar {
		height: 4px;
		flex: 1;
		border-radius: 2px;
		transition:
			background-color 0.2s,
			opacity 0.2s;
	}

	.label {
		font-size: 0.75rem;
		font-weight: 500;
		white-space: nowrap;
	}
</style>
