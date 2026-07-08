<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import Badge from './Badge.svelte';

	const { Story } = defineMeta({
		title: 'Elements/Badge',
		component: Badge,
		tags: ['autodocs']
	});
</script>

<Story name="Neutral" args={{ label: 'Draft' }} />

<Story name="Info" args={{ label: 'New', variant: 'info' }} />

<Story name="Error" args={{ label: 'Overdue', variant: 'error' }} />

<Story name="Hue" args={{ label: 'Group A', variant: { hue: 210 } }} />

<Story
	name="Small with icon"
	args={{ label: 'Today', icon: 'calendarTodayDefault', size: 'small' }}
/>
