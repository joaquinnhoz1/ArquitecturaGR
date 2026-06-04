#!/usr/bin/env python3
"""
Descargador de Portfolio - arq.estudio.gr
Usa el sessionid de Instagram directamente (sin browser_cookie3).
"""
import os, sys, json, time, re, requests
from pathlib import Path

BASE_DIR = Path.home() / "Desktop" / "Portfolio Arquitectura"

POST_MAP = {
    'DYW7bO2gIG7': ('01-Nuevo-Proyecto-Render-2026',           'Render',  'NuevoProyecto'),
    'DWFOH6SiWD-': ('00-Posts-No-Proyecto',                     'Revisar', 'NoProyecto'),
    'DVLxlUXAFPO': ('02-Reforma-Vivienda-2026',                 'Obra',    'ReformaVivienda2026'),
    'DUmNhXejMGK': ('00-Posts-No-Proyecto',                     'Revisar', 'NoProyecto'),
    'DUWlj9CgPlo': ('02-Reforma-Vivienda-2026',                 'Obra',    'ReformaVivienda2026'),
    'DUULVCEjMo3': ('03-Reforma-Ampliacion-Entregada-2026',     'Despues', 'ReformaAmpliacion2026'),
    'DTjCjUSksU7': ('03-Reforma-Ampliacion-Entregada-2026',     'Despues', 'ReformaAmpliacion2026'),
    'DTTtChcAG9Y': ('03-Reforma-Ampliacion-Entregada-2026',     'Antes',   'ReformaAmpliacion2026'),
    'DSRGQCAjFxx': ('06-Estudio-GR-Apertura',                   'Despues', 'EstudioGR'),
    'DQuIlR8AInX': ('02-Reforma-Vivienda-2026',                 'Antes',   'ReformaVivienda2026'),
    'DPrOC42gHQF': ('00-Posts-No-Proyecto',                     'Revisar', 'NoProyecto'),
    'DO1xGdHEpbO': ('00-Posts-No-Proyecto',                     'Revisar', 'NoProyecto'),
    'DOB7qSPAClE': ('00-Posts-No-Proyecto',                     'Revisar', 'NoProyecto'),
    'DN0_2_RwLUr': ('00-Posts-No-Proyecto',                     'Revisar', 'NoProyecto'),
    'DKk9jHZsdUR': ('05-Render-vs-Obra-2025',                   'Render',  'RenderVsObra2025'),
    'DI38l7kOpv2': ('04-PUMA-Energy-Vagnoni',                   'Despues', 'PUMAVagnoni'),
    'DDzKaguOq-D': ('04-PUMA-Energy-Vagnoni',                   'Despues', 'PUMAVagnoni'),
    'C0_vNnUgU2O': ('07-Casa-IH-Clasica-Neoclasica',            'Render',  'CasaIH'),
    'CxwenyaOgTD': ('04-PUMA-Energy-Vagnoni',                   'Antes',   'PUMAVagnoni'),
    'CqG_o4ROA_q': ('00-Posts-No-Proyecto',                     'Revisar', 'NoProyecto'),
    'CoLl5z8MM03': ('08-Farmacia-Traverso',                     'Despues', 'FarmaciaTraverso'),
    'Cm1vVhyOMs3': ('00-Posts-No-Proyecto',                     'Revisar', 'NoProyecto'),
    'CmL-jbIAPmw': ('07-Casa-IH-Clasica-Neoclasica',           'Render',  'CasaIH'),
    'CilkUPJuzTG': ('12-Vivienda-Quincho-Urdampilleta',         'Obra',    'QuinchoUrdampilleta'),
    'CgNeTtoIwQW': ('00-Posts-No-Proyecto',                     'Revisar', 'NoProyecto'),
    'Cf-KRW-q3X2': ('09-Procrear-Juana-Pirovano',              'Obra',    'ProcrearJuana'),
    'CfFdRhkOWlV': ('10-Procrear-Milagros',                    'Obra',    'ProcrearMilagros'),
    'Ce88kgouue2': ('19-Vivienda-Minimalista',                  'Render',  'Minimalista'),
    'Cezmk--oYaA': ('09-Procrear-Juana-Pirovano',              'Obra',    'ProcrearJuana'),
    'CdqhY4VuU2S': ('00-Posts-No-Proyecto',                     'Revisar', 'NoProyecto'),
    'CbtVw8JOa-p': ('00-Posts-No-Proyecto',                     'Revisar', 'NoProyecto'),
    'CbOMYETLsaY': ('09-Procrear-Juana-Pirovano',              'Antes',   'ProcrearJuana'),
    'CafyAt7Ogsh': ('00-Posts-No-Proyecto',                     'Revisar', 'NoProyecto'),
    'CaGQGSFqEAG': ('20-Casa-Galpon-Ferroviario',               'Render',  'CasaGalpon'),
    'CZ0GeuRubGp': ('12-Vivienda-Quincho-Urdampilleta',         'Obra',    'QuinchoUrdampilleta'),
    'CZvBXDrutwj': ('11-Procrear-Bicentenaria',                 'Render',  'ProcrearBicentenaria'),
    'CZh_tsouKku': ('13-Hotel-Daireaux-Restaurante',            'Despues', 'HotelDaireaux'),
    'CZc7-bSuFW3': ('11-Procrear-Bicentenaria',                 'Obra',    'ProcrearBicentenaria'),
    'CZIQbLBugFL': ('13-Hotel-Daireaux-Restaurante',            'Despues', 'HotelDaireaux'),
    'CYjpQ3xrkmX': ('10-Procrear-Milagros',                    'Render',  'ProcrearMilagros'),
    'CWrFAeNL0VF': ('09-Procrear-Juana-Pirovano',              'Render',  'ProcrearJuana'),
    'CWqmsnJrs1W': ('09-Procrear-Juana-Pirovano',              'Render',  'ProcrearJuana'),
    'CWqM1s6LCL7': ('09-Procrear-Juana-Pirovano',              'Render',  'ProcrearJuana'),
    'CV1dXw4rWMY': ('00-Posts-No-Proyecto',                     'Revisar', 'NoProyecto'),
    'CVvPGKJresZ': ('00-Posts-No-Proyecto',                     'Revisar', 'NoProyecto'),
    'CVvO--Jrq0e': ('00-Posts-No-Proyecto',                     'Revisar', 'NoProyecto'),
    'CSzb181rLwj': ('17-Casa-Estilo-Industrial',                'Render',  'CasaIndustrial'),
    'CSzbdkELXY3': ('17-Casa-Estilo-Industrial',                'Render',  'CasaIndustrial'),
    'CSzbIvMrxsK': ('17-Casa-Estilo-Industrial',                'Render',  'CasaIndustrial'),
    'CPW_nJOh4tU': ('00-Posts-No-Proyecto',                     'Revisar', 'NoProyecto'),
    'CPW_hfcBUcr': ('00-Posts-No-Proyecto',                     'Revisar', 'NoProyecto'),
    'CPW_fSeBbkf': ('00-Posts-No-Proyecto',                     'Revisar', 'NoProyecto'),
    'CPHRJ6VBiWO': ('18-Casa-Rural-Zona-Rural',                 'Render',  'CasaRural'),
    'CPHRHlUhrZv': ('18-Casa-Rural-Zona-Rural',                 'Render',  'CasaRural'),
    'CPHRFa_h_WA': ('18-Casa-Rural-Zona-Rural',                 'Render',  'CasaRural'),
    'COOvFJlBDP0': ('00-Posts-No-Proyecto',                     'Revisar', 'NoProyecto'),
    'CNiS-TPhvG3': ('12-Vivienda-Quincho-Urdampilleta',         'Render',  'QuinchoUrdampilleta'),
    'CNiSEIlBeuB': ('12-Vivienda-Quincho-Urdampilleta',         'Render',  'QuinchoUrdampilleta'),
    'CMvbtCuh7DC': ('21-Casa-Campo-Contemporanea',              'Render',  'CasaCampo'),
    'CIysH3NhYJD': ('14-Reforma-Cocina',                        'Antes',   'ReformaCocina'),
    'CGqqoAuHkDE': ('21-Casa-Campo-Contemporanea',              'Render',  'CasaCampo'),
    'CGC8IDZnTbe': ('24-Reforma-Living',                        'Render',  'ReformaLiving'),
    'CFfe16an8It': ('00-Posts-No-Proyecto',                     'Revisar', 'NoProyecto'),
    'CFfew1Knwdf': ('15-Vinoteca-Refaccion',                    'Render',  'Vinoteca'),
    'CFfesmzHhM-': ('15-Vinoteca-Refaccion',                    'Render',  'Vinoteca'),
    'CEsRLZNHJoK': ('15-Vinoteca-Refaccion',                    'Obra',    'Vinoteca'),
    'CEsRI1RnkT0': ('15-Vinoteca-Refaccion',                    'Obra',    'Vinoteca'),
    'CEsRFlYHQBf': ('15-Vinoteca-Refaccion',                    'Obra',    'Vinoteca'),
    'CEaPYu6nuA4': ('00-Posts-No-Proyecto',                     'Revisar', 'NoProyecto'),
    'CEaOq8KHBeN': ('00-Posts-No-Proyecto',                     'Revisar', 'NoProyecto'),
    'CEaNmRIHdbl': ('00-Posts-No-Proyecto',                     'Revisar', 'NoProyecto'),
    'CDwa-eDH_Tn': ('16-Casa-Daireaux-Rural',                   'Render',  'CasaDaireaux'),
    'CDwa66sHknV': ('16-Casa-Daireaux-Rural',                   'Render',  'CasaDaireaux'),
    'CDwa3QDnSrL': ('16-Casa-Daireaux-Rural',                   'Render',  'CasaDaireaux'),
    'CDcIKuDn0On': ('00-Posts-No-Proyecto',                     'Revisar', 'NoProyecto'),
    'CDPt8J7nWXd': ('16-Casa-Daireaux-Rural',                   'Render',  'CasaDaireaux'),
    'CDCeXvAgiyv': ('00-Posts-No-Proyecto',                     'Revisar', 'NoProyecto'),
    'CCn_vwdH9LE': ('00-Posts-No-Proyecto',                     'Revisar', 'NoProyecto'),
    'CByZuz2HXWl': ('00-Posts-No-Proyecto',                     'Revisar', 'NoProyecto'),
    'CAOXPE1H0tc': ('26-Planeamiento-Urbano',                   'Render',  'PlaneamientoUrbano'),
    'B-iNosoH3g5': ('00-Posts-No-Proyecto',                     'Revisar', 'NoProyecto'),
    'B-F4L-mHOwH': ('25-Ampliacion-Galeria-Parrilla',           'Render',  'AmpliacionGaleria'),
    'B97WQ3MH6wZ': ('00-Posts-No-Proyecto',                     'Revisar', 'NoProyecto'),
    'B90D1G2n2Ls': ('22-Proyecto-Oficinas',                     'Render',  'Oficinas'),
    'B9jvIldnK_K': ('00-Posts-No-Proyecto',                     'Revisar', 'NoProyecto'),
    'B9aDcATAFSn': ('23-Proyecto-Edificio-Parasoles',           'Render',  'EdificioParasoles'),
}

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'es-AR,es;q=0.9,en;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Cache-Control': 'max-age=0',
}

def get_session(sessionid, csrftoken=''):
    s = requests.Session()
    s.headers.update(HEADERS)
    cookies = {
        'sessionid': sessionid,
        'csrftoken': csrftoken,
        'ig_did': 'CCEF8E6C-E24B-4D04-9D1D-96A7BE15E22E',
        'mid': 'ZxKjGAALAAGEjwRLMqFRLELFsMep',
    }
    s.cookies.update(cookies)
    return s

def extract_images_from_html(html):
    urls = []
    
    # Patron 1: display_url en JSON interno
    for m in re.finditer(r'"display_url":"(https:[^"]+)"', html):
        u = m.group(1).replace('\\u0026','&').replace('\\/','/')
        if u not in urls: urls.append(u)
    
    # Patron 2: src en tags de imagen grandes (jpeg/webp en CDN)
    for m in re.finditer(r'"src":"(https://[^"]*(?:cdninstagram|fbcdn)[^"]*\.(?:jpg|webp|jpeg))"', html):
        u = m.group(1).replace('\\u0026','&').replace('\\/','/')
        if u not in urls: urls.append(u)
    
    # Patron 3: Buscar image_versions en objetos de media
    for m in re.finditer(r'"url":"(https://[^"]*(?:t51\.82787)[^"]*)"', html):
        u = m.group(1).replace('\\u0026','&').replace('\\/','/')
        if u not in urls: urls.append(u)
    
    # Patron 4: og:image fallback
    if not urls:
        m = re.search(r'property="og:image"\s+content="([^"]+)"', html)
        if m: urls.append(m.group(1))
    
    return urls[:10]

def get_media_urls(session, shortcode):
    """Intenta múltiples endpoints de Instagram para obtener URLs de imágenes."""
    headers_api = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'es-AR,es;q=0.9',
        'X-IG-App-ID': '936619743392459',
        'X-ASBD-ID': '198387',
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': f'https://www.instagram.com/p/{shortcode}/',
        'Origin': 'https://www.instagram.com',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
    }
    
    urls = []
    
    # Intento 1: API ?__a=1
    try:
        r = session.get(
            f'https://www.instagram.com/p/{shortcode}/?__a=1&__d=dis',
            headers=headers_api, timeout=12
        )
        if r.status_code == 200 and r.text.startswith('{'):
            data = r.json()
            media = data.get('graphql', {}).get('shortcode_media', {})
            if not media:
                media = data.get('items', [{}])[0] if 'items' in data else {}
            
            # Foto simple
            if media.get('display_url'):
                urls.append(media['display_url'])
            
            # Carrusel
            edges = media.get('edge_sidecar_to_children', {}).get('edges', [])
            for e in edges:
                node = e.get('node', {})
                if node.get('display_url'):
                    urls.append(node['display_url'])
            
            # image_versions (mobile API format)
            for iv in media.get('image_versions2', {}).get('candidates', []):
                if iv.get('width', 0) >= 1080:
                    urls.append(iv['url'])
                    break
            
            if urls:
                return urls
    except Exception as e:
        pass
    
    # Intento 2: API v1 media info
    try:
        r = session.get(
            f'https://www.instagram.com/api/v1/media/shortcode/info/?shortcode={shortcode}',
            headers=headers_api, timeout=12
        )
        if r.status_code == 200:
            data = r.json()
            items = data.get('items', [])
            for item in items[:1]:
                # Imagen
                for c in item.get('image_versions2', {}).get('candidates', []):
                    if c.get('width', 0) >= 1080:
                        urls.append(c['url'])
                        break
                # Carrusel
                for car in item.get('carousel_media', []):
                    for c in car.get('image_versions2', {}).get('candidates', []):
                        if c.get('width', 0) >= 1080:
                            urls.append(c['url'])
                            break
            if urls:
                return urls
    except Exception as e:
        pass
    
    # Intento 3: Scraping HTML con múltiples patrones
    try:
        r = session.get(
            f'https://www.instagram.com/p/{shortcode}/',
            headers={**HEADERS, 'X-IG-App-ID': '936619743392459'},
            timeout=12
        )
        html = r.text
        
        # Múltiples patrones
        for pattern in [
            r'"display_url":"(https:[^"]+)"',
            r'"url":"(https://[^"]*t51\.82787[^"]*)"',
            r'"src":"(https://[^"]*(?:cdninstagram|fbcdn)[^"]*\.(?:jpg|webp))"',
        ]:
            for m in re.finditer(pattern, html):
                u = m.group(1).replace('\\u0026','&').replace('\\/','/')
                if u not in urls: urls.append(u)
        
        if urls:
            return urls
        
        # og:image ultimo recurso
        m = re.search(r'property="og:image"\s+content="([^"]+)"', html)
        if m: urls.append(m.group(1))
    except Exception as e:
        pass
    
    return urls

def download_post(session, shortcode, proj, cat, name, counters, base_dir):
    img_urls = get_media_urls(session, shortcode)
    
    if not img_urls:
        print(f'  Sin imagenes: {shortcode}')
        return 0
    
    dest_dir = base_dir / proj / cat
    dest_dir.mkdir(parents=True, exist_ok=True)
    
    saved = 0
    for img_url in img_urls[:10]:
        try:
            img_r = session.get(img_url, timeout=20,
                headers={'User-Agent': HEADERS['User-Agent'],
                         'Referer': 'https://www.instagram.com/'})
            if img_r.status_code != 200:
                continue
            
            key = f'{proj}|{cat}'
            counters[key] = counters.get(key, 0) + 1
            num = str(counters[key]).zfill(2)
            ct = img_r.headers.get('content-type', '')
            ext = 'webp' if 'webp' in ct else 'jpg'
            fname = f'{name}-{cat}-{num}.{ext}'
            
            (dest_dir / fname).write_bytes(img_r.content)
            print(f'    + {fname} ({len(img_r.content)//1024}KB)')
            saved += 1
            time.sleep(0.25)
        except Exception as e:
            print(f'    err: {e}')
    
    return saved

def main
def main():
    print('='*50)
    print('DESCARGADOR PORTFOLIO - arq.estudio.gr')
    print('='*50)
    print()
    print('Necesito tu sessionid de Instagram.')
    print()
    print('Como obtenerlo:')
    print('  1. Chrome -> instagram.com (logueado)')
    print('  2. F12 -> Application -> Cookies -> instagram.com')
    print('  3. Buscar la cookie "sessionid" y copiar su valor')
    print('  (empieza con numeros, tiene mas de 50 caracteres)')
    print()
    
    from urllib.parse import unquote
    sessionid = unquote(input('Pega el valor de sessionid: ').strip())
    if len(sessionid) < 20:
        print('ERROR: sessionid muy corto. Verificar.')
        input('Enter para salir...')
        return
    
    # Obtener csrftoken si disponible
    csrftoken = input('Pega el csrftoken (opcional, Enter para saltar): ').strip()
    
    session = get_session(sessionid, csrftoken)
    
    # Probar autenticacion
    print()
    print('Verificando sesion...')
    test = session.get('https://www.instagram.com/arq.estudio.gr/', timeout=10)
    if test.status_code != 200 or 'login' in test.url.lower():
        print(f'ERROR: HTTP {test.status_code} — sessionid invalido o expirado.')
        cont = input('Continuar de todas formas? (s/n): ').strip().lower()
        if cont != 's':
            return
    else:
        print(f'Sesion verificada OK (HTTP {test.status_code})')
    
    print()
    counters = {}
    total_imgs = 0
    total_posts = 0
    errors = 0
    
    posts = list(POST_MAP.items())
    for i, (shortcode, (proj, cat, name)) in enumerate(posts):
        print(f'[{i+1}/{len(posts)}] {shortcode} -> {proj}/{cat}')
        saved = download_post(session, shortcode, proj, cat, name, counters, BASE_DIR)
        total_imgs += saved
        total_posts += 1
        if saved == 0:
            errors += 1
        time.sleep(0.8)
    
    print()
    print('='*50)
    print(f'COMPLETADO: {total_imgs} imagenes | {errors} errores')
    print(f'Revisa la carpeta: {BASE_DIR}')
    print('='*50)
    input('Enter para cerrar...')

if __name__ == '__main__':
    main()
