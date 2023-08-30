const supportedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
const supportedImagesSet = new Set(supportedImageTypes)

export const openFilePreview = (file: File) => {
  if (!supportedImagesSet.has(file.type)) {
    window.open(URL.createObjectURL(file), '_blank')
    return
  }

  const image = new Image()
  image.src = URL.createObjectURL(file)
  const newWindow = window.open('', '_blank')

  if (newWindow !== null) {
    newWindow.document.write(image.outerHTML)
  }
}
