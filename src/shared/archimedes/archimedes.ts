import {
  Archimedes,
  CacheInvalidations,
  CacheLink,
  CacheManager,
  ExecutorLink,
  InvalidationPolicy,
  LoggerLink
} from '@archimedes/arch'
import { CreateVacationCmd } from 'features/binnacle/features/vacation/application/create-vacation-cmd'
import { DeleteVacationCmd } from 'features/binnacle/features/vacation/application/delete-vacation-cmd'
import { GetAllVacationsQry } from 'features/binnacle/features/vacation/application/get-all-vacations-qry'
import { GetDaysForVacationPeriodQry } from 'features/binnacle/features/vacation/application/get-days-for-vacation-period-qry'
import { GetVacationSummaryQry } from 'features/binnacle/features/vacation/application/get-vacation-summary-qry'
import { UpdateVacationCmd } from 'features/binnacle/features/vacation/application/update-vacation-cmd'
import { LogoutCmd } from 'features/user/application/logout-cmd'
import { GetUserSettingsQry } from 'features/user/features/settings/application/get-user-settings-qry'
import { SaveUserSettingsCmd } from 'features/user/features/settings/application/save-user-settings-cmd'

Archimedes.createChain([
  new CacheLink(new CacheManager()),
  new ExecutorLink(),
  new LoggerLink(console)
])

// User
CacheInvalidations.set(LogoutCmd.prototype.key, [InvalidationPolicy.ALL])
CacheInvalidations.set(SaveUserSettingsCmd.prototype.key, [GetUserSettingsQry.prototype.key])

// Vacation
CacheInvalidations.set(CreateVacationCmd.prototype.key, [
  GetAllVacationsQry.prototype.key,
  GetDaysForVacationPeriodQry.prototype.key,
  GetVacationSummaryQry.prototype.key
])
CacheInvalidations.set(DeleteVacationCmd.prototype.key, [
  GetAllVacationsQry.prototype.key,
  GetDaysForVacationPeriodQry.prototype.key,
  GetVacationSummaryQry.prototype.key
])
CacheInvalidations.set(UpdateVacationCmd.prototype.key, [
  GetAllVacationsQry.prototype.key,
  GetDaysForVacationPeriodQry.prototype.key,
  GetVacationSummaryQry.prototype.key
])
