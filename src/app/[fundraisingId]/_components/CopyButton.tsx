import { FileCopy } from "@mui/icons-material";
import { Button } from "@mui/material";
import React, { ReactNode } from "react";

export const CopyButton = ({text}: {text: string | undefined,}) => <Button
        autoFocus
        variant="contained"
        sx={{ ml: 2, mb: 2 }}
        onClick={() => navigator.clipboard.writeText(text || '')}
    >
        <FileCopy />
    </Button>;