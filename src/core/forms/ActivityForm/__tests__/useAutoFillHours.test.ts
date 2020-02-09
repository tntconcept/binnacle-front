import {renderHook} from "@testing-library/react-hooks"
import {useAutoFillHours} from "core/forms/ActivityForm/useAutoFillHours"

describe('useAutoFillHours', () => {
  it('should return 09:00 - 13:00 if lastEndTime is undefined', function () {
    const { result } = renderHook(() => useAutoFillHours(undefined))

    expect(result.current).toEqual({
      startTime: "09:00",
      endTime: "13:00"
    })
  })

  it('should return 14:00 - 18:00 if the lastEndTime is 13:00', function () {
    const { result } = renderHook(() => useAutoFillHours("13:00"))

    expect(result.current).toEqual({
      startTime: "14:00",
      endTime: "18:00"
    })
  })

  it('should return 20:00 - 21:00 if the lastEndTime is greater than 18:00', function () {
    const { result } = renderHook(() => useAutoFillHours("20:00"))

    expect(result.current).toEqual({
      startTime: "20:00",
      endTime: "21:00"
    })
  })

  it('should return 11:00 - 13:00 if the lastEndTime was before 13:00', function () {
    const { result } = renderHook(() => useAutoFillHours("11:00"))

    expect(result.current).toEqual({
      startTime: "11:00",
      endTime: "13:00"
    })
  })

  it('should return 15:00 - 18:00 if the lastEndTime is 15:00', function () {
    const { result } = renderHook(() => useAutoFillHours("15:00"))

    expect(result.current).toEqual({
      startTime: "15:00",
      endTime: "18:00"
    })
  })

  it('should return 14:00 - 18:00 if the lastEndTime is between 13:00 - 14:00', function () {
    const { result } = renderHook(() => useAutoFillHours("13:45"))

    expect(result.current).toEqual({
      startTime: "14:00",
      endTime: "18:00"
    })
  })

})