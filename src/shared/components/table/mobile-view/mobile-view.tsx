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

  const quantityTopColumns = columns.filter((c) => c.showInMobile).length

  const columnHeadings = (columns: ColumnsProps[]) => {
    return columns
      .filter((c) => c.showInMobile)
      .map(({ title, key }) => {
        return (
          <Text
            key={'heading' + key}
            w={`${100 / quantityTopColumns}%`}
            fontSize="sm"
            fontWeight="bold"
            textTransform="uppercase"
            textAlign="center"
            p={2}
          >
            {t(title)}
          </Text>
        )
      })
  }

  const accordionButtonData = (columns: ColumnsProps[], item: Item) => {
    return columns
      .filter((c) => c.showInMobile)
      .map(({ key, dataIndex, render }) => {
        return render ? (
          render(item[dataIndex], key)
        ) : (
          <Text
            as="span"
            key={'button' + key}
            w={`${100 / quantityTopColumns}%`}
            p={2}
            fontSize="sm"
          >
            {item[dataIndex]}
          </Text>
        )
      })
  }

  const accordionPanelData = (columns: ColumnsProps[], item: Item) => {
    return columns
      .filter((c) => !c.showInMobile)
      .map(({ title, key, dataIndex, render }) => {
        return render ? (
          render(item[dataIndex], key)
        ) : (
          <Box key={'box' + key} paddingTop={1} paddingBottom={1}>
            <Text key={'title' + key} fontSize="sm" fontWeight="bold" textTransform="uppercase">
              {`${t(title)}`}
            </Text>
            <Text key={'value' + key}>{item[dataIndex]}</Text>
          </Box>
        )
      })
  }

  return (
    <Box>
      <Flex textAlign="left" align="center" h={35} w={'calc(100% - 20px)'}>
        {columnHeadings(columns)}
      </Flex>
      {dataSource.length === 0 && <p data-testid="empty-mobile-view">{t(emptyTableKey)}</p>}
      <Accordion allowToggle allowMultiple>
        {dataSource.map((item, index) => {
          return (
            <AccordionItem key={'accordionItem' + index}>
              <AccordionButton key={'accordionButton' + index} px={0}>
                {accordionButtonData(columns, item)}
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel key={'accordionPanel' + index} px={0}>
                {accordionPanelData(columns, item)}
              </AccordionPanel>
            </AccordionItem>
          )
        })}
      </Accordion>
    </Box>
  )
}

export default MobileView
