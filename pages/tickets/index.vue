<script setup lang="ts">
import { loadStripe } from '@stripe/stripe-js'

definePageMeta({
  layout: 'default-flex',
})

const { data } = await useFetch('/api/tickets')
const authStore = useAuthStore()
const { $fetchAuth } = useApp()
const config = useRuntimeConfig()

const stripePromise = loadStripe(config.public.NUXT_STRIPE_PUBLIC_KEY as string)

const isLoadingButton = ref<{ [key: string]: boolean }>({})
const successMessage = ref('')
const errorMessage = ref('')

const tickets = computed(() => data.value?.tickets)
const disabledButton = computed(() => {
  return Object.values(isLoadingButton.value).some(value => value)
})

async function handleClick(id: string) {
  if (!authStore.isLogged) {
    navigateTo('/auth/signin?redirectUrl=/tickets')
  }
  else {
    try {
      isLoadingButton.value[id] = true
      const stripe = await stripePromise

      const v = await $fetchAuth('/api/tickets/payment', {
        method: 'POST',
        body: {
          id,
        },
      })

      await stripe?.redirectToCheckout({
        sessionId: v?.id ?? '',
      })
    }
    catch {
      errorMessage.value = 'Une erreur est survenue lors de la réservation du billet'
    }
  }

  isLoadingButton.value[id] = false
}

onMounted(async () => {
  const { success, ticketId, userId } = useRoute().query

  if (success) {
    try {
      isLoadingButton.value[ticketId as string] = true

      const v = await $fetchAuth('/api/tickets/payment/success', {
        method: 'POST',
        body: {
          ticketId,
          userId,
        },
      })

      successMessage.value = v.message

      navigateTo('/tickets')
    }
    catch (err) {
      errorMessage.value = 'Une erreur est survenue lors de la réservation du billet'
    } finally { 
      isLoadingButton.value[ticketId as string] = false
    }
  }
})

watchEffect(() => {
  if (tickets.value) {
    isLoadingButton.value = tickets.value.reduce((acc: any, ticket) => {
      acc[ticket.id] = false
      return acc
    }, {})
  }
})
</script>

<template>
  <div class="relative isolate px-6 lg:px-8 w-full my-auto">
    <div class="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl" aria-hidden="true">
      <div class="mx-auto aspect-1155/678 w-[72.1875rem] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" />
    </div>
    <div class="mx-auto max-w-3xl text-center">
      <p class="mt-2 text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl 2xl:text-6xl">
        Choisissez l’offre qui <br> vous convient
      </p>
    </div>
    <p class="mx-auto mt-4 max-w-2xl text-center text-md font-medium text-pretty text-gray-600 sm:text-xl/8 2xl:text-lg">
      Réservez vos billets pour les Jeux Olympiques 2024 selon vos envies. Que vous veniez seul, en duo ou en famille, vivez l’expérience des JO avec des offres adaptées à tous.
    </p>
    <UAlert v-if="errorMessage" class="mx-auto max-w-3xl mt-4" :title="errorMessage" variant="subtle" color="error" icon="lucide:triangle-alert" close @update:open="errorMessage = ''" />
    <UAlert v-if="successMessage" class="mx-auto max-w-3xl mt-4" :title="successMessage" variant="subtle" color="success" icon="lucide:check-circle" close @update:open="successMessage = ''" />
    <div class="mx-auto mt-16 grid w-full grid-cols-1 items-center sm:mt-5 lg:max-w-7xl lg:grid-cols-3 gap-6 2xl:mt-12 h-full" :class="{ '!mt-8': errorMessage || successMessage }">
      <div v-for="ticket in tickets" :key="ticket.id" class="relative rounded-3xl bg-white/80 p-8 shadow-2xl ring-1 ring-gray-900/10 sm:p-10 h-full">
        <h3 id="tier-enterprise" class="text-base/7 font-semibold text-indigo-400">
          {{ ticket.name }}
        </h3>
        <p class="mt-4 flex items-baseline gap-x-2">
          <span class="text-5xl font-semibold tracking-tight text-gray-900">{{ ticket.price }} €</span>
        </p>
        <p class="mt-6 text-base/7 text-gray-600 h-14">
          {{ ticket.description }}
        </p>
        <ul role="list" class="mt-8 space-y-3 text-sm/6 text-gray-600 sm:mt-10">
          <li v-for="(item, index) in ticket.list" :key="index" class="flex gap-x-3">
            <svg class="h-6 w-5 flex-none text-indigo-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
              <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" />
            </svg>
            {{ item }}
          </li>
        </ul>
        <UButton size="xl" block class="mt-10" :loading="isLoadingButton[ticket.id]" :disabled="disabledButton" @click="handleClick(ticket.id)">
          Réserver maintenant
        </UButton>
      </div>
    </div>
  </div>
</template>
