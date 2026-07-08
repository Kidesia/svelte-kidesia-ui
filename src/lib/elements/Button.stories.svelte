<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn } from 'storybook/test';

	import Button from './Button.svelte';

	const { Story } = defineMeta({
		title: 'Elements/Button',
		component: Button,
		tags: ['autodocs'],
		args: {
			onClick: fn()
		}
	});
</script>

<Story name="Primary" args={{ label: 'Save', variant: 'primary' }} />

<Story name="Secondary" args={{ label: 'Cancel' }} />

<Story name="Tertiary" args={{ label: 'More', variant: 'tertiary' }} />

<Story name="Outline" args={{ label: 'Filter', variant: 'outline' }} />

<Story name="Success" args={{ label: 'Approve', variant: 'success' }} />

<Story name="With icon" args={{ label: 'Add', icon: 'add', variant: 'primary' }} />

<Story name="Disabled" args={{ label: 'Save', variant: 'primary', disabled: true }} />

<Story
	name="With confirmation"
	args={{
		label: 'Delete',
		icon: 'deleteDefault',
		confirmOptions: { message: 'Really delete this entry?' }
	}}
/>
