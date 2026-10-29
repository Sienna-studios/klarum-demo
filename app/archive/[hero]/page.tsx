import { notFound } from "next/navigation";
import { Page } from "@/components/v2/Page";
import { HERO_IDS, type HeroId } from "@/components/v2/Hero";

export const dynamicParams = false;
export const generateStaticParams = () => HERO_IDS.map((hero) => ({ hero }));

export default async function V2Hero({ params }: { params: Promise<{ hero: string }> }) {
  const { hero } = await params;
  if (!HERO_IDS.includes(hero as HeroId)) notFound();
  return <Page hero={hero as HeroId} />;
}
