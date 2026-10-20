const container = document.getElementById("cv-viewer");
const status = document.getElementById("cv-status");

async function showCV() {
  const pdfjs = await import("../vendor/pdfjs/build/pdf.min.mjs");
  const { EventBus, PDFLinkService, PDFViewer, LinkTarget } =
    await import("../vendor/pdfjs/web/pdf_viewer.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc =
    new URL("../vendor/pdfjs/build/pdf.worker.min.mjs", import.meta.url).href;

  const eventBus = new EventBus();
  const linkService = new PDFLinkService({
    eventBus,
    externalLinkTarget: LinkTarget.BLANK,
    externalLinkRel: "noopener noreferrer",
  });
  const viewer = new PDFViewer({
    container,
    viewer: document.getElementById("cv-pages"),
    eventBus,
    linkService,
  });
  linkService.setViewer(viewer);
  eventBus.on("pagesinit", () => {
    viewer.currentScaleValue = "page-width";
  });
  eventBus.on("pagerendered", ({ error }) => {
    if (error) {
      showError(error);
    } else {
      status.hidden = true;
    }
  });

  const pdf = await pdfjs.getDocument({
    url: document.getElementById("cv-link").href,
    cMapUrl: new URL("../vendor/pdfjs/cmaps/", import.meta.url).href,
    cMapPacked: true,
    standardFontDataUrl: new URL("../vendor/pdfjs/standard_fonts/", import.meta.url).href,
    isEvalSupported: false,
  }).promise;
  viewer.setDocument(pdf);
  linkService.setDocument(pdf);

  let width = container.clientWidth;
  new ResizeObserver(() => {
    if (container.clientWidth !== width) {
      width = container.clientWidth;
      if (viewer.pagesCount) viewer.currentScaleValue = "page-width";
    }
  }).observe(container);
}

function showError(error) {
  console.error("CV preview could not load:", error);
  status.hidden = false;
  status.textContent = document.documentElement.lang.startsWith("zh")
    ? "预览暂时无法加载，请使用上方按钮下载或在新标签页打开。"
    : "The preview could not load. Please download the PDF or open it in a new tab.";
}

showCV().catch(showError);
