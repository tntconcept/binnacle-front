import { UserSettings } from '../../../../../../../shared/user/features/settings/domain/user-settings'
import { chrono, timeToDate } from '../../../../../../../../shared/utils/chrono'

export class GetAutofillHours {
  constructor(
    private autoFillHours: boolean,
    private hoursInterval: UserSettings['hoursInterval'],
    private previousEndTime: Date | undefined = undefined
  ) {}

  getAutoFillHours() {
    if (this.autoFillHours) {
      return {
        startTime: this.getNextStartTime(),
        endTime: this.getNextEndTime()
      }
    }

    const date = GetAutofillHours.roundHourToQuarters(this.previousEndTime || chrono.now())
    return {
      startTime: chrono(date).format(chrono.TIME_FORMAT),
      endTime: chrono(date).plus(1, 'hour').format(chrono.TIME_FORMAT)
    }
  }

  static roundHourToQuarters(date: Date): Date {
    const roundMinutes = Math.round(chrono(date).get('minute') / 15) * 15
    return chrono(date).set(roundMinutes, 'minute').getDate()
  }

  private getNextStartTime(): string {
    const startWorkingTime = timeToDate(this.hoursInterval.startWorkingTime, this.previousEndTime)
    const startLunchBreak = timeToDate(this.hoursInterval.startLunchBreak, this.previousEndTime)
    const endLunchBreak = timeToDate(this.hoursInterval.endLunchBreak, this.previousEndTime)

    if (
      this.previousEndTime === undefined ||
      chrono(this.previousEndTime).isBefore(startWorkingTime)
    ) {
      return chrono(startWorkingTime).format(chrono.TIME_FORMAT)
    }

    if (chrono(startLunchBreak).isSame(this.previousEndTime, 'hour')) {
      return chrono(endLunchBreak).format(chrono.TIME_FORMAT)
    }

    if (chrono(this.previousEndTime).isBefore(endLunchBreak)) {
      return chrono(this.previousEndTime).format(chrono.TIME_FORMAT)
    }

    if (chrono(this.previousEndTime).isAfter(endLunchBreak)) {
      return chrono(this.previousEndTime).format(chrono.TIME_FORMAT)
    }

    return chrono(this.previousEndTime).format(chrono.TIME_FORMAT)
  }

  private getNextEndTime() {
    const startLunchBreak = timeToDate(this.hoursInterval.startLunchBreak, this.previousEndTime)
    const endWorkingTime = timeToDate(this.hoursInterval.endWorkingTime, this.previousEndTime)

    if (this.previousEndTime === undefined) {
      return chrono(startLunchBreak).format(chrono.TIME_FORMAT)
    }

    if (chrono(startLunchBreak).isSame(this.previousEndTime, 'hour')) {
      return chrono(endWorkingTime).format(chrono.TIME_FORMAT)
    }

    if (chrono(this.previousEndTime).isBefore(startLunchBreak)) {
      return chrono(startLunchBreak).format(chrono.TIME_FORMAT)
    }

    if (chrono(this.previousEndTime).isBefore(endWorkingTime)) {
      return chrono(endWorkingTime).format(chrono.TIME_FORMAT)
    }

    const isAfterOrSameHour =
      chrono(this.previousEndTime).isAfter(endWorkingTime) ||
      chrono(this.previousEndTime).isSame(endWorkingTime, 'hour')

    if (isAfterOrSameHour) {
      return chrono(this.previousEndTime).plus(1, 'hour').format(chrono.TIME_FORMAT)
    }
  }
}
