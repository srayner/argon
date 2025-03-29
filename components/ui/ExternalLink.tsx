import React from "react";

interface ExternalLinkProps {
  href: string;
  children?: React.ReactNode;
}

const ExternalLink: React.FC<ExternalLinkProps> = ({ href, children }) => {
  // Strip protocol (http:// or https://) for display text
  const displayText = href.replace(/^https?:\/\//, "");

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children || displayText}
    </a>
  );
};

export default ExternalLink;
