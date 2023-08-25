import { FC } from 'react'
import { usePopperTooltip } from 'react-popper-tooltip'
import { Box, Portal, Text, useColorModeValue } from '@chakra-ui/react'

interface Props {
  text: string | undefined
  tooltipContent: string | undefined
}

export const TextWithTooltip: FC<Props> = (props) => {
  const { visible, setTooltipRef, getTooltipProps, setTriggerRef, getArrowProps } =
    usePopperTooltip({
      trigger: 'hover',
      delayShow: 300
    })

  const bg = useColorModeValue('white', 'gray.800')

  return (
    <>
      <Text as={'span'} aria-describedby="approval_date_tooltip" ref={setTriggerRef}>
        {props.text}
      </Text>

      {props.tooltipContent !== undefined && visible && (
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
              <Text as={'span'}>{props.tooltipContent}</Text>
            </Box>
          </Box>
        </Portal>
      )}
    </>
  )
}
