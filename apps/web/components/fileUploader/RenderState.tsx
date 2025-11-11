import React from 'react';
import {CloudUploadIcon, ImageIcon, Loader2Icon, XIcon} from "lucide-react";
import Image from "next/image";
import {Button} from "@workspace/ui/components/button";
import {cn} from "@workspace/ui/lib/utils";

const RenderEmptyState = ({isDragActive} : {isDragActive: boolean}) => {
    return (
        <div className={"text-center space-y-3"}>
            <div className={"flex items-center mx-auto justify-center size-12 rounded-full bg-muted mb-4"}>
                <CloudUploadIcon className={cn(
                    "size-6 text-muted-foreground",
                    isDragActive && "text-primary"
                )} />
            </div>
            <p className={"text-base font-semibold text-foreground"}>Drop your files here or <span className={"font-bold text-primary cursor-pointer"}>click to upload</span></p>
            <Button
                type={"button"}
                className={""}
            >
                Select File
            </Button>
        </div>
    );
};


const RenderErrorState = () => {
    return (
        <div className={"text-center"}>
            <div className={"text-destructive flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/40 mb-4"}>
                <CloudUploadIcon className={cn(
                    "size-6 text-muted-foreground",
                )} />
            </div>
            <p className={"text-base font-semibold text-foreground"}>Upload failed</p>
            <p className={"text-xs mt-1 text-muted-foreground"}>Something went wrong</p>
            <Button
                type={"button"}
                className={""}>Retry file selection</Button>
        </div>
    );
};


const RenderUploadedState = ({previewUrl, isDeleting, handleRemoveFile, fileType}: {fileType: "image" | "video", previewUrl: string, isDeleting: boolean, handleRemoveFile: () => Promise<void>}) => {
    return (
        <div className={"text-center relative group w-full h-full flex items-center justify-center"}>
            {fileType == "video" && (
                <video src={previewUrl} controls className={"rouned-md w-full h-full"} />
            )}

            {fileType == "image" && (
                <Image src={previewUrl} alt={"Upload file"} fill className={"object-contain p-2"} unoptimized />
            )}

            <Button
                type={"button"}
                variant={"destructive"}
                className={cn("absolute top-4 right-4")}
                size={"icon"}
                onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile()
                }}
                disabled={isDeleting}
            >

                {isDeleting && (
                    <Loader2Icon className={"size-4 animate-spin"}/>
                )}

                {!isDeleting && (
                    <XIcon />
                )}

            </Button>

        </div>
    );
};

const RenderUploadingState = ({progress, file}: {progress: number, file: File}) => {
    return (
        <div className={"text-center flex justify-center items-center flex-col"}>
            <p>{progress}</p>

            <p className={"mt-2 text-sm font-medium text-foreground"}>Uploading...</p>
            <p className={"mt-1 text-xs text-muted-foreground truncate max-w-xs"}>{file.name}</p>
            <Button
                type={"button"}
                variant={"destructive"}
                className={cn("absolute top-4 right-4")}
                size={"icon"}
            >
                <XIcon />
            </Button>

        </div>
    );
};



export {RenderErrorState, RenderEmptyState, RenderUploadedState, RenderUploadingState};