import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "About - Agent at Work",
  description: "Learn more about Agent at Work and our mission",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-6">About Us</h1>
        <div className="prose dark:prose-invert">
          <p className="text-lg text-muted-foreground mb-6">
            Agent at Work is the leading directory for AI agents, helping businesses and individuals discover and integrate AI solutions to automate their workflows and boost productivity.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-6">
            We believe in making AI accessible to everyone. Our platform connects users with the most effective AI agents, enabling them to automate tasks, streamline processes, and focus on what matters most.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">What We Offer</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
            <li>Curated directory of AI agents</li>
            <li>Detailed reviews and ratings</li>
            <li>Integration guides and support</li>
            <li>Community-driven insights</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
