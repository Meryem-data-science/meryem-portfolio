from pathlib import Path
import pypdfium2 as pdfium

root = Path(__file__).resolve().parents[1]
out = root / "tmp" / "pdfs"
out.mkdir(parents=True, exist_ok=True)

for source in sorted((root / "output" / "pdf").glob("*.pdf")):
    pdf = pdfium.PdfDocument(str(source))
    for index in range(len(pdf)):
        image = pdf[index].render(scale=1.7).to_pil()
        image.save(out / f"{source.stem}-page-{index + 1}.png")
        print(out / f"{source.stem}-page-{index + 1}.png")
