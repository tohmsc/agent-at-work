import { Breadcrumb } from "@/components/breadcrumb";
import { SubmissionForm } from "@/components/submission-form";

export const metadata = {
  title: 'Submit Your Product',
  description: 'Submit your product to our directory',
};

export default function SubmitPage() {
  return (
    <div className="container max-w-3xl mx-auto py-10 px-4">
      <Breadcrumb items={[{ label: "Submit Product" }]} />
      
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Submit Your Product</h1>
          <p className="text-muted-foreground mt-2">
            Share your product with our community. Fill out the form below with your product details.
          </p>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <SubmissionForm />
        </div>
      </div>
    </div>
  );
}
