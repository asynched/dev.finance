<script lang="ts">
	export let label: string
	export let type: string
	export let placeholder: string | undefined = undefined
	export let name: string
	export let description: string | undefined = undefined
</script>

<div class="flex flex-col">
	<label for={name} class="mb-1 text-gray-600">{label}</label>
	<input
		{type}
		{placeholder}
		id={name}
		{name}
		class="w-full py-2 px-4 rounded outline-none transition-base focus:ring-2 focus:ring-green-600"
	/>
	{#if description}
		<span class="mt-1 text-xs text-gray-600">{description}</span>
	{/if}
</div>
