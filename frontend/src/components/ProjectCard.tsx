type Props = {
  title: string;
  description: string;
  iframeUrl: string;
  sourceUrl: string;
};

const ProjectCard = ({ title, description, iframeUrl, sourceUrl }: Props) => (
  <div className="rounded-xl border bg-white p-4 shadow-md transition hover:shadow-lg">
    <h2 className="mb-2 text-xl font-bold">{title}</h2>
    <p className="text-sm text-gray-700">{description}</p>
    <div className="mt-4 flex gap-3">
      <a href={iframeUrl} target="_blank" className="text-blue-600 underline">
        Launch
      </a>
      <a href={sourceUrl} target="_blank" className="text-gray-600 underline">
        Source
      </a>
    </div>
  </div>
);

export default ProjectCard;
