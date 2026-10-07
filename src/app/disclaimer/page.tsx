import { LegalPage } from "@/components/layout/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Disclaimer", description: "Disclaimer for information published on the Synthokem Labs website.", path: "/disclaimer/", noindex: true });

export default function Page() {
  return (
    <LegalPage
      title="Disclaimer"
      path="/disclaimer/"
      intro={<p>Information on this website is provided for general business information.</p>}
      sections={[
        { h: "No medical advice", body: <p>Synthokem Labs manufactures pharmaceutical ingredients for industry customers. Nothing on this website is medical advice or a recommendation to use any medicine.</p> },
        { h: "Product and regulatory information", body: <p>Product data and regulatory status reflect company documents at the time of publication and may change. Please contact us for current specifications and documentation. [Legal team to confirm.]</p> },
        { h: "External links", body: <p>[Legal team to provide wording on third-party websites.]</p> },
      ]}
    />
  );
}
