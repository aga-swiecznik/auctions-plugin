'use client';

import { Button, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";

export const CopyableText = ({ text, title }: { text: string, title: string }) => {
  const [collapsed, setCollapsed] = useState(true);

  return <Paper sx={{ p: 2, mb: 2 }}>
    <Stack direction="row" justifyContent="space-between">
      {title}
      <Button autoFocus color="primary" variant="contained" onClick={() => navigator.clipboard.writeText(text)}>
        Kopiuj tekst
      </Button>
    </Stack>
    <Typography sx={{ height: collapsed ? '3em' : 'auto', overflow: 'hidden' }} onClick={() => setCollapsed(!collapsed)}>{text}</Typography>
</Paper>
}