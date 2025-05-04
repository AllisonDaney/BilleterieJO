<script lang="ts" setup>
interface Props {
  links: {
    label: string
    to: string
  }[]
}

withDefaults(defineProps<Props>(), {})

const appStore = useAppStore()
</script>

<template>
  <UDrawer v-model:open="appStore.isDrawerOpen" direction="right" :handle="false" :ui="{ content: 'w-full max-w-full sm:w-auto sm:max-w-auto' }">
    <div @click="appStore.toggleDrawer(true)">
      <slot name="trigger" />
    </div>

    <template #content>
      <div class="min-w-80 w-full p-6">
        <div class="flex items-center justify-between">
          <NuxtLink to="/">
            <NuxtImg
              src="/img/logo.svg"
              alt="Billeterie JO"
              height="40"
              class="h-[40px] transition-all ease-in-out duration-300"
            />
          </NuxtLink>
          <UButton
            icon="lucide-x" color="neutral" variant="ghost"
            @click="appStore.toggleDrawer(false)"
          />
        </div>
        <div class="divide-y divide-gray-500/10">
          <div class="flex flex-col space-y-2 py-6 my-6  ">
            <NuxtLink v-for="link in links" :key="link.to" :to="link.to" active-class="text-primary-500 font-bold" class="px-4 py-2">
              {{ link.label }}
            </NuxtLink>
          </div>
          <UButton
            to="/auth/signin"
            size="xl"
            variant="ghost"
            trailing-icon="lucide-arrow-right"
          >
            Se connecter
          </UButton>
        </div>
      </div>
    </template>
  </UDrawer>
</template>
