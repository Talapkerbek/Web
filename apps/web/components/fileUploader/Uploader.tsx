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
import {createApi} from "@/lib/axios";
import {useSession} from "next-auth/react";

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
    const {data: session} = useSession()


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

    console.log(fileState.objectUrl)


    const uploadFile = useCallback(
        async (file: File) => {
            setFileState(prev => ({ ...prev, uploading: true, progress: 0 }));

            try {
                const api = createApi()
                const headers = {
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                    }
                }

                const presignedResponse = await api.post("/file/get-presigned-url", {
                    fileName: file.name,
                    contentType: file.type
                }, headers);

                const { presignedUrl, key } = presignedResponse.data;

                await api.put(presignedUrl, file, {
                    headers: {
                        "Content-Type": file.type,
                    },
                    onUploadProgress: (event) => {
                        if (event.total) {
                            const progress = Math.round((event.loaded / event.total) * 100);
                            setFileState(prev => ({ ...prev, progress }));
                        }
                    },
                });

                setFileState(prev => ({ ...prev, progress: 100, uploading: false, key }));
                onChange?.(key);
                toast.success("File uploaded successfully.");
            } catch (err) {
                console.error(err);
                toast.error("Something went wrong while uploading.");
                setFileState(prev => ({ ...prev, progress: 0, uploading: false, error: true }));
            }
        },
        [fileTypeAccepted, onChange]
    );

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
            onChange?.("")
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
            "relative border-2 border-dashed transition-colors duration-200 w-full h-64 cursor-pointer",
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