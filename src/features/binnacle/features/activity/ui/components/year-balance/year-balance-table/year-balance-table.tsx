import { YearBalance } from '../../../../domain/year-balance'
import { LazyYearBalanceTableDesktop } from './year-balance-table-desktop/year-balance-table.desktop.lazy'
import { LazyYearBalanceTableMobile } from './year-balance-table-mobile/year-balance-table.mobile.lazy'
import { FC } from 'react'
import { useIsMobile } from '../../../../../../../../shared/hooks/use-is-mobile'

export const YearBalanceTable: FC<{ yearBalance: YearBalance }> = ({ yearBalance }) => {
  const isMobile = useIsMobile()

  return isMobile ? (
    <LazyYearBalanceTableMobile yearBalance={yearBalance} />
  ) : (
    <LazyYearBalanceTableDesktop yearBalance={yearBalance} />
  )
}
