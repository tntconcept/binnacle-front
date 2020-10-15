import React from 'react'
import { FocusOn } from 'react-focus-on'
import { useTranslation } from 'react-i18next'
import { Box } from '@chakra-ui/core'
import ButtonVisuallyHidden from 'core/components/ButtonVisuallyHidden'

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
    <Box maxHeight="calc(100% - 24px)" overflowY="scroll">
      <FocusOn enabled={isSelected} onEscapeKey={onEscKey} scrollLock={false} noIsolation={true}>
        <ButtonVisuallyHidden tabIndex={isSelected ? 0 : -1}>
          {t('accessibility.new_activity')}
        </ButtonVisuallyHidden>
        {children}
      </FocusOn>
    </Box>
  )
}

export default CalendarCellBody
