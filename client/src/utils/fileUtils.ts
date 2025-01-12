export const getFileType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'svg':
        return 'image'
      case 'doc':
      case 'docx':
        return 'word'
      case 'xls':
      case 'xlsx':
        return 'excel'
      case 'pdf':
        return 'pdf'
      case 'ppt':
      case 'pptx':
        return 'powerpoint'
      case 'txt':
        return 'text'
      // 必要に応じて他のファイルタイプを追加
      default:
        return 'other'
    }
  }