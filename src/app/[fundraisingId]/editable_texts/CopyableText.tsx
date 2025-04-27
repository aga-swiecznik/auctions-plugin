'use client';

import { Button, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { TextType } from "~/models/Text";

export const CopyableText = ({ text, onEdit, onRemove, type }: { text: string, type: TextType, onEdit: () => void, onRemove: () => void }) => {
  const [collapsed, setCollapsed] = useState(true);

  return <Paper sx={{ p: 2, mb: 2 }}>
    <Stack direction="row" justifyContent="space-between" spacing={2} mb={2}>
      {type}
      <div>
        <Button autoFocus color="primary" variant="contained" onClick={() => navigator.clipboard.writeText(text)} sx={{ mr: 1 }}>
          Kopiuj tekst
        </Button>
        <Button autoFocus color="primary" variant="contained" onClick={onEdit} sx={{ mr: 1 }}>
          Edytuj tekst
        </Button>
        <Button color="error" variant="outlined" onClick={onRemove}>
          Usuń
        </Button>
      </div>
    </Stack>
    <Typography sx={{ height: collapsed ? '3em' : 'auto', overflow: 'hidden' }} onClick={() => setCollapsed(!collapsed)}>{text}</Typography>
</Paper>
}