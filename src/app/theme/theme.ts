import { createTheme, responsiveFontSizes, type ThemeOptions } from '@mui/material/styles';
import palette from './themePalette';
import typography from './themeTypography';
import breakpoints from './themeBreakpoints';
import { Status } from '~/models/Status';
import { AuctionType } from '~/models/AuctionType';

const theme: ThemeOptions = {
  palette,
  typography,
  breakpoints,
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: `linear-gradient(176deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
          boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 5px -1px, rgba(0, 0, 0, 0.14) 0px 5px 8px 0px, rgba(0, 0, 0, 0.12) 0px 1px 14px 0px !important',
        })
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '7px',
          boxShadow: 'rgba(145, 158, 171, 0.3) 0px 0px 2px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px',
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: 'rgba(145, 158, 171, 0.3) 0px 0px 2px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px',
        }
      }
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          fontSize: '16px',
          fontWeight: 500,
          margin: '0 0 10px',
          padding: 0,
        },
        content: {
          overflow: 'hidden',
        },
        title: {
          fontSize: '18px',
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          fontSize: '12px',
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.grey[900]
        })
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.grey[900]
        })
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          textTransform: 'none',
          borderRadius: '5px'
        },
        containedPrimary: ({ theme }) => ({
          backgroundImage: `linear-gradient(130deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        })
      }
    },
    MuiChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          [`&[data-variant="${Status.new}"]`]: {
            backgroundColor: theme.palette.statuses.new,
            color: theme.palette.primary.contrastText,
          },
          [`&[data-variant=${Status.withWinner}]`]: {
            backgroundColor: theme.palette.statuses.withWinner,
            color: theme.palette.primary.contrastText,
          },
          [`&[data-variant=${Status.paid}]`]: {
            backgroundColor: theme.palette.statuses.paid,
          },
          [`&[data-variant=${Status.deleted}]`]: {
            backgroundColor: theme.palette.statuses.deleted,
            color: theme.palette.primary.contrastText,
          },
          [`&[data-variant=${AuctionType.auction}]`]: {
            backgroundColor: theme.palette.types.auction,
            color: theme.palette.primary.contrastText,
          },
          [`&[data-variant=${AuctionType.bricks}]`]: {
            backgroundColor: theme.palette.types.bricks,
            color: theme.palette.primary.contrastText,
          },
          [`&[data-variant=${AuctionType.buyNow}]`]: {
            backgroundColor: theme.palette.types.buyNow,
          },
        }),
        icon: {
          color: 'inherit',
          fontSize: '1rem',
          marginLeft: '10px',
        }
      }
    }
  },
};

export const materialTheme = responsiveFontSizes(createTheme(theme));
