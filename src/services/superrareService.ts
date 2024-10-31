import { z } from 'zod';

const superrareUrlPattern = /^(?:https?:\/\/)?(?:www\.)?superrare\.com\/artwork\/(?:eth\/)?[^\/]+\/\d+$/;

const SuperRareResponseSchema = z.object({
  data: z.object({
    nftByUtid: z.array(z.object({
      universalTokenId: z.string(),
      creator: z.object({
        primaryProfile: z.object({
          sr: z.object({
            srName: z.string()
          }).nullable()
        }).nullable()
      }).nullable(),
      metadata: z.object({
        title: z.string().nullable(),
        description: z.string().nullable(),
        proxyImageMediumUri: z.string().nullable(),
        proxyVideoMediumUri: z.string().nullable()
      }).nullable()
    })).nullable()
  })
});

export type SuperRareArtwork = z.infer<typeof SuperRareResponseSchema>['data']['nftByUtid'][0];

// Helper function to clean URLs of parameters
export function cleanUrl(url: string): string {
  return url.split(/[?#]/)[0];
}

async function fetchMetaTitle(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      // Clean up the title by removing "| SuperRare" or similar suffixes
      return titleMatch[1].replace(/\s*\|\s*SuperRare.*$/i, '').trim();
    }
    throw new Error('Meta title not found');
  } catch (error) {
    console.error('Failed to fetch meta title:', error);
    return 'Untitled Artwork';
  }
}

function cleanImageUrl(url: string): string {
  try {
    const decodedUrl = decodeURIComponent(url);
    const urlObj = new URL(decodedUrl);
    
    // Handle pixura.imgix.net URLs
    if (urlObj.hostname === 'pixura.imgix.net') {
      // The actual image URL is the first path segment
      const actualUrl = urlObj.pathname.substring(1); // Remove leading slash
      return actualUrl;
    }
    
    // Handle pixura.net proxy URLs
    if (urlObj.hostname.includes('pixura.net')) {
      const path = urlObj.pathname;
      const cleanPath = path.replace(/^\/sr-proxy\//, '');
      return cleanPath;
    }
    
    // For all other URLs, remove width, height, and crop parameters
    urlObj.searchParams.delete('w');
    urlObj.searchParams.delete('h');
    urlObj.searchParams.delete('crop');
    urlObj.searchParams.delete('width');
    urlObj.searchParams.delete('height');
    urlObj.searchParams.delete('fit');
    urlObj.searchParams.delete('fm');
    urlObj.searchParams.delete('quality');
    urlObj.searchParams.delete('video');
    urlObj.searchParams.delete('name');
    urlObj.searchParams.delete('auto');
    urlObj.searchParams.delete('s');
    urlObj.searchParams.delete('ixlib');
    
    return urlObj.toString();
  } catch (error) {
    console.error('Failed to clean image URL:', error);
    return url;
  }
}

export function parseSupeRareUrl(url: string): string | null {
  const cleanedUrl = cleanUrl(url);
  
  const match = cleanedUrl.match(superrareUrlPattern);
  if (!match) return null;
  
  // Extract the contract address and token ID from the clean URL
  const parts = cleanedUrl.split('/');
  const tokenId = parts.pop();
  const contractAddress = parts.pop();
  
  if (!tokenId || !contractAddress) return null;
  
  return `${contractAddress}-${tokenId}`;
}

export async function fetchSupeRareArtwork(url: string): Promise<SuperRareArtwork> {
  const cleanedUrl = cleanUrl(url);
  
  // Validate the URL format first
  if (!superrareUrlPattern.test(cleanedUrl)) {
    throw new Error('Invalid SuperRare URL format');
  }

  const utid = parseSupeRareUrl(cleanedUrl);
  if (!utid) {
    throw new Error('Invalid SuperRare URL format');
  }

  const query = `
    query NftByUtid($universalTokenId: [String!]!) {
      nftByUtid(universalTokenId: $universalTokenId) {
        universalTokenId
        creator {
          primaryProfile {
            sr {
              srName
            }
          }
        }
        metadata {
          title
          description
          proxyImageMediumUri
          proxyVideoMediumUri
        }
      }
    }
  `;

  try {
    const response = await fetch('https://api.rare.xyz/v1/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          universalTokenId: [utid]
        }
      })
    });

    if (!response.ok) {
      throw new Error(`SuperRare API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const parsed = SuperRareResponseSchema.parse(data);

    if (!parsed.data.nftByUtid || parsed.data.nftByUtid.length === 0) {
      throw new Error('Artwork not found');
    }

    const artwork = parsed.data.nftByUtid[0];
    if (!artwork.metadata) {
      throw new Error('Invalid artwork data');
    }

    // If title is null, fetch meta title from the artwork URL
    if (!artwork.metadata.title) {
      artwork.metadata.title = await fetchMetaTitle(cleanedUrl);
    }

    // Clean the image URLs before returning
    if (artwork.metadata.proxyImageMediumUri) {
      artwork.metadata.proxyImageMediumUri = cleanImageUrl(artwork.metadata.proxyImageMediumUri);
    }
    if (artwork.metadata.proxyVideoMediumUri) {
      artwork.metadata.proxyVideoMediumUri = cleanImageUrl(artwork.metadata.proxyVideoMediumUri);
    }

    return artwork;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Schema validation error:', error.errors);
      throw new Error('Invalid response format from SuperRare API');
    }
    throw error;
  }
}