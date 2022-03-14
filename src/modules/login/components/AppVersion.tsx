import { Text } from '@chakra-ui/react'
import appVersion from '../../../../package.json'
import { useGlobalState } from '../../../shared/arch/hooks/use-global-state'
import { AppState } from '../../../shared/data-access/state/app-state'

export const AppVersion = () => {
  const { apiVersion } = useGlobalState(AppState)

  return (
    <>
      <Text p={2} alignSelf="flex-end">
        v{appVersion.version}
      </Text>

      {apiVersion ? (
        <Text p={2} alignSelf="flex-end">
          API: v{apiVersion}
        </Text>
      ) : null}
    </>
  )
}
