import { Page } from "@/components/v2/Page";

// `/v2?photos=0` is rewritten here (next.config.ts): the same page without its photographs.
export default function V2NoPhotos() {
  return <Page photos={false} />;
}
