from pathlib import Path
from reportlab.lib.colors import HexColor, white
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import Paragraph

ROOT = Path(__file__).resolve().parents[1]
OUT, PHOTO = ROOT / "output" / "pdf", ROOT / "assets" / "meryem-el-mustad-portrait.png"
W, H = A4
INK, MUTED, PAPER = HexColor("#1c1b20"), HexColor("#69636b"), HexColor("#f7f3ed")
WINE, ROSE, BLUE, LINE = HexColor("#6c233c"), HexColor("#d9aebc"), HexColor("#60788d"), HexColor("#d8d1ca")
SIDE = HexColor("#d8d3d9")

for name, path in {"UI":"segoeui.ttf","UIB":"seguisb.ttf","SERIFB":"georgiab.ttf"}.items():
    pdfmetrics.registerFont(TTFont(name, f"C:/Windows/Fonts/{path}"))


def sty(size=8, leading=11, color=INK, font="UI"):
    return ParagraphStyle("s", fontName=font, fontSize=size, leading=leading, textColor=color, alignment=TA_LEFT)


def para(c, text, x, top, width, ps):
    p = Paragraph(text, ps); _, h = p.wrap(width, H); p.drawOn(c, x, top-h); return top-h


def rule(c, x1, y, x2, color=LINE):
    c.setStrokeColor(color); c.setLineWidth(.55); c.line(x1, y, x2, y)


def section(c, number, text, x, y, width):
    c.setFont("UIB", 6.7); c.setFillColor(WINE); c.drawString(x, y, number)
    c.setFillColor(INK); c.drawString(x+23, y, text.upper()); rule(c, x, y-8, x+width)
    return y-22


def draw_sidebar(c, t):
    c.setFillColor(INK); c.rect(0, 0, 168, H, fill=1, stroke=0)
    c.setFillColor(WINE); c.rect(0, H-7, 168, 7, fill=1, stroke=0)
    c.drawImage(ImageReader(str(PHOTO)), 20, H-204, 128, 160, preserveAspectRatio=True, anchor="c", mask="auto")
    c.setFillColor(white); c.setFont("SERIFB", 16.5); c.drawString(22, H-232, "MERYEM"); c.drawString(22, H-253, "EL MUSTAD")
    c.setFillColor(ROSE); c.setFont("UIB", 6.8); c.drawString(22, H-274, "DATA SCIENCE  /  AI")
    rule(c, 22, H-291, 146, HexColor("#57545b"))
    c.setFillColor(ROSE); c.setFont("UIB", 7); c.drawString(22, H-313, t["contact"].upper())
    y = H-331
    for text in [t["location"], "+212 663 629 347", "meryem.elmustad@usmba.ac.ma", "linkedin.com/in/<br/>meryem-el-mustad-06486127b", "github.com/Meryem-data-science"]:
        y = para(c, text, 22, y, 124, sty(7, 9.8, SIDE))-6
    rule(c, 22, y-2, 146, HexColor("#57545b")); y -= 23
    c.setFillColor(ROSE); c.setFont("UIB", 7); c.drawString(22, y, t["skills"].upper()); y -= 17
    groups = [("DATA","Python  /  SQL  /  Pandas  /  NumPy"),("MODELING","Scikit-learn  /  TensorFlow  /  Deep Learning"),("BI & ETL","Power BI  /  Tableau  /  Talend  /  SQL Server"),("TOOLS","Spark  /  Git  /  UML  /  UI-UX")]
    for title, tools in groups:
        c.setFillColor(white); c.setFont("UIB", 6.4); c.drawString(22, y, title)
        y = para(c, tools, 22, y-6, 124, sty(6.7, 9, SIDE))-12
    rule(c, 22, y, 146, HexColor("#57545b")); y -= 22
    c.setFillColor(ROSE); c.setFont("UIB", 7); c.drawString(22, y, t["languages"].upper())
    c.setFillColor(SIDE); c.setFont("UI", 7)
    for i, item in enumerate(t["language_items"]): c.drawString(22, y-19-i*15, item)
    c.linkURL("mailto:meryem.elmustad@usmba.ac.ma", (20, H-372, 150, H-349), relative=0)
    c.linkURL("https://linkedin.com/in/meryem-el-mustad-06486127b", (20, H-408, 150, H-378), relative=0)
    c.linkURL("https://github.com/Meryem-data-science", (20, H-430, 150, H-409), relative=0)


def draw_experience(c, item, x, y, width):
    date, company, role, desc = item
    c.setFillColor(BLUE); c.setFont("UIB", 6.4); c.drawString(x, y, date.upper())
    c.setFillColor(INK); c.setFont("SERIFB", 11); c.drawString(x+88, y-1, company)
    y2 = para(c, f"<b>{role}</b>", x+88, y-13, width-88, sty(7.3, 9.5, WINE, "UIB"))
    return para(c, desc, x+88, y2-3, width-88, sty(7.2, 9.7, MUTED))-11


def draw_project(c, item, x, y, width):
    title, tag, desc = item
    c.setFillColor(WINE); c.circle(x+2.2, y-3, 1.8, fill=1, stroke=0)
    c.setFillColor(INK); c.setFont("SERIFB", 9.2); c.drawString(x+11, y, title)
    c.setFillColor(BLUE); c.setFont("UIB", 5.8); c.drawRightString(x+width, y, tag.upper())
    return para(c, desc, x+11, y-11, width-11, sty(6.8, 9.1, MUTED))-9


DATA = {
"fr": {"file":"CV_Meryem_El_Mustad_FR.pdf","title":"Élève ingénieure en Data Science<br/>& Intelligence Artificielle","availability":"PFE 2027  /  DATA - IA - PRODUIT","contact":"Contact","location":"Meknès, Maroc","skills":"Compétences","languages":"Langues","language_items":["Arabe - Langue maternelle","Français - Courant","Anglais - Technique"],"profile_label":"Profil","profile":"Élève ingénieure en troisième année à l'École Nationale des Sciences Appliquées de Fès. Je transforme des problématiques réelles en analyses, modèles et produits numériques clairs, en reliant rigueur technique et besoins utilisateurs.","experience_label":"Expériences","experiences":[("Juin - sept. 2026","Abajad AI","Projet de fin d'année - Data & AI","Conception d'un agent d'analyse vidéo, d'un MVP de colocation étudiante et d'un agent autonome de veille des stages PFE."),("Juillet 2025","LafargeHolcim Maroc","Stage d'initiation - Machine Learning","Préparation d'un dataset réseau à 78 variables et comparaison de modèles pour classifier le trafic normal et anormal.")],"education_label":"Formation","education":"<b>Cycle ingénieur - Sciences des données & IA</b><br/><font color='#69636b'>École Nationale des Sciences Appliquées de Fès  /  Diplôme prévu en 2027</font>","projects_label":"Projets clés","projects":[("Anomalies réseau","Machine Learning","Pipeline de classification et comparaison de modèles sur 78 variables."),("Voyages SNCF","BI / ETL","ETL avec Talend et SQL Server, puis dashboard Power BI."),("Fraude bancaire","Deep Learning","Détection de transactions suspectes à partir de 15 variables."),("YUNEST","Produit / UI-UX","MVP de colocation étudiante : identité, parcours et interface mobile.")],"footer":"Disponible pour un stage PFE Data & AI en 2027"},
"en": {"file":"Resume_Meryem_El_Mustad_EN.pdf","title":"Data Science & Artificial Intelligence<br/>Engineering Student","availability":"2027 FINAL-YEAR INTERNSHIP  /  DATA - AI - PRODUCT","contact":"Contact","location":"Meknes, Morocco","skills":"Skills","languages":"Languages","language_items":["Arabic - Native","French - Fluent","English - Technical"],"profile_label":"Profile","profile":"Third-year engineering student at the National School of Applied Sciences of Fez. I turn real-world problems into clear analyses, models and digital products, connecting technical rigor with user needs.","experience_label":"Experience","experiences":[("Jun - Sep 2026","Abajad AI","End-of-year project - Data & AI","Designed a video analysis agent, a student co-living MVP and an autonomous agent for final-year internship monitoring."),("July 2025","LafargeHolcim Morocco","Introductory internship - Machine Learning","Prepared a 78-feature network dataset and compared models to classify normal and abnormal traffic.")],"education_label":"Education","education":"<b>Engineering degree - Data Science & AI</b><br/><font color='#69636b'>National School of Applied Sciences of Fez  /  Expected graduation: 2027</font>","projects_label":"Key projects","projects":[("Network anomalies","Machine Learning","Classification pipeline and model comparison across 78 features."),("SNCF travel","BI / ETL","ETL with Talend and SQL Server, followed by a Power BI dashboard."),("Bank fraud","Deep Learning","Suspicious transaction detection based on 15 input features."),("YUNEST","Product / UI-UX","Student co-living MVP: visual identity, user flows and mobile UI.")],"footer":"Available for a Data & AI final-year internship in 2027"}}


def generate(lang):
    t = DATA[lang]; path = OUT/t["file"]; c = Canvas(str(path), pagesize=A4)
    c.setTitle("Meryem El Mustad - Data & AI"); c.setAuthor("Meryem El Mustad")
    c.setFillColor(PAPER); c.rect(0, 0, W, H, fill=1, stroke=0); draw_sidebar(c, t)
    x, width, y = 194, W-228, H-43
    y = para(c, t["title"], x, y, width, sty(20.5, 23, INK, "SERIFB"))
    c.setFillColor(WINE); c.setFont("UIB", 6.6); c.drawString(x, y-12, t["availability"]); y -= 39
    y = section(c, "01", t["profile_label"], x, y, width)
    y = para(c, t["profile"], x, y, width, sty(7.5, 10.3, MUTED))-16
    y = section(c, "02", t["experience_label"], x, y, width)
    for item in t["experiences"]: y = draw_experience(c, item, x, y, width)
    y = section(c, "03", t["education_label"], x, y-1, width)
    y = para(c, t["education"], x, y, width, sty(8.2, 11, INK))-17
    y = section(c, "04", t["projects_label"], x, y, width)
    gap, col = 19, (width-19)/2; yl = yr = y
    for i, item in enumerate(t["projects"]):
        if i%2 == 0: yl = draw_project(c, item, x, yl, col)
        else: yr = draw_project(c, item, x+col+gap, yr, col)
    fy = min(yl, yr)-5
    c.setFillColor(INK); c.roundRect(x, fy-45, width, 43, 4, fill=1, stroke=0)
    c.setFillColor(white); c.setFont("SERIFB", 10.4); c.drawString(x+14, fy-20, t["footer"])
    c.setFillColor(ROSE); c.setFont("UI", 6.8); c.drawString(x+14, fy-34, "meryem.elmustad@usmba.ac.ma  /  github.com/Meryem-data-science")
    c.linkURL("mailto:meryem.elmustad@usmba.ac.ma", (x, fy-47, x+width, fy), relative=0)
    c.setFillColor(MUTED); c.setFont("UI", 6.4); c.drawRightString(W-34, 18, "MERYEM EL MUSTAD  /  DATA & AI  /  01")
    c.save(); return path


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for language in ("fr", "en"):
        result = generate(language); print(f"{result.name}: {result.stat().st_size} bytes")
