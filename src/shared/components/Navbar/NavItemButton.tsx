import { Flex, useColorModeValue } from "@chakra-ui/react";
import type { FC } from "react";

interface Props {
  keyboardKey: string
  icon: JSX.Element
  onClick: () => void
}

export const NavItemButton: FC<Props> = (props) => {
  const color = useColorModeValue("#424242", "whiteAlpha.900");
  const hoverColor = useColorModeValue("brand.600", "white");

  return (
    <Flex
      as="button"
      accessKey={props.keyboardKey}
      align="center"
      textTransform="uppercase"
      color={color}
      h="full"
      _hover={{
        color: hoverColor
      }}
      cursor="pointer"
      py={[2, 0]}
      px={[6, 0]}
      onClick={props.onClick}
    >
      {props.icon}
      {props.children}
    </Flex>
  )
}
