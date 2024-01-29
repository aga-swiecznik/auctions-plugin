import type { PaletteOptions } from '@mui/material';
import { AuctionType } from '~/models/AuctionType';
import { Status } from '~/models/Status';

// Update the Typography's variant prop options
declare module '@mui/material' {
  interface Palette {
    pastels: Palette['primary'];
    statuses: Record<Status, Palette['primary']['main'] >;
    types: Record<AuctionType, Palette['primary']['main'] >;
  }

  interface PaletteOptions {
    pastels: Palette['primary'];
    statuses: Record<Status, Palette['primary']['main'] >;
    types: Record<AuctionType, Palette['primary']['main'] >;
  }
}

// Will create tests for the future for when after we talk more with design to inify the look and feel.
const palette: PaletteOptions = {
  primary: {
    main: '#1e88e5',
    light: '#21c1d6',
    dark: '#2b6ead',
    contrastText: '#fff',
  },
  secondary: {
    main: '#7460ee',
    light: '#b5a6ff',
    dark: '#6949ff',
  },
  text: {
    primary: '#2a3547',
    secondary: '#7f7f7f',
    disabled: '#A6A6BF',
  },
  error: {
    main: '#FF3030',
  },
  grey: {
    50: '#080A2D14',
    100: '#1D1D1D',
    200: '#858693',
    600: '#e0e0e0',
    900: '#fefefe'
  },
  pastels: {
    main: '#d6ecff',
    light: '#e5f7f8',
    dark: '#dae8f2',
    contrastText: '#1D1D1D',
  },
  statuses: {
    [Status.new]: '#1e88e5',
    [Status.withWinner]: '#43ce23',
    [Status.paid]: '#21c1d6',
    [Status.deleted]: '#2b6ead',
    [Status.notAuction]: '#7f7f7f'
  },
  types: {
    [AuctionType.auction]: '#1e88e5',
    [AuctionType.bricks]: '#43ce23',
    [AuctionType.buyNow]: '#21c1d6',
  }
};

export default palette;
