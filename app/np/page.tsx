import { Home } from "@/components/Home";

// `/?photos=0` is rewritten here (next.config.ts): the same page without the photos.
export default function NoPhotos() {
  return <Home photos={false} />;
}
