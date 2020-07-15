import React from 'react'
import styles from 'pages/binnacle/CalendarDesktop/CalendarGrid.module.css'
import { FocusOn } from 'react-focus-on'
import { VisuallyHidden } from 'common/components'
import { useTranslation } from 'react-i18next'

interface Props {
  isSelected: boolean
  onEscKey: () => void
}

const CalendarCellBody: React.FC<Props> = ({ children, isSelected, onEscKey }) => {
  // announce and trap the focus and focus new activity button
  // on escape key focus the cell header and announce
  // cell body content should not be in the tab order if the cell is not selected

  const { t } = useTranslation()

  return (
    <div className={styles.cellBody}>
      <FocusOn
        enabled={isSelected}
        onEscapeKey={onEscKey}
        scrollLock={false}
        noIsolation={true}
      >
        <VisuallyHidden
          tag="button"
          tabIndex={isSelected ? 0 : -1}>
          {t('accessibility.new_activity')}
        </VisuallyHidden>
        {children}
      </FocusOn>
    </div>
  )
}

export default CalendarCellBody
