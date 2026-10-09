#!/usr/bin/env python3
"""Generate Royal Daring Club sponsorship brochure PDF."""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, white, black, Color
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from PIL import Image as PILImage

BASE = "/Users/julesmoreau/Desktop/Daring Vitrine Marketing"
OUT = os.path.join(BASE, "Royal_Daring_Partenaires_2025-26.pdf")

W, H = A4  # 595.27 x 841.89 points

RED = HexColor("#C8102E")
GOLD = HexColor("#C9A84C")
DARK = HexColor("#1A1A2E")
DARKER = HexColor("#0D0D1A")
LIGHT_BG = HexColor("#F5F5F0")
WHITE = white
GRAY = HexColor("#666666")
LIGHT_GRAY = HexColor("#E8E8E8")
DARK_GRAY = HexColor("#333333")

MARGIN = 40
CONTENT_W = W - 2 * MARGIN


def register_fonts():
    """Try to use system fonts, fall back to Helvetica."""
    font_dirs = [
        os.path.expanduser("~/Library/Fonts"),
        "/Library/Fonts",
        "/System/Library/Fonts",
    ]
    dm_sans_found = False
    playfair_found = False

    for d in font_dirs:
        if not os.path.isdir(d):
            continue
        for f in os.listdir(d):
            fl = f.lower()
            full = os.path.join(d, f)
            if "dmsans" in fl.replace(" ", "").replace("-", "") and fl.endswith((".ttf", ".otf")):
                if "regular" in fl and not dm_sans_found:
                    try:
                        pdfmetrics.registerFont(TTFont("DMSans", full))
                        dm_sans_found = True
                    except:
                        pass
                elif "bold" in fl:
                    try:
                        pdfmetrics.registerFont(TTFont("DMSans-Bold", full))
                    except:
                        pass
                elif "light" in fl or "300" in fl:
                    try:
                        pdfmetrics.registerFont(TTFont("DMSans-Light", full))
                    except:
                        pass
            if "playfair" in fl.replace(" ", "").replace("-", "") and fl.endswith((".ttf", ".otf")):
                if "bold" in fl and "italic" not in fl:
                    try:
                        pdfmetrics.registerFont(TTFont("Playfair-Bold", full))
                        playfair_found = True
                    except:
                        pass
                elif "regular" in fl and "italic" not in fl:
                    try:
                        pdfmetrics.registerFont(TTFont("Playfair", full))
                        playfair_found = True
                    except:
                        pass
                elif "italic" in fl and "bold" not in fl:
                    try:
                        pdfmetrics.registerFont(TTFont("Playfair-Italic", full))
                    except:
                        pass

    heading = "Playfair-Bold" if playfair_found else "Helvetica-Bold"
    heading_regular = "Playfair" if playfair_found else "Helvetica"
    heading_italic = "Playfair-Italic" if playfair_found else "Helvetica-Oblique"
    body = "DMSans" if dm_sans_found else "Helvetica"
    body_bold = "DMSans-Bold" if dm_sans_found else "Helvetica-Bold"
    body_light = "DMSans-Light" if dm_sans_found else "Helvetica"

    return {
        "heading": heading,
        "heading_regular": heading_regular,
        "heading_italic": heading_italic,
        "body": body,
        "body_bold": body_bold,
        "body_light": body_light,
    }


def draw_red_bar(c, y, height=4):
    c.setFillColor(RED)
    c.rect(0, y, W, height, fill=1, stroke=0)


def draw_gold_caption(c, text, x, y, fonts, size=8):
    c.setFont(fonts["body_bold"], size)
    c.setFillColor(GOLD)
    c.drawString(x, y, text.upper())


def draw_heading(c, text, x, y, fonts, size=26, color=DARK):
    c.setFont(fonts["heading"], size)
    c.setFillColor(color)
    c.drawString(x, y, text)


def wrap_text(c, text, font, size, max_width):
    words = text.split()
    lines = []
    current = ""
    c.setFont(font, size)
    for word in words:
        test = current + " " + word if current else word
        if c.stringWidth(test, font, size) <= max_width:
            current = test
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_wrapped(c, text, x, y, font, size, max_width, leading=None, color=None):
    if color:
        c.setFillColor(color)
    if leading is None:
        leading = size * 1.4
    lines = wrap_text(c, text, font, size, max_width)
    for line in lines:
        c.setFont(font, size)
        c.drawString(x, y, line)
        y -= leading
    return y


def load_image(path):
    img = PILImage.open(path)
    if img.mode == "RGBA":
        bg = PILImage.new("RGB", img.size, (255, 255, 255))
        bg.paste(img, mask=img.split()[3])
        return ImageReader(bg)
    return ImageReader(path)


def load_image_keep_alpha(path):
    return ImageReader(path)


def page_cover(c, fonts):
    """PAGE 1: Full-bleed cover with hero image."""
    hero = load_image(os.path.join(BASE, "img/hero.jpg"))
    img_w, img_h = 2048, 1363
    scale = max(W / img_w, H / img_h)
    dw, dh = img_w * scale, img_h * scale
    c.drawImage(hero, (W - dw) / 2, (H - dh) / 2, dw, dh)

    c.setFillColor(Color(0, 0, 0, alpha=0.55))
    c.rect(0, 0, W, H, fill=1, stroke=0)

    draw_red_bar(c, H - 6, 6)

    logo = load_image_keep_alpha(os.path.join(BASE, "logo_daring.png"))
    logo_size = 70
    c.drawImage(logo, (W - logo_size) / 2, H - 120, logo_size, logo_size, mask="auto")

    c.setFont(fonts["body"], 9)
    c.setFillColor(GOLD)
    c.drawCentredString(W / 2, H - 145, "ROYAL DARING CLUB DE MOLENBEEK")

    c.setFont(fonts["heading"], 36)
    c.setFillColor(WHITE)
    c.drawCentredString(W / 2, H / 2 + 50, "Devenez partenaire")
    c.setFont(fonts["heading"], 36)
    c.drawCentredString(W / 2, H / 2 + 6, "du Royal Daring.")

    c.setFont(fonts["body"], 12)
    c.setFillColor(GOLD)
    c.drawCentredString(W / 2, H / 2 - 30, "Dossier Partenariats  ·  Saison 2025-26")

    c.setFont(fonts["body_light"], 11)
    c.setFillColor(HexColor("#CCCCCC"))
    c.drawCentredString(W / 2, H / 2 - 55, "Plus de 100 ans d'histoire a Bruxelles.")

    bar_h = 50
    c.setFillColor(Color(0.1, 0.1, 0.12, alpha=0.85))
    c.rect(0, 0, W, bar_h, fill=1, stroke=0)

    draw_red_bar(c, bar_h, 3)

    stats = [("620", "membres"), ("450+", "jeunes"), ("22", "matchdays")]
    stat_w = W / 3
    for i, (num, lbl) in enumerate(stats):
        cx = stat_w * i + stat_w / 2
        c.setFont(fonts["body_bold"], 18)
        c.setFillColor(WHITE)
        c.drawCentredString(cx, 22, num)
        c.setFont(fonts["body"], 8)
        c.setFillColor(GOLD)
        c.drawCentredString(cx, 10, lbl.upper())


def page_chiffres(c, fonts):
    """PAGE 2: KPIs + 4 pillars."""
    c.setFillColor(DARK)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    draw_red_bar(c, H - 4, 4)

    y = H - 55
    draw_gold_caption(c, "01  ·  Le Daring en chiffres", MARGIN, y, fonts)

    y -= 35
    c.setFont(fonts["heading"], 28)
    c.setFillColor(WHITE)
    c.drawString(MARGIN, y, "Une institution,")
    y -= 35
    c.setFillColor(RED)
    c.drawString(MARGIN, y, "pas une promesse.")

    y -= 40
    kpis = [
        ("100+", "Annees d'histoire", "Fonde en 1922 a Molenbeek"),
        ("620", "Membres actifs", "Saison 2024-25"),
        ("450+", "Jeunes en formation", "EDJ · 5 a 19 ans"),
        ("4", "Titres de Champion", "1946 · 1947 · 1948 · 1949"),
        ("22", "Super Sundays / saison", "Match days domicile"),
        ("2", "Terrains synthetiques", "Mouilles · neufs"),
    ]

    cols = 3
    rows = 2
    cell_w = CONTENT_W / cols
    cell_h = 75

    for idx, (num, lbl, sub) in enumerate(kpis):
        col = idx % cols
        row = idx // cols
        cx = MARGIN + col * cell_w
        cy = y - row * cell_h

        c.setFont(fonts["heading"], 28)
        c.setFillColor(GOLD)
        c.drawString(cx, cy, num)

        c.setFont(fonts["body_bold"], 10)
        c.setFillColor(WHITE)
        c.drawString(cx, cy - 18, lbl)

        c.setFont(fonts["body_light"], 7.5)
        c.setFillColor(GRAY)
        c.drawString(cx, cy - 30, sub)

    y = y - rows * cell_h - 25
    c.setStrokeColor(HexColor("#333333"))
    c.setLineWidth(0.5)
    c.line(MARGIN, y, W - MARGIN, y)

    y -= 30
    draw_gold_caption(c, "4 raisons d'associer votre marque", MARGIN, y, fonts)

    y -= 25
    pillars = [
        ("01", "Une audience qualifiee",
         "Decideurs, professions liberales, familles du nord-ouest bruxellois et de la peripherie neerlandophone. Public a fort pouvoir d'achat, fidele et bilingue FR/NL."),
        ("02", "Une visibilite 360",
         "Maillots Division Honneur et D2, ecran LED Super Sunday, panneautique terrains 1 et 2, ecran clubhouse, site web et reseaux sociaux."),
        ("03", "Un Business Club actif",
         "Reseau de dirigeants locaux, decideurs et professions liberales. Plusieurs evenements B2B chaque saison, convivialite et mise en relation."),
        ("04", "Un projet social ancre",
         "Initiations dans les ecoles de Molenbeek, integration de jeunes au club, soutien des autorites locales."),
    ]

    for num, title, desc in pillars:
        c.setFont(fonts["body_bold"], 9)
        c.setFillColor(RED)
        c.drawString(MARGIN, y, num)

        c.setFont(fonts["body_bold"], 11)
        c.setFillColor(WHITE)
        c.drawString(MARGIN + 25, y, title)

        y -= 16
        y = draw_wrapped(c, desc, MARGIN + 25, y, fonts["body_light"], 8.5, CONTENT_W - 30, leading=12, color=HexColor("#AAAAAA"))
        y -= 10


def page_audience(c, fonts):
    """PAGE 3: Audience & visibility metrics."""
    c.setFillColor(LIGHT_BG)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    draw_red_bar(c, H - 4, 4)

    y = H - 55
    draw_gold_caption(c, "03  ·  Audience & visibilite", MARGIN, y, fonts)

    y -= 35
    c.setFont(fonts["heading"], 28)
    c.setFillColor(DARK)
    c.drawString(MARGIN, y, "Des points de contact")
    y -= 35
    c.setFillColor(RED)
    c.drawString(MARGIN, y, "mesures.")

    y -= 45
    cards = [
        ("MATCH DAYS", "400", "spectateurs moyens / Super Sunday",
         ["22 matchs domicile", "15k contacts cumules / saison"]),
        ("INSTAGRAM", "2,35k", "followers @royaldaringhockey",
         ["4,8% engagement moyen"]),
        ("FACEBOOK", "3,1k", "abonnes page officielle",
         ["Reach moyen 1,8k / post match"]),
        ("ECRAN LED", "1 200", "impressions / Super Sunday",
         ["Rotation 15s sur 90 min"]),
        ("PRESSE & MEDIA", "45+", "mentions / saison",
         ["RTBF, La DH, Bruzz, Sportwereld"]),
    ]

    card_h = 100
    col_w = CONTENT_W / 2 + 10
    left_x = MARGIN
    right_x = MARGIN + col_w

    first_card = cards[0]
    cw = CONTENT_W
    ch = 95
    rx, ry = MARGIN, y - ch
    c.setFillColor(DARK)
    c.roundRect(rx, ry, cw, ch, 6, fill=1, stroke=0)

    draw_gold_caption(c, first_card[0], rx + 15, ry + ch - 20, fonts, size=7)
    c.setFont(fonts["heading"], 36)
    c.setFillColor(WHITE)
    c.drawString(rx + 15, ry + ch - 55, first_card[1])
    c.setFont(fonts["body"], 9)
    c.setFillColor(HexColor("#CCCCCC"))
    c.drawString(rx + 15, ry + ch - 70, first_card[2])

    detail_x = rx + 220
    for di, det in enumerate(first_card[3]):
        c.setFont(fonts["body"], 8)
        c.setFillColor(GOLD)
        c.drawString(detail_x, ry + ch - 45 - di * 16, det)

    y = ry - 15

    for i in range(1, len(cards), 2):
        for j in range(2):
            if i + j >= len(cards):
                break
            card = cards[i + j]
            cx = left_x if j == 0 else left_x + CONTENT_W / 2 + 7
            cw_card = CONTENT_W / 2 - 4
            ch = 95

            c.setFillColor(WHITE)
            c.setStrokeColor(LIGHT_GRAY)
            c.setLineWidth(0.5)
            c.roundRect(cx, y - ch, cw_card, ch, 6, fill=1, stroke=1)

            draw_gold_caption(c, card[0], cx + 12, y - 18, fonts, size=7)
            c.setFont(fonts["heading"], 24)
            c.setFillColor(DARK)
            c.drawString(cx + 12, y - 48, card[1])
            c.setFont(fonts["body"], 8)
            c.setFillColor(GRAY)
            c.drawString(cx + 12, y - 62, card[2])

            for di, det in enumerate(card[3]):
                c.setFont(fonts["body"], 7.5)
                c.setFillColor(DARK_GRAY)
                c.drawString(cx + 12, y - 78 - di * 12, det)

        y -= ch + 12

    y -= 10
    c.setStrokeColor(GOLD)
    c.setLineWidth(1.5)
    c.line(MARGIN, y, MARGIN + 30, y)

    y -= 18
    y = draw_wrapped(c, "Audience a fort pouvoir d'achat, bilingue FR/NL, ancree Bruxelles nord-ouest et peripherie neerlandophone (Dilbeek, Wemmel, Meise).",
                     MARGIN, y, fonts["body"], 9, CONTENT_W, leading=14, color=DARK_GRAY)
    y -= 6
    y = draw_wrapped(c, "Une portee reduite mais une qualite de contact difficile a acheter en media paye.",
                     MARGIN, y, fonts["body_bold"], 9, CONTENT_W, leading=14, color=DARK)


def page_supports(c, fonts):
    """PAGE 4: Visibility supports with images."""
    c.setFillColor(DARK)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    draw_red_bar(c, H - 4, 4)

    y = H - 55
    draw_gold_caption(c, "05  ·  Supports de visibilite", MARGIN, y, fonts)

    y -= 35
    c.setFont(fonts["heading"], 26)
    c.setFillColor(WHITE)
    c.drawString(MARGIN, y, "Montrez votre marque")
    y -= 32
    c.setFillColor(RED)
    c.drawString(MARGIN, y, "la ou le club vit.")

    y -= 30

    img_items = [
        (os.path.join(BASE, "img/sponsor-maillot.png"), "MAILLOT ELITE",
         "Face avant, dos, manche ou short/jupe",
         "Portes par les equipes DH Messieurs & D2 Dames a chaque match."),
        (os.path.join(BASE, "img/sponsor-terrain.jpg"), "PANNEAUTIQUE TERRAIN",
         "Panneaux bord terrain 1 & 2",
         "Visibles sur toutes les photos de match publiees sur les reseaux sociaux du club."),
        (os.path.join(BASE, "img/affiche-match.png"), "DIGITAL & RESEAUX",
         "Affiches de match & site officiel",
         "Logo present sur chaque affiche partagee sur Instagram et Facebook."),
    ]

    img_h = 160
    img_w_each = (CONTENT_W - 20) / 3

    for i, (path, caption, title, desc) in enumerate(img_items):
        ix = MARGIN + i * (img_w_each + 10)

        try:
            img = load_image(path)
            pil_img = PILImage.open(path)
            iw, ih = pil_img.size
            ratio = min(img_w_each / iw, img_h / ih)
            draw_w = iw * ratio
            draw_h = ih * ratio
            c.drawImage(img, ix + (img_w_each - draw_w) / 2, y - draw_h, draw_w, draw_h)
        except:
            pass

        ty = y - img_h - 18
        draw_gold_caption(c, caption, ix, ty, fonts, size=6.5)
        ty -= 15
        c.setFont(fonts["body_bold"], 9)
        c.setFillColor(WHITE)
        c.drawString(ix, ty, title)
        ty -= 14
        lines = wrap_text(c, desc, fonts["body_light"], 7.5, img_w_each - 5)
        for line in lines:
            c.setFont(fonts["body_light"], 7.5)
            c.setFillColor(HexColor("#AAAAAA"))
            c.drawString(ix, ty, line)
            ty -= 11

    y = y - img_h - 85

    c.setStrokeColor(HexColor("#333333"))
    c.setLineWidth(0.5)
    c.line(MARGIN, y, W - MARGIN, y)
    y -= 25

    extras = [
        ("Ecran LED", "Rotation bord terrain pendant les Super Sundays (15s / 90 min)"),
        ("Clubhouse", "Ecran et activation partenaire dans le clubhouse renove"),
    ]

    for title, desc in extras:
        c.setFont(fonts["body_bold"], 10)
        c.setFillColor(GOLD)
        c.drawString(MARGIN, y, title)
        c.setFont(fonts["body"], 9)
        c.setFillColor(HexColor("#CCCCCC"))
        c.drawString(MARGIN + 100, y, desc)
        y -= 22


def page_packs(c, fonts):
    """PAGE 5: Sponsoring packs."""
    c.setFillColor(LIGHT_BG)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    draw_red_bar(c, H - 4, 4)

    y = H - 55
    draw_gold_caption(c, "06  ·  Packs sponsoring 2025-26", MARGIN, y, fonts)

    y -= 35
    c.setFont(fonts["heading"], 26)
    c.setFillColor(DARK)
    c.drawString(MARGIN, y, "Trois paliers")
    y -= 32
    c.setFillColor(RED)
    c.drawString(MARGIN, y, "de visibilite.")

    y -= 20
    c.setFont(fonts["body"], 9)
    c.setFillColor(GRAY)
    c.drawString(MARGIN, y, "Chaque pack est negociable et peut etre adapte a votre strategie.")

    y -= 30

    packs = [
        {
            "name": "Bronze",
            "price": "Sur mesure",
            "sub": "a partir de 2 500 EUR HTVA",
            "items": [
                "Panneau publicitaire Terrain 1",
                "Visibilite ecran Clubhouse",
                "Logo sur royaldaring.be",
            ],
            "bg": WHITE,
            "border": LIGHT_GRAY,
            "accent": HexColor("#CD7F32"),
            "highlight": False,
        },
        {
            "name": "Silver",
            "price": "15 000 EUR",
            "sub": "par saison · HTVA",
            "items": [
                "Sponsor manche ou short/jupe DH & D2",
                "Panneautique Terrain 1 et Terrain 2",
                "Ecran LED Super Sundays",
                "Ecran Clubhouse",
                "Logo prioritaire royaldaring.be",
                "Acces Business Club (4 boissons / Super Sunday)",
            ],
            "bg": WHITE,
            "border": HexColor("#C0C0C0"),
            "accent": HexColor("#808080"),
            "highlight": False,
        },
        {
            "name": "Gold",
            "price": "30 000 EUR",
            "sub": "par saison · HTVA",
            "items": [
                "Sponsor principal maillot DH & D2",
                "Panneautique premium Terrain 1 et 2",
                "Ecran LED premium Super Sundays",
                "Ecran Clubhouse : boucle prioritaire",
                "Logo principal royaldaring.be",
                "Loge Business Club (8 boissons / SS)",
                "Activation dediee avec le club",
                "Co-branding communication officielle",
            ],
            "bg": DARK,
            "border": GOLD,
            "accent": GOLD,
            "highlight": True,
        },
    ]

    col_w = (CONTENT_W - 20) / 3
    pack_h = 420

    for i, pack in enumerate(packs):
        px = MARGIN + i * (col_w + 10)
        py = y - pack_h

        c.setFillColor(pack["bg"])
        c.setStrokeColor(pack["border"])
        c.setLineWidth(1.5 if pack["highlight"] else 0.5)
        c.roundRect(px, py, col_w, pack_h, 6, fill=1, stroke=1)

        if pack["highlight"]:
            c.setFillColor(RED)
            c.roundRect(px, py + pack_h - 22, col_w, 22, 6, fill=1, stroke=0)
            c.setFillColor(RED)
            c.rect(px, py + pack_h - 22, col_w, 12, fill=1, stroke=0)
            c.setFont(fonts["body_bold"], 7)
            c.setFillColor(WHITE)
            c.drawCentredString(px + col_w / 2, py + pack_h - 17, "SPONSOR PRINCIPAL")

        inner_top = py + pack_h - (35 if pack["highlight"] else 15)

        c.setFont(fonts["body_bold"], 8)
        c.setFillColor(pack["accent"])
        c.drawCentredString(px + col_w / 2, inner_top, pack["name"].upper())

        text_color = WHITE if pack["highlight"] else DARK
        sub_color = HexColor("#AAAAAA") if pack["highlight"] else GRAY

        c.setFont(fonts["heading"], 18)
        c.setFillColor(text_color)
        c.drawCentredString(px + col_w / 2, inner_top - 25, pack["price"])

        c.setFont(fonts["body"], 7)
        c.setFillColor(sub_color)
        c.drawCentredString(px + col_w / 2, inner_top - 38, pack["sub"])

        c.setStrokeColor(pack["border"])
        c.setLineWidth(0.3)
        c.line(px + 12, inner_top - 48, px + col_w - 12, inner_top - 48)

        item_y = inner_top - 65
        for item in pack["items"]:
            bullet_color = pack["accent"]
            c.setFillColor(bullet_color)
            c.circle(px + 16, item_y + 3, 2, fill=1, stroke=0)

            lines = wrap_text(c, item, fonts["body"], 7.5, col_w - 38)
            for line in lines:
                c.setFont(fonts["body"], 7.5)
                c.setFillColor(text_color)
                c.drawString(px + 24, item_y, line)
                item_y -= 12
            item_y -= 4

    y = y - pack_h - 20
    c.setFont(fonts["body"], 8)
    c.setFillColor(GRAY)
    c.drawString(MARGIN, y, "Tous les packs sont personnalisables et peuvent se cumuler avec un engagement Mecenat & RSE.")


def page_rse(c, fonts):
    """PAGE 6: RSE / Youth program."""
    c.setFillColor(DARK)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    draw_red_bar(c, H - 4, 4)

    y = H - 55
    draw_gold_caption(c, "07  ·  Mecenat & RSE  ·  Programme Jeunes Daring", MARGIN, y, fonts)

    y -= 35
    c.setFont(fonts["heading"], 26)
    c.setFillColor(WHITE)
    c.drawString(MARGIN, y, "Le hockey, levier")
    y -= 32
    c.setFillColor(RED)
    c.drawString(MARGIN, y, "d'insertion a Molenbeek.")

    y -= 20

    img1 = load_image(os.path.join(BASE, "img/rse-1.jpg"))
    img2 = load_image(os.path.join(BASE, "img/rse-2.jpg"))
    img_display_w = (CONTENT_W - 10) / 2
    img_display_h = 130

    c.drawImage(img1, MARGIN, y - img_display_h, img_display_w, img_display_h)
    c.drawImage(img2, MARGIN + img_display_w + 10, y - img_display_h, img_display_w, img_display_h)

    y -= img_display_h + 20

    y = draw_wrapped(c,
        "Le Daring intervient dans les ecoles de Molenbeek avec l'accord des professeurs et le soutien des autorites communales. Plusieurs jeunes detectes lors de ces initiations integrent ensuite le club : cotisation, equipement, accompagnement entierement pris en charge.",
        MARGIN, y, fonts["body"], 9, CONTENT_W, leading=14, color=HexColor("#CCCCCC"))

    y -= 15
    kpis = [("6", "ecoles partenaires"), ("320+", "enfants inities / an"),
            ("40", "jeunes integres depuis 2020"), ("100%", "finance par le club")]
    kpi_w = CONTENT_W / 4
    for i, (num, lbl) in enumerate(kpis):
        kx = MARGIN + i * kpi_w
        c.setFont(fonts["heading"], 20)
        c.setFillColor(GOLD)
        c.drawString(kx, y, num)
        c.setFont(fonts["body"], 7)
        c.setFillColor(HexColor("#AAAAAA"))
        c.drawString(kx, y - 14, lbl)

    y -= 40
    c.setStrokeColor(HexColor("#333333"))
    c.setLineWidth(0.5)
    c.line(MARGIN, y, W - MARGIN, y)

    y -= 20
    draw_gold_caption(c, "4 paliers de co-financement", MARGIN, y, fonts)

    y -= 20
    tiers = [
        ("1 200 EUR", "Parrain d'un jeune", "Cotisation + equipement complet pour un jeune integre"),
        ("3 500 EUR", "Partenaire Ecole", "Journee d'initiation complete (~80 enfants)"),
        ("12 000 EUR", "Partenaire Programme", "Programme annuel 6 ecoles + 8 jeunes minimum"),
        ("25 000 EUR", "Mecene Principal", "Naming complet du programme"),
    ]

    for price, name, desc in tiers:
        is_recommended = "Programme" in name
        c.setFont(fonts["body_bold"], 10)
        c.setFillColor(GOLD if is_recommended else WHITE)
        c.drawString(MARGIN, y, price)

        c.setFont(fonts["body_bold"], 10)
        c.setFillColor(WHITE)
        c.drawString(MARGIN + 95, y, name)

        if is_recommended:
            rw = c.stringWidth("Recommande", fonts["body"], 6) + 10
            rx = MARGIN + 95 + c.stringWidth(name + "  ", fonts["body_bold"], 10)
            c.setFillColor(GOLD)
            c.roundRect(rx, y - 2, rw, 13, 3, fill=1, stroke=0)
            c.setFont(fonts["body"], 6)
            c.setFillColor(DARK)
            c.drawString(rx + 5, y + 1, "Recommande")

        y -= 14
        c.setFont(fonts["body"], 8)
        c.setFillColor(HexColor("#AAAAAA"))
        c.drawString(MARGIN + 95, y, desc)
        y -= 22

    y -= 5
    c.setFont(fonts["body"], 7.5)
    c.setFillColor(HexColor("#888888"))
    y = draw_wrapped(c, "Le Royal Daring Club est constitue en ASBL. Convention de mecenat distincte de la convention sponsoring possible selon la nature de votre engagement.",
                     MARGIN, y, fonts["body"], 7.5, CONTENT_W, leading=11, color=HexColor("#888888"))


def page_business(c, fonts):
    """PAGE 7: Business Club."""
    c.setFillColor(LIGHT_BG)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    draw_red_bar(c, H - 4, 4)

    y = H - 55
    draw_gold_caption(c, "08  ·  Business Club", MARGIN, y, fonts)

    y -= 35
    c.setFont(fonts["heading"], 26)
    c.setFillColor(DARK)
    c.drawString(MARGIN, y, "Un reseau economique,")
    y -= 32
    c.setFillColor(RED)
    c.drawString(MARGIN, y, "pas un diner mondain.")

    y -= 40
    stats = [("180+", "dirigeants presents / an"), ("4", "evenements reseau"), ("22", "Super Sundays accessibles")]
    stat_w = CONTENT_W / 3
    for i, (num, lbl) in enumerate(stats):
        sx = MARGIN + i * stat_w

        c.setFillColor(DARK)
        c.roundRect(sx, y - 55, stat_w - 15, 55, 5, fill=1, stroke=0)

        c.setFont(fonts["heading"], 28)
        c.setFillColor(GOLD)
        c.drawCentredString(sx + (stat_w - 15) / 2, y - 25, num)
        c.setFont(fonts["body"], 7.5)
        c.setFillColor(WHITE)
        c.drawCentredString(sx + (stat_w - 15) / 2, y - 42, lbl)

    y -= 80

    y = draw_wrapped(c,
        "Depuis plusieurs saisons, le Daring developpe un reseau d'echanges qui allie convivialite et mise en relation professionnelle. Dirigeants d'entreprises locales, decideurs, professions liberales : les forces vives du club.",
        MARGIN, y, fonts["body"], 10, CONTENT_W, leading=16, color=DARK_GRAY)

    y -= 30
    draw_gold_caption(c, "Calendrier des evenements", MARGIN, y, fonts)

    y -= 25
    events = [
        ("SEPT.", "Soiree d'ouverture", "Presentation des equipes Elites · Clubhouse"),
        ("NOV.", "Diner Business Club", "Invite business · 80 couverts"),
        ("FEVR.", "Super Sunday VIP", "Match DH + cocktail dinatoire"),
        ("MAI", "Tournoi partenaires", "Initiation hockey + barbecue"),
    ]

    for month, title, desc in events:
        c.setFillColor(WHITE)
        c.setStrokeColor(LIGHT_GRAY)
        c.setLineWidth(0.5)
        c.roundRect(MARGIN, y - 50, CONTENT_W, 50, 5, fill=1, stroke=1)

        c.setFillColor(RED)
        c.roundRect(MARGIN, y - 50, 60, 50, 5, fill=1, stroke=0)
        c.rect(MARGIN + 5, y - 50, 55, 50, fill=1, stroke=0)

        c.setFont(fonts["body_bold"], 9)
        c.setFillColor(WHITE)
        c.drawCentredString(MARGIN + 30, y - 30, month)

        c.setFont(fonts["body_bold"], 12)
        c.setFillColor(DARK)
        c.drawString(MARGIN + 75, y - 22, title)

        c.setFont(fonts["body"], 8.5)
        c.setFillColor(GRAY)
        c.drawString(MARGIN + 75, y - 38, desc)

        y -= 60

    y -= 15
    c.setStrokeColor(GOLD)
    c.setLineWidth(1.5)
    c.line(MARGIN, y, MARGIN + 30, y)
    y -= 16
    c.setFont(fonts["heading_italic"] if "Playfair-Italic" in [f for f in pdfmetrics.getRegisteredFontNames()] else fonts["body"], 11)
    c.setFillColor(DARK_GRAY)
    c.drawString(MARGIN, y, "\" Au Daring, on ne vend pas un logo.")
    y -= 16
    c.drawString(MARGIN + 10, y, "On ouvre une porte sur Bruxelles. \"")


def page_contact(c, fonts):
    """PAGE 8: Contact information."""
    c.setFillColor(DARK)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    draw_red_bar(c, H - 4, 4)

    logo = load_image_keep_alpha(os.path.join(BASE, "logo_daring.png"))
    logo_size = 50
    c.drawImage(logo, (W - logo_size) / 2, H - 80, logo_size, logo_size, mask="auto")

    y = H - 105
    draw_gold_caption(c, "09  ·  Prendre contact", MARGIN, y, fonts, size=8)
    c.drawCentredString(W / 2, y, "")

    y -= 40
    c.setFont(fonts["heading"], 30)
    c.setFillColor(WHITE)
    c.drawCentredString(W / 2, y, "Parlons-en")
    y -= 36
    c.setFillColor(RED)
    c.drawCentredString(W / 2, y, "directement.")

    y -= 25
    c.setFont(fonts["body"], 10)
    c.setFillColor(HexColor("#AAAAAA"))
    c.drawCentredString(W / 2, y, "Le Daring vous recoit au clubhouse pour une visite")
    y -= 15
    c.drawCentredString(W / 2, y, "et une discussion sans engagement.")

    y -= 50

    contacts = [
        ("President", "Gerald Cosyns", "Vision & strategie du club",
         "+32 475 44 46 96", "g.cosyns@fortepharma.net"),
        ("Business Developer", "Pino Dimonopoli", "Sponsoring & Business Club : votre point d'entree",
         "+32 493 47 31 73", "dimonopolipino@gmail.com"),
        ("Manager Administratif", "Amaury Delaveleye", "Conventions & operationnel",
         "+32 477 95 88 71", "amaury@royaldaring.be"),
    ]

    card_w = (CONTENT_W - 20) / 3
    for i, (role, name, desc, phone, email) in enumerate(contacts):
        cx = MARGIN + i * (card_w + 10)
        ch = 180
        cy = y - ch

        is_main = i == 1
        if is_main:
            c.setFillColor(HexColor("#252540"))
            c.setStrokeColor(GOLD)
            c.setLineWidth(1.5)
        else:
            c.setFillColor(HexColor("#1F1F35"))
            c.setStrokeColor(HexColor("#333355"))
            c.setLineWidth(0.5)
        c.roundRect(cx, cy, card_w, ch, 6, fill=1, stroke=1)

        ty = cy + ch - 20
        draw_gold_caption(c, role, cx + 12, ty, fonts, size=7)

        ty -= 20
        c.setFont(fonts["body_bold"], 13)
        c.setFillColor(WHITE)
        c.drawString(cx + 12, ty, name)

        ty -= 16
        lines = wrap_text(c, desc, fonts["body"], 8, card_w - 24)
        for line in lines:
            c.setFont(fonts["body"], 8)
            c.setFillColor(HexColor("#AAAAAA"))
            c.drawString(cx + 12, ty, line)
            ty -= 12

        ty -= 10
        c.setFont(fonts["body"], 9)
        c.setFillColor(WHITE)
        c.drawString(cx + 12, ty, phone)

        ty -= 16
        c.setFont(fonts["body"], 8)
        c.setFillColor(GOLD)
        c.drawString(cx + 12, ty, email)

    y = y - 180 - 35

    c.setStrokeColor(HexColor("#333355"))
    c.setLineWidth(0.5)
    c.line(MARGIN, y, W - MARGIN, y)

    y -= 25
    draw_gold_caption(c, "Royal Daring Club de Molenbeek", MARGIN, y, fonts, size=8)

    y -= 18
    c.setFont(fonts["body"], 9)
    c.setFillColor(HexColor("#AAAAAA"))
    c.drawString(MARGIN, y, "Rue du Sippelberg  ·  1080 Molenbeek-Saint-Jean  ·  Bruxelles")

    y -= 18
    c.setFont(fonts["body"], 8)
    c.setFillColor(GRAY)
    c.drawString(MARGIN, y, "www.royaldaring.be")

    footer_y = 30
    c.setFont(fonts["body"], 7)
    c.setFillColor(HexColor("#555555"))
    c.drawCentredString(W / 2, footer_y, "Royal Daring Club de Molenbeek  ·  Est. 1922  ·  Tous droits reserves")

    logo_sm = 20
    c.drawImage(logo, (W - logo_sm) / 2, footer_y + 15, logo_sm, logo_sm, mask="auto")


def main():
    fonts = register_fonts()
    print(f"Fonts: {fonts}")

    c = canvas.Canvas(OUT, pagesize=A4)
    c.setTitle("Royal Daring · Dossier Partenariats 2025-26")
    c.setAuthor("Royal Daring Club de Molenbeek")
    c.setSubject("Sponsoring & Mecenat RSE")

    page_cover(c, fonts)
    c.showPage()

    page_chiffres(c, fonts)
    c.showPage()

    page_audience(c, fonts)
    c.showPage()

    page_supports(c, fonts)
    c.showPage()

    page_packs(c, fonts)
    c.showPage()

    page_rse(c, fonts)
    c.showPage()

    page_business(c, fonts)
    c.showPage()

    page_contact(c, fonts)
    c.showPage()

    c.save()
    print(f"PDF saved: {OUT}")


if __name__ == "__main__":
    main()
