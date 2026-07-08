<script lang="ts">
	type Props = {
		phone: string;
	};

	const { phone }: Props = $props();
</script>

<a href="tel:{phone.replace(/[^0-9+]/g, '')}">{phone}</a>
