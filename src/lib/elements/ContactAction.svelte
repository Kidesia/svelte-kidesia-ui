<script lang="ts">
	import MailIcon from '~icons/material-symbols/mail-outline-rounded';
	import PhoneIcon from '~icons/material-symbols/phone-in-talk-rounded';

	type Props = {
		type: 'phone' | 'email';
		value: string;
		/** Overrides the displayed text; defaults to the raw value. */
		label?: string;
	};

	const { type, value, label }: Props = $props();

	const href = $derived(
		type === 'phone' ? `tel:${value.replace(/[^0-9+]/g, '')}` : `mailto:${value}`
	);
</script>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- tel:/mailto: are external schemes, not app routes -->
<a class="contact-action" {href}>
	{#if type === 'phone'}
		<PhoneIcon />
	{:else}
		<MailIcon />
	{/if}
	<span class="contact-action-text">{label ?? value}</span>
</a>

<style>
	.contact-action {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		max-width: 100%;
		padding: 0.25rem 0.625rem;
		border: 1px solid var(--color-border-subtle);
		border-radius: 999px;
		background-color: var(--color-bg-surface);
		color: var(--color-text-primary);
		font-size: 0.875rem;
		text-decoration: none;
		transition: background-color 0.15s ease;
	}

	.contact-action:hover {
		background-color: var(--color-interactive-hover-bg);
	}

	.contact-action :global(svg) {
		width: 1rem;
		height: 1rem;
		color: var(--color-text-tertiary);
		flex-shrink: 0;
	}

	.contact-action-text {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
