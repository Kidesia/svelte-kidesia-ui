<script lang="ts">
	type Props = {
		value: number | null;
	};

	let { value = $bindable() }: Props = $props();
</script>

<input type="range" class="hue-selector" min="0" max="360" style="--__hue: {value}" bind:value />

<style>
	.hue-selector {
		accent-color: oklch(60% 30% var(--__hue));
	}
</style>
