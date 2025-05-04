import i18next from 'i18next'
import { z } from 'zod'
import { zodI18nMap } from 'zod-i18n-map'
import defaultFr from 'zod-i18n-map/locales/fr/zod.json'
import customFr from '~/locales/fr.json'

export default function () {
  i18next.init({
    lng: 'fr',
    fallbackLng: 'fr',
    defaultNS: 'custom',
    resources: {
      fr: { zod: defaultFr, custom: customFr },
    },
  })

  z.setErrorMap(zodI18nMap)

  return {
    z,
  }
}
