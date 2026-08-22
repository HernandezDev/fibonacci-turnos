export interface SeoProps {
    title: string;
    description?: string;
    image?: string;
    url?: string;
}

/**
 * COMPONENTE DE SERVIDOR ESTRICTO (SSG ONLY)
 * 
 * Reglas de uso:
 * - No usar hooks (useState, useEffect, etc).
 * - No importar librerías de cliente.
 * - Este componente nunca se hidrata en el navegador, solo se 
 *   procesa vía renderToString() en el plugin de Vite.
 */
export function Seo({ title, description, image, url }: SeoProps) {
    return (
        <>
            <title>{title}</title>
            {description && <meta name="description" content={description} />}

            {/* OpenGraph */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            {description && <meta property="og:description" content={description} />}
            {image && <meta property="og:image" content={image} />}
            {url && <meta property="og:url" content={url} />}

            {/* Twitter Card (Estándar recomendado si usas imágenes OG) */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            {description && <meta name="twitter:description" content={description} />}
            {image && <meta name="twitter:image" content={image} />}
        </>
    );
}