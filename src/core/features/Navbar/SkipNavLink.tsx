import React from 'react'
import { useTranslation } from 'react-i18next'
import styles from 'core/features/Navbar/SkipNavLink.module.css'

interface ISkipNavLink
  extends Omit<React.HTMLAttributes<HTMLAnchorElement>, 'href'> {
  contentId: string
}
const SkipNavLink: React.FC<ISkipNavLink> = ({ children, contentId, ...props }) => {
  const { t } = useTranslation()

  return (
    <a
      {...props}
      className={styles.skip}
      href={`#${contentId}`}>
      {t('accessibility.skip_to_content')}
    </a>
  )
}

export default SkipNavLink

interface ISkipNavContent extends Omit<React.HTMLAttributes<HTMLDivElement>, 'id'> {
  id: string
}
export const SkipNavContent: React.FC<ISkipNavContent> = ({ id, ...props }) => {
  return <main
    {...props}
    id={id} />
}
