import React from "react";
import { Box, Typography, Link, Container, Grid } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              Fiserv is an Equal Opportunity Employer/Disability/Vet
            </Typography>
            <Link
              href="https://yourwebsite.com/equal-opportunity"
              variant="body2"
              color="inherit"
            >
              View the EEOC Know Your Rights
            </Link>
            {" | "}
            <Link
              href="https://yourwebsite.com/pay-transparency"
              variant="body2"
              color="inherit"
            >
              View our Pay Transparency Statement
            </Link>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" justifyContent="flex-end">
              <Link
                href="https://www.linkedin.com"
                target="_blank"
                color="inherit"
              >
                <LinkedInIcon sx={{ mx: 1 }} />
              </Link>
              <Link
                href="https://www.twitter.com"
                target="_blank"
                color="inherit"
              >
                <TwitterIcon sx={{ mx: 1 }} />
              </Link>
              <Link
                href="https://www.facebook.com"
                target="_blank"
                color="inherit"
              >
                <FacebookIcon sx={{ mx: 1 }} />
              </Link>
              <Link
                href="https://www.instagram.com"
                target="_blank"
                color="inherit"
              >
                <InstagramIcon sx={{ mx: 1 }} />
              </Link>
            </Box>
          </Grid>
        </Grid>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 3 }}
        >
          © 2024 Fiserv, Inc. or its affiliates.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
