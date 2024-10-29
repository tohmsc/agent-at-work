import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Privacy Policy - Agent at Work",
  description: "Our privacy policy and data practices",
};

export default function PrivacyPage() {
  return (
    <main className="container mx-auto px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-6">Privacy Policy</h1>
        <div className="prose dark:prose-invert">
          <p className="text-lg text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <p className="text-muted-foreground mb-4">
              We collect information that you provide directly to us, including when you:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Create an account</li>
              <li>Submit an agent listing</li>
              <li>Contact us</li>
              <li>Subscribe to our newsletter</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Provide and maintain our services</li>
              <li>Process your transactions</li>
              <li>Send you technical notices and updates</li>
              <li>Respond to your comments and questions</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
