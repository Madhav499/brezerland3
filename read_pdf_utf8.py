import PyPDF2

with open('Breezerland_Website_Content.pdf', 'rb') as f:
    reader = PyPDF2.PdfReader(f)
    with open('pdf_content.txt', 'w', encoding='utf-8') as out:
        for i, page in enumerate(reader.pages, 1):
            out.write(f'--- PAGE {i} ---\n')
            out.write(page.extract_text() or '')
            out.write('\n\n')

print("Extraction successful! Output saved in pdf_content.txt")
