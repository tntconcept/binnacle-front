import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";
import { Box, Heading, StackDivider, Text, VStack } from "@chakra-ui/react";

interface Props {
  children: ReactNode
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
        <Box maxW={600} mx="auto" color="gray.800">
          <Text fontSize="4xl" fontWeight="bold" color="brand.600">
            😱
          </Text>
          <VStack spacing={6} align="left">
            <Heading as="h1">Oops! Something went wrong.</Heading>
            <Box>
              <Text>This could be a cache issue, please clean up your cache and try again.</Text>
              <Text>If the problem persists, contact us.</Text>
            </Box>
            <details>
              <summary>Error details</summary>
              <VStack divider={<StackDivider borderColor="gray.200" />} spacing={2} align="left">
                <Text>{this.state.error && this.state.error.toString()}</Text>
                <Text whiteSpace="pre">{this.state.errorInfo?.componentStack}</Text>
              </VStack>
            </details>
          </VStack>
        </Box>
      )
    }

    return this.props.children
  }
}
