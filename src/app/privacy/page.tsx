import { LegalPage } from "@/components/layout/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Privacy Policy", description: "How Synthokem Labs collects, uses and protects personal information submitted through this website.", path: "/privacy/", noindex: true });

export default function Page() {
  return (
    <LegalPage
      title="Privacy Policy"
      path="/privacy/"
      intro={<p>This policy will explain what information Synthokem Labs collects through this website, why it is collected, and the choices available to you.</p>}
      sections={[
        { h: "Information we collect", body: <p>Details you choose to submit through enquiry, contact and career forms — such as name, company, contact details, messages and attachments.</p> },
        { h: "How we use information", body: <p>To respond to enquiries, assess job applications and operate the website. [Legal team to confirm purposes and lawful bases.]</p> },
        { h: "Sharing and transfers", body: <p>[Legal team to describe any service providers, group entities or cross-border transfers.]</p> },
        { h: "Retention", body: <p>[Legal team to specify retention periods for enquiries and applications.]</p> },
        { h: "Your rights", body: <p>[Legal team to describe rights under applicable law, including India&rsquo;s Digital Personal Data Protection Act, 2023, and how to exercise them.]</p> },
        { h: "Contact", body: <p>Privacy questions can be sent to the company email address below.</p> },
      ]}
    />
  );
}
