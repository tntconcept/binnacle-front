import { YearBalance } from 'modules/binnacle/data-access/interfaces/year-balance.interface'
import { useIsMobile } from 'shared/hooks'
import { LazyYearBalanceTableDesktop } from './YearBalanceTableDesktop/YearBalanceTable.desktop.lazy'
import { LazyYearBalanceTableMobile } from './YearBalanceTableMobile/YearBalanceTable.mobile.lazy'

export const YearBalanceTable: React.FC<{ yearBalance: YearBalance }> = ({ yearBalance }) => {
  const isMobile = useIsMobile()

  return isMobile ? (
    <LazyYearBalanceTableMobile yearBalance={yearBalance} />
  ) : (
    <LazyYearBalanceTableDesktop yearBalance={yearBalance} />
  )
}
