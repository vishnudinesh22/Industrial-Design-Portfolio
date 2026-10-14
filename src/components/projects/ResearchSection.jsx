import DesignFrame from '../../design/DesignFrame';

// References and evidence caveats are retained in the project's dedicated data file.
export default function ResearchSection({ section, projectName }) {
  return <DesignFrame section={section} projectName={projectName} />;
}
