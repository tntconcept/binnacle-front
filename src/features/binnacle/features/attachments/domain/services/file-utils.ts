import { RemoteFile } from '../remote-file'

export const isFileType = (file: File | RemoteFile): file is File => {
  return file instanceof File
}
