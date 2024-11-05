import {
  React, useEffect, useState, useCallback,
} from "./Import";
import { useDropzone } from 'react-dropzone';
import JSZip from 'jszip';
import imageCompression from 'browser-image-compression';
import "../css/scroll.css";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FaFilePdf, FaFileExcel, FaFileImage, FaFileWord, FaFileAlt } from 'react-icons/fa';
import { PiFilePptFill } from 'react-icons/pi';

interface UploadedFile {
  fileName: string;
  filePath: string;
  fileSize: number;
  saveFileName: string;
  mgNo: string;
}

interface FileUploadProps {
  value?: File[];
  uploadedFiles?: UploadedFile[];
  multiple?: boolean;
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  onUploadSuccess?: (response: Response) => void;
  onUploadError?: (error: any) => void;
  title?: string;
  readOnly?: boolean;
  errorMsg?: string;
  layout?: "horizontal" | "flex";
  minWidth?: string;
  textAlign?: "left" | "right";
  onFilesChange?: (files: File[], uploadedFiles?: UploadedFile[], deletedFiles?: UploadedFile[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  value = [],
  uploadedFiles = [],
  multiple = false,
  maxSizeMB = 1,
  maxWidthOrHeight = 800,
  title = "파일 설명",
  layout = "horizontal",
  minWidth = "100px",
  textAlign = "right",
  onFilesChange,
}) => {
  const [compressedFiles, setCompressedFiles] = useState<File[]>(value);
  const [uploadedFilesState, setUploadedFilesState] = useState<UploadedFile[]>(uploadedFiles);
  const [deletedFiles, setDeletedFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    setCompressedFiles(value);
  }, [value]);

  useEffect(() => {
    setUploadedFilesState(uploadedFiles);
  }, [uploadedFiles]);

  const compressImage = async (file: File): Promise<File> => {
    if (!file.type.startsWith('image/')) {
      return file;
    }

    const options = {
      maxSizeMB,
      maxWidthOrHeight,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);

      //const extension = file.name.split('.').pop();
      const compressedFileWithExtension = new File(
        [compressedFile],
      //  `${compressedFile.name}.${extension}`,
        file.name,
        { type: compressedFile.type }
      );

      return compressedFileWithExtension;
    } catch (error) {
      throw error;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const processedFilesArray = await Promise.all(
        acceptedFiles.map((file) => compressImage(file))
      );
      const newFiles = [...compressedFiles, ...processedFilesArray];
      setCompressedFiles(newFiles);
      onFilesChange && onFilesChange(newFiles, uploadedFilesState, deletedFiles); // 부모에게 파일 리스트 전달
    } catch (error) {
      console.error(error);
    }
  }, [compressedFiles, onFilesChange, uploadedFilesState, deletedFiles]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple,
    noClick: true,
  });

  const handleDownloadFile = async (mgNo: string, fileUrl: string, fileName: string, saveFileName: string) => {
    try {
      const param = { mgNo: mgNo };
      const data = JSON.stringify(param);
      const baseURL = process.env.REACT_APP_API_URL;
       
  
      const response = await fetch(`${baseURL}/ZZ_FILE`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("파일 다운로드 오류:", error);
    }
  };

    // 전체 다운로드 기능 (Zip)
    const handleDownloadAll = async () => {
      const zip = new JSZip();
      const folder = zip.folder("files");
  
      for (const file of uploadedFilesState) {
        const param = { mgNo: file.mgNo };
        const data = JSON.stringify(param);
        const baseURL = process.env.REACT_APP_API_URL;
       
  
        const response = await fetch(`${baseURL}/ZZ_FILE`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: data,
        });
  
        const blob = await response.blob();
        folder?.file(file.fileName, blob);
      }
  
      zip.generateAsync({ type: 'blob' }).then((content) => {
        const url = window.URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = "files.zip";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      });
    };

    const handleDelete = (index: number) => {
      const newFiles = compressedFiles.filter((_, i) => i !== index);
      setCompressedFiles(newFiles);
      onFilesChange && onFilesChange(newFiles, uploadedFilesState, deletedFiles); // 변경된 파일 리스트 부모에게 전달
    };
  


  const handleDeleteUploaded = (index: number) => {
    const newUploadedFiles = uploadedFilesState.filter((_, i) => i !== index);
    const removedFile = uploadedFilesState[index];
    const removedFileWithStatus = { ...removedFile, status: 'D' };

    setUploadedFilesState(newUploadedFiles);
    setDeletedFiles([...deletedFiles, removedFileWithStatus]); // 삭제된 파일을 저장
    onFilesChange && onFilesChange(compressedFiles, newUploadedFiles, [...deletedFiles, removedFileWithStatus]); // 부모에게 전달
  };

  return (
    <div>
      <div className={` ${layout === "horizontal" ? "grid grid-cols-3 gap-3 items-center" : ""} 
                        ${layout === "flex" ? "flex  space-x-2" : ""}`}>
        <label
          className={`py-2 ${layout === "horizontal" ? "col-span-1 text-right" : ""}
                            ${layout === "flex" ? "w-auto" : ""}`}
          style={{
            ...(minWidth ? { minWidth: minWidth } : {}),
            ...(textAlign ? { textAlign: textAlign } : {}),
          }}
        >
          {title}
        </label>

        <div className={`space-y-1 ${layout === "horizontal" ? "col-span-2" : "flex-grow"}`}>
          <button onClick={open} className="p-2  text-black rounded-md border">
            파일 업로드
          </button>

          <div {...getRootProps()} className='border rounded-md p-3'>
            <input {...getInputProps()} />
            {compressedFiles.length === 0 && (
              <div>
                {isDragActive ? (
                  <p>여기에 놓아주세요.</p>
                ) : (
                  <p>파일을 마우스로 끌어 오세요.</p>
                )}
              </div>
            )}

            {compressedFiles.length > 0 && (
              <div className='max-h-[50px] overflow-y-auto work-scroll'>
                <ul className=" ">
                  {compressedFiles.map((file, index) => (
                    <li key={index} className="flex items-center justify-between py-1 border-b">
                      <div className="flex items-center space-x-2 ">
                      <XMarkIcon onClick={() => handleDelete(index)} className="w-5 h-5 text-zinc-500 cursor-pointer"></XMarkIcon>
                        <span className='text-sm'>{file.name}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className='text-sm'>{(file.size / 1024).toFixed(2)} KB</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {uploadedFilesState.length > 0 && (
            <div className='mt-4'>
               <div className="flex justify-between items-center py-1">
                <p>업로드된 파일 목록:</p>
                <button
                  onClick={handleDownloadAll}
                  className=" text-blue-500 px-3 py-1 rounded-md text-sm border"
                >
                  전체 다운로드
                </button>
              </div>
              <ul className='work-scroll'>
                {uploadedFilesState.map((file, index) => (
                  <li key={index} className="flex items-center justify-between py-1 border-b">
                    <div className="flex items-center space-x-2">
                      <XMarkIcon onClick={() => handleDeleteUploaded(index)} className="w-5 h-5 text-zinc-500 cursor-pointer"></XMarkIcon>
                      <button onClick={() => handleDownloadFile(file.mgNo, file.filePath, file.fileName, file.saveFileName)} className="text-sm underline">
                        {file.fileName}
                      </button>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className='text-sm'>{(file.fileSize / 1024).toFixed(2)} KB</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { FileUpload };
