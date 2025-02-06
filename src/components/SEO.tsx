import { Helmet } from 'react-helmet';

export function SEO({ title, description }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
}

// Example Usage:
// <SEO title="Match Details" description="Upcoming matches and details" />

