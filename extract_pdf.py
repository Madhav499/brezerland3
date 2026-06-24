from pathlib import Path
import PyPDF2
p = Path('Breezerland_Website_Content.pdf')
print('PDF exists:', p.exists())
text = ''
with p.open('rb') as f:
    r = PyPDF2.PdfReader(f)
    for i, pg in enumerate(r.pages, 1):
        t = pg.extract_text()
        print('--- PAGE', i, '---')
        print(t)
        print()
