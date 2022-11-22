import Head from "next/head";

export type SeoProps = {
  title: string;
  description: string;
  image: string;
};
export default function SEO(seo: SeoProps) {
  return (
    <Head>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="image" content={seo.image} />
      <link
        rel="icon"
        href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>👤</text></svg>"
      />
    </Head>
  );
}
