#!/usr/bin/env python3
"""Convierte cookies de cualquier formato (JSON/Netscape) al formato que necesita instaloader."""
import json, sys, os

def convert_cookies(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read().strip()

    cookies = []

    # Detectar formato JSON (Cookie-Editor exporta JSON por defecto)
    if content.startswith('[') or content.startswith('{'):
        try:
            data = json.loads(content)
            if isinstance(data, dict):
                data = [data]
            for c in data:
                domain = c.get('domain', '.instagram.com')
                if not domain.startswith('.'):
                    domain = '.' + domain
                cookies.append({
                    'domain': domain,
                    'name': c.get('name', ''),
                    'value': c.get('value', ''),
                    'path': c.get('path', '/'),
                    'secure': 'TRUE' if c.get('secure', False) else 'FALSE',
                    'expires': str(int(c.get('expirationDate', 2000000000))),
                })
            print(f"Formato detectado: JSON ({len(cookies)} cookies)")
        except json.JSONDecodeError as e:
            print(f"ERROR parseando JSON: {e}")
            return False
    elif '# Netscape' in content or content.count('\t') > 5:
        # Ya está en Netscape — validar y reescribir
        print("Formato detectado: Netscape")
        for line in content.splitlines():
            if line.startswith('#') or not line.strip():
                continue
            parts = line.split('\t')
            if len(parts) >= 7:
                cookies.append({
                    'domain': parts[0], 'name': parts[5], 'value': parts[6],
                    'path': parts[2], 'secure': parts[3], 'expires': parts[4],
                })
    else:
        print("ERROR: Formato de cookies no reconocido.")
        print("Asegurate de usar Cookie-Editor -> Export -> Export as Netscape")
        return False

    if not cookies:
        print("ERROR: No se encontraron cookies en el archivo.")
        return False

    # Verificar que sessionid está presente
    session_cookies = [c for c in cookies if c['name'] == 'sessionid']
    if not session_cookies:
        print("ERROR CRITICO: No se encontro 'sessionid' en las cookies.")
        print("Esto significa que no estas logueado en Instagram en Chrome.")
        print("Inicia sesion en Instagram en Chrome y exporta las cookies de nuevo.")
        return False

    print(f"Total cookies: {len(cookies)}")
    print(f"sessionid: ENCONTRADO (primeros 20 chars: {session_cookies[0]['value'][:20]}...)")

    # Escribir formato Netscape correcto
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('# Netscape HTTP Cookie File\n')
        f.write('# https://curl.se/docs/http-cookies.html\n\n')
        for c in cookies:
            domain = c['domain']
            if not domain.startswith('.'):
                domain = '.' + domain
            f.write(f"{domain}\tTRUE\t{c['path']}\t{c['secure']}\t{c['expires']}\t{c['name']}\t{c['value']}\n")

    print(f"Cookies convertidas y guardadas en: {output_file}")
    return True

if __name__ == '__main__':
    inp = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.expanduser('~'), 'Desktop', 'instagram-cookies.txt')
    out = os.path.join(os.path.expanduser('~'), 'Desktop', 'instagram-cookies-converted.txt')
    ok = convert_cookies(inp, out)
    if not ok:
        sys.exit(1)
    print("Listo para usar con instaloader.")
