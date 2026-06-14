import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://importwise.ie", lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: "https://importwise.ie/source", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://importwise.ie/vrt", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://importwise.ie/reviews", lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: "https://importwise.ie/about", lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: "https://importwise.ie/contact", lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];
}
