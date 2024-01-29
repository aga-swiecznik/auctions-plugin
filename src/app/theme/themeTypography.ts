import type { TypographyOptions } from '@mui/material/styles/createTypography';
import breakpoints from './themeBreakpoints';
declare module '@mui/material/styles' {
  interface TypographyVariants {
    subheader: React.CSSProperties;
    helpertext: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    subheader: React.CSSProperties;
    helpertext: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    subheader: true;
    helpertext: true;
  }
}

const typography: TypographyOptions = {
  h1: {
    fontSize: '30px' as string,
    margin: '0 0 10px',
    [`@media screen and (max-width: ${breakpoints.values.md}px)`]: {
      fontSize: '25px',
    },
  },
  h2: {
    fontSize: '24px' as string,

    [`@media screen and (max-width: ${breakpoints.values.md}px)`]: {
      fontSize: '20px',
    },
  },
  h3: {
    fontSize: '20px' as string,
    fontWeight: 300,
    paddingBottom: 8,

    [`@media screen and (max-width: ${breakpoints.values.md}px)`]: {
      fontSize: '18px',
    },
  },

  h4: {
    fontSize: '32px' as string,
    fontWeight: 400 as number,
    [`@media screen and (max-width: ${breakpoints.values.md}px)`]: {
      fontSize: '22px',
    },
  },
  h5: {
    fontSize: '24px' as string,
    [`@media screen and (max-width: ${breakpoints.values.md}px)`]: {
      fontSize: '20px',
    },
  },
  h6: {
    fontSize: '20px' as string,
    fontWeight: 400 as number,
    [`@media screen and (max-width: ${breakpoints.values.md}px)`]: {
      fontSize: '18px',
    },
  },
  subtitle1: {
    fontSize: '20px' as string,
    fontWeight: 700,
  },
  subtitle2: {
    fontSize: '18px' as string,
  },
  subheader: {
    fontSize: '16px',
  },
  body1: {
    fontSize: '16px' as string,
    [`@media screen and (max-width: ${breakpoints.values.md}px)`]: {
      fontSize: '14px',
    },
  },
  body2: {
    fontSize: '14px' as string,
  },
  caption: {
    fontSize: '12px' as string,
    lineHeight: '20px' as string,
    letterSpacing: '.4px',
    opacity: 0.5
  },
  helpertext: {
    color: '#777' as string,
    fontFeatureSettings: "'clig' off, 'liga' off" as string,
    fontSize: '12px' as string,
    fontStyle: 'normal' as string,
    fontWeight: 400 as number,
    letterSpacing: '.4px',
    lineHeight: '20px' as string,
    marginTop: '0px' as string,
    marginBottom: '0px' as string,
  },
};

export default typography;
