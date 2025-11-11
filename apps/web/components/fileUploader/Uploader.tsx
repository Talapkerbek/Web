"use client"

import React, {useCallback, useEffect, useState} from 'react';
import {FileRejection, useDropzone} from "react-dropzone";
import {
    RenderEmptyState,
    RenderErrorState,
    RenderUploadingState,
    RenderUploadedState
} from "@/components/fileUploader/RenderState";
import {toast} from "sonner";
import {env} from "@/lib/env";
import {cn} from "@workspace/ui/lib/utils";
import {Card, CardContent} from "@workspace/ui/components/card";

interface IUploaderState {
    id: string | null;
    file: File | null;
    uploading: boolean;
    progress: number;
    key?: string;
    isDeleting: boolean;
    error: boolean;
    objectUrl?: string;
    fileType: "image" | "video"
}

interface IUploaderProps {
    value: string;
    onChange: (value: string) => void;
    fileTypeAccepted: "video" | "image"
}

const Uploader = ({value, onChange, fileTypeAccepted} : IUploaderProps) => {
    const [fileState, setFileState] = useState<IUploaderState>({
        error: false,
        file: null,
        id: null,
        uploading: false,
        progress: 0,
        isDeleting: false,
        objectUrl: value ? (env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL + "/" + value) : undefined,
        fileType: fileTypeAccepted,
        key: value
    });

    const uploadFile = useCallback(async(file: File) => {
        setFileState(prevState => ({...prevState, uploading: true, progress: 0}));

        try {
            const presignedResponse = await fetch("/api/s3/upload", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    fileName: file.name,
                    contentType: file.type,
                    size: file.size,
                    isImage: fileTypeAccepted === "image"
                })
            })

            if (!presignedResponse.ok) {
                toast.error("Failed to generate presigned URL")
                setFileState(prevState => ({...prevState, uploading: false, progress: 0, error: true}));
                return;
            }

            const {presignedUrl, key} = await presignedResponse.json();

            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest();

                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const progressPercentage = (event.loaded / event.total) * 100;
                        setFileState(prevState => ({...prevState, progress: Math.round(progressPercentage)}));
                    }
                }

                xhr.onload = () => {
                    if (xhr.status === 200 || xhr.status === 204) {
                        setFileState(prevState => ({...prevState, progress: 100, uploading: false, key}));

                        onChange?.(key)

                        toast.success("File uploaded successfully.");
                        resolve()
                    }
                    else {
                        reject(new Error("Upload failed."));
                    }
                }

                xhr.onerror = (event) => {
                    reject(new Error("Upload failed."));
                }

                xhr.open("PUT", presignedUrl);
                xhr.setRequestHeader("Content-Type", file.type);
                xhr.send(file)
            })




        } catch (e) {
            toast.success("Something went wrong while uploading.");
            setFileState(prevState => ({...prevState, progress: 0, uploading: false, error: true}));
        }
    }, [fileTypeAccepted, onChange])

    const onDrop = useCallback(async (acceptedFiles : File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0]

            if (!file) {
                toast.error("File not found")
                return;
            }

            if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")){
                URL.revokeObjectURL(fileState.objectUrl)
            }

            setFileState({
                file: file,
                uploading: false,
                progress: 0,
                objectUrl: URL.createObjectURL(file),
                error: false,
                // TODO
                id: "uuidv4()",
                isDeleting: false,
                fileType: fileTypeAccepted
            })

            await uploadFile(file)
        }
    }, [uploadFile, fileState.objectUrl, fileTypeAccepted])

    const handleRemoveFile = async () => {
        if (fileState.isDeleting || !fileState.objectUrl) return;

        try {
            setFileState(prevState => ({...prevState, isDeleting: true}));

            const res = await fetch("/api/s3/delete", {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    key: fileState.key
                })
            })

            if (!res.ok) {
                toast.error("Failed to delete file.");
                setFileState(prevState => ({...prevState, isDeleting: true, error: true}));

                return;
            }

            if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")){
                URL.revokeObjectURL(fileState.objectUrl)
            }

            onChange?.("")

            setFileState({
                error: false,
                file: null,
                id: null,
                uploading: false,
                progress: 0,
                isDeleting: false,
                fileType: fileTypeAccepted
            });

            toast.success("File removed successfully")
        }
        catch (e) {
            toast.error("Error during removing file. Please try again.");
            setFileState(prevState => ({...prevState, isDeleting: false, error: true}));
        }
    }

    useEffect(() => {
        return () => {
            if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")){
                URL.revokeObjectURL(fileState.objectUrl)
            }
        }
    }, [fileState.objectUrl]);

    function rejectedFiles(fileRejection: FileRejection[]) {
        if (fileRejection.length) {
            const tooManyFiles = fileRejection
                .find((rejection) => rejection.errors[0]?.code === 'too-many-files')

            const tooLarge = fileRejection
                .find((rejection) => rejection.errors[0]?.code === "file-too-large")

            if (tooManyFiles) {
                toast.error("Too many files selected, maximum is 1.")
            }

            if (tooLarge) {
                toast.error("File Size too large, maximum is 5 M.")
            }
        }
    }

    const renderContent = () => {
        if (fileState.uploading) {
            return <RenderUploadingState file={fileState.file!} progress={fileState.progress} />
        }

        if (fileState.error) {
            return <RenderErrorState/>
        }

        if (fileState.objectUrl) {
           return <RenderUploadedState fileType={fileTypeAccepted} previewUrl={fileState.objectUrl} isDeleting={fileState.isDeleting} handleRemoveFile={handleRemoveFile} />
        }

        return <RenderEmptyState isDragActive={isDragActive}/>
    }

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept: fileTypeAccepted === "video" ? {'video/*': []} : {"image/*": []},
        maxFiles: 1,
        multiple: false,
        maxSize: 30 * 1024 * 1024,

        onDropRejected: rejectedFiles,
        disabled: fileState.uploading || !!fileState.objectUrl
    })

    return (
        <Card {...getRootProps()} className={cn(
            "relative border-2 border-dashed transition-colors duration-200 w-full h-64",
            isDragActive && "border-primary bg-primary/10 border-solid",
            !isDragActive && "border-border hover:border-primary",
        )}>
            <CardContent className={"flex items-center justify-center h-full w-full p-4"}>
                <input {...getInputProps()} />
                {renderContent()}
            </CardContent>
        </Card>
    );
};

export default Uploader;