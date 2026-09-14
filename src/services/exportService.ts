import jsPDF from 'jspdf';
import type { Slide, PlatformType } from '../types/carousel';
import { DIMENSIONS } from '../constants/templates';

export const ExportService = {
    /**
     * Export all carousel slides as a multi-page PDF document
     */
    async exportToPdf(
        slides: Slide[],
        platform: PlatformType,
        renderSlideCallback: (index: number) => Promise<string>
    ): Promise<void> {
        if (!slides || slides.length === 0) {
            throw new Error("No slides to export.");
        }

        const dim = DIMENSIONS[platform];
        const w = dim.width;
        const h = dim.height;

        const pdf = new jsPDF({
            orientation: w > h ? 'landscape' : 'portrait',
            unit: 'px',
            format: [w, h],
            hotfixes: ['px_scaling']
        });

        for (let i = 0; i < slides.length; i++) {
            const dataUrl = await renderSlideCallback(i);
            if (i > 0) {
                pdf.addPage([w, h], w > h ? 'landscape' : 'portrait');
            }
            pdf.addImage(dataUrl, 'PNG', 0, 0, w, h, undefined, 'FAST');
        }

        pdf.save('carouselx-slides.pdf');
    },

    /**
     * Export a single slide as a high-resolution PNG image
     */
    downloadSlideAsPng(dataUrl: string, slideNumber: number): void {
        const link = document.createElement('a');
        link.download = `carouselx-slide-${slideNumber}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
