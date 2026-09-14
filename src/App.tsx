import React, { useRef } from 'react';
import { CarouselProvider, useCarousel } from './context/CarouselContext';
import { Header } from './components/Header';
import { IconSidebar } from './components/sidebar/IconSidebar';
import { SettingsPanel } from './components/sidebar/SettingsPanel';
import { SlideCanvas, type SlideCanvasHandle } from './components/editor/SlideCanvas';
import { BottomTrack } from './components/editor/BottomTrack';
import { AiModal } from './components/modals/AiModal';
import { TemplateModal } from './components/modals/TemplateModal';
import { ApiKeyModal } from './components/modals/ApiKeyModal';
import { LoadingOverlay } from './components/common/LoadingOverlay';
import { Toast } from './components/common/Toast';
import { ExportService } from './services/exportService';

const CarouselApp: React.FC = () => {
    const canvasHandleRef = useRef<SlideCanvasHandle | null>(null);
    const { slides, currentSlideIndex, platform, setIsLoading, showToast } = useCarousel();

    const handleExportPdf = async () => {
        if (!canvasHandleRef.current) return;
        setIsLoading(true, 'Compiling carousel slides into high-res PDF...');

        try {
            await ExportService.exportToPdf(
                slides,
                platform,
                (index) => canvasHandleRef.current!.renderSlideToDataUrl(index)
            );
            showToast('PDF exported successfully!');
        } catch (err: any) {
            alert('Export Error: ' + (err.message || 'Failed to export PDF'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportPng = () => {
        if (!canvasHandleRef.current) return;
        const dataUrl = canvasHandleRef.current.getCurrentSlideDataUrl();
        if (dataUrl) {
            ExportService.downloadSlideAsPng(dataUrl, currentSlideIndex + 1);
            showToast(`Slide #${currentSlideIndex + 1} downloaded as PNG!`);
        }
    };

    return (
        <div className="app-container">
            <Header onExportPdf={handleExportPdf} onExportPng={handleExportPng} />
            <IconSidebar />
            <SettingsPanel />
            <main className="editor-main">
                <SlideCanvas ref={canvasHandleRef} />
                <BottomTrack />
            </main>

            <AiModal />
            <TemplateModal />
            <ApiKeyModal />
            <LoadingOverlay />
            <Toast />
        </div>
    );
};

export default function App() {
    return (
        <CarouselProvider>
            <CarouselApp />
        </CarouselProvider>
    );
}
