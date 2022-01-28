export const openImageInTab = (data: any) => {
  const newImage = new Image()
  newImage.src = 'data:image/jpeg;base64,' + data
  // newImage.setAttribute("style", "-webkit-user-select: none;margin: auto;cursor: zoom-in;")

  const newWin = window.open('')
  if (newWin) {
    // newWin.document.write('<head><title>your title</title></head>')
    newWin.document.write(newImage.outerHTML)
    newWin.document.close()
  }
}
