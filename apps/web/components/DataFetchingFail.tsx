import React from 'react';
import {Card, CardContent} from "@workspace/ui/components/card";
import {Button} from "@workspace/ui/components/button";
import {cn} from "@workspace/ui/lib/utils";

const DataFetchingFail = ({refetch, className, message} : {message?: string; refetch: () => void, className?: string}) => {
    return (
        <Card className={className}>
            <CardContent className={cn("flex items-center gap-4 justify-between")}>
                <p>
                    {message ? message : "Failed to fetch data"}
                </p>
                <Button variant={"outline"} className={"mr-2"} onClick={refetch}>
                    Try again
                </Button>
            </CardContent>
        </Card>
    );
};

export default DataFetchingFail;