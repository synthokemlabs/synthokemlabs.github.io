import { LegalPage } from "@/components/layout/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Cookie Policy", description: "How this website uses cookies and similar technologies.", path: "/cookies/", noindex: true });

export default function Page() {
  return (
    <LegalPage
      title="Cookie Policy"
      path="/cookies/"
      intro={<p>This website is designed to work without tracking cookies.</p>}
      sections={[
        { h: "What this site stores", body: <p>The website does not set analytics or advertising cookies. Your browser may store a short list of recently viewed products locally on your device to make browsing easier; it is never sent to us.</p> },
        { h: "Third-party content", body: <p>The Google Maps embed on the contact page loads only when you choose to show it. Once loaded, Google may set its own cookies under its policies.</p> },
        { h: "Changes", body: <p>If analytics or other tools are added in future, this page and any consent controls will be updated before they are enabled. [Legal team to confirm.]</p> },
      ]}
    />
  );
}
