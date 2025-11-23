import  {useCallback, useState} from 'react'
import {  type FileWithPath, useDropzone} from 'react-dropzone'

import { Button } from '../button'


type FileUploaderProps = {
    fieldChange: (FILES: File[])=> void
    mediaUrl: string

}
const FileUploader = ({fieldChange,mediaUrl}: FileUploaderProps) => {
    const [file, setfile] = useState<File[]>([]) //use for drop or pick Keep track of the currently selected files
    const [fileUrl, setfileUrl] = useState(mediaUrl) //for image already when we edit


     const onDrop = useCallback((acceptedFiles: FileWithPath[])=> {
        setfile(acceptedFiles)
        fieldChange(acceptedFiles)
        setfileUrl(URL.createObjectURL(acceptedFiles[0]))
  }, [file])


  const {getRootProps, getInputProps} = useDropzone({
    onDrop,
    accept: {
        'image/*': ['.png', '.jpeg', '.jpg', '.svg']
    }
})
  return (
  <div {...getRootProps()} className='flex items-center flex-col bg-[#212121] rounded-xl cursor-pointer'>
      <input {...getInputProps()} className='cursor-pointer' />
      {
        fileUrl ?
        (
            <>
            <div className='flex flex-1 justify-center w-full p-5 lg:p-10'>
                <img  src={fileUrl}
                alt='image'
                className='file_uploader-img'/>
            </div>
                <p className='file_uploader-label '>Click or drag photo to replace</p>
            </>

        )
         : (
            <div className='file_uploader-box '>
                <img  src='/assets/icons/file-upload.svg'
                width={96}
                height={96}
                alt='file-upload'
                />
                <h3 className='base-semibold text-white mt-2 mb-2'>Drag photo here</h3>
                <p className='text-gray-500'>SVG, PNG, JPG</p>
                <Button className='px-1 mt-1 py-1 cursor-pointer text-white bg-gray-500 rounded-xl text-xs '>
                  Select from Computer
                </Button>
                
        
        </div>
         )
         
      }
    </div>  
    )
}

export default FileUploader