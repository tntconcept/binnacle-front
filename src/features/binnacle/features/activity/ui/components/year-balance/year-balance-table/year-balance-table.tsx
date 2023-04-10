import { YearBalance } from 'features/binnacle/features/activity/domain/year-balance'
import { useIsMobile } from 'shared/hooks'
import { LazyYearBalanceTableDesktop } from './year-balance-table-desktop/year-balance-table.desktop.lazy'
import { LazyYearBalanceTableMobile } from './year-balance-table-mobile/year-balance-table.mobile.lazy'

export const YearBalanceTable: React.FC<{ yearBalance: YearBalance }> = ({ yearBalance }) => {
  const isMobile = useIsMobile()

  return isMobile ? (
    <LazyYearBalanceTableMobile yearBalance={yearBalance} />
  ) : (
    <LazyYearBalanceTableDesktop yearBalance={yearBalance} />
  )
}
