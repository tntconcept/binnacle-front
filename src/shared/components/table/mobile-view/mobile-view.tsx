import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Text
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { ColumnsProps, Item, MobileViewProps } from '../table.types'

const MobileView: React.FC<MobileViewProps> = ({ dataSource, columns, emptyTableKey }) => {
  const { t } = useTranslation()

  const columnHeadings = (columns: ColumnsProps[]) => {
    return columns
      .filter((c) => c.showInMobile)
      .map(({ title, key }) => {
        return (
          <Text key={key} w={100} fontSize="sm" fontWeight="bold" textTransform="uppercase">
            {t(title)}
          </Text>
        )
      })
  }

  const accordionButtonData = (columns: ColumnsProps[], item: Item) => {
    return columns
      .filter((c) => c.showInMobile)
      .map(({ key, dataIndex, render }) => {
        return render ? render(item[dataIndex], key) : item[dataIndex]
      })
  }

  const accordionPanelData = (columns: ColumnsProps[], item: Item) => {
    return columns
      .filter((c) => !c.showInMobile)
      .map(({ title, key, dataIndex, render }) => {
        return render ? (
          render(item[dataIndex], key)
        ) : (
          <Box key={key}>
            <Text
              as="span"
              key={key}
              w={100}
              fontSize="sm"
              fontWeight="bold"
              textTransform="uppercase"
            >
              {`${t(title)}: `}
            </Text>
            <Text as="span">{item[dataIndex]}</Text>
          </Box>
        )
      })
  }

  return (
    <Box>
      <Flex textAlign="left" align="center" h={35}>
        {columnHeadings(columns)}
      </Flex>
      {dataSource.length === 0 && <p data-testid="empty-mobile-view">{t(emptyTableKey)}</p>}
      <Accordion allowToggle allowMultiple>
        {dataSource.map((item, index) => {
          return (
            <AccordionItem key={index}>
              <AccordionButton px={0}>
                {accordionButtonData(columns, item)}
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel px={0}>{accordionPanelData(columns, item)}</AccordionPanel>
            </AccordionItem>
          )
        })}
      </Accordion>
    </Box>
  )
}

export default MobileView
