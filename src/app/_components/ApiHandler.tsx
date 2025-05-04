"use client";

import { Alert, Box, IconButton, Stack } from "@mui/material";
import { useErrorStore } from "../store/errorState";
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from "next/navigation";

export const ApiError = () => {
    const { errors, setError } = useErrorStore((state) => ({
        errors: state.errors,
        setError: state.setError,
    }));
    const { push } = useRouter();

    const activeErrors = Object.entries(errors).filter(
        ([_key, message]) => message !== null
      );

      if (activeErrors.length === 0) {
        return null;
      }

    if (activeErrors.some(([_, message]) => message === 'UNAUTHORIZED')) {
        push('/api/auth/signin');
        return null;
    }

    if (activeErrors.some(([_, message]) => message === 'You do not have access to this fundraising.')) {
        push('/');
        return null;
    }

    return (
        <Box
        sx={{
          position: 'fixed',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1500,
          width: '90%',
          maxWidth: '600px',
        }}
      >
        <Stack spacing={1}>
          {activeErrors.map(([endpointKey, message]) => (
            <Alert
              key={endpointKey}
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setError(endpointKey, null);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ width: '100%' }} // Alert zajmuje całą szerokość kontenera
            >
              [{endpointKey}]: {message}
            </Alert>
          ))}
        </Stack>
      </Box>
    );
    }