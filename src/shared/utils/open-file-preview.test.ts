import { openFilePreview } from './open-file-preview'

describe('OpenFilePreview', () => {
  it('should open file preview in new tab', () => {
    window.open = jest.fn()
    global.URL.createObjectURL = jest.fn()

    const file = new File(['(⌐□_□)'], 'test.pdf', {
      type: 'pdf'
    })

    openFilePreview(file)

    expect(window.open).toHaveBeenCalled()
  })

  it('should open image preview in new tab', () => {
    const newWindow = { document: { write: jest.fn() } }
    window.open = jest.fn().mockReturnValue(newWindow)
    global.URL.createObjectURL = jest.fn()
    const file = new File(['(⌐□_□)'], 'test.jpg', {
      type: 'image/jpg'
    })

    openFilePreview(file)

    expect(window.open).toHaveBeenCalled()
    expect(newWindow.document.write).toHaveBeenCalled()
  })
})
