import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import type { FC } from "react";
import { Link, useMatch } from "react-router-dom";
import { useIsMobile } from "shared/hooks";

interface Props {
  to: string
  keyboardKey: string
  icon: JSX.Element
}

export const NavItemLink: FC<Props> = (props) => {
  const isActive = useMatch(props.to);
  const color = useColorModeValue("#424242", "whiteAlpha.900");
  const hoverColor = useColorModeValue('brand.600', 'gray.400')
  const bgColor = useColorModeValue(['gray.100', 'unset'], ['gray.600', 'unset'])
  const isMobile = useIsMobile()

  const showUnderline = isActive && !isMobile
  const underlineBgColor = useColorModeValue('brand.600', 'gray.400')

  return (
    <Flex
      as={Link}
      to={props.to}
      accessKey={props.keyboardKey}
      align="center"
      textTransform="uppercase"
      color={color}
      h="full"
      _hover={{
        color: hoverColor
      }}
      bgColor={isActive ? bgColor : undefined}
      py={[2, 0]}
      px={[6, 0]}
    >
      {showUnderline && (
        <Box
          height="2px"
          width="100%"
          bgColor={underlineBgColor}
          position="absolute"
          bottom="0"
          borderRadius="10px"
        />
      )}
      {props.icon}
      {props.children}
    </Flex>
  )
}
