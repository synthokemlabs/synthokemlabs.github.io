import { LegalPage } from "@/components/layout/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Terms of Use", description: "Terms governing the use of the Synthokem Labs website.", path: "/terms/", noindex: true });

export default function Page() {
  return (
    <LegalPage
      title="Terms of Use"
      path="/terms/"
      intro={<p>These terms will set out the conditions for using this website and its content.</p>}
      sections={[
        { h: "Use of the website", body: <p>[Legal team to define permitted use.]</p> },
        { h: "Product information", body: <p>Product information on this website is provided for business-to-business reference only and does not constitute an offer, specification or regulatory claim. [Legal team to confirm.]</p> },
        { h: "Intellectual property", body: <p>[Legal team to describe ownership of content, trademarks and logos.]</p> },
        { h: "Limitation of liability", body: <p>[Legal team to provide wording.]</p> },
        { h: "Governing law", body: <p>[Legal team to specify jurisdiction.]</p> },
      ]}
    />
  );
}
