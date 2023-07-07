import type { FC, HTMLAttributes } from 'react'
import { useTranslation } from 'react-i18next'
import styles from 'shared/components/navbar/skip-nav-link.module.css'

interface Props extends Omit<HTMLAttributes<HTMLAnchorElement>, 'href'> {
  contentId: string
}

export const SkipNavLink: FC<Props> = ({ contentId, ...props }) => {
  const { t } = useTranslation()

  return (
    <a {...props} className={styles.skip} href={`#${contentId}`}>
      {t('accessibility.skip_to_content')}
    </a>
  )
}
