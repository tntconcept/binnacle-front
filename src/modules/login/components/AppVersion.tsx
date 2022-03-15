import { Text } from '@chakra-ui/react'
import appVersion from '../../../../package.json'
import { useGlobalState } from '../../../shared/arch/hooks/use-global-state'
import { AppState } from '../../../shared/data-access/state/app-state'
import { useActionOnMount } from '../../../shared/arch/hooks/use-action-on-mount'
import { GetApiVersionAction } from '../data-access/actions/get-api-version-action'

export const AppVersion = () => {
  const { apiVersion } = useGlobalState(AppState)
  const isLoading = useActionOnMount(GetApiVersionAction)

  return (
    <Text p={2} alignSelf="flex-end">
      app: v{appVersion.version} {isLoading ? `| api:  v${apiVersion}` : null}
    </Text>
  )
}
