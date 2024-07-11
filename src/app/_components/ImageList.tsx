import { Stack } from "@mui/material";
import { api } from "~/trpc/react";
import { copyImageToClipboard } from 'copy-image-clipboard'

export const ImageList = () => {
    const { data: images, error } = api.images.list.useQuery({max: 6});

    const handleClick = async (image: string) => {
        copyImageToClipboard(image)
    }

    return <Stack direction="row" justifyContent="space-between">
        {images?.map(image => 
            <img key={image} src={image} style={{width: '50px'}} onClick={() => copyImageToClipboard(image)} />
        )}
    </Stack>;
}