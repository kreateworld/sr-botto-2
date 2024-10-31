import React from 'react';
import { Helmet } from 'react-helmet-async';

interface HeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  children?: React.ReactNode;
}

const Head: React.FC<HeadProps> = ({
  title = 'Botto DAO - $RARE Artwork Curation',
  description = 'Join BottoDAO in curating artworks available for purchase with $RARE on SuperRare. Vote, comment, and help shape the future of decentralized art curation.',
  image = 'https://cms.botto.com/assets/807de48d-47df-47e8-b20c-5b2deb2616f6',
  url = 'https://rare.botto.com',
  children
}) => {
  const siteName = 'Botto DAO';
  const twitterHandle = '@BottoDAO';
  const faviconUrl = 'https://cms.botto.com/assets/74c67177-f8b1-40c8-af05-9af5501f58c7';

  return (
    <Helmet prioritizeSeoTags>
      {/* Basic metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />

      {/* Favicon */}
      <link rel="icon" type="image/png" href={faviconUrl} />
      <link rel="apple-touch-icon" href={faviconUrl} />

      {/* Additional SEO */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#171717" />
      <meta name="keywords" content="Botto, DAO, NFT, SuperRare, RARE, Art, Curation, Web3, Blockchain" />
      <meta name="author" content="Botto DAO" />

      {/* Additional tags */}
      {children}
    </Helmet>
  );
};

export default Head;