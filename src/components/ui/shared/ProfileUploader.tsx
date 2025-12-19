import  {useCallback, useState} from 'react'
import {useDropzone,type FileWithPath} from 'react-dropzone'

import { convertFileToUrl } from '@/lib/utils'
type profileProps = {
  fieldChange: (files:File | null)=> void
  mediaUrl?: string
}


export function ProfileUploader({fieldChange,mediaUrl}:profileProps) {


  // const [file, setfile] = useState<File[]>([])
  const [fileUrl, setfileUrl] = useState<string>( mediaUrl || "/assets/icons/profile-placeholder.svg")



  const onDrop = useCallback((acceptedFiles:FileWithPath[]) => {
    const file = acceptedFiles[0] ??  null
    if(!file) return
    fieldChange(file)
    setfileUrl(convertFileToUrl(file))
   
  }, [fieldChange])

    const {getRootProps, getInputProps} = useDropzone({
      onDrop,
      accept: {"image/*": [".png","jpeg","jpg"],}

    })
  return (
       <div {...getRootProps()}>
      <input {...getInputProps()} className='cursor-pointer' />
      <div className='cursor-pointer flex items-center gap-4'>
       <img
          src={fileUrl}
  className="h-20 w-20 rounded-full object-cover object-center border-2 border-gray-200 shadow-sm"          alt="profile"
        />
         <p className='md:base-semibold text-gray-400 '>Change profile photo</p>

      </div>

    </div>
  )
}


