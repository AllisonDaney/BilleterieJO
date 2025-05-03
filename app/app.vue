<script setup lang="ts">
const { afterEach } = useRouter()

afterEach(() => {
  useAppStore().toggleDrawer(false)
})
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator color="var(--ui-color-primary-500)" />
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
