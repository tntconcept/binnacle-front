import type { ErrorInfo, ReactNode } from 'react'
import { Component } from 'react'
import { Box, Heading, StackDivider, Text, VStack, Link } from '@chakra-ui/react'
import { TFunction } from 'i18next'
import { PageWithTitle } from './page-with-title/page-with-title'

interface Props {
  children: ReactNode
  t: TFunction<'translation'>
}

interface State {
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    error: null,
    errorInfo: null
  }

  public componentDidUpdate() {}

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })
  }

  public render() {
    if (this.state.error !== null) {
      return (
        <Box my={4}>
          <PageWithTitle title={this.props.t('global_error.title')}>
            <VStack spacing={2} align="left">
              <Heading as="h1"></Heading>
              <Box>
                <Text>{this.props.t('global_error.description_1')}</Text>
                <Text>{this.props.t('global_error.description_2')}</Text>
                <Text display={'inline'}>{this.props.t('global_error.cta_1')}</Text>
                <Link href="mailto:desktop.support@autentia.com">
                  {this.props.t('global_error.cta_2')}
                </Link>
              </Box>
              <details>
                <summary>{this.props.t('global_error.error_details')}</summary>
                <VStack divider={<StackDivider borderColor="gray.200" />} spacing={2} align="left">
                  <Text>{this.state.error && this.state.error.toString()}</Text>
                  <Text whiteSpace="pre">{this.state.errorInfo?.componentStack}</Text>
                </VStack>
              </details>
            </VStack>
          </PageWithTitle>
        </Box>
      )
    }

    return this.props.children
  }
}
