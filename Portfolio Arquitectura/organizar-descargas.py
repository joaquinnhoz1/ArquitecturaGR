#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Organiza las imágenes descargadas por instaloader en la estructura
de carpetas Portfolio Arquitectura con el naming correcto.
Uso: python organizar-descargas.py [carpeta_instaloader]
"""

import os, sys, shutil, re
from pathlib import Path

# ── MAPA COMPLETO: shortcode → proyecto/categoría ────────────────────────────
POST_MAP = {
    'DYW7bO2gIG7': {'proj':'01-Nuevo-Proyecto-Render-2026',            'cat':'Render',  'name':'NuevoProyecto'},
    'DWFOH6SiWD-': {'proj':'00-Posts-No-Proyecto',                     'cat':'Revisar', 'name':'NoProyecto'},
    'DVLxlUXAFPO': {'proj':'02-Reforma-Vivienda-2026',                 'cat':'Obra',    'name':'ReformaVivienda2026'},
    'DUmNhXejMGK': {'proj':'00-Posts-No-Proyecto',                     'cat':'Revisar', 'name':'NoProyecto'},
    'DUWlj9CgPlo': {'proj':'02-Reforma-Vivienda-2026',                 'cat':'Obra',    'name':'ReformaVivienda2026'},
    'DUULVCEjMo3': {'proj':'03-Reforma-Ampliacion-Entregada-2026',     'cat':'Despues', 'name':'ReformaAmpliacion2026'},
    'DTjCjUSksU7': {'proj':'03-Reforma-Ampliacion-Entregada-2026',     'cat':'Despues', 'name':'ReformaAmpliacion2026'},
    'DTTtChcAG9Y': {'proj':'03-Reforma-Ampliacion-Entregada-2026',     'cat':'Antes',   'name':'ReformaAmpliacion2026'},
    'DSRGQCAjFxx': {'proj':'06-Estudio-GR-Apertura',                   'cat':'Despues', 'name':'EstudioGR'},
    'DQuIlR8AInX': {'proj':'02-Reforma-Vivienda-2026',                 'cat':'Antes',   'name':'ReformaVivienda2026'},
    'DPrOC42gHQF': {'proj':'00-Posts-No-Proyecto',                     'cat':'Revisar', 'name':'NoProyecto'},
    'DO1xGdHEpbO': {'proj':'00-Posts-No-Proyecto',                     'cat':'Revisar', 'name':'NoProyecto'},
    'DOB7qSPAClE': {'proj':'00-Posts-No-Proyecto',                     'cat':'Revisar', 'name':'NoProyecto'},
    'DN0_2_RwLUr': {'proj':'00-Posts-No-Proyecto',                     'cat':'Revisar', 'name':'NoProyecto'},
    'DKk9jHZsdUR': {'proj':'05-Render-vs-Obra-2025',                   'cat':'Render',  'name':'RenderVsObra2025'},
    'DI38l7kOpv2': {'proj':'04-PUMA-Energy-Vagnoni',                   'cat':'Despues', 'name':'PUMAVagnoni'},
    'DDzKaguOq-D': {'proj':'04-PUMA-Energy-Vagnoni',                   'cat':'Despues', 'name':'PUMAVagnoni'},
    'C0_vNnUgU2O': {'proj':'07-Casa-IH-Clasica-Neoclasica',            'cat':'Render',  'name':'CasaIH'},
    'CxwenyaOgTD': {'proj':'04-PUMA-Energy-Vagnoni',                   'cat':'Antes',   'name':'PUMAVagnoni'},
    'CqG_o4ROA_q': {'proj':'00-Posts-No-Proyecto',                     'cat':'Revisar', 'name':'NoProyecto'},
    'CoLl5z8MM03': {'proj':'08-Farmacia-Traverso',                     'cat':'Despues', 'name':'FarmaciaTraverso'},
    'Cm1vVhyOMs3': {'proj':'00-Posts-No-Proyecto',                     'cat':'Revisar', 'name':'NoProyecto'},
    'CmL-jbIAPmw': {'proj':'07-Casa-IH-Clasica-Neoclasica',           'cat':'Render',  'name':'CasaIH'},
    'CilkUPJuzTG': {'proj':'12-Vivienda-Quincho-Urdampilleta',         'cat':'Obra',    'name':'QuinchoUrdampilleta'},
    'CgNeTtoIwQW': {'proj':'00-Posts-No-Proyecto',                     'cat':'Revisar', 'name':'NoProyecto'},
    'Cf-KRW-q3X2': {'proj':'09-Procrear-Juana-Pirovano',              'cat':'Obra',    'name':'ProcrearJuana'},
    'CfFdRhkOWlV': {'proj':'10-Procrear-Milagros',                    'cat':'Obra',    'name':'ProcrearMilagros'},
    'Ce88kgouue2': {'proj':'19-Vivienda-Minimalista',                  'cat':'Render',  'name':'Minimalista'},
    'Cezmk--oYaA': {'proj':'09-Procrear-Juana-Pirovano',              'cat':'Obra',    'name':'ProcrearJuana'},
    'CdqhY4VuU2S': {'proj':'00-Posts-No-Proyecto',                     'cat':'Revisar', 'name':'NoProyecto'},
    'CbtVw8JOa-p': {'proj':'00-Posts-No-Proyecto',                     'cat':'Revisar', 'name':'NoProyecto'},
    'CbOMYETLsaY': {'proj':'09-Procrear-Juana-Pirovano',              'cat':'Antes',   'name':'ProcrearJuana'},
    'CafyAt7Ogsh': {'proj':'00-Posts-No-Proyecto',                     'cat':'Revisar', 'name':'NoProyecto'},
    'CaGQGSFqEAG': {'proj':'20-Casa-Galpon-Ferroviario',               'cat':'Render',  'name':'CasaGalpon'},
    'CZ0GeuRubGp': {'proj':'12-Vivienda-Quincho-Urdampilleta',         'cat':'Obra',    'name':'QuinchoUrdampilleta'},
    'CZvBXDrutwj': {'proj':'11-Procrear-Bicentenaria',                 'cat':'Render',  'name':'ProcrearBicentenaria'},
    'CZh_tsouKku': {'proj':'13-Hotel-Daireaux-Restaurante',            'cat':'Despues', 'name':'HotelDaireaux'},
    'CZc7-bSuFW3': {'proj':'11-Procrear-Bicentenaria',                 'cat':'Obra',    'name':'ProcrearBicentenaria'},
    'CZIQbLBugFL': {'proj':'13-Hotel-Daireaux-Restaurante',            'cat':'Despues', 'name':'HotelDaireaux'},
    'CYjpQ3xrkmX': {'proj':'10-Procrear-Milagros',                    'cat':'Render',  'name':'ProcrearMilagros'},
    'CWrFAeNL0VF': {'proj':'09-Procrear-Juana-Pirovano',              'cat':'Render',  'name':'ProcrearJuana'},
    'CWqmsnJrs1W': {'proj':'09-Procrear-Juana-Pirovano',              'cat':'Render',  'name':'ProcrearJuana'},
    'CWqM1s6LCL7': {'proj':'09-Procrear-Juana-Pirovano',              'cat':'Render',  'name':'ProcrearJuana'},
    'CV1dXw4rWMY': {'proj':'00-Posts-No-Proyecto',                     'cat':'Revisar', 'name':'NoProyecto'},
    'CVvPGKJresZ': {'proj':'00-Posts-No-Proyecto',                     'cat':'Revisar', 'name':'NoProyecto'},
    'CVvO--Jrq0e': {'proj':'00-Posts-No-Proyecto',                     'cat':'Revisar', 'name':'NoProyecto'},
    'CSzb181rLwj': {'proj':'17-Casa-Estilo-Industrial',                'cat':'Render',  'name':'CasaIndustrial'},
    'CSzbdkELXY3': {'proj':'17-Casa-Estilo-Industrial',                'cat':'Render',  'name':'CasaIndustrial'},
    'CSzbIvMrxsK': {'proj':'17-Casa-Estilo-Industrial',                'cat':'Render',  'name':'CasaIndustrial'},
    'CPW_nJOh4tU': {'proj':'00-Posts-No-Proyecto',                     'cat':'Revisar', 'name':'NoProyecto'},
    'CPW_hfcBUcr': {'proj':'00-Posts-No-Proyecto',                     'cat':'Revisar', 'name':'NoProyecto'},
    'CPW_fSeBbkf': {'proj':'00-Posts-No-Proyecto',                     'cat':'Revisar', 'name':'NoProyecto'},
    'CPHRJ6VBiWO': {'proj':'18-Casa-Rural-Zona-Rural',                 'cat':'Render',  'name':'CasaRural'},
    'CPHRHlUhrZv': {'proj':'18-Casa-Rural-Zona-Rural',                 'cat':'Render',  'name':'CasaRural'},
    'CPHRFa_h_WA': {'proj':'18-Casa-Rural-Zona-Rural',                 'cat':'Render',  'name':'CasaRural'},
    'COOvFJlBDP0': {'proj':'00-Posts-No-Proyecto',                     'cat':'Revisar', 'name':'NoProyecto'},
    'CNiS-TPhvG3': {'proj':'12-Vivienda-Quincho-Urdampilleta',         'cat':'Render',  'name':'QuinchoUrdampilleta'},
    'CNiSEIlBeuB': {'proj':'12-Vivienda-Quincho-Urdampilleta',         'cat':'Render',  'name':'QuinchoUrdampilleta'},
    'CMvbtCuh7DC': {'proj':'21-Casa-Campo-Contemporanea',              'cat':'Render',  'name':'CasaCampo'},
    'CIysH3NhYJD': {'proj':'14-Reforma-Cocina',                        'cat':'Antes',   'name':'ReformaCocina'},
    'CGqqoAuHkDE': {'proj':'21-Casa-Campo-Contemporanea',              'cat':'Render',  'name':'CasaCampo'},
    'CGC8IDZnTbe': {'proj':'24-Reforma-Living',                        'cat':'Render',  'name':'ReformaLiving'},
    'CFfe16an8It': {'proj':'00-Posts-No-Proyecto',                     'cat':'Revisar', 'name':'NoProyecto'},
    'CFfew1Knwdf': {'proj':'15-Vinoteca-Refaccion',                    'cat':'Render',  'name':'Vinoteca'},
    'CFfesmzHhM-': {'proj':'15-Vinoteca-Refaccion',                    'cat':'Render',  'name':'Vinoteca'},
    'CEsRLZNHJoK': {'proj':'15-Vinoteca-Refaccion',                    'cat':'Obra',    'name':'Vinoteca'},
    'CEsRI1RnkT0': {'proj':'15-Vinoteca-Refaccion',                    'cat':'Obra',    'name':'Vinoteca'},
    'CEsRFlYHQBf': {'proj':'15-Vinoteca-Refaccion',                    'cat':'Obra',    'name':'Vinoteca'},
    'CEaPYu6nuA4': {'proj':'00-Posts-No-Proyecto',                     'cat':'Revisar', 'name':'NoProyecto'},
    'CEaOq8KHBeN': {'proj':'00-Posts-No-Proyecto',                     'cat':'Revisar', 'name':'NoProyecto'},
    'CEaNmRIHdbl': {'proj':'00-Posts-No-Proyecto',                     'cat':'Revisar', 'name':'NoProyecto'},
    'CDwa-eDH_Tn': {'proj':'16-Casa-Daireaux-Rural',                   'cat':'Render',  'name':'CasaDaireaux'},
    'CDwa66sHknV': {'proj':'16-Casa-Daireaux-Rural',                   'cat':'Render',  'name':'CasaDaireaux'},
    'CDwa3QDnSrL': {'proj':'16-Casa-Daireaux-Rural',                   'cat':'Render',  'name':'CasaDaireaux'},
    'CDcIKuDn0On': {'proj':'00-Posts-No-Proyecto',                     'cat':'Revisar', 'name':'NoProyecto'},
    'CDPt8J7nWXd': {'proj':'16-Casa-Daireaux-Rural',                   'cat':'Render',  'name':'CasaDaireaux'},
    'CDCeXvAgiyv': {'proj':'00-Posts-No-Proyecto',                     'cat':'Revisar', 'name':'NoProyecto'},
    'CCn_vwdH9LE': {'proj':'00-Posts-No-Proyecto',                     'cat':'Revisar', 'name':'NoProyecto'},
    'CByZuz2HXWl': {'proj':'00-Posts-No-Proyecto',                     'cat':'Revisar', 'name':'NoProyecto'},
    'CAOXPE1H0tc': {'proj':'26-Planeamiento-Urbano',                   'cat':'Render',  'name':'PlaneamientoUrbano'},
    'B-iNosoH3g5': {'proj':'00-Posts-No-Proyecto',                     'cat':'Revisar', 'name':'NoProyecto'},
    'B-F4L-mHOwH': {'proj':'25-Ampliacion-Galeria-Parrilla',           'cat':'Render',  'name':'AmpliacionGaleria'},
    'B97WQ3MH6wZ': {'proj':'00-Posts-No-Proyecto',                     'cat':'Revisar', 'name':'NoProyecto'},
    'B90D1G2n2Ls': {'proj':'22-Proyecto-Oficinas',                     'cat':'Render',  'name':'Oficinas'},
    'B9jvIldnK_K': {'proj':'00-Posts-No-Proyecto',                     'cat':'Revisar', 'name':'NoProyecto'},
    'B9aDcATAFSn': {'proj':'23-Proyecto-Edificio-Parasoles',           'cat':'Render',  'name':'EdificioParasoles'},
}

def main():
    # Directorio de descargas de instaloader
    if len(sys.argv) > 1:
        ig_dir = Path(sys.argv[1])
    else:
        ig_dir = Path.home() / 'Desktop' / 'ig_descarga_temp' / 'arq.estudio.gr'

    # Directorio base del portfolio
    base_dir = Path.home() / 'Desktop' / 'Portfolio Arquitectura'

    if not ig_dir.exists():
        print(f"ERROR: No se encontró la carpeta de descargas: {ig_dir}")
        print("Ejecutá primero DESCARGAR-PORTFOLIO.bat")
        input("Presioná Enter para salir...")
        return

    print(f"Leyendo archivos desde: {ig_dir}")
    print(f"Organizando en: {base_dir}\n")

    # Contadores por proyecto/categoría para numeración
    counters = {}
    moved = 0
    skipped = 0
    unknown = 0

    # Extensiones de imagen válidas
    img_exts = {'.jpg', '.jpeg', '.webp', '.png', '.heic'}

    # Procesar archivos
    files = sorted(ig_dir.iterdir())
    for fpath in files:
        if fpath.suffix.lower() not in img_exts:
            continue

        fname = fpath.stem  # nombre sin extensión
        ext = fpath.suffix.lower()

        # instaloader con --filename-pattern {shortcode} genera: SHORTCODE.jpg o SHORTCODE_N.jpg
        # Extraer shortcode base (sin sufijo numérico de carrusel)
        shortcode_match = re.match(r'^([A-Za-z0-9_\-]+?)(?:_\d+)?$', fname)
        if not shortcode_match:
            print(f"  SKIP (nombre raro): {fpath.name}")
            skipped += 1
            continue

        shortcode = shortcode_match.group(1)

        if shortcode not in POST_MAP:
            print(f"  DESCONOCIDO: {fpath.name} (shortcode: {shortcode})")
            unknown += 1
            # Mover a carpeta de revisión general
            rev_dir = base_dir / '00-Posts-No-Proyecto' / 'Revisar'
            rev_dir.mkdir(parents=True, exist_ok=True)
            dest = rev_dir / fpath.name
            shutil.copy2(fpath, dest)
            continue

        info = POST_MAP[shortcode]
        proj_dir = base_dir / info['proj'] / info['cat']
        proj_dir.mkdir(parents=True, exist_ok=True)

        # Numeración por proyecto+categoría
        key = f"{info['proj']}|{info['cat']}"
        counters[key] = counters.get(key, 0) + 1
        num = str(counters[key]).zfill(2)

        # Nombre final: NombreProyecto-Categoria-01.jpg
        new_name = f"{info['name']}-{info['cat']}-{num}{ext}"
        dest = proj_dir / new_name

        shutil.copy2(fpath, dest)
        print(f"  ✓ {new_name}  ({info['proj']})")
        moved += 1

    print(f"\n{'='*50}")
    print(f"Imágenes organizadas: {moved}")
    print(f"Desconocidas (revisión): {unknown}")
    print(f"Omitidas: {skipped}")
    print(f"\nRevisá la carpeta 'Portfolio Arquitectura' en tu Escritorio.")
    print(f"{'='*50}")
    input("\nPresioná Enter para cerrar...")

if __name__ == '__main__':
    main()
