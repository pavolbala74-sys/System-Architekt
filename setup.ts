import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { locales, type Locale } from '../../i18n'
import '../styles/globals.css'

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: undefined })

  return {
    title: 'Pavol Balazik — Systems Architect',
    description: 'Engineering systems architect exploring energy efficiency, friction reduction and flow optimization.',
    keywords: [
      'systems architect', 'energy efficiency', 'friction optimization',
      'hydrodynamics', 'aerodynamics', 'mechanical engineering', 'flow optimization',
    ],
    authors: [{ name: 'Pavol Balazik' }],
    openGraph: {
      title: 'Pavol Balazik — Systems Architect',
      description: 'Engineering systems architect exploring energy efficiency, friction reduction and flow optimization.',
      type: 'website',
    },
    alternates: {
      languages: { en: '/en', sk: '/sk', de: '/de' },
    },
  }
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!locales.includes(locale as Locale)) notFound()

  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <div className="noise-overlay" aria-hidden="true" />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
