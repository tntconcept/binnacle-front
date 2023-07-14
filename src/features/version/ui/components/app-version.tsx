import { Text } from '@chakra-ui/react'
import { GetApiVersionQry } from '../../application/get-api-version-qry'
import { useExecuteUseCaseOnMount } from '../../../../shared/arch/hooks/use-execute-use-case-on-mount'
import appVersion from '../../../../../package.json'

export const AppVersion = () => {
  const { result: apiVersion } = useExecuteUseCaseOnMount(GetApiVersionQry)

  return (
    <Text p={2} alignSelf="flex-end">
      app: v{appVersion.version} {apiVersion ? `| api: v${apiVersion}` : null}
    </Text>
  )
}
