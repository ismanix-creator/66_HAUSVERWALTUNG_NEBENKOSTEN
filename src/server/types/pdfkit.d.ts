declare module 'pdfkit' {
  interface PDFKitFontOptions {
    underline?: boolean
    align?: 'left' | 'center' | 'right' | 'justify'
    paragraphGap?: number
  }

  interface PDFDocumentCtorOptions {
    size?: 'A4' | 'A5' | string
    margin?: number
  }

  class PDFDocument {
    constructor(options?: PDFDocumentCtorOptions)
    fontSize(size: number): this
    text(content: string, options?: PDFKitFontOptions): this
    moveDown(step?: number): this
    pipe(destination: NodeJS.WritableStream): this
    end(): this
  }

  export default PDFDocument
}
