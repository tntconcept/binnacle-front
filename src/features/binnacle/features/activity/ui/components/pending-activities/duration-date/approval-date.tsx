import { FC } from 'react'
import { usePopperTooltip } from 'react-popper-tooltip'
import { Box, Portal, Text, useColorModeValue } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

export const ApprovalDate: FC<{
  approvalDate: string | undefined
  authoredBy: string | undefined
}> = (props) => {
  const { t } = useTranslation()

  const { visible, setTooltipRef, getTooltipProps, setTriggerRef, getArrowProps } =
    usePopperTooltip({
      trigger: 'hover',
      delayShow: 300
    })

  const bg = useColorModeValue('white', 'gray.800')

  return (
    <>
      <span aria-describedby="approval_date_tooltip" ref={setTriggerRef}>
        {props.approvalDate}
      </span>
      {props.authoredBy !== undefined && visible && (
        <Portal>
          <Box
            role="tooltip"
            data-testid="approval_date_tooltip"
            ref={setTooltipRef}
            {...getTooltipProps({ className: 'tooltip-container' })}
          >
            <Box
              _after={{
                borderColor: bg
              }}
              {...getArrowProps({ className: 'tooltip-arrow' })}
            />
            <Box maxWidth="600px" bg={bg}>
              <Text as={'span'}>
                {t('activity_pending.approved_by')} {props.authoredBy}
              </Text>
            </Box>
          </Box>
        </Portal>
      )}
    </>
  )
}
