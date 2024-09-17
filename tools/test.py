from pypdf import PdfReader, PdfWriter
import pdb

reader = PdfReader("base_pdf.pdf")
writer = PdfWriter()

pdb.set_trace()

page = reader.pages[0]
fields = reader.get_fields()

writer.add_page(page)

writer.update_page_form_field_values(
    writer.pages[0], {"fieldname": "some filled in text"}
)

with open("filled-out.pdf", "wb") as output_stream:
    writer.write(output_stream)