import type { FC } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import styles from 'shared/components/Navbar/SkipNavLink.module.css'

interface ISkipNavLink extends Omit<React.HTMLAttributes<HTMLAnchorElement>, 'href'> {
  contentId: string
}

export const SkipNavLink: FC<ISkipNavLink> = ({ contentId, ...props }) => {
  const { t } = useTranslation()

  return (
    <a {...props} className={styles.skip} href={`#${contentId}`}>
      {t('accessibility.skip_to_content')}
    </a>
  )
}

interface ISkipNavContent extends Omit<React.HTMLAttributes<HTMLDivElement>, 'id'> {
  id: string
}
export const SkipNavContent: FC<ISkipNavContent> = ({ id, ...props }) => {
  return <section {...props} id={id} />
}
