import { redirect } from "next/navigation";

export default function NoPhotosV2Index() {
  redirect("/v2/c?photos=0");
}
