import { forwardRef } from 'react'
import { ListItem, useColorModeValue } from '@chakra-ui/react'

export const ComboboxItem = forwardRef<any, any>(({ isActive, ...props }, ref) => {
  const optionColor = useColorModeValue('black', 'whiteAlpha.900')
  const optionHoverBgColor = useColorModeValue('brand.500', 'darkBrand.600')

  return (
    <ListItem
      color={isActive ? 'white' : optionColor}
      bgColor={isActive ? optionHoverBgColor : 'transparent'}
      cursor="pointer"
      padding="0.5em"
      margin="0 -0.5em"
      borderRadius="4px"
      _first={{
        mt: '-0.5em'
      }}
      _last={{
        mb: '-0.5em'
      }}
      _hover={{
        bgColor: optionHoverBgColor,
        color: 'white'
      }}
      {...props}
      ref={ref}
    />
  )
})

ComboboxItem.displayName = 'ComboboxItem'
