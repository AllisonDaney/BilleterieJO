<script setup>
const tickets = [
  {
    id: 1,
    name: 'Offre Solo',
    price: 29,
    description: 'Idéale pour vivre l’événement à votre rythme.',
    list: [
      '1 billet pour une épreuve au choix',
      'E-ticket sécurisé',
      'Assistance par email',
      'Accès aux infos en temps réel',
    ],
  },
  {
    id: 2,
    name: 'Offre Duo',
    price: 55,
    description: 'Parfait pour partager l’émotion des JO à deux.',
    list: [
      '2 billets pour la même épreuve',
      'Placement côte à côte garanti',
      'E-tickets sécurisés',
      'Support prioritaire',
    ],
  },
  {
    id: 3,
    name: ' Offre Familiale',
    price: 99,
    description: 'Conçue pour une sortie sportive en famille.',
    list: [
      '4 billets pour la même épreuve',
      'Placement groupé',
      'Cadeau souvenir officiel',
      'Assistance dédiée',
    ],
  },
]
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
    <div class="mx-auto mt-16 grid w-full grid-cols-1 items-center sm:mt-5 lg:max-w-7xl lg:grid-cols-3 gap-6 2xl:mt-20">
      <div v-for="ticket in tickets" :key="ticket.id" class="relative rounded-3xl bg-white/80 p-8 shadow-2xl ring-1 ring-gray-900/10 sm:p-10">
        <h3 id="tier-enterprise" class="text-base/7 font-semibold text-indigo-400">
          {{ ticket.name }}
        </h3>
        <p class="mt-4 flex items-baseline gap-x-2">
          <span class="text-5xl font-semibold tracking-tight text-gray-900">{{ ticket.price }} €</span>
        </p>
        <p class="mt-6 text-base/7 text-gray-600">
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
        <UButton size="xl" to="/tickets" block class="sm:mt-10">
          Réserver maintenant
        </UButton>
      </div>
    </div>
  </div>
</template>
