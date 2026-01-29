import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOProps {
	title?: string;
	description?: string;
	name?: string;
	type?: string;
	image?: string;
	canonical?: string;
}

const SEO: React.FC<SEOProps> = ({
	title,
	description,
	name = "Bjorn Wiki",
	type = "website",
	image = "/carousel_1.jpg", // Default image
	canonical,
}) => {
	const siteTitle = title ? `${title} | ${name}` : name;
	const siteDescription =
		description ||
		"Official Wiki for Bjorn, the fully voiced Nord follower for Skyrim. Explore quests, lore, and chat with Bjorn.";
	const siteUrl = "https://bjorn.wiki";

	return (
		<Helmet>
			{/* Standard metadata tags */}
			<title>{siteTitle}</title>
			<meta name="description" content={siteDescription} />
			{canonical && <link rel="canonical" href={canonical} />}

			{/* Facebook tags */}
			<meta property="og:type" content={type} />
			<meta property="og:title" content={siteTitle} />
			<meta property="og:description" content={siteDescription} />
			<meta property="og:image" content={`${siteUrl}${image}`} />
			<meta property="og:url" content={window.location.href} />

			{/* Twitter tags */}
			<meta name="twitter:creator" content={name} />
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={siteTitle} />
			<meta name="twitter:description" content={siteDescription} />
			<meta name="twitter:image" content={`${siteUrl}${image}`} />
		</Helmet>
	);
};

export default SEO;
