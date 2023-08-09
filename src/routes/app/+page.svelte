<script lang="ts">
	import { invalidate, invalidateAll } from '$app/navigation'
	import CreateExpenseModal from '@/components/modals/CreateExpenseModal.svelte'
	import type { PageData } from './$types'
	import { flip } from 'svelte/animate'
	import ProfileModal from '@/components/modals/ProfileModal.svelte'

	export let data: PageData

	let createExpenseModal = false
	let profileModal = false

	const income = data.expenses
		.filter((expense) => expense.amount >= 0)
		.reduce((total, expense) => total + expense.amount, 0)
	const expense = data.expenses
		.filter((expense) => expense.amount < 0)
		.reduce((total, expense) => total + expense.amount, 0)
	const total = income + expense

	function formatCurrency(value: number) {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL',
		}).format(value)
	}

	function toggleExpenseModal() {
		createExpenseModal = !createExpenseModal
	}

	function toggleProfileModal() {
		profileModal = !profileModal
	}

	async function handleDelete(id: number) {
		const form = new FormData()

		form.append('id', String(id))

		await fetch(`?/remove`, {
			method: 'POST',
			body: form,
		})

		invalidateAll()
	}
</script>

<svelte:head>
	<title>DevFinance | Registre suas transações</title>
</svelte:head>

<header class="bg-green-700">
	<div class="py-6 w-[90%] max-w-screen-md mx-auto flex flex-col">
		<img
			src="https://dev-finance.netlify.app/assets/img/logo.svg"
			alt="Logo"
			class="self-center mb-6"
		/>
		<div class="-mb-12 grid lg:grid-cols-3 gap-8">
			<div class="p-6 bg-white rounded shadow-xl shadow-gray-600/10">
				<div class="mb-2 flex justify-between items-center">
					<span class="text-gray-600 text-sm">Entradas</span>
					<img
						src="https://dev-finance.netlify.app/assets/img/income.svg"
						alt="Entradas"
					/>
				</div>
				<h2 class="text-3xl tracking-tight text-gray-700">
					{formatCurrency(income)}
				</h2>
			</div>
			<div class="p-6 bg-white rounded shadow-xl shadow-gray-600/10">
				<div class="mb-2 flex justify-between items-center">
					<span class="text-gray-600 text-sm">Saídas</span>
					<img
						src="https://dev-finance.netlify.app/assets/img/expense.svg"
						alt="Saídas"
					/>
				</div>
				<h2 class="text-3xl tracking-tight text-gray-700">
					{formatCurrency(expense)}
				</h2>
			</div>
			<div
				class="p-6 bg-green-600 text-white rounded shadow-xl shadow-gray-600/10"
			>
				<div class="mb-2 flex items-center justify-between">
					<span class="text-sm">Total</span>
					<img
						src="https://dev-finance.netlify.app/assets/img/total.svg"
						alt="Total"
					/>
				</div>
				<h2 class="text-3xl tracking-tight">{formatCurrency(total)}</h2>
			</div>
		</div>
	</div>
</header>

<div class="py-12 w-[90%] max-w-screen-md mx-auto">
	<button class="mb-4 text-green-600" on:click={toggleExpenseModal}>
		+ Nova transação
	</button>
	{#if data.expenses.length > 0}
		<div class="w-full overflow-x-auto">
			<table class="w-full border-separate border-spacing-y-2 text-sm">
				<thead class="text-left font-normal bg-white rounded">
					<tr class="text-gray-400">
						<th class="font-normal py-4 px-8">Descrição</th>
						<th class="font-normal py-4 px-8">Valor</th>
						<th class="font-normal py-4 px-8">Data</th>
						<th />
					</tr>
				</thead>
				<tbody>
					{#each data.expenses as expense (expense.id)}
						<tr animate:flip={{ duration: 200 }} class="bg-white text-gray-600">
							<td class="py-4 px-8">{expense.name}</td>
							<td
								class="py-4 px-8"
								class:text-green-600={expense.amount >= 0}
								class:text-red-600={expense.amount < 0}
								>{formatCurrency(expense.amount)}</td
							>
							<td class="py-4 px-8 text-gray-400"
								>{expense.date.toLocaleDateString()}</td
							>
							<td class="py-4 px-8">
								<button
									aria-label="Remover"
									on:click={() => handleDelete(expense.id)}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="w-4 h-4 text-gray-60"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
										/>
									</svg>
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<div
			class="p-4 text-center border-2 border-dashed text-gray-400 text-sm rounded"
		>
			<p>Você ainda não possui transações</p>
		</div>
	{/if}
</div>

<button
	class="w-12 h-12 bg-green-600 rounded-lg grid place-items-center text-white fixed bottom-8 right-8 shadow-xl shadow-green-600/25 transition-base hover:bg-green-500"
	on:click={toggleProfileModal}
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class="w-6 h-6"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
		/>
	</svg>
</button>

{#if createExpenseModal}
	<CreateExpenseModal on:close={toggleExpenseModal} />
{/if}

{#if profileModal}
	<ProfileModal
		user={data.user}
		sessions={data.sessions}
		on:close={toggleProfileModal}
	/>
{/if}
