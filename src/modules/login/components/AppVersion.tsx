import { Text } from '@chakra-ui/react'
import appVersion from '../../../../package.json'

export const AppVersion = () => {
  return (
    <Text p={2} alignSelf="flex-end">
      v{appVersion.version}
    </Text>
  )
}
