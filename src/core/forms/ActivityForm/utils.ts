import {addMinutes, format} from "date-fns"
import {IActivity} from "api/interfaces/IActivity"
import {IRecentRole} from "api/interfaces/IRecentRole"
import {ActivityFormValues} from "core/forms/ActivityForm/ActivityForm"

export const openImageInTab = (data: any) => {
  const newImage = new Image();
  newImage.src = "data:image/jpeg;base64," + data;
  // newImage.setAttribute("style", "-webkit-user-select: none;margin: auto;cursor: zoom-in;")

  const newWin = window.open("");
  if (newWin) {
    // newWin.document.write('<head><title>your title</title></head>')
    newWin.document.write(newImage.outerHTML);
    newWin.document.close();
  }
};

export const getInitialValues = (
  activity?: IActivity,
  roleFound?: IRecentRole,
  period?: {
    startTime: string,
    endTime: string
  }
): ActivityFormValues => {
  if (activity) {
    return {
      startTime: format(activity.startDate, "HH:mm"),
      endTime: format(
        addMinutes(activity.startDate, activity.duration),
        "HH:mm"
      ),
      organization: activity.organization,
      project: activity.project,
      role: activity.projectRole,
      billable: activity.billable,
      description: activity.description
    };
  }

  return {
    startTime: period!.startTime,
    endTime: period!.endTime,
    organization: roleFound ? (({ foo: true } as unknown) as any) : undefined,
    project: roleFound ? (({ foo: true } as unknown) as any) : undefined,
    role: roleFound
      ? {
        id: roleFound!.id,
        name: roleFound!.name
      }
      : undefined,
    billable: roleFound?.projectBillable ?? false,
    description: ""
  };
};
